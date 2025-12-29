"use client"; // Important if using icons or hooks
import React from "react";
import { FaStar, FaStarHalf, FaRegStar } from "react-icons/fa";

interface FiveStarRatingProps {
  rating: number;
  totalStars?: number;
  filledColor?: string;
  emptyColor?: string;
}

const FiveStarRating = ({
  rating,
  totalStars = 5,
  filledColor = "gold",
  emptyColor = "gray",
}: FiveStarRatingProps) => {
  const starsArray = [];
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating - fullStars >= 0.5;
  const emptyStars = totalStars - fullStars - (hasHalfStar ? 1 : 0);

  for (let i = 0; i < fullStars; i++) {
    starsArray.push(<FaStar key={`full-${i}`} color={filledColor} />);
  }

  if (hasHalfStar) {
    starsArray.push(
      <div className="relative" key="half-star">
        <FaStar className="text-gray-300" />
        <FaStarHalf
          className="absolute top-0 left-0 z-20"
          color={filledColor}
        />
      </div>,
    );
  }

  for (let i = 0; i < emptyStars; i++) {
    starsArray.push(<FaStar key={`empty-${i}`} className="text-gray-300" />);
  }

  return (
    <div style={{ display: "flex", gap: "2px", alignItems: "center" }}>
      {starsArray}
    </div>
  );
};

// ENSURE THIS LINE IS AT THE VERY BOTTOM
export default FiveStarRating;
