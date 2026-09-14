export interface Subcategory {
  id: string;
  name: string;
  items: string[];
}

export interface Category {
  id: string;
  slug: string;
  name: string;
  iconName: string;
  description: string;
  productCount: number;
  featuredBrands: string[];
  subcategories: Subcategory[];
}

export const RACKNSELL_CATEGORIES: Category[] = [
  {
    id: 'cat-01',
    slug: 'cleaning-supplies',
    name: 'Cleaning Supplies',
    iconName: 'Sparkles',
    description: 'Industrial floor cleaners, degreasers, trash bins, mops, wipers & automated dispenser systems.',
    productCount: 148,
    featuredBrands: ['Kimberly-Clark', 'Roots Multiclean', 'Taski Diversey', 'Lysol Pro', 'Scotch-Brite'],
    subcategories: [
      {
        id: 'sub-01-1',
        name: 'Floor Cleaners & Disinfectants',
        items: ['Heavy Duty Industrial Degreasers', 'Disinfectant Floor Concentrates', 'Toilet & Washroom Cleaners', 'Glass Cleaners']
      },
      {
        id: 'sub-01-2',
        name: 'Waste Management & Bins',
        items: ['Heavy Plastic Trash Cans (60L, 120L, 240L)', 'Biohazard Trash Bags', 'Foot Pedal Dustbins', 'Stainless Steel Bins']
      },
      {
        id: 'sub-01-3',
        name: 'Mops, Wipers & Squeegees',
        items: ['Industrial Wet Mops & Cotton Refills', 'Floor Squeegees (45cm, 60cm)', 'Microfiber Floor Cleaning Cloths', 'Extendable Telescopic Poles']
      },
      {
        id: 'sub-01-4',
        name: 'Tissues & Dispenser Systems',
        items: ['Jumbo Roll Tissue Dispensers', 'C-Fold Hand Towels', 'Touchless Auto Hand Sanitizer Dispensers', 'Liquid Soap Wall Mounts']
      }
    ]
  },
  {
    id: 'cat-02',
    slug: 'office-supplies',
    name: 'Office Supplies',
    iconName: 'FileText',
    description: 'Copier paper, writing instruments, lever arch filing systems, desk accessories and toners.',
    productCount: 312,
    featuredBrands: ['JK Copier', 'Bilt Matrix', 'Kangaro', 'Reynolds', 'Logitech', 'HP'],
    subcategories: [
      {
        id: 'sub-02-1',
        name: 'Paper Products & Pads',
        items: ['A4 Copier Paper 75 GSM', 'A4 Copier Paper 80 GSM', 'A3 Plotter & Copier Paper', 'Spiral Executive Notepads', 'Sticky Notes']
      },
      {
        id: 'sub-02-2',
        name: 'Filing & Document Storage',
        items: ['Box Files & Lever Arch Files', 'Ring Binders & Display Files', 'Expandable Accordion Folders', 'Plastic Document Wallets']
      },
      {
        id: 'sub-02-3',
        name: 'Desk Organizers & Fasteners',
        items: ['Heavy Duty Staplers & Pins (Kangaro 24/6, 23/17)', 'Paper Punching Machines (2-hole, 4-hole)', 'Paper Clips & Binder Clips', 'Mesh Pen Stands & Trays']
      },
      {
        id: 'sub-02-4',
        name: 'Writing Instruments & Markers',
        items: ['Whiteboard Markers (Pack of 10)', 'Permanent Industrial Chisel Markers', 'Gel & Ballpoint Pens', 'Fluorescent Highlighters']
      }
    ]
  },
  {
    id: 'cat-03',
    slug: 'electrical-components',
    name: 'Electrical Components',
    iconName: 'Zap',
    description: 'Industrial switchgear, MCBs, MCCBs, contactors, overload relays, distribution boards & plugs.',
    productCount: 420,
    featuredBrands: ['Schneider Electric', 'L&T Switchgear', 'ABB', 'Siemens', 'Havells', 'Legrand'],
    subcategories: [
      {
        id: 'sub-03-1',
        name: 'Circuit Breakers & Protection',
        items: ['Single / Double / Triple Pole MCBs (6A - 63A)', 'Moulded Case Circuit Breakers (MCCB 100A - 630A)', 'Residual Current Circuit Breakers (RCCB)', 'Surge Protection Devices (SPD)']
      },
      {
        id: 'sub-03-2',
        name: 'Contactors & Starters',
        items: ['3-Pole Power Contactors (9A - 225A)', 'Thermal Overload Relays', 'Direct On-Line (DOL) Starters', 'Automatic Star-Delta Starters']
      },
      {
        id: 'sub-03-3',
        name: 'Industrial Plugs & Sockets',
        items: ['16A 3-Pin Industrial Plug & Socket', '32A 5-Pin IP67 Waterproof Sockets', '63A Surface Mount Interlocked Sockets', 'Distribution Junction Boxes']
      },
      {
        id: 'sub-03-4',
        name: 'Control Panels & Indicating Lights',
        items: ['22.5mm Push Buttons & Selector Switches', 'LED Panel Indicator Lamps (R, Y, B, G)', 'Emergency Stop Mushroom Pushbuttons', 'Rotary Cam Switches']
      }
    ]
  },
  {
    id: 'cat-04',
    slug: 'safety-equipment',
    name: 'Safety Equipment & Gear',
    iconName: 'Shield',
    description: 'ISI certified safety helmets, steel toe boots, high-vis vests, nitrile gloves, respirators & fall arrest harness.',
    productCount: 285,
    featuredBrands: ['Karam', '3M', 'Allen Cooper', 'Honeywell', 'Udyogi', 'Hillson'],
    subcategories: [
      {
        id: 'sub-04-1',
        name: 'Head & Face Protection',
        items: ['ISI Industrial Safety Helmets with Ratchet Harness', 'Industrial Face Shields & Visors', 'Welding Helmets with Auto-Darkening', 'Bump Caps']
      },
      {
        id: 'sub-04-2',
        name: 'Safety Footwear',
        items: ['Steel-Toe Antistatic Safety Shoes (S1P/S3)', 'Oil & Chemical Resistant Safety Boots', 'Gum Boots with Steel Midplate', 'Executive Safety Oxfords']
      },
      {
        id: 'sub-04-3',
        name: 'Respiratory & Hearing Protection',
        items: ['N95 Particulate Respirator Masks (Box of 50)', 'Half-Face Chemical Cartridge Gas Masks', 'Silicone Corded Ear Plugs (SNR 32dB)', 'Industrial Ear Muffs']
      },
      {
        id: 'sub-04-4',
        name: 'Fall Protection & Body Wear',
        items: ['Full Body Harness with Scaffolding Hooks', 'Shock Absorbing Webbing Lanyards', 'High-Visibility Neon Reflective Safety Vests (EN 471)', 'Boiler Suits & Coveralls']
      },
      {
        id: 'sub-04-5',
        name: 'Hand Protection',
        items: ['Cut-Resistant Level 5 Knitted Gloves', 'Heavy Duty Nitrile Chemical Resistant Gloves', 'Leather Welding Gauntlet Gloves', 'PU Coated Precision Handling Gloves']
      }
    ]
  },
  {
    id: 'cat-05',
    slug: 'power-tools',
    name: 'Power Tools',
    iconName: 'Wrench',
    description: 'Professional angle grinders, impact drills, cordless drivers, rotary hammers, circular saws & cutters.',
    productCount: 195,
    featuredBrands: ['Bosch Professional', 'Makita', 'Dewalt', 'Stanley', 'Hilti', 'Hikoki'],
    subcategories: [
      {
        id: 'sub-05-1',
        name: 'Drilling & Fastening Tools',
        items: ['13mm Impact Drills (500W - 850W)', '18V Cordless Brushless Drill Drivers', 'Heavy Duty Impact Wrenches (1/2" Drive)', 'Rotary Hammer Drills (SDS-Plus)']
      },
      {
        id: 'sub-05-2',
        name: 'Grinding & Polishing Tools',
        items: ['4-Inch (100mm) Angle Grinders (840W - 1100W)', '7-Inch Heavy Duty Metal Cutting Grinders', 'Variable Speed Rotary Die Grinders', 'Orbital Sanders & Polishers']
      },
      {
        id: 'sub-05-3',
        name: 'Cutting & Saws',
        items: ['14-Inch Metal Chop Saws (2200W)', 'Circular Saws (7-1/4" 1400W)', 'Jig Saws for Metal & Wood', 'Marble & Tile Cutters (110mm)']
      },
      {
        id: 'sub-05-4',
        name: 'Power Tool Accessories',
        items: ['SDS Plus Drill Bit Sets', 'Abrasive Cutting & Grinding Wheels', 'Diamond Concrete Cutting Blades', 'HSS Metal Twist Drill Bits (1-13mm)']
      }
    ]
  },
  {
    id: 'cat-06',
    slug: 'hand-tools',
    name: 'Hand Tools',
    iconName: 'Hammer',
    description: 'Spanners, socket sets, combination pliers, insulated screwdrivers, torque wrenches & maintenance tool kits.',
    productCount: 340,
    featuredBrands: ['Stanley', 'Taparia', 'Gedore', 'Venus', 'Groove-Lock', 'Falcon'],
    subcategories: [
      {
        id: 'sub-06-1',
        name: 'Spanners & Wrenches',
        items: ['Combination Ring & Open Ended Spanners (6-32mm)', 'Adjustable Pipe Wrenches (10", 12", 18")', 'Torque Wrenches with Calibration Certificate', 'Double Ended Ring Spanners']
      },
      {
        id: 'sub-06-2',
        name: 'Pliers & Cutters',
        items: ['Combination Insulated Pliers (8 Inch, 1000V)', 'Long Nose Pliers with Side Cutter', 'Heavy Duty Diagonal Wire Cutters', 'Circlip Pliers Set (Internal & External)']
      },
      {
        id: 'sub-06-3',
        name: 'Screwdrivers & Allen Keys',
        items: ['VDE Insulated Electrician Screwdriver Sets', 'Magnetic Tip Phillips & Slotted Drivers', 'Hex Allen Key Sets (Ball End 1.5-10mm)', 'Torx Star Key Sets']
      },
      {
        id: 'sub-06-4',
        name: 'Striking & Tool Storage',
        items: ['Ball Peen Hammers with Fiberglass Handle', 'Dead Blow Urethane Mallets', 'Machinist Toolboxes with Cantilever Trays', 'Heavy Duty Wheeled Tool Chests']
      }
    ]
  },
  {
    id: 'cat-07',
    slug: 'lighting',
    name: 'Lighting',
    iconName: 'Sun',
    description: 'Industrial LED high bays, flood lights, cleanroom panel troffers, emergency exit lights & flameproof fixtures.',
    productCount: 160,
    featuredBrands: ['Havells', 'Philips Industrial', 'Wipro Lighting', 'Bajaj Electricals', 'Crompton'],
    subcategories: [
      {
        id: 'sub-07-1',
        name: 'Industrial High Bay & Baylights',
        items: ['100W UFO LED High Bay Light (140 Lm/W)', '150W Die-Cast Aluminium High Bay Fixture', '200W Heavy Industrial Warehouse Baylight', 'Linear High Bay Fixtures']
      },
      {
        id: 'sub-07-2',
        name: 'Flood & Outdoor Lighting',
        items: ['50W / 100W IP66 Waterproof LED Flood Lights', '150W Heavy Mast Flood Lights', 'LED Industrial Street Lights (60W - 120W)', 'Solar Integrated Street Lights']
      },
      {
        id: 'sub-07-3',
        name: 'Cleanroom & Commercial Troffers',
        items: ['2x2 Foot 36W LED False Ceiling Cleanroom Panels', 'Edge-Lit Recessed Modular Troffers', 'Surface Mount Battens (4ft 20W/40W)', 'IP65 Cleanroom Top Opening Fixtures']
      },
      {
        id: 'sub-07-4',
        name: 'Emergency & Specialty Lighting',
        items: ['Automatic Emergency Backup Exit Sign Lights (3-hour)', 'Flameproof Well Glass Fixtures (Zone 1 / Zone 2)', 'Handheld Rechargeable LED Inspection Torches', 'Tower Beacon Warning Lights']
      }
    ]
  },
  {
    id: 'cat-08',
    slug: 'signages-labels',
    name: 'Signages & Labels',
    iconName: 'AlertTriangle',
    description: 'OSHA compliant hazard signs, fire exit boards, floor caution tapes, barcode asset tags & mandatory PPE boards.',
    productCount: 175,
    featuredBrands: ['Brady', 'AlertMark', 'Safetysign', '3M Signs', 'SignGuard'],
    subcategories: [
      {
        id: 'sub-08-1',
        name: 'Safety & Danger Signs',
        items: ['Danger 415V High Voltage Shock Signs', 'Flammable Material Caution Boards', 'No Smoking / Highly Flammable Zone Signs', 'Emergency Eyewash & First Aid Station Signs']
      },
      {
        id: 'sub-08-2',
        name: 'Fire & Evacuation Signages',
        items: ['Photoluminescent Glow-in-Dark Fire Exit Signs', 'Fire Extinguisher Locator Boards', 'Emergency Assembly Point Signs', 'Evacuation Route Maps & Arrows']
      },
      {
        id: 'sub-08-3',
        name: 'Floor Marking & Caution Tapes',
        items: ['Yellow & Black Hazard Striped Caution Floor Tape', 'Red & White Restricted Area Floor Tape', 'Barricade Non-Adhesive Caution Ribbons (500m)', 'Anti-Skid Glow-in-the-Dark Stair Treads']
      },
      {
        id: 'sub-08-4',
        name: 'Asset Tags & Industrial Labels',
        items: ['Barcoded Metallic Asset Tracking Tags', 'Pre-Printed Pipe Marking Flow Direction Labels', 'Quality Inspection Passed / Rejected Stickers', 'Equipment Lockout / Tagout (LOTO) Tags']
      }
    ]
  },
  {
    id: 'cat-09',
    slug: 'paint-polish',
    name: 'Paint & Polish',
    iconName: 'Paintbrush',
    description: 'Industrial epoxy floor coatings, zinc phosphate primers, machine enamels, aerosol spray paints & thinners.',
    productCount: 110,
    featuredBrands: ['Asian Paints PPG', 'Berger Protective', 'AkzoNobel', 'Kansai Nerolac', 'Rust-Oleum'],
    subcategories: [
      {
        id: 'sub-09-1',
        name: 'Protective & Epoxy Primers',
        items: ['Two-Component Zinc Phosphate Epoxy Primer', 'Red Oxide Anti-Corrosive Metal Primer', 'Zinc Rich Cold Galvanizing Primer', 'Etch Primer for Aluminium & Galvanized Steel']
      },
      {
        id: 'sub-09-2',
        name: 'Floor Coatings & Screeds',
        items: ['Self-Leveling Epoxy Floor Coating (2mm)', 'High Gloss Polyurethane (PU) Topcoat', 'Chemical Resistant Screed Mortar', 'Clear Protective Concrete Dustproofer']
      },
      {
        id: 'sub-09-3',
        name: 'Industrial Machine Enamels',
        items: ['Fast Drying Synthetic Machinery Enamel', 'Heat Resistant Aluminium Paint (up to 600°C)', 'Aerosol Touch-Up Spray Paints (400ml)', 'Line Marking Road & Floor Paint']
      },
      {
        id: 'sub-09-4',
        name: 'Thinners & Solvents',
        items: ['Epoxy Thinner (Grade A Industrial)', 'Polyurethane (PU) Reducer & Thinner', 'NC General Purpose Thinner', 'Degreaser & Surface Preparation Wash']
      }
    ]
  },
  {
    id: 'cat-10',
    slug: 'cable-accessories',
    name: 'Cable and Cable Accessories',
    iconName: 'Cpu',
    description: 'Armoured power cables, multicore flexible control cables, nylon cable ties, GI cable trays, brass glands & lugs.',
    productCount: 260,
    featuredBrands: ['Polycab', 'Finolex Cables', 'Havells', 'Dowells', 'Schneider', 'Raychem RPG'],
    subcategories: [
      {
        id: 'sub-10-1',
        name: 'Power & Control Cables',
        items: ['1.1kV XLPE Armoured Copper Cables (4 Core, 16-95 sq.mm)', 'Flexible Multicore Shielded Control Cables', 'Submersible Copper Flat Cables', 'Fire Survival FR-LSH Cables']
      },
      {
        id: 'sub-10-2',
        name: 'Cable Ties & Fasteners',
        items: ['UV Resistant Heavy Duty Nylon Cable Ties (100-500mm)', 'Stainless Steel 316 Ball Lock Cable Ties', 'Self-Adhesive Cable Tie Mounting Bases', 'Spiral Wrapping Bands & Heat Shrink Tubes']
      },
      {
        id: 'sub-10-3',
        name: 'Cable Trays & Raceways',
        items: ['Perforated Hot Dip Galvanized Cable Trays', 'Ladder Type Heavy Duty Cable Trays with Covers', 'Wire Mesh Basket Trays', 'PVC Floor Duct Raceways']
      },
      {
        id: 'sub-10-4',
        name: 'Cable Glands & Terminal Lugs',
        items: ['Double Compression Weatherproof Brass Glands', 'Single Compression Brass Cable Glands', 'Copper Ring Terminal Lugs (Heavy Duty Crimping)', 'Pin & Fork Insulated Terminal Connectors']
      }
    ]
  },
  {
    id: 'cat-11',
    slug: 'hardware',
    name: 'Hardware',
    iconName: 'Package',
    description: 'High tensile hex bolts, nuts, washers, drop-in anchors, heavy duty caster wheels, industrial bearings & latches.',
    productCount: 390,
    featuredBrands: ['TVS Fasteners', 'Unbrako', 'SKF Bearings', 'FAG', 'Rexroth', 'Godrej Hardware'],
    subcategories: [
      {
        id: 'sub-11-1',
        name: 'Fasteners & Threaded Rods',
        items: ['High Tensile Hex Head Bolts (Grade 8.8, 10.9)', 'Full Thread Metric Hex Nuts & Lock Nuts', 'Spring Washers & Plain Flat Washers', 'Stainless Steel 304 Threaded Studs (1m Length)']
      },
      {
        id: 'sub-11-2',
        name: 'Heavy Duty Anchor Systems',
        items: ['Through-Bolt Wedge Anchors for Concrete', 'Drop-In Expansion Anchors', 'Chemical Anchor Injection Cartridges & Studs', 'Nylon Wall Rawl Plugs']
      },
      {
        id: 'sub-11-3',
        name: 'Casters & Material Handling Wheels',
        items: ['Heavy Duty Polyurethane (PU) Swivel Casters with Brake', 'Cast Iron Fixed Heavy Duty Trolley Wheels', 'Rubber Pneumatic Casters for Uneven Floors', 'Ball Transfer Units']
      },
      {
        id: 'sub-11-4',
        name: 'Industrial Bearings & Bushings',
        items: ['Deep Groove Ball Bearings (SKF 6200, 6300 Series)', 'Tapered Roller Bearings', 'Pillow Block Bearings (UCP 204 - 210)', 'Self-Lubricating Bronze Bushings']
      }
    ]
  },
  {
    id: 'cat-12',
    slug: 'test-measuring',
    name: 'Test and Measuring Instruments',
    iconName: 'Activity',
    description: 'Digital multimeters, clamp meters, laser distance meters, infrared thermometers, insulation testers & calipers.',
    productCount: 135,
    featuredBrands: ['Fluke', 'Mastech', 'Bosch Measuring', 'Mitutoyo', 'Megger', 'Testo'],
    subcategories: [
      {
        id: 'sub-12-1',
        name: 'Electrical Test Meters',
        items: ['CAT III / CAT IV True RMS Digital Multimeters', 'AC/DC Digital Clamp Meters (600A - 1000A)', 'Insulation Resistance Testers (Megger 1kV/2.5kV)', 'Phase Sequence & Motor Rotation Testers']
      },
      {
        id: 'sub-12-2',
        name: 'Temperature & Thermal Testing',
        items: ['Non-Contact Infrared Laser Thermometers (-50°C to 800°C)', 'Thermal Imaging Cameras for Switchboard Audits', 'K-Type Thermocouple Digital Thermometers', 'Digital Hygrometer & Psychrometers']
      },
      {
        id: 'sub-12-3',
        name: 'Laser & Distance Measuring',
        items: ['Laser Distance Measurers (50m, 80m, 100m Range)', 'Self-Leveling 360-Degree Cross Line Laser Levels', 'Digital Ultrasonic Thickness Gauges', 'Optical & Contact Digital Tachometers (RPM)']
      },
      {
        id: 'sub-12-4',
        name: 'Precision Mechanical Metrology',
        items: ['Digital Stainless Steel Vernier Calipers (0-150mm, 0-300mm)', 'Outside Micrometer Sets (0-25mm, 25-50mm)', 'Dial Indicator Gauges with Magnetic Base', 'Thread Pitch & Feeler Gauges']
      }
    ]
  },
  {
    id: 'cat-13',
    slug: 'adhesive-sealants-tapes',
    name: 'Adhesive, Sealants, Tapes',
    iconName: 'Layers',
    description: 'Silicone sealants, Loctite threadlockers, heavy duty duct tapes, epoxy resins, Araldite & VHB double-sided tapes.',
    productCount: 220,
    featuredBrands: ['Pidilite (Fevicol/M-Seal/Dr.Fixit)', 'Loctite Henkel', '3M Industrial', 'Dow Corning', 'Araldite', 'Anabond'],
    subcategories: [
      {
        id: 'sub-13-1',
        name: 'Industrial Tapes',
        items: ['3M VHB Heavy Duty Double Sided Acrylic Foam Tape', 'Waterproof Reinforced Fabric Duct Tape', 'Crepe Paper High Temp Masking Tape', 'Aluminium Foil Heat Shielding Tape', 'Electrical PVC Insulation Tape']
      },
      {
        id: 'sub-13-2',
        name: 'Silicone & Joint Sealants',
        items: ['Neutral Cure RTV Silicone Weatherproofing Sealant', 'High Temperature Red Silicone Gasket Maker (up to 315°C)', 'Polyurethane (PU) Expansion Joint Sealant', 'Acrylic Gap Filler Sealant']
      },
      {
        id: 'sub-13-3',
        name: 'Threadlockers & Retaining Compounds',
        items: ['Loctite 243 Medium Strength Threadlocker (Blue)', 'Loctite 270 High Strength Permanent Studlocker (Red)', 'Loctite 577 Thread Pipe Sealant', 'Bearing Retaining Compound (Loctite 609/641)']
      },
      {
        id: 'sub-13-4',
        name: 'Epoxy Resins & Structural Adhesives',
        items: ['Araldite Standard Epoxy Adhesive (Clear Resin + Hardener)', 'Steel-Filled Epoxy Repair Putty (M-Seal Metal)', 'Cyanoacrylate Instant Super Glue (50g)', 'Polyurethane Hot Melt Adhesives']
      }
    ]
  }
];
