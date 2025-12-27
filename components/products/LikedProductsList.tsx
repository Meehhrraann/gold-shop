"use client";
import React, { useState } from "react";
import ProductCard from "./ProductCard";

const LikedProductsList = ({ initialProducts }) => {
  const [products, setProducts] = useState(initialProducts);

  return (
    <div className="grid w-full grid-cols-2 gap-3 bg-red-500 md:grid-cols-3 lg:grid-cols-4">
      {products.map((product, index) => (
        <div key={index}>
          <ProductCard setProducts={setProducts} product={product} />
        </div>
      ))}
    </div>
  );
};

export default LikedProductsList;
