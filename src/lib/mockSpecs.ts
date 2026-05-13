import { Spec } from "@/types/product";

const CATEGORY_SPECS: Record<
  string,
  (product: { id: number; price: number; brand?: string }) => Spec[]
> = {
  smartphones: (p) => [
    {
      label: "Display",
      value: `${(5.5 + (p.id % 3) * 0.5).toFixed(1)}"`,
      unit: "inches",
    },
    { label: "RAM", value: `${[4, 6, 8, 12][p.id % 4]}`, unit: "GB" },
    { label: "Storage", value: `${[64, 128, 256, 512][p.id % 4]}`, unit: "GB" },
    { label: "Battery", value: `${3000 + (p.id % 10) * 200}`, unit: "mAh" },
    { label: "Camera", value: `${[12, 48, 64, 108][p.id % 4]}`, unit: "MP" },
    { label: "5G", value: p.price > 500 ? "Yes" : "No" },
    { label: "OS", value: p.id % 2 === 0 ? "Android 14" : "Android 13" },
    { label: "Weight", value: `${170 + (p.id % 30)}`, unit: "g" },
  ],

  laptops: (p) => [
    {
      label: "Processor",
      value: ["Intel Core i5", "Intel Core i7", "AMD Ryzen 5", "AMD Ryzen 7"][
        p.id % 4
      ],
    },
    { label: "RAM", value: `${[8, 16, 32][p.id % 3]}`, unit: "GB" },
    {
      label: "Storage",
      value: `${[256, 512, 1000][p.id % 3]}`,
      unit: "GB SSD",
    },
    { label: "Display", value: `${[13.3, 14, 15.6, 16][p.id % 4]}"` },
    { label: "Battery Life", value: `${8 + (p.id % 8)}`, unit: "hrs" },
    {
      label: "Graphics",
      value: ["Integrated", "NVIDIA GTX", "NVIDIA RTX", "AMD Radeon"][p.id % 4],
    },
    {
      label: "Weight",
      value: `${(1.2 + (p.id % 10) * 0.1).toFixed(1)}`,
      unit: "kg",
    },
    {
      label: "OS",
      value: ["Windows 11", "Windows 11 Pro", "Linux", "macOS"][p.id % 4],
    },
  ],

  tablets: (p) => [
    { label: "Display", value: `${8 + (p.id % 5)}"` },
    { label: "RAM", value: `${[3, 4, 6, 8][p.id % 4]}`, unit: "GB" },
    { label: "Storage", value: `${[32, 64, 128, 256][p.id % 4]}`, unit: "GB" },
    { label: "Battery", value: `${5000 + (p.id % 5) * 1000}`, unit: "mAh" },
    { label: "Camera", value: `${[8, 12, 13][p.id % 3]}`, unit: "MP" },
    { label: "OS", value: p.id % 2 === 0 ? "Android 14" : "iPadOS 17" },
    { label: "Connectivity", value: p.price > 400 ? "Wi-Fi + 4G" : "Wi-Fi" },
  ],

  beauty: (p) => [
    {
      label: "Skin Type",
      value: ["All", "Dry", "Oily", "Sensitive"][p.id % 4],
    },
    { label: "Finish", value: ["Matte", "Dewy", "Natural"][p.id % 3] },
    { label: "Shades", value: `${6 + (p.id % 8)}` },
    { label: "Size", value: `${30 + (p.id % 5) * 10}`, unit: "ml" },
    { label: "Cruelty-Free", value: p.price > 20 ? "Yes" : "No" },
  ],

  skincare: (p) => [
    {
      label: "Skin Type",
      value: ["All", "Dry", "Oily", "Combination"][p.id % 4],
    },
    {
      label: "Key Ingredient",
      value: ["Niacinamide", "Hyaluronic", "Vitamin C", "Retinol"][p.id % 4],
    },
    { label: "Size", value: `${40 + (p.id % 6) * 10}`, unit: "ml" },
    { label: "Routine", value: p.id % 2 === 0 ? "AM" : "PM" },
  ],

  fragrances: (p) => [
    { label: "Type", value: ["EDT", "EDP", "Parfum"][p.id % 3] },
    { label: "Scent", value: ["Floral", "Woody", "Citrus", "Fresh"][p.id % 4] },
    { label: "Size", value: `${30 + (p.id % 5) * 10}`, unit: "ml" },
    { label: "Longevity", value: `${4 + (p.id % 6)}`, unit: "hrs" },
  ],

  groceries: (p) => [
    { label: "Weight", value: `${0.5 + (p.id % 8) * 0.25}`, unit: "kg" },
    {
      label: "Calories",
      value: `${80 + (p.id % 6) * 20}`,
      unit: "per serving",
    },
    { label: "Organic", value: p.id % 3 === 0 ? "Yes" : "No" },
    { label: "Servings", value: `${2 + (p.id % 6)}` },
  ],

  furniture: (p) => [
    {
      label: "Material",
      value: ["Wood", "Metal", "Fabric", "Leather"][p.id % 4],
    },
    { label: "Width", value: `${70 + (p.id % 6) * 10}`, unit: "cm" },
    { label: "Depth", value: `${40 + (p.id % 5) * 8}`, unit: "cm" },
    { label: "Assembly", value: p.price > 150 ? "Required" : "Minimal" },
  ],

  homedecoration: (p) => [
    {
      label: "Material",
      value: ["Ceramic", "Glass", "Wood", "Metal"][p.id % 4],
    },
    { label: "Height", value: `${15 + (p.id % 8) * 3}`, unit: "cm" },
    {
      label: "Style",
      value: ["Modern", "Minimal", "Classic", "Boho"][p.id % 4],
    },
  ],

  kitchenaccessories: (p) => [
    {
      label: "Material",
      value: ["Stainless Steel", "Silicone", "Wood", "Plastic"][p.id % 4],
    },
    { label: "Pieces", value: `${2 + (p.id % 6)}` },
    { label: "Dishwasher Safe", value: p.id % 2 === 0 ? "Yes" : "No" },
  ],

  womensdresses: (p) => [
    {
      label: "Material",
      value: ["Cotton", "Linen", "Polyester", "Silk"][p.id % 4],
    },
    { label: "Fit", value: ["Regular", "Slim", "Relaxed"][p.id % 3] },
    { label: "Length", value: ["Mini", "Midi", "Maxi"][p.id % 3] },
    { label: "Sizes", value: "XS-XL" },
  ],

  mensshirts: (p) => [
    {
      label: "Material",
      value: ["Cotton", "Linen", "Polyester", "Blend"][p.id % 4],
    },
    { label: "Fit", value: ["Regular", "Slim", "Relaxed"][p.id % 3] },
    { label: "Sizes", value: "S-XXL" },
  ],

  mensshoes: (p) => [
    {
      label: "Upper",
      value: ["Leather", "Mesh", "Suede", "Synthetic"][p.id % 4],
    },
    { label: "Sole", value: ["Rubber", "Foam", "EVA"][p.id % 3] },
    { label: "Sizes", value: "7-12" },
  ],

  womensshoes: (p) => [
    {
      label: "Upper",
      value: ["Leather", "Mesh", "Suede", "Synthetic"][p.id % 4],
    },
    { label: "Heel", value: ["Flat", "Low", "Mid", "High"][p.id % 4] },
    { label: "Sizes", value: "5-10" },
  ],

  womensbags: (p) => [
    {
      label: "Material",
      value: ["Leather", "Canvas", "Nylon", "Vegan"][p.id % 4],
    },
    { label: "Capacity", value: ["Small", "Medium", "Large"][p.id % 3] },
    { label: "Compartments", value: `${2 + (p.id % 4)}` },
  ],

  default: (p) => [
    { label: "Brand", value: p.brand || "Generic" },
    { label: "Model Year", value: `${2022 + (p.id % 3)}` },
    { label: "Warranty", value: `${[1, 2, 3][p.id % 3]}`, unit: "year(s)" },
    {
      label: "Weight",
      value: `${(0.3 + (p.id % 20) * 0.05).toFixed(2)}`,
      unit: "kg",
    },
    { label: "Color Options", value: `${[2, 3, 4, 5][p.id % 4]}` },
    { label: "In Box", value: "Item, Manual" },
  ],
};

export function getProductSpecs(
  productId: number,
  category: string,
  price: number,
  brand?: string,
): Spec[] {
  const normalizedCategory = category
    .toLowerCase()
    .replace(/-/g, "")
    .replace(/\s/g, "");
  const generator =
    CATEGORY_SPECS[normalizedCategory] ||
    CATEGORY_SPECS[
      Object.keys(CATEGORY_SPECS).find((k) => normalizedCategory.includes(k)) ||
        "default"
    ] ||
    CATEGORY_SPECS.default;

  return generator({ id: productId, price, brand });
}
