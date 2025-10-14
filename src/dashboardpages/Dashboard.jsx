import Layout from "../components/dashboardcomponents/Sidebar";

export function Dashboard() {
  return (
    <div className="min-h-screen bg-background">
        {/* <Layout /> */}
      <h1 className="text-3xl font-bold text-foreground">Welcome to the Dashboard</h1>
      <p className="mt-4 text-foreground/70">This is your main dashboard where you can manage your inventory and view reports.</p>
      {/* Add more dashboard content here */}
    </div>
  );
}