import { getProducts } from "@/lib/products";
import ProductsClient from "@/components/products-client";

export default async function HomePage() {
  const products = await getProducts();

  return <ProductsClient initialProducts={products} />;
}
