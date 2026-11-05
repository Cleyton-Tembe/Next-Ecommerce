"use client";

import { motion } from "framer-motion";
import ProductCard from "@/components/ProductComponents/ProductCard";
import type { Product } from "@/types/Product";

interface AnimatedProductGridProps {
  products: Product[];
  category: string;
}

export default function AnimatedProductGrid({
  products,
  category,
}: AnimatedProductGridProps) {
  return (
    <>
      <motion.h1
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center text-4xl sm:text-5xl font-bold text-emerald-400 mb-8"
      >
        {category.charAt(0).toUpperCase() + category.slice(1)}
      </motion.h1>

      {products.length === 0 ? (
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-3xl font-semibold text-gray-300 text-center"
        >
          No products found
        </motion.h2>
      ) : (
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.15,
              },
            },
          }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          {products.map((product) => (
            <motion.div
              key={product._id}
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: { opacity: 1, y: 0 },
              }}
              transition={{ duration: 0.5 }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </motion.div>
      )}
    </>
  );
}
