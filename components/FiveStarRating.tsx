import { FaStar, FaStarHalfAlt, FaRegStar, FaStarHalf } from "react-icons/fa";

const FiveStarRating = ({
  rating,
  totalStars = 5,
  filledColor = "gold",
  emptyColor = "gray",
}) => {
  const starsArray = [];

  // Calculate the number of full, half, and empty stars
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating - fullStars >= 0.5;
  const emptyStars = totalStars - fullStars - (hasHalfStar ? 1 : 0);

  // 1. Render Full Stars
  for (let i = 0; i < fullStars; i++) {
    starsArray.push(<FaStar key={`full-${i}`} color={filledColor} />);
  }

  // 2. Render Half Star (if applicable)
  if (hasHalfStar) {
    starsArray.push(
      <div className="relative">
        <FaStar className="top-0 left-0 z-10 text-gray-300" key="full" />
        <FaStarHalf
          className="absolute top-0 left-0 z-20"
          key="half"
          color={filledColor}
        />
      </div>,
    );
  }

  // 3. Render Empty Stars
  for (let i = 0; i < emptyStars; i++) {
    // Note: FaRegStar (regular star) is used for the empty state.
    starsArray.push(
      <FaStar key={`empty-${i}`} className="top-0 left-0 z-10 text-gray-300" />,
    );
  }

  return (
    <div style={{ display: "flex", gap: "2px", alignItems: "center" }}>
      {starsArray}
    </div>
  );
};

export default FiveStarRating;
