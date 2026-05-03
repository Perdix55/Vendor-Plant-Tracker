# Vickery Wholesale Greenhouse — Purchase Order System
## Training Guide

---

## Table of Contents

1. [Overview](#overview)
2. [Getting Around](#getting-around)
3. [Dashboard](#dashboard)
4. [Vendors](#vendors)
5. [Purchase Orders — Full Workflow](#purchase-orders--full-workflow)
   - [Step 1: Create a Draft Order](#step-1-create-a-draft-order)
   - [Step 2: Submit the Order](#step-2-submit-the-order)
   - [Step 3: Send the Vendor Email](#step-3-send-the-vendor-email)
   - [Step 4: Vendor Confirms (Vendor Side)](#step-4-vendor-confirms-vendor-side)
   - [Step 5: Enter Vendor Confirmations (Internal)](#step-5-enter-vendor-confirmations-internal)
   - [Step 6: Receive the Shipment](#step-6-receive-the-shipment)
6. [Inventory](#inventory)
7. [Barcode Labels](#barcode-labels)
8. [Admin](#admin)
   - [Vendors Tab](#vendors-tab)
   - [Products Tab](#products-tab)
   - [Settings Tab](#settings-tab)
9. [Order Status Reference](#order-status-reference)
10. [Tips and Common Questions](#tips-and-common-questions)

---

## Overview

The Vickery PO System is the internal tool used to manage all weekly purchase orders with your 13 plant vendors. It replaces paper-based or spreadsheet ordering by giving you one place to:

- Build orders from each vendor's product catalog
- Email vendors a confirmation link so they can mark availability
- Track what was confirmed, what arrived, and what's in inventory
- Print barcode labels for received plants
- Manage vendor contact information and product catalogs

---

## Getting Around

The left sidebar is your main navigation. It has five sections:

| Item | What it does |
|---|---|
| **Dashboard** | Quick overview of recent activity and stats |
| **Purchase Orders** | Create and manage all orders |
| **Inventory** | View current stock levels, adjust, and view history |
| **Vendors** | Browse all vendors and their product catalogs |
| **Admin** | Manage vendor emails, shipping days, products, and settings |

At the bottom of the sidebar is a **New Order** button — a shortcut to start a fresh purchase order from anywhere in the system.

---

## Dashboard

The Dashboard gives you a snapshot of what's happening right now:

- **Summary cards** — total active orders, pending confirmations, items received this week, and low stock alerts
- **Recent Orders** — the last several purchase orders with their current status and vendor name
- **Vendor Activity** — how many orders each vendor has received total

Use the Dashboard as your daily starting point to see what orders need attention.

---

## Vendors

The Vendors page shows all 13 vendors as a grid of cards. Each card shows the vendor name and the number of products in their catalog.

Click any vendor card to open their **Vendor Detail** page, which includes:

- Vendor name and configured shipping days
- A searchable product catalog for that vendor (product name + pack size)

The vendor detail page is read-only — product editing is done in Admin.

---

## Purchase Orders — Full Workflow

A purchase order moves through several stages. Here is the complete step-by-step process from creation to receiving inventory.

---

### Step 1: Create a Draft Order

1. Click **Purchase Orders** in the sidebar, then click **New Order** (or use the button at the bottom of the sidebar).
2. Choose a **vendor** from the dropdown.
3. Set the **Ship Date** (when the vendor ships) and **Arrive Date** (when you expect the truck).
4. The system loads that vendor's full product catalog below the form.
5. Enter a quantity in the **Qty** column next to any product you want to order. Leave blank to skip that product.
6. Click **Create Order**.

The order is saved as a **Draft**. You can come back to it and edit quantities at any time while it is still a draft.

---

### Step 2: Submit the Order

Open the draft order by clicking its row on the Purchase Orders list.

When you are ready to finalize the quantities:

1. Click **Submit Order** (top right of the order detail page).
2. The order status changes to **Submitted** (shown with an orange badge).

Once submitted, the line items are locked — you can no longer edit quantities. This signals the order is ready to go to the vendor.

---

### Step 3: Send the Vendor Email

After submitting, the order detail page shows a **Send Email** button.

1. Click **Send Email**.
2. The system sends an HTML email to the vendor's address on file. The email contains a unique confirmation link.
3. The order status updates to **Sent** (blue badge) and the "Email sent" timestamp is recorded.

If you need to resend (e.g., the vendor didn't receive it), click **Resend Email** — the same unique link is reused.

> **Important:** The vendor must have an email address saved in Admin > Vendors before this button will work. If no email is on file you will see an error message.

---

### Step 4: Vendor Confirms (Vendor Side)

The vendor receives an email with a button linking to a confirmation page. No login is required — the link is unique and secure.

On the confirmation page the vendor sees:

- Your company name and the order week
- A table of every line item with product name, pack size, and quantity ordered
- For each line, a dropdown to select: **Available**, **Unavailable**, or **Partial**
- If they select **Partial**, a field appears to enter the confirmed quantity
- An optional **Notes** field per line

The vendor clicks **Submit Confirmation** when done. The system records their response and the order status automatically updates.

---

### Step 5: Enter Vendor Confirmations (Internal)

If the vendor calls or emails their confirmation instead of using the link, you can enter it yourself:

1. Open the order detail page.
2. Click **Enter Vendor Confirmations**.
3. Each line item shows a dropdown: Available / Partial / Unavailable.
4. For Partial, enter the confirmed quantity.
5. Click **Save Confirmations**.

After saving, the order status automatically updates to:
- **Confirmed** — if all items are available or partial
- **Partial** — if some items are unavailable

---

### Step 6: Receive the Shipment

When the truck arrives:

1. Open the order detail page (status should be Confirmed or Partial).
2. Click **Receive Shipment** (green button).
3. On the receive page, each confirmed line item is listed with a quantity field pre-filled with the confirmed amount.
4. Adjust any quantities if what arrived differs from what was confirmed.
5. Add a **Note** to any line if needed (e.g., "damaged tray").
6. Click **Confirm Receipt**.

The system:
- Creates an inventory transaction record for each received item
- Updates the on-hand quantity in inventory
- Hides the "Receive Shipment" button on the order (since it's been received)

---

## Inventory

The **Inventory** page shows current stock levels for everything that has been received.

### What you see

- **Summary cards** at the top: total SKUs in stock, total units on hand, items received this week, and items with zero stock
- **Search bar** to filter by product name or vendor
- A table with: Product, Vendor, Pack Size, Quantity On Hand, and Last Received date

### Adjusting inventory

Use the **Adjust** button (pencil icon) on any inventory row to record:

| Adjustment Type | When to use |
|---|---|
| **Sale** | Record a sale that reduces stock |
| **Write-off** | Remove damaged or dead plants |
| **Correction** | Fix a count that was entered incorrectly |

Enter the quantity and an optional note, then click Save.

### Transaction History

Click the **History** button (clock icon) on any inventory row to see a full ledger of every receive, sale, adjustment, and write-off for that product.

---

## Barcode Labels

On the **Order Detail** page, after an order has been submitted/sent, a **Labels** column appears in the line items table.

For each product you want to label:

1. Adjust the **qty** field (pre-filled with the pack size).
2. Click the **print icon** button.
3. A print window opens with CODE128 barcodes — one per unit — formatted for label printing.
4. Print directly from that window.

The barcode encodes the product name so it can be scanned when selling or doing inventory counts.

---

## Admin

The Admin page has three tabs: **Vendors**, **Products**, and **Settings**.

---

### Vendors Tab

This is where you manage the contact information for each of the 13 vendors.

**To edit a vendor:**
1. Click the pencil icon on any vendor row.
2. Update the **email address** and/or **shipping days** (e.g., Monday, Tuesday).
3. Click the check mark to save.

**Email address** is required for the Send Email step to work.

**Shipping days** are informational — they help you plan which orders to create each week.

**To add a new vendor:**
1. Click **Add Vendor**.
2. Enter the vendor name, email, and shipping days.
3. Click Save.

**To import a vendor + products from a spreadsheet:**
1. Click **Import Spreadsheet**.
2. Select an Excel or CSV file. The file must have columns named **Product** (or "Name") and **Pack Size** (or "Size").
3. Enter the vendor name.
4. Click Import.

The system will create the vendor and all their products in one step.

---

### Products Tab

The Products tab lets you view and edit the product catalog for any vendor.

1. Select a vendor from the dropdown.
2. The full product list for that vendor loads below.
3. Click the pencil icon on any product to edit the name or pack size.
4. Click the **+ Add Product** button to add a new product to the selected vendor.

---

### Settings Tab

The Settings tab currently has one option:

**Sending Email Address** — Enter an email address here (e.g., `orders@vickerygreenhouse.com`) to have vendor confirmation emails include a Reply-To header pointing to that address. When vendors hit Reply in their email client, their response goes to this address instead of the Gmail account used to send.

Leave it blank to use the default Gmail account behavior.

---

## Order Status Reference

| Status | Badge color | What it means |
|---|---|---|
| **Draft** | Gray | Order is being built; quantities can still be edited |
| **Submitted** | Orange | Order is finalized and ready to send; line items are locked |
| **Sent** | Blue | Confirmation email has been sent to the vendor |
| **Confirmed** | Green | All line items have vendor confirmation |
| **Partial** | Yellow | Some items unavailable; partial confirmation recorded |

---

## Tips and Common Questions

**Q: I clicked Send Email but got an error.**
Make sure the vendor has an email address saved in Admin > Vendors. All vendors start with no email on file and must be set up before emailing.

**Q: The vendor confirmed by phone. What do I do?**
Open the order and click "Enter Vendor Confirmations." You can enter everything manually without the vendor needing to use the link.

**Q: Can I edit an order after submitting?**
No. Once an order is submitted the quantities are locked. If you need to change something, contact the vendor directly and enter any differences when receiving the shipment.

**Q: What if the truck arrives with different quantities than confirmed?**
On the Receive Shipment page, simply change the quantity for that line item to what actually arrived before clicking Confirm Receipt.

**Q: How do I fix an inventory count that was entered wrong?**
Go to Inventory, find the product, click Adjust, choose **Correction**, and enter the correct quantity. The system records the correction in the transaction history.

**Q: Can I resend the confirmation email?**
Yes — the button changes to "Resend Email" after the first send. The vendor's existing link still works.

**Q: A vendor is not on the list.**
Go to Admin > Vendors and click Add Vendor, or use Import Spreadsheet if you have their product list in a file.
