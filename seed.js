import { createClient } from "@supabase/supabase-js";
import 'dotenv/config';

const supabaseUrl = process.env.VITE_SUPABASE_URL || "";
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || "";

const supabase = createClient(supabaseUrl, supabaseKey);

const ALL_PRODUCTS = [
  {
    title: "Farm Fresh Tomatoes",
    category: "Vegetables",
    price: 40,
    image_url: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=800&q=80",
    description: "Hand-picked daily from our poly-house farms."
  },
  {
    title: "Red Onions",
    category: "Vegetables",
    price: 35,
    image_url: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=800&q=80",
    description: "Cured perfectly for long shelf life."
  },
  {
    title: "Organic Spinach",
    category: "Vegetables",
    price: 25,
    image_url: "https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=800&q=80",
    description: "Crisp, iron-rich spinach."
  },
  {
    title: "Sweet Potatoes",
    category: "Vegetables",
    price: 50,
    image_url: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=800&q=80",
    description: "High quality export-grade sweet potatoes."
  },
  {
    title: "Fresh Apples",
    category: "Fruits",
    price: 120,
    image_url: "https://images.unsplash.com/photo-1560806887-1e4cd0b6fac6?w=800&q=80",
    description: "Crisp apples from the orchards."
  },
  {
    title: "Bananas",
    category: "Fruits",
    price: 60,
    image_url: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=800&q=80",
    description: "Naturally ripened yellow bananas."
  },
  {
    title: "Tiger Prawns",
    category: "Seafood",
    price: 800,
    image_url: "https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?w=800&q=80",
    description: "Large export-quality tiger prawns."
  },
  {
    title: "Rohu Fish",
    category: "Seafood",
    price: 350,
    image_url: "https://images.unsplash.com/photo-1511690078903-71dc5a49f5e3?w=800&q=80",
    description: "Freshly caught and ice-packed."
  }
];

async function seed() {
  const { data, error } = await supabase.from('products').insert(ALL_PRODUCTS).select();
  if (error) {
    console.error("Error inserting:", error);
  } else {
    console.log("Successfully seeded products:", data.length);
  }
}

seed();
