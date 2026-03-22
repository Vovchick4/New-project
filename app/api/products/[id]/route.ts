import { NextResponse } from "next/server";
import { deleteProduct, updateProduct } from "@/lib/products";
import { validateProductInput } from "@/lib/validation";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function PUT(request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    const input = validateProductInput(body);
    const updated = await updateProduct(id, input);

    if (!updated) {
      return NextResponse.json({ message: "Товар не знайдено." }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Не вдалося оновити товар.";
    const status = message.includes("Vercel") ? 503 : 400;
    return NextResponse.json({ message }, { status });
  }
}

export async function DELETE(_: Request, context: RouteContext) {
  const { id } = await context.params;
  const deleted = await deleteProduct(id);

  if (!deleted) {
    return NextResponse.json({ message: "Товар не знайдено." }, { status: 404 });
  }

  return NextResponse.json({ success: true });
}
