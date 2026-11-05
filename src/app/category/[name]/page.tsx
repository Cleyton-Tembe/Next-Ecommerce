import AnimatedProductGrid from "@/components/AnimatedProductGrid";
import { GetProdByCategory } from "@/controller/product";

interface CategoryPageProps {
  params: Promise<{ name: string }>;
}

export default async function Categorypage({ params }: CategoryPageProps) {
  const { name: category } = await params;
  console.log(category);
  const products = await GetProdByCategory(category);

  return (
    <div className="min-h-screen">
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <AnimatedProductGrid products={products} category={category} />
      </div>
    </div>
  );
}
