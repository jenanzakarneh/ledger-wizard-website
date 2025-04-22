
import { useState, useMemo } from "react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import AccountsTable from "@/components/accounts/AccountsTable";
import AccountsHeader from "@/components/accounts/AccountsHeader";
import AccountTabs from "@/components/accounts/AccountTabs";
import AccountsToolbar from "@/components/accounts/AccountsToolbar";
import { accountsData, accountTabs, type AccountType } from "@/data/accountsData";
import { exportAccounts, type ExportFormat } from "@/utils/exportAccounts";

const ChartOfAccounts = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("Assets");

  const currentType =
    accountTabs.find((t) => t.label === activeTab)?.filter || null;

  const filteredAccountsData = useMemo(() => {
    if (!currentType) return accountsData;
    const filtered: Record<string, typeof accountsData[string]> = {};
    Object.entries(accountsData).forEach(([key, value]) => {
      if (value.type === currentType) {
        filtered[key] = value;
      }
    });
    return filtered;
  }, [currentType]);

  const handleExport = (format: ExportFormat) => {
    try {
      exportAccounts(filteredAccountsData, format);
      toast.success(`Chart of accounts exported successfully as ${format.toUpperCase()}`);
    } catch (error) {
      toast.error(`Failed to export chart of accounts as ${format.toUpperCase()}`);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F8FB]">
      <Header />
      <div className="flex flex-col lg:flex-row">
        <aside className="w-full lg:w-56 border-r border-b lg:border-b-0 bg-white">
          <Sidebar />
        </aside>
        <main className="flex-1 px-4 sm:px-6 lg:px-9 py-4 sm:py-6 lg:py-8">
          <AccountsHeader />
          <AccountTabs activeTab={activeTab} onTabChange={setActiveTab} />

          <div className="flex flex-col gap-2 mb-2">
            <div className="w-full">
              <Input
                type="search"
                placeholder="Search by ..."
                className="w-full sm:max-w-xs text-[15px] px-3 py-2 h-10 border border-[#E6E9F0] rounded-lg bg-white shadow-none ring-0 focus:ring-2 focus:ring-[#275DF5]/15 focus:border-[#275DF5]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <AccountsToolbar onExport={handleExport} />
          </div>

          <div className="rounded-xl bg-white shadow-[0_2px_10px_rgba(44,56,130,0.05)] border border-[#E6E9F0] p-0 mt-2 overflow-hidden">
            <AccountsTable
              accountsData={filteredAccountsData}
              searchQuery={searchQuery}
            />
          </div>
        </main>
      </div>
    </div>
  );
};

export default ChartOfAccounts;
