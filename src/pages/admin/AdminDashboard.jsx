import {
  ArrowUpRight,
  Box,
  IndianRupee,
  ShoppingCart,
  Users,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import AdminLayout from "../../components/admin/AdminLayout";
import StatCard from "../../components/admin/StatCard";

const salesData = [
  { name: "Mon", sales: 4200 },
  { name: "Tue", sales: 6800 },
  { name: "Wed", sales: 5100 },
  { name: "Thu", sales: 8200 },
  { name: "Fri", sales: 7400 },
  { name: "Sat", sales: 9600 },
  { name: "Sun", sales: 8900 },
];

const recentOrders = [
  {
    id: "FS10241",
    customer: "Rahul Sharma",
    product: "Wireless Headphones",
    amount: "₹1,999",
    status: "DELIVERED",
  },
  {
    id: "FS10240",
    customer: "Priya Reddy",
    product: "Smart Watch",
    amount: "₹2,499",
    status: "SHIPPED",
  },
  {
    id: "FS10239",
    customer: "Arjun Kumar",
    product: "Running Shoes",
    amount: "₹1,499",
    status: "CONFIRMED",
  },
  {
    id: "FS10238",
    customer: "Sneha Patel",
    product: "Travel Backpack",
    amount: "₹899",
    status: "PLACED",
  },
];

const topProducts = [
  {
    name: "Wireless Headphones",
    category: "Electronics",
    sold: 124,
  },
  {
    name: "Running Shoes",
    category: "Fashion",
    sold: 98,
  },
  {
    name: "Smart Watch",
    category: "Electronics",
    sold: 87,
  },
  {
    name: "Travel Backpack",
    category: "Accessories",
    sold: 64,
  },
];

const statusClasses = {
  DELIVERED: "bg-green-50 text-green-600",
  SHIPPED: "bg-blue-50 text-blue-600",
  CONFIRMED: "bg-indigo-50 text-indigo-600",
  PLACED: "bg-yellow-50 text-yellow-600",
};

function AdminDashboard() {
  return (
    <AdminLayout>

      {/* Heading */}
      <div className="mb-7">
        <p className="text-sm font-medium text-indigo-600">
          Overview
        </p>

        <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
          Dashboard
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Monitor your FlashSale store performance.
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

        <StatCard
          title="Total Revenue"
          value="₹1,24,580"
          subtitle="+12.5% from last month"
          icon={IndianRupee}
          iconClass="bg-green-100 text-green-600"
        />

        <StatCard
          title="Total Orders"
          value="1,248"
          subtitle="+8.2% from last month"
          icon={ShoppingCart}
          iconClass="bg-indigo-100 text-indigo-600"
        />

        <StatCard
          title="Total Products"
          value="486"
          subtitle="32 low-stock products"
          icon={Box}
          iconClass="bg-orange-100 text-orange-600"
        />

        <StatCard
          title="Total Users"
          value="8,642"
          subtitle="+15.4% from last month"
          icon={Users}
          iconClass="bg-purple-100 text-purple-600"
        />

      </div>

      {/* Charts */}
      <div className="mt-6 grid gap-6 xl:grid-cols-3">

        {/* Sales */}
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm xl:col-span-2 sm:p-6">

          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-bold text-slate-900">
                Sales Overview
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                Sales performance for this week
              </p>
            </div>

            <button
              type="button"
              className="flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-700"
            >
              View Report
              <ArrowUpRight size={14} />
            </button>
          </div>

          <div className="mt-6 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={salesData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                />

                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                />

                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(value) =>
                    `₹${value / 1000}k`
                  }
                />

                <Tooltip
                  formatter={(value) => [
                    `₹${value.toLocaleString("en-IN")}`,
                    "Sales",
                  ]}
                />

                <Bar
                  dataKey="sales"
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* Order Status */}
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">

          <h2 className="font-bold text-slate-900">
            Order Status
          </h2>

          <p className="mt-1 text-xs text-slate-500">
            Current order distribution
          </p>

          <div className="mt-6 space-y-5">

            <div>
              <div className="mb-2 flex justify-between text-xs">
                <span className="font-medium text-slate-600">
                  Delivered
                </span>
                <span className="font-bold text-slate-900">
                  58%
                </span>
              </div>

              <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                <div className="h-full w-[58%] rounded-full bg-green-500" />
              </div>
            </div>

            <div>
              <div className="mb-2 flex justify-between text-xs">
                <span className="font-medium text-slate-600">
                  Shipped
                </span>
                <span className="font-bold text-slate-900">
                  21%
                </span>
              </div>

              <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                <div className="h-full w-[21%] rounded-full bg-blue-500" />
              </div>
            </div>

            <div>
              <div className="mb-2 flex justify-between text-xs">
                <span className="font-medium text-slate-600">
                  Confirmed
                </span>
                <span className="font-bold text-slate-900">
                  13%
                </span>
              </div>

              <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                <div className="h-full w-[13%] rounded-full bg-indigo-500" />
              </div>
            </div>

            <div>
              <div className="mb-2 flex justify-between text-xs">
                <span className="font-medium text-slate-600">
                  Placed
                </span>
                <span className="font-bold text-slate-900">
                  8%
                </span>
              </div>

              <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                <div className="h-full w-[8%] rounded-full bg-yellow-500" />
              </div>
            </div>

          </div>
        </section>
      </div>

      {/* Tables */}
      <div className="mt-6 grid gap-6 xl:grid-cols-3">

        {/* Recent Orders */}
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm xl:col-span-2">

          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 sm:px-6">
            <div>
              <h2 className="font-bold text-slate-900">
                Recent Orders
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                Latest customer orders
              </p>
            </div>

            <button
              type="button"
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-700"
            >
              View All
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[650px]">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50 text-left">
                  <th className="px-5 py-3 text-xs font-semibold text-slate-500">
                    Order
                  </th>
                  <th className="px-5 py-3 text-xs font-semibold text-slate-500">
                    Customer
                  </th>
                  <th className="px-5 py-3 text-xs font-semibold text-slate-500">
                    Product
                  </th>
                  <th className="px-5 py-3 text-xs font-semibold text-slate-500">
                    Amount
                  </th>
                  <th className="px-5 py-3 text-xs font-semibold text-slate-500">
                    Status
                  </th>
                </tr>
              </thead>

              <tbody>
                {recentOrders.map((order) => (
                  <tr
                    key={order.id}
                    className="border-b border-slate-100 last:border-0"
                  >
                    <td className="px-5 py-4 text-xs font-bold text-slate-900">
                      {order.id}
                    </td>

                    <td className="px-5 py-4 text-sm text-slate-600">
                      {order.customer}
                    </td>

                    <td className="px-5 py-4 text-sm text-slate-600">
                      {order.product}
                    </td>

                    <td className="px-5 py-4 text-sm font-bold text-slate-900">
                      {order.amount}
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${
                          statusClasses[order.status]
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Top Products */}
        <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">

          <div className="border-b border-slate-100 px-5 py-4">
            <h2 className="font-bold text-slate-900">
              Top Products
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              Best selling products
            </p>
          </div>

          <div className="divide-y divide-slate-100">
            {topProducts.map((product, index) => (
              <div
                key={product.name}
                className="flex items-center gap-3 px-5 py-4"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-xs font-bold text-slate-500">
                  #{index + 1}
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-slate-900">
                    {product.name}
                  </p>

                  <p className="mt-0.5 text-xs text-slate-400">
                    {product.category}
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-sm font-bold text-slate-900">
                    {product.sold}
                  </p>

                  <p className="text-[10px] text-slate-400">
                    sold
                  </p>
                </div>
              </div>
            ))}
          </div>

        </section>
      </div>
    </AdminLayout>
  );
}

export default AdminDashboard;