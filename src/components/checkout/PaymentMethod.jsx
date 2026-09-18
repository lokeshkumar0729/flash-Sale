import {
  Banknote,
  CreditCard,
  Landmark,
  Smartphone,
} from "lucide-react";

function PaymentMethod({ paymentMethod, setPaymentMethod }) {
  const paymentOptions = [
    {
      id: "upi",
      title: "UPI",
      description: "Pay using Google Pay, PhonePe, Paytm, etc.",
      icon: Smartphone,
    },
    {
      id: "card",
      title: "Credit / Debit Card",
      description: "Visa, Mastercard, RuPay and other cards",
      icon: CreditCard,
    },
    {
      id: "netbanking",
      title: "Net Banking",
      description: "Pay directly from your bank account",
      icon: Landmark,
    },
    {
      id: "cod",
      title: "Cash on Delivery",
      description: "Pay when your order is delivered",
      icon: Banknote,
    },
  ];

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      {/* Header */}
      <div>
        <h2 className="text-lg font-bold text-slate-900">
          Payment Method
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Choose how you would like to pay for your order.
        </p>
      </div>

      {/* Payment Options */}
      <div className="mt-6 space-y-3">
        {paymentOptions.map((option) => {
          const Icon = option.icon;
          const selected = paymentMethod === option.id;

          return (
            <button
              key={option.id}
              type="button"
              onClick={() => setPaymentMethod(option.id)}
              className={`flex w-full items-center gap-4 rounded-xl border p-4 text-left transition ${
                selected
                  ? "border-indigo-500 bg-indigo-50 ring-1 ring-indigo-500"
                  : "border-slate-200 bg-white hover:border-indigo-300 hover:bg-slate-50"
              }`}
            >
              {/* Icon */}
              <div
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
                  selected
                    ? "bg-indigo-600 text-white"
                    : "bg-slate-100 text-slate-600"
                }`}
              >
                <Icon size={21} />
              </div>

              {/* Text */}
              <div className="min-w-0 flex-1">
                <h3
                  className={`text-sm font-semibold ${
                    selected
                      ? "text-indigo-700"
                      : "text-slate-900"
                  }`}
                >
                  {option.title}
                </h3>

                <p className="mt-1 text-xs text-slate-500">
                  {option.description}
                </p>
              </div>

              {/* Radio */}
              <div
                className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${
                  selected
                    ? "border-indigo-600"
                    : "border-slate-300"
                }`}
              >
                {selected && (
                  <div className="h-2.5 w-2.5 rounded-full bg-indigo-600" />
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Payment Information */}
      <div className="mt-5 rounded-xl bg-slate-50 p-4">
        {paymentMethod === "upi" && (
          <div>
            <p className="text-sm font-semibold text-slate-800">
              UPI Payment
            </p>

            <p className="mt-1 text-xs text-slate-500">
              You will be redirected to your UPI app when
              payment processing is connected.
            </p>
          </div>
        )}

        {paymentMethod === "card" && (
          <div>
            <p className="text-sm font-semibold text-slate-800">
              Card Payment
            </p>

            <p className="mt-1 text-xs text-slate-500">
              Your card details will be securely processed
              when the payment gateway is connected.
            </p>
          </div>
        )}

        {paymentMethod === "netbanking" && (
          <div>
            <p className="text-sm font-semibold text-slate-800">
              Net Banking
            </p>

            <p className="mt-1 text-xs text-slate-500">
              Select your bank during the payment process.
            </p>
          </div>
        )}

        {paymentMethod === "cod" && (
          <div>
            <p className="text-sm font-semibold text-slate-800">
              Cash on Delivery
            </p>

            <p className="mt-1 text-xs text-slate-500">
              Pay in cash when your order reaches your
              delivery address.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default PaymentMethod;