const names = [
  "Tênis Air Jordan — Masculino",
  "Tênis Nike Casual — Unissex",
  "Tênis Sport Classic — Feminino",
  "Tênis Urban — Masculino",
  "Tênis Everyday — Unissex",
  "Tênis Air Jordan — Feminino",
  "Tênis Nike Essential — Masculino",
  "Tênis Sport Comfort — Unissex",
  "Tênis Urban Classic — Feminino",
  "Tênis Everyday Casual — Masculino",
  "Tênis Air Jordan High — Unissex",
  "Tênis Nike Street — Feminino",
];
export const products = names.map((name, index) => ({
  id: String(index + 1),
  name,
  category: "Tênis",
  brand: name.includes("Nike") || name.includes("Jordan") ? "Nike" : "Digital",
  image: `/product-thumb-${(index % 5) + 1}.jpeg`,
  images: Array.from({ length: 5 }, (_, i) => ({
    src: `/produc-image-${i + 1}.jpeg`,
    alt: `Foto demonstrativa ${i + 1} do catálogo de tênis`,
  })),
  price: 200 + index * 20,
  ...(index < 2 ? { priceDiscount: (200 + index * 20) * 0.7 } : {}),
  description:
    "Estilo e conforto para acompanhar o seu dia. Um visual versátil para combinar com suas peças favoritas e aproveitar cada passo. Imagens ilustrativas do catálogo demonstrativo.",
  reference: `384167${11 + index}`,
  stars: 4.7,
  rating: 90,
  sizes: ["39", "40", "41", "42", "43"],
  colors: ["#6fe9f5", "#ff6573", "#616161", "#7471b9"],
}));
