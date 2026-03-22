import { NextResponse } from "next/server";
import { createProduct, getProducts } from "@/lib/products";
import { validateProductInput } from "@/lib/validation";

export const dynamic = "force-dynamic";

export async function GET() {
  const products = await getProducts();
  return NextResponse.json(products);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const input = validateProductInput(body);
    const product = await createProduct(input);
    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Не вдалося створити товар.";
    const status = message.includes("Vercel") ? 503 : 400;
    return NextResponse.json({ message }, { status });
  }
}
