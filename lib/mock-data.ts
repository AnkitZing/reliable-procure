import { User, Company, Product, Requisition, PurchaseOrder, RFQ, ThreeWayMatch } from './types';

export const DEMO_USERS: Record<string, User> = {
  SUPER_ADMIN: {
    id: 'usr-admin-01',
    name: 'Rajesh Sharma',
    email: 'admin@reliableprocure.com',
    password: 'Admin@123',
    role: 'SUPER_ADMIN',
    companyName: 'Reliable Platform HQ',
    department: 'Central Operations'
  },
  BUYER: {
    id: 'usr-buyer-01',
    name: 'Ankit Jain',
    email: 'ankit.jain@tataadvanced.com',
    password: 'Buyer@123',
    role: 'BUYER',
    companyId: 'comp-ent-01',
    companyName: 'Tata Advanced Systems Ltd',
    department: 'Plant Operations & MRO'
  },
  APPROVER: {
    id: 'usr-approver-01',
    name: 'Vikramaditya Rao',
    email: 'v.rao@tataadvanced.com',
    password: 'Approver@123',
    role: 'APPROVER',
    companyId: 'comp-ent-01',
    companyName: 'Tata Advanced Systems Ltd',
    department: 'Finance & Procurement Head'
  },
  VENDOR: {
    id: 'usr-vendor-01',
    name: 'Industrial Supply Hub',
    email: 'sales@industrialsupplyhub.in',
    password: 'Vendor@123',
    role: 'VENDOR',
    companyId: 'comp-ven-01',
    companyName: 'Industrial Supply Hub LLP',
    department: 'Order Fulfillment'
  }
};

export const INITIAL_COMPANIES: Company[] = [
  {
    id: 'comp-ent-01',
    name: 'Tata Advanced Systems Ltd',
    gstin: '27AABCT2345M1ZV',
    pan: 'AABCT2345M',
    type: 'ENTERPRISE',
    creditLimit: 5000000,
    creditUsed: 1420000,
    paymentTerms: 'Net 45',
    status: 'ACTIVE',
    billingAddress: 'Plot 45, MIDC Industrial Area, Pune, Maharashtra 411018',
    state: 'Maharashtra'
  },
  {
    id: 'comp-ent-02',
    name: 'Larsen & Toubro Infra',
    gstin: '24AABCL1234N1ZT',
    pan: 'AABCL1234N',
    type: 'ENTERPRISE',
    creditLimit: 10000000,
    creditUsed: 3850000,
    paymentTerms: 'Net 60',
    status: 'ACTIVE',
    billingAddress: 'L&T Knowledge City, Vadodara, Gujarat 390019',
    state: 'Gujarat'
  },
  {
    id: 'comp-ven-01',
    name: 'Industrial Supply Hub LLP',
    gstin: '27AABFI9876P1ZR',
    pan: 'AABFI9876P',
    type: 'VENDOR',
    creditLimit: 0,
    creditUsed: 0,
    paymentTerms: 'Immediate',
    status: 'ACTIVE',
    billingAddress: 'Gala 12, Logistics Park, Bhiwandi, Maharashtra 421302',
    state: 'Maharashtra'
  },
  {
    id: 'comp-ven-02',
    name: 'Karam Safety Solutions',
    gstin: '07AAACK4321D1ZN',
    pan: 'AAACK4321D',
    type: 'VENDOR',
    creditLimit: 0,
    creditUsed: 0,
    paymentTerms: 'Net 30',
    status: 'ACTIVE',
    billingAddress: 'Okhla Industrial Estate, Phase III, New Delhi 110020',
    state: 'Delhi'
  }
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-001',
    name: 'Karam Industrial Safety Helmet (ISI Certified)',
    sku: 'SAF-HLM-001',
    category: 'Safety & PPE',
    description: 'High density polymer safety helmet with 4-point suspension harness and chin strap. Conforms to IS 2925 standard.',
    brand: 'Karam',
    basePrice: 280,
    contractPrice: 245,
    hsnCode: '650610',
    gstRate: 18,
    unit: 'Pieces',
    moq: 10,
    stock: 1450,
    image: 'https://images.unsplash.com/photo-1578873375972-00b86a87747e?auto=format&fit=crop&w=600&q=80',
    tiers: [
      { minQty: 10, price: 245 },
      { minQty: 50, price: 220 },
      { minQty: 200, price: 195 }
    ],
    vendorId: 'comp-ven-02',
    vendorName: 'Karam Safety Solutions'
  },
  {
    id: 'prod-002',
    name: 'Bosch GSB 500W Professional Impact Drill Kit',
    sku: 'MRO-DRL-002',
    category: 'Industrial Tools & MRO',
    description: 'Heavy duty 500W corded reversible impact drill with 100-accessory maintenance toolbox kit.',
    brand: 'Bosch',
    basePrice: 3850,
    contractPrice: 3450,
    hsnCode: '846721',
    gstRate: 18,
    unit: 'Sets',
    moq: 2,
    stock: 180,
    image: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=600&q=80',
    tiers: [
      { minQty: 2, price: 3450 },
      { minQty: 10, price: 3200 },
      { minQty: 25, price: 2990 }
    ],
    vendorId: 'comp-ven-01',
    vendorName: 'Industrial Supply Hub LLP'
  },
  {
    id: 'prod-003',
    name: 'Allen Cooper Steel-Toe Antistatic Industrial Safety Shoes',
    sku: 'SAF-SHO-003',
    category: 'Safety & PPE',
    description: 'Genuine leather work safety boots with 200J impact resistant steel toe cap and oil-resistant PU double density sole.',
    brand: 'Allen Cooper',
    basePrice: 1650,
    contractPrice: 1390,
    hsnCode: '640340',
    gstRate: 18,
    unit: 'Pairs',
    moq: 5,
    stock: 620,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80',
    tiers: [
      { minQty: 5, price: 1390 },
      { minQty: 25, price: 1280 },
      { minQty: 100, price: 1150 }
    ],
    vendorId: 'comp-ven-02',
    vendorName: 'Karam Safety Solutions'
  },
  {
    id: 'prod-004',
    name: 'Schneider Electric Acti9 32A Triple Pole MCB (C-Curve)',
    sku: 'ELE-MCB-004',
    category: 'Electrical & Electronics',
    description: '10kA breaking capacity miniature circuit breaker designed for heavy industrial control panels.',
    brand: 'Schneider',
    basePrice: 1420,
    contractPrice: 1210,
    hsnCode: '853620',
    gstRate: 18,
    unit: 'Pieces',
    moq: 6,
    stock: 450,
    image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80',
    tiers: [
      { minQty: 6, price: 1210 },
      { minQty: 24, price: 1120 },
      { minQty: 60, price: 1020 }
    ],
    vendorId: 'comp-ven-01',
    vendorName: 'Industrial Supply Hub LLP'
  },
  {
    id: 'prod-005',
    name: 'Makita 840W 100mm Heavy Duty Angle Grinder (9556HNG)',
    sku: 'MRO-GRN-005',
    category: 'Industrial Tools & MRO',
    description: 'High heat-resistance motor with labyrinth construction to seal and protect motor and bearings from dust and debris.',
    brand: 'Makita',
    basePrice: 3200,
    contractPrice: 2850,
    hsnCode: '846729',
    gstRate: 18,
    unit: 'Pieces',
    moq: 2,
    stock: 140,
    image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80',
    tiers: [
      { minQty: 2, price: 2850 },
      { minQty: 8, price: 2680 },
      { minQty: 20, price: 2490 }
    ],
    vendorId: 'comp-ven-01',
    vendorName: 'Industrial Supply Hub LLP'
  },
  {
    id: 'prod-006',
    name: 'Fluke 101 Pocket Digital Multimeter (CAT III 600V)',
    sku: 'ELE-MUL-006',
    category: 'Electrical & Electronics',
    description: 'Basic DC accuracy 0.5%, CAT III 600V safety rated, rugged design for facility electrical troubleshooting.',
    brand: 'Fluke',
    basePrice: 3450,
    contractPrice: 2990,
    hsnCode: '903031',
    gstRate: 18,
    unit: 'Units',
    moq: 1,
    stock: 95,
    image: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=600&q=80',
    tiers: [
      { minQty: 1, price: 2990 },
      { minQty: 5, price: 2850 },
      { minQty: 15, price: 2690 }
    ],
    vendorId: 'comp-ven-01',
    vendorName: 'Industrial Supply Hub LLP'
  },
  {
    id: 'prod-007',
    name: 'Kimberly-Clark Professional WypAll X80 Reusable Heavy Wipes',
    sku: 'FAC-WIP-007',
    category: 'Facility & Cleaning',
    description: 'Hydroknit technology industrial absorbent wipes for grease, oil, and machine cleaning in manufacturing plants.',
    brand: 'Kimberly-Clark',
    basePrice: 2150,
    contractPrice: 1890,
    hsnCode: '481890',
    gstRate: 12,
    unit: 'Rolls',
    moq: 4,
    stock: 320,
    image: 'https://images.unsplash.com/photo-1583947215259-38e31be8751f?auto=format&fit=crop&w=600&q=80',
    tiers: [
      { minQty: 4, price: 1890 },
      { minQty: 16, price: 1750 },
      { minQty: 50, price: 1590 }
    ],
    vendorId: 'comp-ven-01',
    vendorName: 'Industrial Supply Hub LLP'
  },
  {
    id: 'prod-008',
    name: '3M 9010 N95 Anti-Pollution & Particulate Respirator (Box of 50)',
    sku: 'SAF-MSK-008',
    category: 'Safety & PPE',
    description: 'NIOSH approved N95 mask with electrostatically charged microfibers for industrial dust and particulate protection.',
    brand: '3M',
    basePrice: 1250,
    contractPrice: 1050,
    hsnCode: '630790',
    gstRate: 5,
    unit: 'Boxes',
    moq: 5,
    stock: 820,
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=600&q=80',
    tiers: [
      { minQty: 5, price: 1050 },
      { minQty: 20, price: 950 },
      { minQty: 100, price: 840 }
    ],
    vendorId: 'comp-ven-02',
    vendorName: 'Karam Safety Solutions'
  },
  {
    id: 'prod-009',
    name: 'WD-40 Multi-Use Industrial Maintenance Spray (420ml x Pack of 6)',
    sku: 'MRO-WD4-009',
    category: 'Industrial Tools & MRO',
    description: 'Displaces moisture, removes rust, penetrates stuck parts, lubricates machinery linkages and stops squeaks.',
    brand: 'WD-40',
    basePrice: 2280,
    contractPrice: 1950,
    hsnCode: '340319',
    gstRate: 18,
    unit: 'Packs',
    moq: 3,
    stock: 410,
    image: 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&w=600&q=80',
    tiers: [
      { minQty: 3, price: 1950 },
      { minQty: 12, price: 1820 },
      { minQty: 30, price: 1690 }
    ],
    vendorId: 'comp-ven-01',
    vendorName: 'Industrial Supply Hub LLP'
  },
  {
    id: 'prod-010',
    name: 'Logitech MK295 Silent Wireless Keyboard & Mouse Combo',
    sku: 'OFC-KBD-010',
    category: 'Office & IT Supplies',
    description: 'SilentTouch technology with 90% reduced clicking noise, spill-resistant design and 2.4GHz wireless dongle.',
    brand: 'Logitech',
    basePrice: 2295,
    contractPrice: 1980,
    hsnCode: '847160',
    gstRate: 18,
    unit: 'Sets',
    moq: 3,
    stock: 240,
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=600&q=80',
    tiers: [
      { minQty: 3, price: 1980 },
      { minQty: 15, price: 1840 },
      { minQty: 50, price: 1690 }
    ],
    vendorId: 'comp-ven-01',
    vendorName: 'Industrial Supply Hub LLP'
  },
  {
    id: 'prod-011',
    name: 'Stanley 110-Piece Mechanics Socket & Ratchet Tool Set',
    sku: 'MRO-STN-011',
    category: 'Industrial Tools & MRO',
    description: 'Chrome vanadium steel forged sockets with pear-head ratchets, extension bars, and heavy blow-mold carry case.',
    brand: 'Stanley',
    basePrice: 8900,
    contractPrice: 7650,
    hsnCode: '820420',
    gstRate: 18,
    unit: 'Sets',
    moq: 1,
    stock: 75,
    image: 'https://images.unsplash.com/photo-1530124566582-a618bc2615dc?auto=format&fit=crop&w=600&q=80',
    tiers: [
      { minQty: 1, price: 7650 },
      { minQty: 5, price: 7200 },
      { minQty: 15, price: 6800 }
    ],
    vendorId: 'comp-ven-01',
    vendorName: 'Industrial Supply Hub LLP'
  },
  {
    id: 'prod-012',
    name: 'Roots Multiclean Professional Wet & Dry Industrial Vacuum Cleaner',
    sku: 'FAC-VAC-012',
    category: 'Facility & Cleaning',
    description: '30L stainless steel tank with 1400W dual stage suction motor for metal chips, oil spills, and warehouse dust.',
    brand: 'Roots Multiclean',
    basePrice: 16800,
    contractPrice: 14500,
    hsnCode: '850811',
    gstRate: 18,
    unit: 'Units',
    moq: 1,
    stock: 45,
    image: 'https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?auto=format&fit=crop&w=600&q=80',
    tiers: [
      { minQty: 1, price: 14500 },
      { minQty: 3, price: 13800 },
      { minQty: 10, price: 12900 }
    ],
    vendorId: 'comp-ven-01',
    vendorName: 'Industrial Supply Hub LLP'
  },
  {
    id: 'prod-013',
    name: 'Havells 150W Die-Cast Aluminium LED High Bay Light Fixture',
    sku: 'LGT-HBY-013',
    category: 'Lighting',
    description: 'IP66 waterproof rated 150W UFO industrial LED high bay light, 150 lm/Watt luminous efficacy, 6500K cool white for warehouse and factory shed lighting.',
    brand: 'Havells',
    basePrice: 4800,
    contractPrice: 4150,
    hsnCode: '940540',
    gstRate: 18,
    unit: 'Units',
    moq: 4,
    stock: 260,
    image: 'https://images.unsplash.com/photo-1565814636199-ae8133055c1c?auto=format&fit=crop&w=600&q=80',
    tiers: [
      { minQty: 4, price: 4150 },
      { minQty: 16, price: 3850 },
      { minQty: 50, price: 3550 }
    ],
    vendorId: 'comp-ven-01',
    vendorName: 'Industrial Supply Hub LLP'
  },
  {
    id: 'prod-014',
    name: 'Polycab 4-Core 25 sq.mm Aluminium Armoured LT Cable (100m Drum)',
    sku: 'CBL-ARM-014',
    category: 'Cable and Cable Accessories',
    description: '1.1kV grade XLPE insulated galvanized steel flat strip armoured power cable suitable for underground laying and industrial plant machinery wiring.',
    brand: 'Polycab',
    basePrice: 28500,
    contractPrice: 24900,
    hsnCode: '854449',
    gstRate: 18,
    unit: 'Drums',
    moq: 1,
    stock: 35,
    image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80',
    tiers: [
      { minQty: 1, price: 24900 },
      { minQty: 3, price: 23600 },
      { minQty: 10, price: 22400 }
    ],
    vendorId: 'comp-ven-01',
    vendorName: 'Industrial Supply Hub LLP'
  },
  {
    id: 'prod-015',
    name: 'Berger Epilux 4 Industrial Epoxy High Gloss Floor Coating (20L Drum)',
    sku: 'PNT-EPX-015',
    category: 'Paint & Polish',
    description: 'Two-pack polyamide cured epoxy coating for concrete industrial floors, chemical spill zones, and pharmaceutical warehouse walkways.',
    brand: 'Berger Protective',
    basePrice: 9400,
    contractPrice: 8200,
    hsnCode: '320890',
    gstRate: 18,
    unit: 'Drums',
    moq: 2,
    stock: 90,
    image: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=600&q=80',
    tiers: [
      { minQty: 2, price: 8200 },
      { minQty: 6, price: 7650 },
      { minQty: 20, price: 7100 }
    ],
    vendorId: 'comp-ven-01',
    vendorName: 'Industrial Supply Hub LLP'
  },
  {
    id: 'prod-016',
    name: 'Unbrako Grade 10.9 High Tensile Hex Bolts & Nuts M16 x 75mm (Box of 50)',
    sku: 'HDW-BLT-016',
    category: 'Hardware',
    description: 'Alloy steel quenched and tempered high tensile socket head and hex bolts for heavy machine foundation and structural steel clamping.',
    brand: 'Unbrako',
    basePrice: 3250,
    contractPrice: 2800,
    hsnCode: '731815',
    gstRate: 18,
    unit: 'Boxes',
    moq: 3,
    stock: 310,
    image: 'https://images.unsplash.com/photo-1586864387967-d02ef85d93e8?auto=format&fit=crop&w=600&q=80',
    tiers: [
      { minQty: 3, price: 2800 },
      { minQty: 10, price: 2550 },
      { minQty: 30, price: 2350 }
    ],
    vendorId: 'comp-ven-01',
    vendorName: 'Industrial Supply Hub LLP'
  },
  {
    id: 'prod-017',
    name: 'Loctite 243 Medium Strength Threadlocker & Sealant (50ml Bottle)',
    sku: 'ADH-LOC-017',
    category: 'Adhesive, Sealants, Tapes',
    description: 'Prevents loosening on vibrating assemblies such as pumps, gearboxes, and presses. Effective on all metals including passive substrates.',
    brand: 'Loctite Henkel',
    basePrice: 980,
    contractPrice: 820,
    hsnCode: '350691',
    gstRate: 18,
    unit: 'Bottles',
    moq: 5,
    stock: 480,
    image: 'https://images.unsplash.com/photo-1617791160536-598cf32026fb?auto=format&fit=crop&w=600&q=80',
    tiers: [
      { minQty: 5, price: 820 },
      { minQty: 20, price: 740 },
      { minQty: 50, price: 680 }
    ],
    vendorId: 'comp-ven-01',
    vendorName: 'Industrial Supply Hub LLP'
  },
  {
    id: 'prod-018',
    name: 'Brady OSHA Danger 415V High Voltage Shock Danger Board (12x18 Inch)',
    sku: 'SGN-VLT-018',
    category: 'Signages & Labels',
    description: 'UV-resistant rigid retro-reflective aluminium composite panel sign board with bilingual (English/Hindi) safety warning symbols.',
    brand: 'Brady',
    basePrice: 650,
    contractPrice: 520,
    hsnCode: '831000',
    gstRate: 18,
    unit: 'Pieces',
    moq: 5,
    stock: 350,
    image: 'https://images.unsplash.com/photo-1590402494682-cd3fb53b1f70?auto=format&fit=crop&w=600&q=80',
    tiers: [
      { minQty: 5, price: 520 },
      { minQty: 25, price: 460 },
      { minQty: 100, price: 395 }
    ],
    vendorId: 'comp-ven-02',
    vendorName: 'Karam Safety Solutions'
  }
];


export const INITIAL_REQUISITIONS: Requisition[] = [
  {
    id: 'pr-001',
    prNumber: 'PR-2026-0189',
    buyerId: 'usr-buyer-01',
    buyerName: 'Ankit Jain',
    companyId: 'comp-ent-01',
    companyName: 'Tata Advanced Systems Ltd',
    department: 'Plant Operations & MRO',
    subtotal: 58800,
    totalTax: 10584,
    totalAmount: 69384,
    status: 'PENDING_APPROVAL',
    approvalThreshold: 15000,
    createdAt: '2026-09-12 11:30',
    items: [
      {
        productId: 'prod-001',
        productName: 'Karam Industrial Safety Helmet (ISI Certified)',
        sku: 'SAF-HLM-001',
        unit: 'Pieces',
        quantity: 120,
        unitPrice: 195,
        hsnCode: '650610',
        gstRate: 18,
        taxAmount: 4212,
        totalAmount: 27612
      },
      {
        productId: 'prod-002',
        productName: 'Bosch GSB 500W Professional Impact Drill Kit',
        sku: 'MRO-DRL-002',
        unit: 'Sets',
        quantity: 10,
        unitPrice: 3200,
        hsnCode: '846721',
        gstRate: 18,
        taxAmount: 5760,
        totalAmount: 37760
      }
    ]
  },
  {
    id: 'pr-002',
    prNumber: 'PR-2026-0174',
    buyerId: 'usr-buyer-01',
    buyerName: 'Ankit Jain',
    companyId: 'comp-ent-01',
    companyName: 'Tata Advanced Systems Ltd',
    department: 'Health & Safety (EHS)',
    subtotal: 10500,
    totalTax: 525,
    totalAmount: 11025,
    status: 'PO_GENERATED',
    poNumber: 'PO-2026-0941',
    approvalThreshold: 15000,
    approvedBy: 'Auto-Approved (Threshold < ₹15,000)',
    approvedAt: '2026-09-10 14:15',
    createdAt: '2026-09-10 14:15',
    items: [
      {
        productId: 'prod-008',
        productName: '3M 9010 N95 Anti-Pollution & Particulate Respirator (Box of 50)',
        sku: 'SAF-MSK-008',
        unit: 'Boxes',
        quantity: 10,
        unitPrice: 1050,
        hsnCode: '630790',
        gstRate: 5,
        taxAmount: 525,
        totalAmount: 11025
      }
    ]
  }
];

export const INITIAL_PURCHASE_ORDERS: PurchaseOrder[] = [
  {
    id: 'po-001',
    poNumber: 'PO-2026-0941',
    prId: 'pr-002',
    companyId: 'comp-ent-01',
    companyName: 'Tata Advanced Systems Ltd',
    buyerName: 'Ankit Jain',
    buyerGstin: '27AABCT2345M1ZV',
    vendorId: 'comp-ven-02',
    vendorName: 'Karam Safety Solutions',
    vendorGstin: '07AAACK4321D1ZN',
    items: [
      {
        productId: 'prod-008',
        productName: '3M 9010 N95 Anti-Pollution & Particulate Respirator (Box of 50)',
        sku: 'SAF-MSK-008',
        unit: 'Boxes',
        quantity: 10,
        unitPrice: 1050,
        hsnCode: '630790',
        gstRate: 5,
        taxAmount: 525,
        totalAmount: 11025
      }
    ],
    subtotal: 10500,
    cgst: 0,
    sgst: 0,
    igst: 525, // Inter-state Delhi to Maharashtra
    totalAmount: 11025,
    status: 'IN_TRANSIT',
    deliveryDate: '2026-09-18',
    issuedAt: '2026-09-10 14:20',
    shippingAddress: 'Plant Gate 2, MIDC Industrial Area, Pune 411018',
    trackingNumber: 'BLUEDART-8829104',
    carrierName: 'BlueDart Express Logistics'
  },
  {
    id: 'po-002',
    poNumber: 'PO-2026-0895',
    prId: 'pr-000',
    companyId: 'comp-ent-01',
    companyName: 'Tata Advanced Systems Ltd',
    buyerName: 'Ankit Jain',
    buyerGstin: '27AABCT2345M1ZV',
    vendorId: 'comp-ven-01',
    vendorName: 'Industrial Supply Hub LLP',
    vendorGstin: '27AABFI9876P1ZR',
    items: [
      {
        productId: 'prod-004',
        productName: 'Schneider Electric Acti9 32A Triple Pole MCB (C-Curve)',
        sku: 'ELE-MCB-004',
        unit: 'Pieces',
        quantity: 35,
        unitPrice: 1200,
        hsnCode: '853620',
        gstRate: 18,
        taxAmount: 7560,
        totalAmount: 49560
      }
    ],
    subtotal: 42000,
    cgst: 3780,
    sgst: 3780,
    igst: 0,
    totalAmount: 49560,
    status: 'DELIVERED',
    deliveryDate: '2026-09-08',
    issuedAt: '2026-09-04 10:00',
    shippingAddress: 'Plant Gate 2, MIDC Industrial Area, Pune 411018',
    trackingNumber: 'DELHIVERY-992144',
    carrierName: 'Delhivery Surface'
  }
];

export const INITIAL_RFQS: RFQ[] = [
  {
    id: 'rfq-101',
    rfqNumber: 'RFQ-2026-0043',
    title: '500kVA Industrial Servo Voltage Stabilizer with Isolation Transformer',
    category: 'Electrical & Electronics',
    description: 'Heavy duty copper-wound oil-cooled industrial stabilizer required for aerospace CNC machine floor. Input 320V-460V, Output 400V +/- 1%.',
    quantity: 2,
    unit: 'Units',
    targetDate: '2026-09-30',
    companyName: 'Tata Advanced Systems Ltd',
    department: 'Heavy Machinery & Production',
    status: 'QUOTES_RECEIVED',
    createdAt: '2026-09-08 16:40',
    quotes: [
      {
        id: 'qt-01',
        vendorId: 'comp-ven-01',
        vendorName: 'Industrial Supply Hub LLP',
        unitPrice: 425000,
        taxRate: 18,
        totalPrice: 1003000,
        leadTimeDays: 14,
        validUntil: '2026-09-28',
        status: 'SUBMITTED',
        notes: 'Includes 1-year onsite warranty and test certificate.'
      },
      {
        id: 'qt-02',
        vendorId: 'comp-ven-custom',
        vendorName: 'Consul Neowatt Power Systems',
        unitPrice: 410000,
        taxRate: 18,
        totalPrice: 967600,
        leadTimeDays: 21,
        validUntil: '2026-09-25',
        status: 'SUBMITTED',
        notes: 'Includes copper winding warranty and digital bypass switch.'
      }
    ]
  }
];

export const INITIAL_MATCHES: ThreeWayMatch[] = [
  {
    poNumber: 'PO-2026-0895',
    vendorName: 'Industrial Supply Hub LLP',
    poAmount: 49560,
    grnStatus: 'FULLY_RECEIVED',
    invoiceAmount: 49560,
    matchStatus: 'MATCHED',
    varianceAmount: 0,
    paymentSettlementStatus: 'CLEARED'
  },
  {
    poNumber: 'PO-2026-0811',
    vendorName: 'Apex Tools & Spares',
    poAmount: 85200,
    grnStatus: 'PARTIALLY_RECEIVED',
    invoiceAmount: 85200,
    matchStatus: 'VARIANCE_FLAGGED',
    varianceAmount: 14200,
    paymentSettlementStatus: 'ON_HOLD'
  }
];
