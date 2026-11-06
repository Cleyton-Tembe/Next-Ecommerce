import { useEffect, useState } from "react";
import LoadingSpinner from "./Global/LoadingSpinner";
import ProductCard from "./ProductComponents/ProductCard";
import toast from "react-hot-toast";
import AxiosInstance from "@/lib/axio";
import { getErrorMessage } from "@/lib/getErrorMessage";
import type { Product } from "@/types/Product";

const PeopleAlsoBought = () => {
  const [recommendations, setRecommendations] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const res = await AxiosInstance.get("/products/recomended");
        console.log("boy your recommendation: ", res.data);
        setRecommendations(res.data.products);
      } catch (error) {
        toast.error(
          getErrorMessage(
            error,
            "An error occurred while fetching recommendations",
          ),
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecommendations();
  }, []);

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="mt-8">
      <h3 className="text-2xl font-semibold text-emerald-400">
        People also bought
      </h3>
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {recommendations.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
};
export default PeopleAlsoBought;
