# Reliable — Enterprise B2B Procurement & Sourcing Platform

A modern, high-performance **Procure-to-Pay (P2P)** enterprise procurement platform built with **Next.js 16 (App Router)**, **React 19**, **TypeScript**, and **Tailwind CSS**.

---

## 🌟 Key Functional Features

1. **Procure-to-Pay (P2P) Lifecycle Automation:**
   * **Enterprise Catalog:** Volume-tiered commercial pricing (10+, 50+, 200+ units) across MRO, Safety & PPE, Electrical, IT, and Facilities.
   * **Threshold Requisition (PR) Routing:**
     * Total < ₹15,000 $\rightarrow$ **Auto-Approved into PO** instantly.
     * Total $\ge$ ₹15,000 $\rightarrow$ Routed to Department Manager / Finance Approver.
   * **Digital Purchase Order (PO):** Formally formatted, GST-compliant digital POs with HSN codes, tax calculations (CGST/SGST vs IGST), and carrier tracking.
   * **Request for Quote (RFQ) Engine:** Custom requirement bidding with side-by-side supplier quotation comparison and 1-click PO award.
   * **Automated 3-Way Matching:** Cross-matches Purchase Orders $\leftrightarrow$ Physical Warehouse GRNs $\leftrightarrow$ Supplier GST Invoices with variance detection and payment clearance.
   * **Spend Analytics & Buydesk Intelligence:** Real-time departmental budget consumption gauges and contract cost savings tracking.

---

## 🔑 Demo Access Credentials

The platform features an instant **1-Click Auto-Fill** on the login page:

| Role | User Name | Email | Password |
|---|---|---|---|
| **Super Admin** | Rajesh Sharma | `admin@reliableprocure.com` | `Admin@123` |
| **Corporate Buyer** | Ankit Jain | `ankit.jain@tataadvanced.com` | `Buyer@123` |
| **Finance Approver** | Vikramaditya Rao | `v.rao@tataadvanced.com` | `Approver@123` |
| **Supplier / Vendor** | Industrial Supply Hub | `sales@industrialsupplyhub.in` | `Vendor@123` |

---

## 🚀 Local Development

```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm run dev

# 3. Open browser at:
http://localhost:3000
```

---

## ☁️ 1-Click Free Deployment on Vercel

1. Push this repo to your GitHub account.
2. Go to [vercel.com/new](https://vercel.com/new) and import this repository.
3. Click **Deploy**. Vercel will automatically build and provide a permanent free `https://reliable-procure.vercel.app` URL with automated SSL.
