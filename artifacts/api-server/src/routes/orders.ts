import { Router } from "express";
import { db } from "@workspace/db";
import {
  ordersTable,
  orderItemsTable,
  vendorsTable,
  productsTable,
  inventoryItemsTable,
  inventoryTransactionsTable,
} from "@workspace/db";
import { eq, and, desc, sql } from "drizzle-orm";
import { randomUUID } from "crypto";
import { ReplitConnectors } from "@replit/connectors-sdk";

const router = Router();

function mapOrder(order: any, items: any[]) {
  return {
    id: order.id,
    vendorId: order.vendorId,
    vendorName: order.vendorName,
    vendorEmail: order.vendorEmail ?? null,
    weekDate: order.weekDate,
    shipDate: order.shipDate ?? null,
    arriveDate: order.arriveDate ?? null,
    status: order.status,
    notes: order.notes ?? null,
    emailSentAt: order.emailSentAt instanceof Date ? order.emailSentAt.toISOString() : (order.emailSentAt ?? null),
    items: items.map(mapItem),
    createdAt: order.createdAt instanceof Date ? order.createdAt.toISOString() : order.createdAt,
    updatedAt: order.updatedAt instanceof Date ? order.updatedAt.toISOString() : order.updatedAt,
  };
}

function mapItem(item: any) {
  return {
    id: item.id,
    orderId: item.orderId,
    productId: item.productId,
    productName: item.productName ?? item.name ?? "",
    packSize: item.packSize ?? null,
    quantityOrdered: item.quantityOrdered,
    quantityConfirmed: item.quantityConfirmed ?? null,
    availability: item.availability ?? null,
    notes: item.notes ?? null,
  };
}

async function fetchOrderWithItems(orderId: number) {
  const rows = await db
    .select({
      id: ordersTable.id,
      vendorId: ordersTable.vendorId,
      vendorName: vendorsTable.name,
      vendorEmail: vendorsTable.email,
      weekDate: ordersTable.weekDate,
      shipDate: ordersTable.shipDate,
      arriveDate: ordersTable.arriveDate,
      status: ordersTable.status,
      notes: ordersTable.notes,
      emailSentAt: ordersTable.emailSentAt,
      createdAt: ordersTable.createdAt,
      updatedAt: ordersTable.updatedAt,
    })
    .from(ordersTable)
    .innerJoin(vendorsTable, eq(vendorsTable.id, ordersTable.vendorId))
    .where(eq(ordersTable.id, orderId));

  if (!rows.length) return null;

  const items = await db
    .select({
      id: orderItemsTable.id,
      orderId: orderItemsTable.orderId,
      productId: orderItemsTable.productId,
      productName: productsTable.name,
      packSize: productsTable.packSize,
      quantityOrdered: orderItemsTable.quantityOrdered,
      quantityConfirmed: orderItemsTable.quantityConfirmed,
      availability: orderItemsTable.availability,
      notes: orderItemsTable.notes,
    })
    .from(orderItemsTable)
    .innerJoin(productsTable, eq(productsTable.id, orderItemsTable.productId))
    .where(eq(orderItemsTable.orderId, orderId));

  return { order: rows[0], items };
}

// GET /orders
router.get("/orders", async (req, res) => {
  try {
    const { vendorId, status, weekDate } = req.query as Record<string, string | undefined>;

    const conditions = [];
    if (vendorId) conditions.push(eq(ordersTable.vendorId, parseInt(vendorId, 10)));
    if (status) conditions.push(eq(ordersTable.status, status));
    if (weekDate) conditions.push(eq(ordersTable.weekDate, weekDate));

    const orders = await db
      .select({
        id: ordersTable.id,
        vendorId: ordersTable.vendorId,
        vendorName: vendorsTable.name,
        weekDate: ordersTable.weekDate,
        shipDate: ordersTable.shipDate,
        arriveDate: ordersTable.arriveDate,
        status: ordersTable.status,
        notes: ordersTable.notes,
        emailSentAt: ordersTable.emailSentAt,
        createdAt: ordersTable.createdAt,
      })
      .from(ordersTable)
      .innerJoin(vendorsTable, eq(vendorsTable.id, ordersTable.vendorId))
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(desc(ordersTable.createdAt));

    const orderIds = orders.map((o) => o.id);
    let itemCounts: Record<number, { total: number; confirmed: number; totalQty: number }> = {};

    if (orderIds.length > 0) {
      const items = await db
        .select()
        .from(orderItemsTable)
        .where(
          sql`${orderItemsTable.orderId} = ANY(ARRAY[${sql.join(orderIds.map((id) => sql`${id}`), sql`, `)}]::int[])`
        );
      for (const item of items) {
        if (!itemCounts[item.orderId]) itemCounts[item.orderId] = { total: 0, confirmed: 0, totalQty: 0 };
        itemCounts[item.orderId].total++;
        itemCounts[item.orderId].totalQty += item.quantityOrdered;
        if (item.availability === "available" || item.availability === "partial") {
          itemCounts[item.orderId].confirmed++;
        }
      }
    }

    res.json(
      orders.map((o) => ({
        id: o.id,
        vendorId: o.vendorId,
        vendorName: o.vendorName,
        weekDate: o.weekDate,
        shipDate: o.shipDate ?? null,
        arriveDate: o.arriveDate ?? null,
        status: o.status,
        notes: o.notes ?? null,
        emailSentAt: o.emailSentAt instanceof Date ? o.emailSentAt.toISOString() : (o.emailSentAt ?? null),
        totalItems: itemCounts[o.id]?.total ?? 0,
        confirmedItems: itemCounts[o.id]?.confirmed ?? 0,
        totalQuantity: itemCounts[o.id]?.totalQty ?? 0,
        createdAt: o.createdAt instanceof Date ? o.createdAt.toISOString() : o.createdAt,
      }))
    );
  } catch (err) {
    req.log.error({ err }, "Failed to list orders");
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST /orders
router.post("/orders", async (req, res) => {
  try {
    const { vendorId, weekDate, shipDate, arriveDate, notes, items } = req.body;

    if (!vendorId || !weekDate || !Array.isArray(items)) {
      return res.status(400).json({ error: "vendorId, weekDate, and items are required" });
    }

    const [order] = await db
      .insert(ordersTable)
      .values({ vendorId, weekDate, shipDate, arriveDate, notes, status: "draft" })
      .returning();

    if (items.length > 0) {
      await db.insert(orderItemsTable).values(
        items.map((item: any) => ({
          orderId: order.id,
          productId: item.productId,
          quantityOrdered: item.quantityOrdered,
        }))
      );
    }

    const result = await fetchOrderWithItems(order.id);
    const [vendor] = await db.select().from(vendorsTable).where(eq(vendorsTable.id, vendorId));

    res.status(201).json(
      mapOrder(
        { ...order, vendorName: vendor?.name ?? "", vendorEmail: vendor?.email ?? null },
        result?.items ?? []
      )
    );
  } catch (err) {
    req.log.error({ err }, "Failed to create order");
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET /orders/:orderId
router.get("/orders/:orderId", async (req, res) => {
  try {
    const orderId = parseInt(req.params.orderId, 10);
    const result = await fetchOrderWithItems(orderId);
    if (!result) return res.status(404).json({ error: "Order not found" });
    res.json(mapOrder(result.order, result.items));
  } catch (err) {
    req.log.error({ err }, "Failed to get order");
    res.status(500).json({ error: "Internal server error" });
  }
});

// PATCH /orders/:orderId
router.patch("/orders/:orderId", async (req, res) => {
  try {
    const orderId = parseInt(req.params.orderId, 10);
    const { status, notes, shipDate, arriveDate } = req.body;

    const updateData: any = { updatedAt: new Date() };
    if (status !== undefined) updateData.status = status;
    if (notes !== undefined) updateData.notes = notes;
    if (shipDate !== undefined) updateData.shipDate = shipDate;
    if (arriveDate !== undefined) updateData.arriveDate = arriveDate;

    await db.update(ordersTable).set(updateData).where(eq(ordersTable.id, orderId));

    const result = await fetchOrderWithItems(orderId);
    if (!result) return res.status(404).json({ error: "Order not found" });
    res.json(mapOrder(result.order, result.items));
  } catch (err) {
    req.log.error({ err }, "Failed to update order");
    res.status(500).json({ error: "Internal server error" });
  }
});

// DELETE /orders/:orderId
router.delete("/orders/:orderId", async (req, res) => {
  try {
    const orderId = parseInt(req.params.orderId, 10);
    await db.delete(ordersTable).where(eq(ordersTable.id, orderId));
    res.status(204).send();
  } catch (err) {
    req.log.error({ err }, "Failed to delete order");
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET /orders/:orderId/items
router.get("/orders/:orderId/items", async (req, res) => {
  try {
    const orderId = parseInt(req.params.orderId, 10);
    const items = await db
      .select({
        id: orderItemsTable.id,
        orderId: orderItemsTable.orderId,
        productId: orderItemsTable.productId,
        productName: productsTable.name,
        packSize: productsTable.packSize,
        quantityOrdered: orderItemsTable.quantityOrdered,
        quantityConfirmed: orderItemsTable.quantityConfirmed,
        availability: orderItemsTable.availability,
        notes: orderItemsTable.notes,
      })
      .from(orderItemsTable)
      .innerJoin(productsTable, eq(productsTable.id, orderItemsTable.productId))
      .where(eq(orderItemsTable.orderId, orderId));

    res.json(items.map(mapItem));
  } catch (err) {
    req.log.error({ err }, "Failed to list order items");
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST /orders/:orderId/items
router.post("/orders/:orderId/items", async (req, res) => {
  try {
    const orderId = parseInt(req.params.orderId, 10);
    const { productId, quantityOrdered } = req.body;

    const [item] = await db
      .insert(orderItemsTable)
      .values({ orderId, productId, quantityOrdered })
      .returning();

    const [product] = await db.select().from(productsTable).where(eq(productsTable.id, productId));

    res.status(201).json(mapItem({ ...item, productName: product?.name ?? "", packSize: product?.packSize }));
  } catch (err) {
    req.log.error({ err }, "Failed to add order item");
    res.status(500).json({ error: "Internal server error" });
  }
});

// PATCH /orders/:orderId/items/:itemId
router.patch("/orders/:orderId/items/:itemId", async (req, res) => {
  try {
    const itemId = parseInt(req.params.itemId, 10);
    const { quantityOrdered, quantityConfirmed, availability, notes } = req.body;

    const updateData: any = {};
    if (quantityOrdered !== undefined) updateData.quantityOrdered = quantityOrdered;
    if (quantityConfirmed !== undefined) updateData.quantityConfirmed = quantityConfirmed;
    if (availability !== undefined) updateData.availability = availability;
    if (notes !== undefined) updateData.notes = notes;

    await db.update(orderItemsTable).set(updateData).where(eq(orderItemsTable.id, itemId));

    const rows = await db
      .select({
        id: orderItemsTable.id,
        orderId: orderItemsTable.orderId,
        productId: orderItemsTable.productId,
        productName: productsTable.name,
        packSize: productsTable.packSize,
        quantityOrdered: orderItemsTable.quantityOrdered,
        quantityConfirmed: orderItemsTable.quantityConfirmed,
        availability: orderItemsTable.availability,
        notes: orderItemsTable.notes,
      })
      .from(orderItemsTable)
      .innerJoin(productsTable, eq(productsTable.id, orderItemsTable.productId))
      .where(eq(orderItemsTable.id, itemId));

    if (!rows.length) return res.status(404).json({ error: "Item not found" });
    res.json(mapItem(rows[0]));
  } catch (err) {
    req.log.error({ err }, "Failed to update order item");
    res.status(500).json({ error: "Internal server error" });
  }
});

// DELETE /orders/:orderId/items/:itemId
router.delete("/orders/:orderId/items/:itemId", async (req, res) => {
  try {
    const itemId = parseInt(req.params.itemId, 10);
    await db.delete(orderItemsTable).where(eq(orderItemsTable.id, itemId));
    res.status(204).send();
  } catch (err) {
    req.log.error({ err }, "Failed to delete order item");
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST /orders/:orderId/receive
router.post("/orders/:orderId/receive", async (req, res) => {
  try {
    const orderId = parseInt(req.params.orderId, 10);
    const { items } = req.body;
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: "items array required" });
    }

    // Fetch order to get vendorId
    const orderRows = await db
      .select({ vendorId: ordersTable.vendorId })
      .from(ordersTable)
      .where(eq(ordersTable.id, orderId));
    if (!orderRows.length) return res.status(404).json({ error: "Order not found" });
    const vendorId = orderRows[0].vendorId;

    for (const item of items) {
      if (!item.productId || !item.quantityReceived || item.quantityReceived <= 0) continue;

      // Record transaction
      await db.insert(inventoryTransactionsTable).values({
        productId: item.productId,
        vendorId,
        orderId,
        type: "receive",
        quantity: item.quantityReceived,
        notes: item.notes ?? null,
      });

      // Upsert inventory_items
      const existing = await db
        .select()
        .from(inventoryItemsTable)
        .where(and(eq(inventoryItemsTable.productId, item.productId), eq(inventoryItemsTable.vendorId, vendorId)));

      if (existing.length > 0) {
        await db
          .update(inventoryItemsTable)
          .set({ quantityOnHand: existing[0].quantityOnHand + item.quantityReceived, updatedAt: new Date() })
          .where(eq(inventoryItemsTable.id, existing[0].id));
      } else {
        await db.insert(inventoryItemsTable).values({
          productId: item.productId,
          vendorId,
          quantityOnHand: item.quantityReceived,
        });
      }
    }

    res.json({ received: items.length });
  } catch (err) {
    req.log.error({ err }, "Failed to receive order");
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST /orders/:orderId/confirm
router.post("/orders/:orderId/confirm", async (req, res) => {
  try {
    const orderId = parseInt(req.params.orderId, 10);
    const { items } = req.body;

    if (!Array.isArray(items)) {
      return res.status(400).json({ error: "items array required" });
    }

    for (const item of items) {
      const updateData: any = { availability: item.availability };
      if (item.quantityConfirmed !== undefined) updateData.quantityConfirmed = item.quantityConfirmed;
      if (item.notes !== undefined) updateData.notes = item.notes;
      await db.update(orderItemsTable).set(updateData).where(eq(orderItemsTable.id, item.itemId));
    }

    const allItems = await db.select().from(orderItemsTable).where(eq(orderItemsTable.orderId, orderId));
    const hasUnavailable = allItems.some((i) => i.availability === "unavailable" || i.availability === "partial");
    const allAvailable = allItems.every((i) => i.availability === "available");

    let newStatus = "sent";
    if (allAvailable) newStatus = "confirmed";
    else if (hasUnavailable) newStatus = "partial";

    await db.update(ordersTable).set({ status: newStatus, updatedAt: new Date() }).where(eq(ordersTable.id, orderId));

    const result = await fetchOrderWithItems(orderId);
    if (!result) return res.status(404).json({ error: "Order not found" });
    res.json(mapOrder(result.order, result.items));
  } catch (err) {
    req.log.error({ err }, "Failed to confirm order");
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST /orders/:orderId/send-email
router.post("/orders/:orderId/send-email", async (req, res) => {
  try {
    const orderId = parseInt(req.params.orderId, 10);

    const rows = await db
      .select({
        id: ordersTable.id,
        vendorId: ordersTable.vendorId,
        vendorName: vendorsTable.name,
        vendorEmail: vendorsTable.email,
        weekDate: ordersTable.weekDate,
        status: ordersTable.status,
        confirmToken: ordersTable.confirmToken,
      })
      .from(ordersTable)
      .innerJoin(vendorsTable, eq(vendorsTable.id, ordersTable.vendorId))
      .where(eq(ordersTable.id, orderId));

    if (!rows.length) return res.status(404).json({ error: "Order not found" });

    const order = rows[0];

    if (!order.vendorEmail) {
      return res.status(400).json({ error: "Vendor has no email address on file. Please add one in Admin > Vendors." });
    }

    // Generate or reuse confirm token
    let token = order.confirmToken;
    if (!token) {
      token = randomUUID();
      await db.update(ordersTable).set({ confirmToken: token }).where(eq(ordersTable.id, orderId));
    }

    // Build the confirmation URL using REPLIT_DOMAINS or fallback
    const domain = process.env.REPLIT_DOMAINS?.split(",")[0]?.trim()
      ?? `localhost:80`;
    const protocol = domain.startsWith("localhost") ? "http" : "https";
    const confirmUrl = `${protocol}://${domain}/confirm/${token}`;

    // Format week date nicely
    const weekDateDisplay = order.weekDate;

    const emailBody = buildEmailHtml({
      vendorName: order.vendorName,
      weekDate: weekDateDisplay,
      confirmUrl,
      orderId,
    });

    const connectors = new ReplitConnectors();
    const emailB64 = Buffer.from(
      `To: ${order.vendorEmail}\r\n` +
      `Subject: Purchase Order Confirmation Request - ${order.vendorName} - Week of ${weekDateDisplay}\r\n` +
      `MIME-Version: 1.0\r\n` +
      `Content-Type: text/html; charset=UTF-8\r\n` +
      `\r\n` +
      emailBody
    ).toString("base64url");

    const response = await connectors.proxy("google-mail", "/gmail/v1/users/me/messages/send", {
      method: "POST",
      body: JSON.stringify({ raw: emailB64 }),
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      const errText = await response.text();
      req.log.error({ status: response.status, errText }, "Gmail send failed");
      return res.status(502).json({ error: "Failed to send email via Gmail" });
    }

    const emailSentAt = new Date();
    await db.update(ordersTable)
      .set({ emailSentAt, status: order.status === "draft" ? "sent" : order.status, updatedAt: emailSentAt })
      .where(eq(ordersTable.id, orderId));

    res.json({
      success: true,
      message: `Email sent to ${order.vendorEmail}`,
      emailSentAt: emailSentAt.toISOString(),
    });
  } catch (err) {
    req.log.error({ err }, "Failed to send order email");
    res.status(500).json({ error: "Internal server error" });
  }
});

function buildEmailHtml({ vendorName, weekDate, confirmUrl, orderId }: {
  vendorName: string;
  weekDate: string;
  confirmUrl: string;
  orderId: number;
}) {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background:#f5f0e8;font-family:Georgia,serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f0e8;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);">
          <tr>
            <td style="background:#2d5a3d;padding:32px 40px;">
              <h1 style="margin:0;color:#ffffff;font-size:22px;font-weight:normal;letter-spacing:0.5px;">Vickery Wholesale Greenhouse</h1>
              <p style="margin:6px 0 0;color:#a8c9b4;font-size:14px;">Purchase Order Confirmation Request</p>
            </td>
          </tr>
          <tr>
            <td style="padding:40px;">
              <p style="margin:0 0 16px;color:#3d2b1f;font-size:16px;">Dear ${vendorName},</p>
              <p style="margin:0 0 24px;color:#5a4a3a;font-size:15px;line-height:1.6;">
                Please review and confirm your availability for Purchase Order #${orderId} for the week of <strong>${weekDate}</strong>.
              </p>
              <p style="margin:0 0 32px;color:#5a4a3a;font-size:15px;line-height:1.6;">
                Click the button below to open the order and mark each item as available, unavailable, or partial. No login is required.
              </p>
              <table cellpadding="0" cellspacing="0">
                <tr>
                  <td style="background:#2d5a3d;border-radius:6px;">
                    <a href="${confirmUrl}" style="display:inline-block;padding:14px 32px;color:#ffffff;font-size:15px;text-decoration:none;font-family:Georgia,serif;">
                      Review &amp; Confirm Order
                    </a>
                  </td>
                </tr>
              </table>
              <p style="margin:32px 0 0;color:#9a8a7a;font-size:13px;line-height:1.5;">
                If the button above doesn't work, copy and paste this link into your browser:<br>
                <a href="${confirmUrl}" style="color:#2d5a3d;word-break:break-all;">${confirmUrl}</a>
              </p>
            </td>
          </tr>
          <tr>
            <td style="background:#f5f0e8;padding:24px 40px;border-top:1px solid #e8e0d0;">
              <p style="margin:0;color:#9a8a7a;font-size:12px;">
                This email was sent by Vickery Wholesale Greenhouse purchasing system. 
                If you have questions, please reply to this email or contact your buyer directly.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export default router;
