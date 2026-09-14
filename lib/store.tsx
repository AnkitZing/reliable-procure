'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Role, User, Product, Requisition, PurchaseOrder, RFQ, ThreeWayMatch, CartItem, Company
} from './types';
import { 
  DEMO_USERS, INITIAL_COMPANIES, INITIAL_PRODUCTS, 
  INITIAL_REQUISITIONS, INITIAL_PURCHASE_ORDERS, INITIAL_RFQS, INITIAL_MATCHES 
} from './mock-data';

const STORAGE_PREFIX = 'reliable_v3_';

const STORAGE_KEYS = {
  CURRENT_ROLE: `${STORAGE_PREFIX}role`,
  CART: `${STORAGE_PREFIX}cart`,
  PRODUCTS: `${STORAGE_PREFIX}products`,
  REQUISITIONS: `${STORAGE_PREFIX}requisitions`,
  PURCHASE_ORDERS: `${STORAGE_PREFIX}purchase_orders`,
  RFQS: `${STORAGE_PREFIX}rfqs`,
  MATCHES: `${STORAGE_PREFIX}matches`,
  COMPANIES: `${STORAGE_PREFIX}companies`,
};

function getStored<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch {
    return fallback;
  }
}

function saveStored<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error('Storage error', e);
  }
}

interface ReliableStoreContextType {
  isLoaded: boolean;
  currentRole: Role;
  currentUser: User;
  setRole: (role: Role) => void;
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  products: Product[];
  addProduct: (product: Omit<Product, 'id'>) => void;
  bulkAddProducts: (newProducts: Omit<Product, 'id'>[]) => void;
  adjustProductStock: (productId: string, newStock: number) => void;
  requisitions: Requisition[];
  createRequisitionFromCart: (department?: string) => Requisition | null;
  approveRequisition: (prId: string) => void;
  rejectRequisition: (prId: string, reason: string) => void;
  purchaseOrders: PurchaseOrder[];
  updatePOStatus: (poId: string, status: PurchaseOrder['status'], trackingNumber?: string, carrierName?: string) => void;
  rfqs: RFQ[];
  createRFQ: (rfqData: Omit<RFQ, 'id' | 'rfqNumber' | 'createdAt' | 'status' | 'quotes'>) => RFQ;
  awardRFQQuote: (rfqId: string, quoteId: string) => void;
  matches: ThreeWayMatch[];
  clearMatchSettlement: (poNumber: string) => void;
  companies: Company[];
  addCompany: (company: Omit<Company, 'id'>) => void;
  toggleCompanyStatus: (companyId: string) => void;
  resetDemoData: () => void;
  isAuthenticated: boolean;
  login: (email: string, password?: string) => { success: boolean; message?: string };
  logout: () => void;
}

const ReliableContext = createContext<ReliableStoreContextType | null>(null);

export function ReliableProvider({ children }: { children: React.ReactNode }) {
  const [currentRole, setCurrentRoleState] = useState<Role>('BUYER');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [requisitions, setRequisitions] = useState<Requisition[]>(INITIAL_REQUISITIONS);
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>(INITIAL_PURCHASE_ORDERS);
  const [rfqs, setRfqs] = useState<RFQ[]>(INITIAL_RFQS);
  const [matches, setMatches] = useState<ThreeWayMatch[]>(INITIAL_MATCHES);
  const [companies, setCompanies] = useState<Company[]>(INITIAL_COMPANIES);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Initialize once on mount
  useEffect(() => {
    const storedRole = getStored<Role>(STORAGE_KEYS.CURRENT_ROLE, 'BUYER');
    const storedCart = getStored<CartItem[]>(STORAGE_KEYS.CART, []);
    const storedProducts = getStored<Product[]>(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
    
    // Merge initial products with stored products so any newly added catalog items are guaranteed present
    const prodMap = new Map<string, Product>();
    INITIAL_PRODUCTS.forEach(p => prodMap.set(p.id, p));
    storedProducts.forEach(p => prodMap.set(p.id, p));
    const mergedProducts = Array.from(prodMap.values());

    const storedRequisitions = getStored<Requisition[]>(STORAGE_KEYS.REQUISITIONS, INITIAL_REQUISITIONS);
    const storedPOs = getStored<PurchaseOrder[]>(STORAGE_KEYS.PURCHASE_ORDERS, INITIAL_PURCHASE_ORDERS);
    const storedRfqs = getStored<RFQ[]>(STORAGE_KEYS.RFQS, INITIAL_RFQS);
    const storedMatches = getStored<ThreeWayMatch[]>(STORAGE_KEYS.MATCHES, INITIAL_MATCHES);
    
    const storedCompanies = getStored<Company[]>(STORAGE_KEYS.COMPANIES, INITIAL_COMPANIES);
    const compMap = new Map<string, Company>();
    INITIAL_COMPANIES.forEach(c => compMap.set(c.id, c));
    storedCompanies.forEach(c => compMap.set(c.id, c));
    const mergedCompanies = Array.from(compMap.values());

    const storedAuth = getStored<boolean>(`${STORAGE_PREFIX}auth`, false);

    setCurrentRoleState(storedRole);
    setCart(storedCart);
    setProducts(mergedProducts);
    setRequisitions(storedRequisitions);
    setPurchaseOrders(storedPOs);
    setRfqs(storedRfqs);
    setMatches(storedMatches);
    setCompanies(mergedCompanies);
    setIsAuthenticated(storedAuth);
    setIsLoaded(true);
  }, []);

  const setRole = (role: Role) => {
    setCurrentRoleState(role);
    saveStored(STORAGE_KEYS.CURRENT_ROLE, role);
    setIsAuthenticated(true);
    saveStored(`${STORAGE_PREFIX}auth`, true);
  };

  const login = (email: string, password?: string) => {
    const cleanEmail = email.trim().toLowerCase();
    const matchedUser = Object.values(DEMO_USERS).find(u => u.email.toLowerCase() === cleanEmail);
    if (!matchedUser) {
      return { success: false, message: 'Invalid enterprise email. Please select or enter one of the demo emails.' };
    }
    if (password && matchedUser.password && matchedUser.password !== password) {
      return { success: false, message: `Incorrect password for ${matchedUser.name}. (Correct: ${matchedUser.password})` };
    }
    setCurrentRoleState(matchedUser.role);
    saveStored(STORAGE_KEYS.CURRENT_ROLE, matchedUser.role);
    setIsAuthenticated(true);
    saveStored(`${STORAGE_PREFIX}auth`, true);
    return { success: true };
  };

  const logout = () => {
    setIsAuthenticated(false);
    saveStored(`${STORAGE_PREFIX}auth`, false);
  };

  const currentUser: User = DEMO_USERS[currentRole] || DEMO_USERS.SUPER_ADMIN;

  // Cart operations
  const addToCart = (product: Product, quantity: number = 1) => {
    const existingIndex = cart.findIndex(item => item.product.id === product.id);
    let newCart: CartItem[];

    const calculatePrice = (p: Product, qty: number) => {
      let price = p.contractPrice || p.basePrice;
      if (p.tiers && p.tiers.length > 0) {
        const sortedTiers = [...p.tiers].sort((a, b) => b.minQty - a.minQty);
        const matchedTier = sortedTiers.find(t => qty >= t.minQty);
        if (matchedTier) price = matchedTier.price;
      }
      return price;
    };

    if (existingIndex >= 0) {
      const newQty = cart[existingIndex].quantity + quantity;
      newCart = cart.map((item, idx) => 
        idx === existingIndex 
          ? { ...item, quantity: newQty, effectiveUnitPrice: calculatePrice(item.product, newQty) }
          : item
      );
    } else {
      const initQty = Math.max(quantity, product.moq || 1);
      newCart = [...cart, {
        product,
        quantity: initQty,
        effectiveUnitPrice: calculatePrice(product, initQty)
      }];
    }

    setCart(newCart);
    saveStored(STORAGE_KEYS.CART, newCart);
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    const newCart = cart.map(item => {
      if (item.product.id === productId) {
        let price = item.product.contractPrice || item.product.basePrice;
        if (item.product.tiers && item.product.tiers.length > 0) {
          const sorted = [...item.product.tiers].sort((a, b) => b.minQty - a.minQty);
          const matched = sorted.find(t => quantity >= t.minQty);
          if (matched) price = matched.price;
        }
        return { ...item, quantity, effectiveUnitPrice: price };
      }
      return item;
    });
    setCart(newCart);
    saveStored(STORAGE_KEYS.CART, newCart);
  };

  const removeFromCart = (productId: string) => {
    const newCart = cart.filter(item => item.product.id !== productId);
    setCart(newCart);
    saveStored(STORAGE_KEYS.CART, newCart);
  };

  const clearCart = () => {
    setCart([]);
    saveStored(STORAGE_KEYS.CART, []);
  };

  // Requisition to PO logic
  const createRequisitionFromCart = (department: string = 'Plant Operations & MRO') => {
    if (cart.length === 0) return null;

    let subtotal = 0;
    let totalTax = 0;

    const items = cart.map(item => {
      const itemSubtotal = item.effectiveUnitPrice * item.quantity;
      const taxRate = item.product.gstRate || 18;
      const itemTax = Math.round((itemSubtotal * taxRate) / 100);
      subtotal += itemSubtotal;
      totalTax += itemTax;

      return {
        productId: item.product.id,
        productName: item.product.name,
        sku: item.product.sku,
        unit: item.product.unit,
        quantity: item.quantity,
        unitPrice: item.effectiveUnitPrice,
        hsnCode: item.product.hsnCode,
        gstRate: taxRate,
        taxAmount: itemTax,
        totalAmount: itemSubtotal + itemTax
      };
    });

    const totalAmount = subtotal + totalTax;
    const approvalThreshold = 15000;
    const isAutoApproved = totalAmount < approvalThreshold;
    const prNumber = `PR-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const newPR: Requisition = {
      id: `pr-${Date.now()}`,
      prNumber,
      buyerId: currentUser.id,
      buyerName: currentUser.name,
      companyId: currentUser.companyId || 'comp-ent-01',
      companyName: currentUser.companyName || 'Tata Advanced Systems Ltd',
      department,
      subtotal,
      totalTax,
      totalAmount,
      status: isAutoApproved ? 'PO_GENERATED' : 'PENDING_APPROVAL',
      approvalThreshold,
      items,
      createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
      approvedBy: isAutoApproved ? 'Auto-Approved (Threshold < ₹15,000)' : undefined,
      approvedAt: isAutoApproved ? new Date().toISOString().replace('T', ' ').slice(0, 16) : undefined
    };

    let updatedPOs = [...purchaseOrders];

    // Auto-generate PO if below threshold
    if (isAutoApproved) {
      const poNumber = `PO-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
      newPR.poNumber = poNumber;

      const newPO: PurchaseOrder = {
        id: `po-${Date.now()}`,
        poNumber,
        prId: newPR.id,
        companyId: newPR.companyId,
        companyName: newPR.companyName,
        buyerName: newPR.buyerName,
        buyerGstin: '27AABCT2345M1ZV',
        vendorId: cart[0]?.product.vendorId || 'comp-ven-01',
        vendorName: cart[0]?.product.vendorName || 'Industrial Supply Hub LLP',
        vendorGstin: '27AABFI9876P1ZR',
        items,
        subtotal,
        cgst: Math.round(totalTax / 2),
        sgst: Math.round(totalTax / 2),
        igst: 0,
        totalAmount,
        status: 'ISSUED',
        deliveryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
        issuedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
        shippingAddress: 'Plant Gate 2, MIDC Industrial Area, Pune 411018'
      };

      updatedPOs = [newPO, ...updatedPOs];
      setPurchaseOrders(updatedPOs);
      saveStored(STORAGE_KEYS.PURCHASE_ORDERS, updatedPOs);
    }

    const updatedPRs = [newPR, ...requisitions];
    setRequisitions(updatedPRs);
    saveStored(STORAGE_KEYS.REQUISITIONS, updatedPRs);

    clearCart();
    return newPR;
  };

  // Approver action
  const approveRequisition = (prId: string) => {
    const prIndex = requisitions.findIndex(p => p.id === prId);
    if (prIndex < 0) return;

    const pr = requisitions[prIndex];
    const poNumber = `PO-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const updatedPR: Requisition = {
      ...pr,
      status: 'PO_GENERATED',
      poNumber,
      approvedBy: `${currentUser.name} (${currentUser.role})`,
      approvedAt: new Date().toISOString().replace('T', ' ').slice(0, 16)
    };

    const newPO: PurchaseOrder = {
      id: `po-${Date.now()}`,
      poNumber,
      prId: pr.id,
      companyId: pr.companyId,
      companyName: pr.companyName,
      buyerName: pr.buyerName,
      buyerGstin: '27AABCT2345M1ZV',
      vendorId: 'comp-ven-01',
      vendorName: 'Industrial Supply Hub LLP',
      vendorGstin: '27AABFI9876P1ZR',
      items: pr.items,
      subtotal: pr.subtotal,
      cgst: Math.round(pr.totalTax / 2),
      sgst: Math.round(pr.totalTax / 2),
      igst: 0,
      totalAmount: pr.totalAmount,
      status: 'ISSUED',
      deliveryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
      issuedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
      shippingAddress: 'Plant Gate 2, MIDC Industrial Area, Pune 411018'
    };

    const updatedPRs = [...requisitions];
    updatedPRs[prIndex] = updatedPR;
    setRequisitions(updatedPRs);
    saveStored(STORAGE_KEYS.REQUISITIONS, updatedPRs);

    const updatedPOs = [newPO, ...purchaseOrders];
    setPurchaseOrders(updatedPOs);
    saveStored(STORAGE_KEYS.PURCHASE_ORDERS, updatedPOs);
  };

  const rejectRequisition = (prId: string, reason: string) => {
    const updated = requisitions.map(pr => 
      pr.id === prId 
        ? { ...pr, status: 'REJECTED' as const, rejectionReason: reason } 
        : pr
    );
    setRequisitions(updated);
    saveStored(STORAGE_KEYS.REQUISITIONS, updated);
  };

  // Vendor Action: Update PO Status & Dispatch
  const updatePOStatus = (poId: string, status: PurchaseOrder['status'], trackingNumber?: string, carrierName?: string) => {
    const updated = purchaseOrders.map(po => {
      if (po.id === poId) {
        return {
          ...po,
          status,
          trackingNumber: trackingNumber || po.trackingNumber,
          carrierName: carrierName || po.carrierName
        };
      }
      return po;
    });
    setPurchaseOrders(updated);
    saveStored(STORAGE_KEYS.PURCHASE_ORDERS, updated);
  };

  // RFQ Creation & Award
  const createRFQ = (rfqData: Omit<RFQ, 'id' | 'rfqNumber' | 'createdAt' | 'status' | 'quotes'>) => {
    const rfqNumber = `RFQ-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const newRfq: RFQ = {
      ...rfqData,
      id: `rfq-${Date.now()}`,
      rfqNumber,
      createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
      status: 'OPEN',
      quotes: []
    };
    const updated = [newRfq, ...rfqs];
    setRfqs(updated);
    saveStored(STORAGE_KEYS.RFQS, updated);
    return newRfq;
  };

  const awardRFQQuote = (rfqId: string, quoteId: string) => {
    const rfq = rfqs.find(r => r.id === rfqId);
    if (!rfq) return;

    const quote = rfq.quotes.find(q => q.id === quoteId);
    if (!quote) return;

    const updatedRfqs = rfqs.map(r => {
      if (r.id === rfqId) {
        return {
          ...r,
          status: 'AWARDED' as const,
          winningQuoteId: quoteId,
          quotes: r.quotes.map(q => ({
            ...q,
            status: q.id === quoteId ? ('ACCEPTED' as const) : ('REJECTED' as const)
          }))
        };
      }
      return r;
    });
    setRfqs(updatedRfqs);
    saveStored(STORAGE_KEYS.RFQS, updatedRfqs);

    // Auto-generate formal PO from winning quote
    const poNumber = `PO-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const subtotal = quote.unitPrice * rfq.quantity;
    const taxAmount = Math.round((subtotal * quote.taxRate) / 100);

    const newPO: PurchaseOrder = {
      id: `po-${Date.now()}`,
      poNumber,
      prId: rfq.rfqNumber,
      companyId: 'comp-ent-01',
      companyName: rfq.companyName,
      buyerName: currentUser.name,
      buyerGstin: '27AABCT2345M1ZV',
      vendorId: quote.vendorId,
      vendorName: quote.vendorName,
      vendorGstin: '27AABFI9876P1ZR',
      items: [
        {
          productId: 'custom-rfq-item',
          productName: rfq.title,
          sku: rfq.rfqNumber,
          unit: rfq.unit,
          quantity: rfq.quantity,
          unitPrice: quote.unitPrice,
          hsnCode: '850440',
          gstRate: quote.taxRate,
          taxAmount,
          totalAmount: quote.totalPrice
        }
      ],
      subtotal,
      cgst: Math.round(taxAmount / 2),
      sgst: Math.round(taxAmount / 2),
      igst: 0,
      totalAmount: quote.totalPrice,
      status: 'ISSUED',
      deliveryDate: new Date(Date.now() + (quote.leadTimeDays || 14) * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
      issuedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
      shippingAddress: 'Plant Gate 2, MIDC Industrial Area, Pune 411018'
    };

    const updatedPOs = [newPO, ...purchaseOrders];
    setPurchaseOrders(updatedPOs);
    saveStored(STORAGE_KEYS.PURCHASE_ORDERS, updatedPOs);
  };

  // Add new Product (Admin/Vendor)
  const addProduct = (product: Omit<Product, 'id'>) => {
    const newProduct: Product = {
      ...product,
      id: `prod-${Date.now()}`
    };
    const updated = [newProduct, ...products];
    setProducts(updated);
    saveStored(STORAGE_KEYS.PRODUCTS, updated);
  };

  // Bulk add products (e.g. from CSV uploader)
  const bulkAddProducts = (newProducts: Omit<Product, 'id'>[]) => {
    const created: Product[] = newProducts.map((p, idx) => ({
      ...p,
      id: `prod-${Date.now()}-${idx}`
    }));
    const updated = [...created, ...products];
    setProducts(updated);
    saveStored(STORAGE_KEYS.PRODUCTS, updated);
  };

  // Adjust Stock for warehouse / inventory
  const adjustProductStock = (productId: string, newStock: number) => {
    const updated = products.map(p => 
      p.id === productId ? { ...p, stock: Math.max(0, newStock) } : p
    );
    setProducts(updated);
    saveStored(STORAGE_KEYS.PRODUCTS, updated);
  };

  // Clear 3-Way Match payment settlement
  const clearMatchSettlement = (poNumber: string) => {
    const updated = matches.map(m => 
      m.poNumber === poNumber ? { ...m, paymentSettlementStatus: 'CLEARED' as const } : m
    );
    setMatches(updated);
    saveStored(STORAGE_KEYS.MATCHES, updated);
  };

  // Add Company (Vendor or Enterprise)
  const addCompany = (company: Omit<Company, 'id'>) => {
    const newCompany: Company = {
      ...company,
      id: `comp-${company.type === 'VENDOR' ? 'ven' : 'ent'}-${Date.now()}`
    };
    const updated = [newCompany, ...companies];
    setCompanies(updated);
    saveStored(STORAGE_KEYS.COMPANIES, updated);
  };

  // Toggle company KYC status (Super Admin control)
  const toggleCompanyStatus = (companyId: string) => {
    const updated = companies.map(c => {
      if (c.id === companyId) {
        const nextStatus = c.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
        return { ...c, status: nextStatus as Company['status'] };
      }
      return c;
    });
    setCompanies(updated);
    saveStored(STORAGE_KEYS.COMPANIES, updated);
  };

  // Reset database to initial demo state
  const resetDemoData = () => {
    localStorage.clear();
    setCurrentRoleState('BUYER');
    setIsAuthenticated(false);
    setCart([]);
    setProducts(INITIAL_PRODUCTS);
    setRequisitions(INITIAL_REQUISITIONS);
    setPurchaseOrders(INITIAL_PURCHASE_ORDERS);
    setRfqs(INITIAL_RFQS);
    setMatches(INITIAL_MATCHES);
    setCompanies(INITIAL_COMPANIES);
  };

  return (
    <ReliableContext.Provider
      value={{
        isLoaded,
        currentRole,
        currentUser,
        setRole,
        cart,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        products,
        addProduct,
        bulkAddProducts,
        adjustProductStock,
        requisitions,
        createRequisitionFromCart,
        approveRequisition,
        rejectRequisition,
        purchaseOrders,
        updatePOStatus,
        rfqs,
        createRFQ,
        awardRFQQuote,
        matches,
        clearMatchSettlement,
        companies,
        addCompany,
        toggleCompanyStatus,
        resetDemoData,
        isAuthenticated,
        login,
        logout
      }}
    >
      {children}
    </ReliableContext.Provider>
  );
}

export function useReliableStore() {
  const context = useContext(ReliableContext);
  if (!context) {
    throw new Error('useReliableStore must be used within a ReliableProvider');
  }
  return context;
}
