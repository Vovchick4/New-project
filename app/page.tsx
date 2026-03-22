import { connection } from "next/server";
import { getProducts } from "@/lib/products";
import ProductsClient from "@/components/products-client";

export default async function HomePage() {
  await connection();
  const products = await getProducts();

  return <ProductsClient initialProducts={products} />;
}
