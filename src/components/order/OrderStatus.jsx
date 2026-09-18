import {
  CheckCircle2,
  Package,
  Truck,
  MapPin,
} from "lucide-react";

function OrderStatus({ status }) {
  const steps = [
    {
      id: "PLACED",
      label: "Order Placed",
      icon: CheckCircle2,
    },
    {
      id: "CONFIRMED",
      label: "Confirmed",
      icon: Package,
    },
    {
      id: "SHIPPED",
      label: "Shipped",
      icon: Truck,
    },
    {
      id: "OUT_FOR_DELIVERY",
      label: "Out for Delivery",
      icon: MapPin,
    },
    {
      id: "DELIVERED",
      label: "Delivered",
      icon: CheckCircle2,
    },
  ];

  const currentIndex = steps.findIndex(
    (step) => step.id === status
  );

  return (
    <div className="w-full">
      <div className="flex items-start justify-between">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const completed = index <= currentIndex;

          return (
            <div
              key={step.id}
              className="relative flex flex-1 flex-col items-center"
            >
              {index !== steps.length - 1 && (
                <div
                  className={`absolute left-1/2 top-5 h-0.5 w-full ${
                    index < currentIndex
                      ? "bg-indigo-600"
                      : "bg-slate-200"
                  }`}
                />
              )}

              <div
                className={`relative z-10 flex h-10 w-10 items-center justify-center rounded-full border-2 ${
                  completed
                    ? "border-indigo-600 bg-indigo-600 text-white"
                    : "border-slate-200 bg-white text-slate-400"
                }`}
              >
                <Icon size={18} />
              </div>

              <p
                className={`mt-2 text-center text-[10px] font-medium sm:text-xs ${
                  completed
                    ? "text-indigo-600"
                    : "text-slate-400"
                }`}
              >
                {step.label}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default OrderStatus;