import DashboardLayout from "@/components/layout/DashboardLayout";

export default function AdminDashboard() {
  return (
    <DashboardLayout>
      <div className="animate-fade-in-up">
        <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>
        <p className="text-muted">Admin controls and analytics coming soon...</p>
      </div>
    </DashboardLayout>
  );
}
