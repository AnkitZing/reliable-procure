export type Role = 'SUPER_ADMIN' | 'BUYER' | 'APPROVER' | 'VENDOR';

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: Role;
  companyId?: string;
  companyName?: string;
  department?: string;
  avatar?: string;
}

export interface Company {
  id: string;
  name: string;
  gstin: string;
  pan: string;
  type: 'ENTERPRISE' | 'VENDOR';
  creditLimit: number;
  creditUsed: number;
  paymentTerms: string; // e.g., 'Net 30', 'Net 45'
  status: 'ACTIVE' | 'PENDING_KYC' | 'SUSPENDED';
  billingAddress: string;
  state: string;
}

export interface ProductTier {
  minQty: number;
  price: number;
}

export interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  description: string;
  brand: string;
  basePrice: number;
  contractPrice?: number; // Special enterprise contracted rate
  hsnCode: string;
  gstRate: number; // 5, 12, 18, 28
  unit: string;
  moq: number; // Minimum order quantity
  stock: number;
  image: string;
  gallery?: string[];
  tiers: ProductTier[];
  vendorId: string;
  vendorName: string;
  specifications?: Record<string, string>;
  standards?: string[];
  features?: string[];
  leadTimeDays?: number;
  warranty?: string;
  origin?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  effectiveUnitPrice: number;
}

export type RequisitionStatus = 'DRAFT' | 'PENDING_APPROVAL' | 'APPROVED' | 'REJECTED' | 'PO_GENERATED';

export interface RequisitionItem {
  productId: string;
  productName: string;
  sku: string;
  unit: string;
  quantity: number;
  unitPrice: number;
  hsnCode: string;
  gstRate: number;
  taxAmount: number;
  totalAmount: number;
}

export interface Requisition {
  id: string;
  prNumber: string;
  buyerId: string;
  buyerName: string;
  companyId: string;
  companyName: string;
  department: string;
  subtotal: number;
  totalTax: number;
  totalAmount: number;
  status: RequisitionStatus;
  items: RequisitionItem[];
  createdAt: string;
  approvedBy?: string;
  approvedAt?: string;
  rejectionReason?: string;
  approvalThreshold: number;
  poNumber?: string;
}

export type POStatus = 'ISSUED' | 'ACKNOWLEDGED' | 'IN_TRANSIT' | 'PARTIALLY_DELIVERED' | 'DELIVERED' | 'CLOSED';

export interface PurchaseOrder {
  id: string;
  poNumber: string;
  prId: string;
  companyId: string;
  companyName: string;
  buyerName: string;
  buyerGstin: string;
  vendorId: string;
  vendorName: string;
  vendorGstin: string;
  items: RequisitionItem[];
  subtotal: number;
  cgst: number;
  sgst: number;
  igst: number;
  totalAmount: number;
  status: POStatus;
  deliveryDate: string;
  issuedAt: string;
  shippingAddress: string;
  trackingNumber?: string;
  carrierName?: string;
}

export type RFQStatus = 'OPEN' | 'QUOTES_RECEIVED' | 'AWARDED' | 'CANCELLED';

export interface VendorQuote {
  id: string;
  vendorId: string;
  vendorName: string;
  unitPrice: number;
  taxRate: number;
  totalPrice: number;
  leadTimeDays: number;
  validUntil: string;
  status: 'SUBMITTED' | 'ACCEPTED' | 'REJECTED';
  notes?: string;
}

export interface RFQ {
  id: string;
  rfqNumber: string;
  title: string;
  category: string;
  description: string;
  quantity: number;
  unit: string;
  targetDate: string;
  companyName: string;
  department: string;
  status: RFQStatus;
  quotes: VendorQuote[];
  createdAt: string;
  winningQuoteId?: string;
}

export interface GRNItem {
  productId: string;
  productName: string;
  orderedQty: number;
  receivedQty: number;
  acceptedQty: number;
  rejectedQty: number;
  rejectionRemarks?: string;
}

export interface GRN {
  id: string;
  grnNumber: string;
  poNumber: string;
  vendorName: string;
  receivedDate: string;
  inspectedBy: string;
  items: GRNItem[];
  status: 'PENDING_VERIFICATION' | 'MATCHED' | 'DISCREPANCY_FLAGGED';
}

export interface ThreeWayMatch {
  poNumber: string;
  vendorName: string;
  poAmount: number;
  grnStatus: 'FULLY_RECEIVED' | 'PARTIALLY_RECEIVED' | 'REJECTED_PARTS';
  invoiceAmount: number;
  matchStatus: 'MATCHED' | 'VARIANCE_FLAGGED';
  varianceAmount: number;
  paymentSettlementStatus: 'PENDING' | 'CLEARED' | 'ON_HOLD';
}
