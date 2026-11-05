import mongoose from "mongoose";
import User from "../src/model/user.ts";
import Product from "../src/model/product.ts";
import Coupon from "../src/model/coupon.ts";

const uri = process.env.NEXT_DB_URL;
if (!uri) {
  console.error("NEXT_DB_URL is not set (add it to .env.local)");
  process.exit(1);
}

const keep = process.argv.includes("--keep");

type Item = [string, number, string, boolean?];

const catalog: Record<string, { items: Item[] }> = {
  jeans: {
    items: [
      [
        "Classic Blue Jeans",
        59.9,
        "Straight-fit denim with a timeless wash.",
        true,
      ],
      ["Slim Black Jeans", 64.9, "Stretch denim, slim cut, all-day comfort."],
      ["Relaxed Light Jeans", 54.5, "Loose fit with a faded light wash."],
      [
        "Skinny Dark Indigo Jeans",
        62.0,
        "Super-stretch skinny fit in deep indigo.",
      ],
      ["Wide Leg Vintage Jeans", 69.9, "High-rise wide leg with a retro wash."],
      ["Ripped Knee Jeans", 66.5, "Distressed knees for a street look.", true],
      ["Tapered Grey Jeans", 58.9, "Tapered leg in a washed grey tone."],
      ["Bootcut Classic Jeans", 57.0, "Mid-rise bootcut with a clean finish."],
      [
        "Carpenter Work Jeans",
        72.0,
        "Utility pockets and a loop on a rigid denim.",
      ],
      [
        "Selvedge Raw Jeans",
        129.0,
        "Raw selvedge denim that ages beautifully.",
      ],
    ],
  },
  "t-shirts": {
    items: [
      ["Essential White Tee", 19.9, "100% cotton crew-neck tee.", true],
      ["Graphic Street Tee", 24.9, "Oversized tee with a bold front print."],
      ["Striped Cotton Tee", 22.0, "Breathable striped tee for everyday wear."],
      ["Black Basic Tee", 18.9, "Soft black tee that goes with everything."],
      [
        "Pocket Heavyweight Tee",
        27.5,
        "Thick cotton with a chest pocket.",
        true,
      ],
      ["V-Neck Slim Tee", 21.0, "Slim-fit v-neck in stretch jersey."],
      ["Vintage Washed Tee", 26.9, "Garment-dyed with a worn-in feel."],
      ["Long Sleeve Henley", 32.0, "Three-button henley in waffle knit."],
      ["Polo Piqué Shirt", 34.9, "Classic piqué polo with ribbed collar."],
      ["Tie-Dye Summer Tee", 23.9, "Hand-style tie-dye for bright days."],
    ],
  },
  shoes: {
    items: [
      [
        "Urban Runner Sneakers",
        89.9,
        "Lightweight sneakers with cushioned soles.",
        true,
      ],
      ["Leather Derby Shoes", 119.0, "Polished leather for formal occasions."],
      ["Canvas Low-Tops", 49.9, "Classic canvas sneakers in many colors."],
      ["High-Top Basketball Shoes", 99.0, "Ankle support and grippy outsole."],
      [
        "Suede Chelsea Boots",
        134.9,
        "Elastic-sided boots in soft suede.",
        true,
      ],
      ["Slip-On Loafers", 79.5, "Easy leather loafers with a flexible sole."],
      ["Trail Hiking Boots", 139.0, "Waterproof boots with deep lugs."],
      ["Minimal White Sneakers", 84.9, "Clean leather court sneakers."],
      ["Leather Sandals", 44.9, "Adjustable straps and a cork footbed."],
      ["Running Pro Trainers", 109.0, "Responsive foam for daily miles."],
    ],
  },
  glasses: {
    items: [
      ["Aviator Sunglasses", 39.9, "Metal frame with UV400 lenses."],
      ["Round Retro Glasses", 34.9, "Vintage-inspired round frames.", true],
      ["Square Acetate Frames", 44.9, "Bold acetate frames for a modern look."],
      ["Cat-Eye Sunglasses", 42.0, "Upswept frames with gradient lenses."],
      ["Wayfarer Classic", 47.5, "The iconic shape in glossy black.", true],
      ["Blue Light Blockers", 29.9, "Clear lenses that reduce screen glare."],
      ["Polarized Sport Shades", 54.9, "Wraparound fit with polarized lenses."],
      ["Oversized Fashion Shades", 38.9, "Large lenses for a statement look."],
      [
        "Titanium Rimless Glasses",
        89.0,
        "Ultra-light rimless titanium frames.",
      ],
      [
        "Tortoise Shell Frames",
        49.9,
        "Warm tortoise acetate in a timeless shape.",
      ],
    ],
  },
  jackets: {
    items: [
      [
        "Denim Trucker Jacket",
        99.0,
        "Heavyweight denim jacket with button front.",
      ],
      [
        "Bomber Jacket",
        109.9,
        "Water-resistant bomber with ribbed cuffs.",
        true,
      ],
      ["Leather Biker Jacket", 189.0, "Genuine leather with asymmetric zip."],
      ["Puffer Winter Jacket", 149.0, "Insulated puffer for cold days.", true],
      ["Windbreaker Shell", 69.9, "Packable and wind-resistant."],
      ["Wool Overcoat", 219.0, "Long wool-blend coat with notch lapel."],
      ["Fleece Zip Jacket", 59.9, "Warm midlayer in recycled fleece."],
      ["Varsity Jacket", 119.0, "Wool body with faux leather sleeves."],
      [
        "Waxed Field Jacket",
        159.0,
        "Water-repellent waxed cotton with pockets.",
      ],
      ["Quilted Vest", 79.0, "Lightweight quilted vest for layering."],
    ],
  },
  suits: {
    items: [
      ["Navy Two-Piece Suit", 249.0, "Tailored wool-blend suit in navy.", true],
      ["Charcoal Slim Suit", 229.0, "Slim-fit suit, perfect for the office."],
      ["Black Tuxedo", 299.0, "Evening tuxedo with satin lapels."],
      ["Light Grey Summer Suit", 219.0, "Breathable lightweight fabric."],
      [
        "Three-Piece Pinstripe Suit",
        329.0,
        "Classic pinstripe with matching waistcoat.",
        true,
      ],
      ["Burgundy Velvet Blazer", 179.0, "Statement velvet blazer for events."],
      ["Beige Linen Suit", 239.0, "Relaxed linen suit for warm weather."],
      ["Double-Breasted Navy Suit", 279.0, "Peak lapels and a structured cut."],
      [
        "Slim Fit Dress Trousers",
        69.0,
        "Tailored trousers with a sharp crease.",
      ],
      ["Checked Tweed Blazer", 199.0, "Textured tweed with elbow patches."],
    ],
  },
  bags: {
    items: [
      ["Leather Backpack", 79.9, "Roomy backpack with padded laptop sleeve."],
      ["Canvas Tote Bag", 29.9, "Durable everyday tote."],
      [
        "Crossbody Messenger",
        59.9,
        "Compact messenger with adjustable strap.",
        true,
      ],
      ["Weekender Duffel", 94.0, "Spacious duffel for short trips.", true],
      ["Mini Belt Bag", 24.9, "Hands-free bag with secure zip."],
      ["Laptop Briefcase", 109.0, "Structured briefcase for 15-inch laptops."],
      ["Drawstring Gym Sack", 17.9, "Light sack for the gym or beach."],
      [
        "Roll-Top Waterproof Pack",
        74.9,
        "Weatherproof backpack for commuting.",
      ],
      ["Leather Card Holder", 22.0, "Slim holder with four card slots."],
      ["Travel Hard Case", 139.0, "Carry-on hard shell with spinner wheels."],
    ],
  },
};

const photos: Record<string, string[]> = {
  jeans: [
    "apFR6sYu7ss",
    "ttPpaZutpXE",
    "9yoXrG6Er_g",
    "h6PKsr0wDH4",
    "wNP79A-_bRY",
    "nC4-PXzKZcI",
    "jll9ZPrAVms",
    "YeGao3uk8kI",
  ],
  "t-shirts": [
    "6Nub980bI3I",
    "k1WdkXkTKHk",
    "7WE1LbSc4zM",
    "nzcZydN0sRM",
    "20wx7IY7Ggk",
    "fEt6Wd4t4j0",
    "lT1QeQmlIyo",
  ],
  shoes: [
    "164_6wVEHfI",
    "U_2YmQh2XGw",
    "wFNTfYo9Vnc",
    "1Us_GlM9j-M",
    "6e8FWhF-nwI",
    "a-QH9MAAVNI",
    "da-aMPdJ9ww",
    "KBgL_QA11xQ",
  ],
  jackets: ["TcRaVI3LXds", "6emxbke6OxA", "J3-4aCOLOdg", "M5F4vmEnxsA"],
  suits: [
    "NxtxmmHc2OE",
    "ACR44H1X8jE",
    "IIpY8NZYeAg",
    "vXmHnW7puxE",
    "SRBHZzeNi6Q",
  ],
  bags: [
    "_H0fjILH5Vw",
    "d-BTL93LsGg",
    "J69W3O3WKGQ",
    "xzrJCS4grC4",
    "NEd6SvkCmhU",
    "1R2TtR_UUVw",
    "AL9mw5tM3l8",
  ],
  glasses: [
    "K62u25Jk6vo",
    "weaHrH2AU3k",
    "smkayFKmfz0",
    "Fy1ADkxmkDc",
    "lrbZn9Y_PoI",
  ],
};

const unsplash = (id: string) =>
  `https://unsplash.com/photos/${id}/download?force=true&w=800`;

const products = Object.entries(catalog).flatMap(([category, { items }]) =>
  items.map(([name, price, description, isFeatured], i) => ({
    name,
    category,
    price,
    image: unsplash(photos[category][i % photos[category].length]),
    description,
    isFeatured: !!isFeatured,
  })),
);

async function main() {
  await mongoose.connect(uri!);
  console.log("Connected to MongoDB");

  if (!keep) {
    await Promise.all([
      Product.deleteMany({}),
      Coupon.deleteMany({}),
      User.deleteMany({
        email: { $in: ["admin@example.com", "customer@example.com"] },
      }),
    ]);
    console.log("Cleared existing seed data");
  }

  // Use create() (not insertMany) so the User pre-save hook hashes passwords.
  const [admin, customer] = await User.create([
    {
      name: "Admin",
      email: "admin@example.com",
      password: "admin123",
      role: "admin",
    },
    {
      name: "Customer",
      email: "customer@example.com",
      password: "customer123",
      role: "customer",
    },
  ]);

  const inserted = await Product.insertMany(products);

  // Coupon.userId is unique + required: one coupon per user.
  const nextYear = new Date();
  nextYear.setFullYear(nextYear.getFullYear() + 1);
  await Coupon.create({
    code: "WELCOME10",
    discountPercentage: 10,
    expirationDate: nextYear,
    isActive: true,
    userId: customer._id,
  });

  console.log(`Seeded ${inserted.length} products, 2 users, 1 coupon`);
  console.log("  admin:    admin@example.com / admin123");
  console.log(
    "  customer: customer@example.com / customer123 (coupon WELCOME10)",
  );
  void admin;
}

main()
  .catch((err) => {
    console.error("Seed failed:", err);
    process.exitCode = 1;
  })
  .finally(() => mongoose.disconnect());
