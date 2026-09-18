import { useState } from "react";

import AdminSidebar from "./AdminSidebar";
import AdminHeader from "./AdminHeader";

function AdminLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50">

      <AdminSidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="lg:pl-64">

        <AdminHeader
          onMenuClick={() => setSidebarOpen(true)}
        />

        <main className="p-4 sm:p-6 lg:p-8">
          {children}
        </main>

      </div>
    </div>
  );
}

export default AdminLayout;