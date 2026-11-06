import type { Metadata } from "next";
import { notFound } from "next/navigation";
import AnimatedProductGrid from "@/components/AnimatedProductGrid";
import { GetProdByCategory } from "@/controller/product";
import { categoryTitle, isCategory } from "@/lib/helperFn";

interface CategoryPageProps {
  params: Promise<{ name: string }>;
}

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { name } = await params;
  return { title: `${categoryTitle(decodeURIComponent(name))} | E-Commerce` };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { name } = await params;
  const category = decodeURIComponent(name);

  if (!isCategory(category)) notFound();

  const products = await GetProdByCategory(category);

  return (
    <div className="min-h-screen">
      <div className="relative z-10 mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <AnimatedProductGrid products={products} category={category} />
      </div>
    </div>
  );
}
