export const DESIGN_STYLES = [
  "Modern",
  "Scandinavian",
  "Minimalist",
  "Industrial",
  "Luxury",
  "Bohemian",
  "Japanese",
  "Contemporary",
] as const;

export const ROOM_TYPES = [
  "Living Room",
  "Bedroom",
  "Kitchen",
  "Bathroom",
  "Office",
  "Dining Room",
  "Balcony",
] as const;

export const BUDGET_CATEGORIES = ["Budget", "Mid-Range", "Premium", "Luxury"] as const;

export const COLOR_PALETTES = [
  "Neutral",
  "Warm",
  "Cool",
  "Earth Tones",
  "Monochrome",
  "Bold & Vibrant",
  "Pastel",
  "Dark & Moody",
] as const;

// Unsplash images for each room type
export const DESIGN_SEED: {
  title: string;
  description: string;
  roomType: string;
  style: string;
  images: string[];
  colorPalette: string[];
  furniture: string[];
  materials: string[];
  budgetCategory: string;
  estimatedBudget: string;
  designerName: string;
  designerNotes: string;
  tags: string[];
}[] = [
  {
    title: "Serene Scandinavian Living Room",
    description:
      "A bright, airy living room embracing Nordic simplicity with natural textures and muted tones. Every element serves a purpose while maintaining warmth and comfort.",
    roomType: "Living Room",
    style: "Scandinavian",
    images: [
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80",
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80",
    ],
    colorPalette: ["#F5F0EB", "#D4C5B0", "#8B7355", "#4A4A4A", "#FFFFFF"],
    furniture: ["Low-profile sofa", "Wooden coffee table", "Sheepskin rug", "Floor lamp", "Open shelving"],
    materials: ["Light oak wood", "Linen fabric", "Wool", "Rattan", "Concrete accents"],
    budgetCategory: "Mid-Range",
    estimatedBudget: "8500",
    designerName: "Emma Larsson",
    designerNotes: "Focus on natural light. Use sheer curtains to maximize brightness while maintaining privacy.",
    tags: ["cozy", "bright", "natural", "nordic"],
  },
  {
    title: "Luxe Minimalist Bedroom Retreat",
    description:
      "An ultra-refined bedroom where less is definitively more. Premium materials and impeccable proportions create a sanctuary of calm.",
    roomType: "Bedroom",
    style: "Minimalist",
    images: [
      "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&q=80",
      "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800&q=80",
    ],
    colorPalette: ["#F8F6F3", "#E8E0D4", "#C9B99A", "#6B6B6B", "#2C2C2C"],
    furniture: ["Platform bed", "Floating nightstands", "Hidden wardrobe", "Accent chair", "Statement pendant"],
    materials: ["Walnut veneer", "Cashmere", "Brushed brass", "Silk", "Marble"],
    budgetCategory: "Luxury",
    estimatedBudget: "22000",
    designerName: "Yuki Tanaka",
    designerNotes: "Eliminate visual clutter. Every object must earn its place in the room.",
    tags: ["serene", "luxury", "minimal", "retreat"],
  },
  {
    title: "Industrial Loft Kitchen",
    description:
      "A bold kitchen design merging raw industrial materials with modern functionality. Exposed brick, steel, and concrete form a dramatic culinary space.",
    roomType: "Kitchen",
    style: "Industrial",
    images: [
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80",
      "https://images.unsplash.com/photo-1565538810643-b5bdb714032a?w=800&q=80",
    ],
    colorPalette: ["#3D3D3D", "#8C7853", "#C0A882", "#E8E0D0", "#B5B5B5"],
    furniture: ["Steel island", "Industrial bar stools", "Open shelving", "Subway tile backsplash", "Matte black fixtures"],
    materials: ["Exposed brick", "Brushed steel", "Reclaimed wood", "Poured concrete", "Matte black metal"],
    budgetCategory: "Premium",
    estimatedBudget: "35000",
    designerName: "Marcus Webb",
    designerNotes: "Balance raw materials with warm wood tones to prevent the space feeling cold.",
    tags: ["bold", "raw", "urban", "loft"],
  },
  {
    title: "Japanese Zen Home Office",
    description:
      "Inspired by wabi-sabi philosophy, this home office promotes focus and creativity through simplicity, natural elements, and mindful design.",
    roomType: "Office",
    style: "Japanese",
    images: [
      "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=800&q=80",
      "https://images.unsplash.com/photo-1585421514738-01798e348b17?w=800&q=80",
    ],
    colorPalette: ["#F2EDE4", "#C8B89A", "#8B7355", "#4A3728", "#1A1A1A"],
    furniture: ["Low desk", "Floor cushion", "Bamboo storage", "Shoji screen", "Bonsai display"],
    materials: ["Bamboo", "Rice paper", "Dark cedar", "Natural stone", "Linen"],
    budgetCategory: "Mid-Range",
    estimatedBudget: "6500",
    designerName: "Hiroshi Nakamura",
    designerNotes: "Incorporate a small water feature or plant to bring nature indoors and aid concentration.",
    tags: ["zen", "focus", "natural", "mindful"],
  },
  {
    title: "Bohemian Living Room Oasis",
    description:
      "A vibrant, eclectic living space celebrating global textiles, vintage finds, and lush botanicals. Perfectly imperfect and deeply personal.",
    roomType: "Living Room",
    style: "Bohemian",
    images: [
      "https://images.unsplash.com/photo-1602028915047-37269d1a73f7?w=800&q=80",
      "https://images.unsplash.com/photo-1567016432779-094069958ea5?w=800&q=80",
    ],
    colorPalette: ["#D4956A", "#8B4513", "#C0392B", "#F39C12", "#27AE60"],
    furniture: ["Rattan sofa", "Moroccan poufs", "Macramé wall art", "Vintage chest", "Hanging plants"],
    materials: ["Jute", "Rattan", "Kilim rugs", "Mixed textiles", "Reclaimed wood"],
    budgetCategory: "Budget",
    estimatedBudget: "3500",
    designerName: "Sofia Reyes",
    designerNotes: "Layer textures and patterns fearlessly. The key is balancing warm earth tones throughout.",
    tags: ["eclectic", "colorful", "global", "vintage"],
  },
  {
    title: "Contemporary Spa Bathroom",
    description:
      "A hotel-inspired bathroom retreat featuring clean lines, premium stone, and integrated technology for the ultimate self-care experience.",
    roomType: "Bathroom",
    style: "Contemporary",
    images: [
      "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=800&q=80",
      "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?w=800&q=80",
    ],
    colorPalette: ["#F5F5F0", "#D4CFCA", "#9E9689", "#5C5450", "#1C1C1C"],
    furniture: ["Freestanding bathtub", "Floating vanity", "Rain shower", "Heated towel rail", "Vessel sink"],
    materials: ["Carrara marble", "Travertine", "Brushed nickel", "Frosted glass", "Teak wood"],
    budgetCategory: "Luxury",
    estimatedBudget: "28000",
    designerName: "Claire Fontaine",
    designerNotes: "Install dimmable lighting on multiple circuits to set the perfect mood for any time of day.",
    tags: ["spa", "luxury", "serene", "hotel"],
  },
  {
    title: "Modern Dining Room Elegance",
    description:
      "A sophisticated dining space designed for memorable gatherings, blending contemporary form with timeless elegance.",
    roomType: "Dining Room",
    style: "Modern",
    images: [
      "https://images.unsplash.com/photo-1617806118233-18e1de247200?w=800&q=80",
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80",
    ],
    colorPalette: ["#1A1A2E", "#16213E", "#C0A882", "#F5F0EB", "#E8D5B7"],
    furniture: ["Marble dining table", "Velvet chairs", "Statement chandelier", "Sideboard", "Wine display"],
    materials: ["Calacatta marble", "Velvet", "Polished brass", "Smoked glass", "Dark walnut"],
    budgetCategory: "Premium",
    estimatedBudget: "18000",
    designerName: "Alexandre Dupont",
    designerNotes: "The chandelier should hang 30-34 inches above the table for optimal visual proportion.",
    tags: ["elegant", "entertaining", "sophisticated", "dramatic"],
  },
  {
    title: "Scandinavian Balcony Garden",
    description:
      "Transform your outdoor space into a Nordic garden retreat with layered greenery, cozy textiles, and warm lighting.",
    roomType: "Balcony",
    style: "Scandinavian",
    images: [
      "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&q=80",
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
    ],
    colorPalette: ["#4A7C59", "#8FBC8F", "#F5F0EB", "#D4C5B0", "#8B7355"],
    furniture: ["Teak loungers", "Bistro table", "Planters", "Fairy lights", "Outdoor rug"],
    materials: ["Teak wood", "Galvanized steel", "Weather-resistant fabric", "Terracotta pots", "Rope"],
    budgetCategory: "Budget",
    estimatedBudget: "2500",
    designerName: "Astrid Berg",
    designerNotes: "Use vertical planters to maximize space and create a lush green wall effect.",
    tags: ["outdoor", "green", "cozy", "urban garden"],
  },
  {
    title: "Luxury Modern Living Room",
    description:
      "An opulent living space where contemporary architecture meets sumptuous materials. Soaring ceilings and bespoke furniture define this prestigious interior.",
    roomType: "Living Room",
    style: "Luxury",
    images: [
      "https://images.unsplash.com/photo-1600210492493-0946911123ea?w=800&q=80",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80",
    ],
    colorPalette: ["#0D0D0D", "#1A1A1A", "#C0A882", "#D4AF37", "#F5F0EB"],
    furniture: ["Bespoke sectional", "Onyx coffee table", "Art installation", "B&B Italia armchairs", "Custom cabinetry"],
    materials: ["Onyx", "Polished brass", "Cashmere", "Smoked oak", "Art glass"],
    budgetCategory: "Luxury",
    estimatedBudget: "85000",
    designerName: "Victoria Ashworth",
    designerNotes: "Commission bespoke art pieces that complement the color palette rather than dominate it.",
    tags: ["opulent", "bespoke", "statement", "premium"],
  },
  {
    title: "Minimalist White Kitchen",
    description:
      "A pristine kitchen where form follows function. Hidden storage, integrated appliances, and a monochromatic palette create effortless elegance.",
    roomType: "Kitchen",
    style: "Minimalist",
    images: [
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80",
      "https://images.unsplash.com/photo-1565538810643-b5bdb714032a?w=800&q=80",
    ],
    colorPalette: ["#FFFFFF", "#F5F5F5", "#E0E0E0", "#9E9E9E", "#424242"],
    furniture: ["Handle-less cabinets", "Waterfall island", "Integrated hood", "Bar stools", "Floating shelves"],
    materials: ["Corian", "Quartz", "Stainless steel", "Matte lacquer", "Glass"],
    budgetCategory: "Premium",
    estimatedBudget: "42000",
    designerName: "Hans Mueller",
    designerNotes: "Every detail matters in minimalism. Invest in quality hardware and seamless joinery.",
    tags: ["clean", "white", "functional", "sleek"],
  },
  {
    title: "Industrial Bedroom Loft",
    description:
      "Urban meets cozy in this dramatic loft bedroom. Exposed structural elements provide character while plush textiles ensure comfort.",
    roomType: "Bedroom",
    style: "Industrial",
    images: [
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800&q=80",
      "https://images.unsplash.com/photo-1540518614846-7eded433c457?w=800&q=80",
    ],
    colorPalette: ["#2C2C2C", "#4A4A4A", "#8B7355", "#C0A882", "#F5F0EB"],
    furniture: ["Steel bed frame", "Reclaimed wood headboard", "Industrial dresser", "Edison bulb fixture", "Leather bench"],
    materials: ["Exposed brick", "Raw steel", "Reclaimed pine", "Leather", "Edison bulbs"],
    budgetCategory: "Mid-Range",
    estimatedBudget: "9500",
    designerName: "Jake Morrison",
    designerNotes: "Soften the industrial aesthetic with luxurious bedding and soft area rugs.",
    tags: ["urban", "raw", "character", "loft"],
  },
  {
    title: "Contemporary Home Office",
    description:
      "A productive powerhouse designed for the modern professional. Ergonomic principles meet sophisticated aesthetics in this high-performance workspace.",
    roomType: "Office",
    style: "Contemporary",
    images: [
      "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=800&q=80",
      "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80",
    ],
    colorPalette: ["#1E3A5F", "#2E5FA3", "#7BAFD4", "#F0F4F8", "#FFFFFF"],
    furniture: ["Height-adjustable desk", "Ergonomic chair", "Built-in bookshelves", "Monitor arm", "Cable management"],
    materials: ["Tempered glass", "Powder-coated steel", "White oak", "Acoustic panels", "Leather"],
    budgetCategory: "Mid-Range",
    estimatedBudget: "7500",
    designerName: "Sarah Chen",
    designerNotes: "Position desk perpendicular to windows to reduce screen glare while maximizing natural light.",
    tags: ["productive", "ergonomic", "professional", "focused"],
  },
];
