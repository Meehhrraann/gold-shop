import React from "react";
import OrderCard from "./OrderCard";

const OrdersList = ({ initialOrders }) => {
  return (
    <div className="flex flex-col gap-10">
      {initialOrders.map((order, index) => (
        <OrderCard key={index} order={order} />
      ))}
    </div>
  );
};

export default OrdersList;
