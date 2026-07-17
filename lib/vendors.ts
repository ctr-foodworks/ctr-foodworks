import type { Vendor } from "./types";

export const vendors: Vendor[] = [
  {
    slug: "southern-belle-chicken-co",
    name: "Southern Belle Chicken Co.",
    tagline: "Southern Fried · World Traveled",
    description:
      "Southern Belle Chicken Co. reimagines fried chicken through a well-traveled lens. Crispy sandwiches, hand-breaded strips, and craveable sides start in Southern tradition, then pick up sauces and flavor twists from around the world — the thinking behind its motto, “Southern Fried. World Traveled.” It’s led by Michelin-recommended, James Beard-nominated Atlanta chef Joey Ward, so every plate lands somewhere between down-home comfort and chef-driven craft.",
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
      "Morelli’s has been an Atlanta ice cream institution since husband-and-wife team Donald and Clarissa opened their first walk-up shop in East Atlanta in 2009. The small-batch parlor is known for signature scoops like Blueberry Corncake, Salted Caramel, and Coffee Doughnut — the kind of flavors that turn first-timers into regulars.",
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
      "The Sparrow serves the bold, tingling flavors of Szechuan China in a lively, fast-casual format. Built on traditional Szechuan techniques and authentic ingredients, the menu spans dumplings, wok-fired noodles, stir-fried specialties, rice bowls, and shareable small plates — approachable heat with real depth.",
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
      "La Tropical is Chef Minelly Amador’s celebration of Puerto Rican, Cuban, and Latin cooking. Expect pressed Cuban sandwiches, crispy bacalaitos, mofongo, carne frita, arroz con pollo, and slow-braised ropa vieja — homegrown recipes plated with heart and served with warm island hospitality.",
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
      "Fuzzy’s Raw Bar channels the classic dockside oyster shack — fresh oysters, shrimp cocktail, lobster rolls, and coastal comfort food in a fun, nostalgic room. Cold drinks, fresh catches, and an easy welcome, whether you’re in for lunch, dinner, or a late-night bite.",
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
      "Eggflip × SushiFlip runs two kitchens off one counter. Eggflip is a Korean-inspired, fast-casual take on breakfast and comfort food — egg sandwiches, breakfast burritos, and bowls — while SushiFlip handles the raw side with fresh sushi rolls, poke bowls, and shareable starters. Two cravings, one stop.",
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
      "Rivalry Beef puts two legendary sandwich towns head to head: Philly cheesesteaks versus Chicago Italian beef. It’s stacked, messy, old-school Americana with a modern street-food streak — pick a side, because every bite helps settle the beef.",
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
      "Patty & Frank’s is a modern American grill built on nostalgic comfort food and quality ingredients. Smashed burgers, premium beef franks, and roadside-stand classics come together under the motto “Love In Every Bun” — familiar favorites with chef-driven execution and an energetic, fast-casual feel.",
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
      "Mimi Taqueria is a female chef-driven kitchen serving modern Mexican street food. Chef Mimi’s tacos, burritos, enchiladas, and signature comfort plates lean on fresh ingredients and house-made sauces, all served up in a warm, energetic room.",
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
      "Flora D’Italia is a fresh, approachable take on classic Italian cooking. Handmade pastas, Neapolitan-style pizzas, hearty sandwiches, crisp salads, and comfort staples like eggplant and chicken Parmesan come from quality ingredients and traditional recipes — an easy call for a casual lunch or a relaxed dinner with friends.",
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
      "DessertBox is a modern bakery where French pâtisserie meets everyday comfort. Its case runs from elegant cakes and cupcakes to fresh-baked breads, seasonal specialties, and a handful of savory bites — each one made with real technique and built to be shared.",
    cuisine: ["Bakery", "Pastry", "Desserts"],
    metaDescription:
      "A modern bakery of French-inspired pastries, cakes, breads, and savory bites at DessertBox inside CTR Food Works in downtown Atlanta.",
    accent: "primary",
    imageUrl: "/images/vendors/dessertbox.jpg",
    logoUrl: "/logos/vendors/dessertbox.png",
  },
];
