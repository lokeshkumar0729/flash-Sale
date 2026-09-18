import { useState } from "react";

import Navbar from "../../components/layout/Navbar";
import CustomerSidebar from "../../components/layout/CustomerSidebar";
import FlashSaleBanner from "../../components/product/FlashSaleBanner";
import CategoryList from "../../components/product/CategoryList";
import ProductGrid from "../../components/product/ProductGrid";

function Home() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50">

      {/* Navbar */}
      <Navbar
        onMenuClick={() => setSidebarOpen(true)}
      />

      <div className="mx-auto flex max-w-[1600px]">

        {/* Sidebar */}
        <CustomerSidebar
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        {/* Main Content */}
        <main className="min-w-0 flex-1 p-4 sm:p-6">

          <div className="mx-auto max-w-7xl space-y-7">

            {/* Flash Sale */}
            <FlashSaleBanner />

            {/* Categories */}
            <CategoryList />

            {/* Products */}
            <ProductGrid />

          </div>

        </main>

      </div>
    </div>
  );
}

export default Home;