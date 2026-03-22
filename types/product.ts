export type Product = {
  id: string;
  name: string;
  price: number;
  category: string;
  description: string;
  createdAt: string;
  updatedAt: string;
};

export type ProductInput = {
  name: string;
  price: number;
  category: string;
  description: string;
};
