import { products } from "../data/products";
const normalize = (value) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
// Replace only this adapter when the backend contract is available.
export async function listProducts({ search = "" } = {}) {
  const query = normalize(search);
  return structuredClone(
    products.filter((product) => normalize(product.name).includes(query)),
  );
}
export async function getProductById(id) {
  return structuredClone(
    products.find((product) => product.id === String(id)) ?? null,
  );
}
