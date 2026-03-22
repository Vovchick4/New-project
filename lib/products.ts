import { promises as fs } from "fs";
import os from "os";
import path from "path";
import { Product, ProductInput } from "@/types/product";

const tempDir = process.env.TMPDIR || os.tmpdir();
const dataFilePath = path.join(tempDir, "data.json");

const defaultProducts: Product[] = [
  {
    id: "prod-1",
    name: "Кавова чашка Terra",
    price: 390,
    category: "Посуд",
    description: "Керамічна чашка ручного стилю для щоденної кави або чаю.",
    createdAt: new Date("2026-03-20T09:00:00.000Z").toISOString(),
    updatedAt: new Date("2026-03-20T09:00:00.000Z").toISOString(),
  },
  {
    id: "prod-2",
    name: "Блокнот Canvas",
    price: 240,
    category: "Канцелярія",
    description:
      "Щільний папір, тканинна обкладинка та приємний мінімалістичний дизайн.",
    createdAt: new Date("2026-03-21T12:30:00.000Z").toISOString(),
    updatedAt: new Date("2026-03-21T12:30:00.000Z").toISOString(),
  },
];

// async function ensureDataFile() {
//   try {
//     await fs.access(dataFilePath);
//   } catch {
//     await fs.writeFile(
//       dataFilePath,
//       JSON.stringify(defaultProducts, null, 2),
//       "utf8",
//     );
//   }
// }

async function readProducts(): Promise<Product[]> {
  // await ensureDataFile();

  try {
    const raw = await fs.readFile(dataFilePath, "utf8");
    return JSON.parse(raw) as Product[];
  } catch {
    return defaultProducts;
  }
}

async function writeProducts(products: Product[]) {
  await fs.writeFile(dataFilePath, JSON.stringify(products, null, 2), "utf8");
}

function buildId() {
  return `prod-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export async function getProducts() {
  return readProducts();
}

export async function createProduct(input: ProductInput) {
  const products = await readProducts();
  const now = new Date().toISOString();

  const product: Product = {
    id: buildId(),
    name: input.name.trim(),
    price: Number(input.price),
    category: input.category.trim(),
    description: input.description.trim(),
    createdAt: now,
    updatedAt: now,
  };

  products.unshift(product);
  await writeProducts(products);
  return product;
}

export async function updateProduct(id: string, input: ProductInput) {
  const products = await readProducts();
  const index = products.findIndex((product) => product.id === id);

  if (index === -1) {
    return null;
  }

  const current = products[index];
  const updated: Product = {
    ...current,
    name: input.name.trim(),
    price: Number(input.price),
    category: input.category.trim(),
    description: input.description.trim(),
    updatedAt: new Date().toISOString(),
  };

  products[index] = updated;
  await writeProducts(products);
  return updated;
}

export async function deleteProduct(id: string) {
  const products = await readProducts();
  const nextProducts = products.filter((product) => product.id !== id);

  if (nextProducts.length === products.length) {
    return false;
  }

  await writeProducts(nextProducts);
  return true;
}
