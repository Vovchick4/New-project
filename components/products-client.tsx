"use client";

import { FormEvent, useState } from "react";
import { Product, ProductInput } from "@/types/product";

type ProductsClientProps = {
  initialProducts: Product[];
};

const emptyForm: ProductInput = {
  name: "",
  price: 0,
  category: "",
  description: ""
};

export default function ProductsClient({ initialProducts }: ProductsClientProps) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [form, setForm] = useState<ProductInput>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState("Готово до роботи з товарами.");

  async function refreshProducts() {
    const response = await fetch("/api/products", { cache: "no-store" });
    const nextProducts = (await response.json()) as Product[];
    setProducts(nextProducts);
  }

  function startEdit(product: Product) {
    setEditingId(product.id);
    setForm({
      name: product.name,
      price: product.price,
      category: product.category,
      description: product.description
    });
    setStatus(`Редагування: ${product.name}`);
  }

  function resetForm() {
    setEditingId(null);
    setForm(emptyForm);
    setStatus("Форму очищено.");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setStatus(editingId ? "Оновлюю товар..." : "Створюю товар...");

    try {
      const response = await fetch(editingId ? `/api/products/${editingId}` : "/api/products", {
        method: editingId ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form)
      });

      if (!response.ok) {
        const error = (await response.json()) as { message?: string };
        throw new Error(error.message ?? "Операція не виконалась.");
      }

      await refreshProducts();
      const actionLabel = editingId ? "Товар оновлено." : "Товар створено.";
      resetForm();
      setStatus(actionLabel);
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Сталася помилка.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDelete(id: string) {
    setIsSubmitting(true);
    setStatus("Видаляю товар...");

    try {
      const response = await fetch(`/api/products/${id}`, {
        method: "DELETE"
      });

      if (!response.ok) {
        const error = (await response.json()) as { message?: string };
        throw new Error(error.message ?? "Не вдалося видалити товар.");
      }

      await refreshProducts();

      if (editingId === id) {
        resetForm();
      }

      setStatus("Товар видалено.");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Сталася помилка.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="page-shell">
      <section className="hero">
        <p className="hero__eyebrow">Next.js + TypeScript</p>
        <h1 className="hero__title">Гнучкий CRUD для ваших товарів</h1>
        <p className="hero__copy">
          Додавайте, редагуйте й видаляйте товари через API-роути Next.js. Дані зараз зберігаються у тимчасовому
          файлі середовища, тож апка підходить для демонстрації та тестування CRUD-поведінки.
        </p>
      </section>

      <section className="dashboard">
        <aside className="panel">
          <h2 className="section-title">{editingId ? "Редагувати товар" : "Новий товар"}</h2>
          <p className="section-copy">
            Заповніть форму, а всі операції підуть через вбудований API-шар Next.js без окремого бекенду.
          </p>

          <form className="form-grid" onSubmit={handleSubmit}>
            <div className="field">
              <label htmlFor="name">Назва</label>
              <input
                id="name"
                value={form.name}
                onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
                placeholder="Наприклад, Лампа Atelier"
                required
              />
            </div>

            <div className="field">
              <label htmlFor="price">Ціна</label>
              <input
                id="price"
                type="number"
                min="0"
                step="0.01"
                value={form.price}
                onChange={(event) => setForm((current) => ({ ...current, price: Number(event.target.value) }))}
                required
              />
            </div>

            <div className="field">
              <label htmlFor="category">Категорія</label>
              <input
                id="category"
                value={form.category}
                onChange={(event) => setForm((current) => ({ ...current, category: event.target.value }))}
                placeholder="Декор, Техніка, Одяг..."
                required
              />
            </div>

            <div className="field">
              <label htmlFor="description">Опис</label>
              <textarea
                id="description"
                value={form.description}
                onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
                placeholder="Коротко опишіть товар"
                required
              />
            </div>

            <div className="actions">
              <button className="button button--primary" type="submit" disabled={isSubmitting}>
                {editingId ? "Оновити" : "Додати"}
              </button>
              <button className="button button--secondary" type="button" onClick={resetForm} disabled={isSubmitting}>
                Очистити
              </button>
            </div>
          </form>

          <p className="status">{status}</p>
        </aside>

        <section className="products-panel">
          <div className="products-head">
            <div>
              <h2 className="section-title">Товари</h2>
              <p>Усього позицій: {products.length}</p>
            </div>
          </div>

          {products.length === 0 ? (
            <div className="empty-state">Поки що товарів немає. Додайте перший запис через форму ліворуч.</div>
          ) : (
            <div className="products-grid">
              {products.map((product) => (
                <article className="product-card" key={product.id}>
                  <div className="product-card__top">
                    <h3 className="product-card__title">{product.name}</h3>
                    <p className="product-card__price">{product.price} грн</p>
                  </div>
                  <p className="product-card__meta">Категорія: {product.category}</p>
                  <p className="product-card__description">{product.description}</p>
                  <div className="actions">
                    <button
                      className="button button--secondary"
                      type="button"
                      onClick={() => startEdit(product)}
                      disabled={isSubmitting}
                    >
                      Редагувати
                    </button>
                    <button
                      className="button button--danger"
                      type="button"
                      onClick={() => handleDelete(product.id)}
                      disabled={isSubmitting}
                    >
                      Видалити
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </section>
    </main>
  );
}
