
import { DollarSign, ArrowUpRight, ArrowDownRight, Activity } from "lucide-react";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import OverviewCard from "@/components/dashboard/OverviewCard";
import RecentTransactions from "@/components/dashboard/RecentTransactions";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <div className="flex">
        <aside className="w-64 border-r bg-gray-50/40">
          <Sidebar />
        </aside>
        <main className="flex-1 p-6">
          <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
          
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
            <OverviewCard
              title="Total Balance"
              value="$12,450"
              icon={<DollarSign className="h-4 w-4 text-muted-foreground" />}
            />
            <OverviewCard
              title="Income"
              value="$4,250"
              description="+20.1% from last month"
              icon={<ArrowUpRight className="h-4 w-4 text-green-600" />}
            />
            <OverviewCard
              title="Expenses"
              value="$2,800"
              description="+12% from last month"
              icon={<ArrowDownRight className="h-4 w-4 text-red-600" />}
            />
            <OverviewCard
              title="Active Accounts"
              value="6"
              icon={<Activity className="h-4 w-4 text-muted-foreground" />}
            />
          </div>

          <RecentTransactions />
        </main>
      </div>
    </div>
  );
};

export default Index;
