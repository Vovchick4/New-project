import { ProductInput } from "@/types/product";

export function validateProductInput(payload: unknown): ProductInput {
  if (!payload || typeof payload !== "object") {
    throw new Error("Некоректне тіло запиту.");
  }

  const candidate = payload as Partial<ProductInput>;
  const name = candidate.name?.toString().trim() ?? "";
  const category = candidate.category?.toString().trim() ?? "";
  const description = candidate.description?.toString().trim() ?? "";
  const price = Number(candidate.price);

  if (!name) {
    throw new Error("Назва товару обов'язкова.");
  }

  if (!category) {
    throw new Error("Категорія товару обов'язкова.");
  }

  if (!description) {
    throw new Error("Опис товару обов'язковий.");
  }

  if (Number.isNaN(price) || price < 0) {
    throw new Error("Ціна повинна бути додатним числом.");
  }

  return {
    name,
    category,
    description,
    price
  };
}
