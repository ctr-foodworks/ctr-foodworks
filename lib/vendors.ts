import type { Vendor } from "./types";

export const vendors: Vendor[] = [
  {
    slug: "southern-belle-chicken-co",
    name: "Southern Belle Chicken Co.",
    tagline: "Southern Fried · World Traveled",
    description:
      "Southern Belle Chicken Co. brings a bold new take on fried chicken, serving up crispy sandwiches, hand-breaded strips, and craveable sides rooted in Southern tradition and inspired by flavors from around the world. Led by Michelin-recommended and James Beard-nominated Atlanta chef Joey Ward, the concept lives by its motto: “Southern Fried. World Traveled.” With globally influenced sauces, unexpected flavor combinations, and a chef-driven approach, every dish blends comfort, craft, and culinary creativity. Southern Belle Chicken Co. delivers the soul of the South with the energy of an international street-food journey.",
    cuisine: ["Southern", "Fried Chicken", "American"],
    metaDescription:
      "Chef Joey Ward's globally-inspired fried chicken — crispy sandwiches, hand-breaded strips, and craveable sides at CTR Food Works in downtown Atlanta.",
    accent: "primary",
    imageUrl: "/images/vendors/southern-belle-chicken-co.jpg",
    logoUrl: "/logos/vendors/southern-belle-chicken-co.png",
    logoLargeUrl: "/logos/vendors/southern-belle-chicken-co-large.png",
  },
  {
    slug: "morellis",
    name: "Morelli's",
    tagline: "Artisan Ice Cream",
    description:
      "Morelli’s Ice Cream serves up signature flavors like Blueberry Corncake, Salted Caramel, Coffee Doughnut, and many more that keep fans coming back for more. Owned by husband-and-wife team Donald and Clarissa, the beloved small-batch ice cream parlor has become an Atlanta favorite since opening its first walk-up shop in East Atlanta in 2009.",
    cuisine: ["Ice Cream", "Desserts"],
    metaDescription:
      "Morelli's small-batch ice cream — Blueberry Corncake, Salted Caramel, and more from the beloved Atlanta parlor, now at CTR Food Works downtown.",
    accent: "primary",
    imageUrl: "/images/vendors/morellis-photo.jpg",
    logoUrl: "/logos/vendors/morellis.jpg",
  },
  {
    slug: "the-sparrow",
    name: "The Sparrow",
    tagline: "Szechuan Cuisine",
    description:
      "The Sparrow brings the bold flavors of Szechuan Chinese cuisine in a lively, fast-casual format. Inspired by traditional Szechuan cooking techniques and authentic ingredients, the concept will feature dumplings, wok-fired noodles, stir-fried specialties, rice bowls, and shareable small plates, delivering an approachable and flavorful dining experience rooted in Asian culinary tradition.",
    cuisine: ["Szechuan", "Chinese"],
    metaDescription:
      "Bold Szechuan Chinese cooking — dumplings, wok-fired noodles, and shareable plates at The Sparrow inside CTR Food Works in downtown Atlanta.",
    accent: "primary",
    imageUrl: "/images/vendors/the-sparrow.jpg",
    logoUrl: "/logos/vendors/the-sparrow.png",
    logoLargeUrl: "/logos/vendors/the-sparrow-large.png",
  },
  {
    slug: "la-tropical",
    name: "La Tropical",
    tagline: "Cuban · Caribbean · Latin",
    description:
      "At La Tropical, every dish celebrates the vibrant flavors and traditions of Puerto Rican, Cuban, and Latin cuisine. From perfectly pressed Cuban sandwiches and crispy bacalaitos to savory mofongo, carne frita, arroz con pollo, and slow-braised ropa vieja, each plate is crafted with heart, soul, and authentic island flavor. Led by Chef Minelly Amador, La Tropical brings together homegrown recipes, warm hospitality, and the spirit of the Caribbean in a lively and welcoming atmosphere.",
    cuisine: ["Cuban", "Caribbean", "Latin American"],
    metaDescription:
      "Cuban, Puerto Rican, and Latin favorites — pressed sandwiches, mofongo, and ropa vieja from Chef Minelly Amador at CTR Food Works, downtown Atlanta.",
    accent: "primary",
    imageUrl: "/images/vendors/la-tropical.jpg",
    logoUrl: "/logos/vendors/la-tropical.png",
  },
  {
    slug: "fuzzys",
    name: "Fuzzy's",
    tagline: "Raw Bar · Seafood",
    description:
      "Fuzzy’s Raw Bar is a laid-back seafood restaurant and raw bar, serving fresh oysters, shrimp cocktail, lobster rolls, cold drinks, and coastal comfort food in a fun, nostalgic setting. Inspired by classic dockside seafood shacks and old-school oyster bars, Fuzzy’s blends fresh catches, bold flavors, and a welcoming atmosphere where guests can gather for lunch, dinner, or a late-night bite.",
    cuisine: ["Seafood", "Raw Bar"],
    metaDescription:
      "A laid-back seafood raw bar — fresh oysters, shrimp cocktail, and lobster rolls at Fuzzy's inside CTR Food Works in downtown Atlanta.",
    accent: "navy",
    imageUrl: "/images/vendors/fuzzys.jpg",
    logoUrl: "/logos/vendors/fuzzys.jpg",
  },
  {
    slug: "eggflip-x-sushiflip",
    name: "Eggflip × SushiFlip",
    tagline: "Korean Breakfast · Handcrafted Sushi",
    description:
      "Eggflip × SushiFlip offer the best of both worlds. Eggflip is a Korean-inspired fast-casual concept serving flavorful egg sandwiches, breakfast burritos, bowls, and elevated comfort food. On the flip side, SushiFlip features fresh sushi rolls, poke bowls, and shareable appetizers, creating a modern and approachable dining experience that keeps guests coming back for more.",
    cuisine: ["Korean", "Sushi", "Breakfast"],
    metaDescription:
      "Korean-inspired egg sandwiches and breakfast bowls plus fresh sushi and poke at Eggflip × SushiFlip inside CTR Food Works, downtown Atlanta.",
    accent: "primary",
    imageUrl: "/images/vendors/eggflip-x-sushiflip.jpg",
    logoUrl: "/logos/vendors/eggflip-x-sushiflip.png",
  },
  {
    slug: "rivalry-beef",
    name: "Rivalry Beef",
    tagline: "Philly × Chicago",
    description:
      "Rivalry Beef brings two legendary sandwich cities under one roof: Philly cheesesteaks and Chicago Italian beef. Built around the playful rivalry between the two icons, the concept delivers stacked sandwiches and old-school Americana energy with a modern street-food vibe. Whether you’re Team Philly or Team Chicago, every bite helps settle the beef.",
    cuisine: ["Cheesesteak", "Italian Beef", "Sandwiches"],
    metaDescription:
      "Philly cheesesteaks meet Chicago Italian beef — stacked sandwiches settling the rivalry at Rivalry Beef inside CTR Food Works, downtown Atlanta.",
    accent: "primary",
    // Food photo still pending from Thierry — using the temporary logo as the
    // card image. VendorCard renders this object-contain on a neutral tile
    // (see imageMode: "logo") so the square logo isn't crop-mangled by the
    // usual 4:3 object-cover.
    imageUrl: "/logos/vendors/rivalry-beef.png",
    logoUrl: "/logos/vendors/rivalry-beef.png",
    imageMode: "logo",
    comingSoon: true,
  },
  {
    slug: "patty-and-franks",
    name: "Patty & Frank's",
    tagline: "Burgers & Hot Dogs",
    description:
      "Patty & Frank’s is a modern American burger and hot dog concept that blends nostalgic comfort food with elevated ingredients and bold flavor. The brand is known for its smashed burgers, premium beef franks, and craveable classics inspired by iconic roadside stands and neighborhood grill counters. Built around quality, simplicity, and “Love In Every Bun,” Patty & Frank’s delivers an energetic fast-casual experience that feels both familiar and fresh, combining retro Americana with chef-driven execution and broad consumer appeal.",
    cuisine: ["Burgers", "Hot Dogs", "American"],
    metaDescription:
      "Smashed burgers, premium beef franks, and roadside classics at Patty & Frank's — a modern American grill inside CTR Food Works, downtown Atlanta.",
    accent: "primary",
    imageUrl: "/images/vendors/patty-and-franks.jpg",
    logoUrl: "/logos/vendors/patty-and-franks.png",
  },
  {
    slug: "mimi-taqueria",
    name: "Mimi Taqueria",
    tagline: "Modern Mexican Street Food",
    description:
      "MiMi Taqueria is a lively, female chef-driven kitchen serving Mexican street food with a playful modern twist. Inspired by Chef Mimi’s passion for handcrafted cooking and fresh ingredients, the menu features delicious tacos, burritos, enchiladas, and signature comfort dishes packed with unique flavors, house-made sauces, and soulful authenticity. All served in a warm, energetic atmosphere.",
    cuisine: ["Mexican"],
    metaDescription:
      "Chef Mimi's modern Mexican street food — tacos, burritos, and enchiladas with house-made sauces at Mimi Taqueria inside CTR Food Works, Atlanta.",
    accent: "primary",
    imageUrl: "/images/vendors/mimi-taqueria.jpg",
    logoUrl: "/logos/vendors/mimi-taqueria.svg",
  },
  {
    slug: "flora-ditalia",
    name: "Flora D'Italia",
    tagline: "Italian Kitchen",
    description:
      "Flora D’Italia brings a fresh and approachable take on classic Italian cuisine. Known for its handmade pastas, Neapolitan-style pizzas, hearty sandwiches, crisp salads, and comforting favorites like eggplant and chicken Parmesan, the restaurant focuses on quality ingredients and satisfying flavors. Blending traditional Italian recipes with a modern, welcoming atmosphere, Flora D’Italia offers the perfect spot for everything from a casual lunch to a relaxed dinner with friends and family.",
    cuisine: ["Italian", "Pizza", "Pasta"],
    metaDescription:
      "Handmade pastas, Neapolitan pizzas, and Italian classics at Flora D'Italia — a fresh take on la cucina inside CTR Food Works, downtown Atlanta.",
    accent: "primary",
    imageUrl: "/images/vendors/flora-ditalia.jpg",
    logoUrl: "/logos/vendors/flora-ditalia.png",
  },
  {
    slug: "dessertbox",
    name: "DessertBox",
    tagline: "Modern Bakery & Pastry",
    description:
      "Dessertbox is a modern bakery rooted in craft, simplicity, and beauty. Inspired by classic French pâtisserie and timeless comfort foods, DessertBox offers a curated selection of desserts, breads, and savory bites made with exceptional technique and quality ingredients. From elegant cakes and cupcakes to seasonal specialties, every item is thoughtfully crafted to be enjoyed every day, shared often, and remembered long after the last bite.",
    cuisine: ["Bakery", "Pastry", "Desserts"],
    metaDescription:
      "A modern bakery of French-inspired pastries, cakes, breads, and savory bites at DessertBox inside CTR Food Works in downtown Atlanta.",
    accent: "primary",
    imageUrl: "/images/vendors/dessertbox.jpg",
    logoUrl: "/logos/vendors/dessertbox.png",
  },
];
