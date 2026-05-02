import { Router } from "express";
import { db } from "@workspace/db";
import { ordersTable, vendorsTable } from "@workspace/db";
import { eq, desc, sql, count } from "drizzle-orm";

const router = Router();

// GET /summary/dashboard
router.get("/summary/dashboard", async (req, res) => {
  try {
    const orders = await db.select({ status: ordersTable.status, weekDate: ordersTable.weekDate }).from(ordersTable);
    const vendors = await db.select({ id: vendorsTable.id }).from(vendorsTable);

    const now = new Date();
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - now.getDay());
    const weekStartStr = weekStart.toISOString().split("T")[0];

    const totalOrders = orders.length;
    const draftOrders = orders.filter((o) => o.status === "draft").length;
    const sentOrders = orders.filter((o) => o.status === "sent").length;
    const confirmedOrders = orders.filter((o) => o.status === "confirmed").length;
    const partialOrders = orders.filter((o) => o.status === "partial").length;
    const totalVendors = vendors.length;
    const currentWeekOrders = orders.filter((o) => o.weekDate >= weekStartStr).length;

    res.json({
      totalOrders,
      draftOrders,
      sentOrders,
      confirmedOrders,
      partialOrders,
      totalVendors,
      currentWeekOrders,
      upcomingWeeks: Math.max(0, sentOrders + draftOrders),
    });
  } catch (err) {
    req.log.error({ err }, "Failed to get dashboard summary");
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET /summary/recent-orders
router.get("/summary/recent-orders", async (req, res) => {
  try {
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
        createdAt: ordersTable.createdAt,
      })
      .from(ordersTable)
      .innerJoin(vendorsTable, eq(vendorsTable.id, ordersTable.vendorId))
      .orderBy(desc(ordersTable.createdAt))
      .limit(20);

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
        totalItems: 0,
        confirmedItems: 0,
        totalQuantity: 0,
        createdAt: o.createdAt instanceof Date ? o.createdAt.toISOString() : o.createdAt,
      }))
    );
  } catch (err) {
    req.log.error({ err }, "Failed to get recent orders");
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET /summary/vendor-activity
router.get("/summary/vendor-activity", async (req, res) => {
  try {
    const rows = await db
      .select({
        vendorId: vendorsTable.id,
        vendorName: vendorsTable.name,
        totalOrders: count(ordersTable.id),
      })
      .from(vendorsTable)
      .leftJoin(ordersTable, eq(ordersTable.vendorId, vendorsTable.id))
      .groupBy(vendorsTable.id)
      .orderBy(vendorsTable.name);

    const lastOrderRows = await db
      .select({ vendorId: ordersTable.vendorId, maxDate: sql<string>`max(${ordersTable.createdAt})` })
      .from(ordersTable)
      .groupBy(ordersTable.vendorId);

    const lastOrderMap: Record<number, string> = {};
    for (const r of lastOrderRows) lastOrderMap[r.vendorId] = r.maxDate;

    res.json(
      rows.map((r) => ({
        vendorId: r.vendorId,
        vendorName: r.vendorName,
        totalOrders: r.totalOrders,
        lastOrderDate: lastOrderMap[r.vendorId] ?? null,
      }))
    );
  } catch (err) {
    req.log.error({ err }, "Failed to get vendor activity");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
