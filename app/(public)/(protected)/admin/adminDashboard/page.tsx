import AdminDashboard from "@/components/adminDashboard/AdminDashboard";
import { getDashboardData } from "@/lib/actions/auth/dashboard.action";

export const dynamic = "force-dynamic"; // Ensure this page doesn't cache stale data

const AdminPage = async () => {
  // Fetch data directly on the server
  const data = await getDashboardData();

  return (
    <div className="w-full">
      {/* Pass the fetched data as props */}
      <AdminDashboard
        totals={data.totals}
        recentOrders={data.recentOrders}
        chartData={data.chartData}
      />
    </div>
  );
};

export default AdminPage;
