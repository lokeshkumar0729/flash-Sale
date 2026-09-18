import { createContext, useContext, useState } from "react";

const OrderContext = createContext();

export function OrderProvider({ children }) {
  const [orders, setOrders] = useState([]);

  const addOrder = ({
    items,
    address,
    paymentMethod,
    subtotal,
    savings,
    deliveryCharge,
    total,
  }) => {
    const newOrder = {
      id: `FS${Date.now()}`,

      date: new Date().toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),

      status: "PLACED",

      items: items.map((item) => ({
        ...item,
      })),

      address: {
        ...address,
      },

      paymentMethod,

      subtotal,
      savings,
      deliveryCharge,
      total,
    };

    setOrders((currentOrders) => [
      newOrder,
      ...currentOrders,
    ]);

    return newOrder;
  };

  const getOrderById = (orderId) => {
    return orders.find((order) => order.id === orderId);
  };

  const clearOrders = () => {
    setOrders([]);
  };

  const value = {
    orders,
    addOrder,
    getOrderById,
    clearOrders,
  };

  return (
    <OrderContext.Provider value={value}>
      {children}
    </OrderContext.Provider>
  );
}

export function useOrders() {
  const context = useContext(OrderContext);

  if (!context) {
    throw new Error(
      "useOrders must be used inside OrderProvider"
    );
  }

  return context;
}