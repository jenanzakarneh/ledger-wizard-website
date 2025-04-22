import { useState, useMemo } from "react";
import { Download, Plus, Upload, FileExport } from "lucide-react";
import { toast } from "sonner";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import AccountsTable from "@/components/accounts/AccountsTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useIsMobile } from "@/hooks/use-mobile";
import { exportAccountsToCSV } from "@/utils/exportAccounts";

type AccountType = "Asset" | "Liability" | "Equity" | "Revenue" | "Expense";
interface AccountNode {
  code: string;
  name: string;
  type: AccountType;
  balance: number;
  debits?: number;
  credits?: number;
  children?: Record<string, AccountNode>;
}

const accountsData: Record<string, AccountNode> = {
  "1000": {
    code: "1000",
    name: "Assets",
    type: "Asset",
    balance: 150000,
    debits: 175000,
    credits: 25000,
    children: {
      "1100": {
        code: "1100",
        name: "Cash",
        type: "Asset",
        balance: 45000,
        debits: 55000,
        credits: 10000,
        children: {
          "1110": {
            code: "1110",
            name: "Bank Account",
            type: "Asset",
            balance: 35000,
            debits: 40000,
            credits: 5000,
          },
          "1120": {
            code: "1120",
            name: "Petty Cash",
            type: "Asset",
            balance: 10000,
            debits: 15000,
            credits: 5000,
          },
        },
      },
      "1200": {
        code: "1200",
        name: "Accounts Receivable",
        type: "Asset",
        balance: 105000,
        debits: 120000,
        credits: 15000,
      },
    },
  },
  "2000": {
    code: "2000",
    name: "Liabilities",
    type: "Liability",
    balance: 65000,
    debits: 15000,
    credits: 80000,
    children: {
      "2100": {
        code: "2100",
        name: "Accounts Payable",
        type: "Liability",
        balance: 45000,
        debits: 10000,
        credits: 55000,
      },
      "2200": {
        code: "2200",
        name: "Notes Payable",
        type: "Liability",
        balance: 20000,
        debits: 5000,
        credits: 25000,
      },
    },
  },
  "3000": {
    code: "3000",
    name: "Equity",
    type: "Equity",
    balance: 85000,
    debits: 5000,
    credits: 90000,
    children: {
      "3100": {
        code: "3100",
        name: "Common Stock",
        type: "Equity",
        balance: 50000,
        debits: 0,
        credits: 50000,
      },
      "3200": {
        code: "3200",
        name: "Retained Earnings",
        type: "Equity",
        balance: 35000,
        debits: 5000,
        credits: 40000,
      },
    },
  },
  "4000": {
    code: "4000",
    name: "Revenue",
    type: "Revenue",
    balance: 120000,
    debits: 0,
    credits: 120000,
    children: {
      "4100": {
        code: "4100",
        name: "Sales Revenue",
        type: "Revenue",
        balance: 120000,
        debits: 0,
        credits: 120000,
      },
    },
  },
  "5000": {
    code: "5000",
    name: "Expenses",
    type: "Expense",
    balance: 65000,
    debits: 65000,
    credits: 0,
    children: {
      "5100": {
        code: "5100",
        name: "Rent Expense",
        type: "Expense",
        balance: 20000,
        debits: 20000,
        credits: 0,
      },
      "5200": {
        code: "5200",
        name: "Utilities Expense",
        type: "Expense",
        balance: 15000,
        debits: 15000,
        credits: 0,
      },
      "5300": {
        code: "5300",
        name: "Salaries Expense",
        type: "Expense",
        balance: 30000,
        debits: 30000,
        credits: 0,
      },
    },
  },
};

const accountTabs = [
  { label: "All", filter: null },
  { label: "Assets", filter: "Asset" },
  { label: "Liabilities", filter: "Liability" },
  { label: "Capital & equity", filter: "Equity" },
  { label: "Income", filter: "Revenue" },
  { label: "Trade Expenses", filter: "Expense" },
  { label: "Expenses", filter: "Expense" },
];

function filterAccountsByType(
  accounts: Record<string, AccountNode>,
  type: AccountType | null
): Record<string, AccountNode> {
  if (!type) return accounts;
  const filtered: Record<string, AccountNode> = {};
  Object.entries(accounts).forEach(([key, value]) => {
    let children =
      value.children &&
      filterAccountsByType(value.children, type);
    if (value.type === type || (children && Object.keys(children).length > 0)) {
      filtered[key] = {
        ...value,
        children: children && Object.keys(children).length > 0 ? children : undefined,
      };
    }
  });
  return filtered;
}

const ChartOfAccounts = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("Assets");
  const isMobile = useIsMobile();

  const currentType =
    accountTabs.find((t) => t.label === activeTab)?.filter || null;

  const filteredAccountsData = useMemo(() => {
    return currentType ? filterAccountsByType(accountsData, currentType as AccountType) : accountsData;
  }, [currentType]);

  const handleExport = () => {
    try {
      exportAccountsToCSV(filteredAccountsData);
      toast.success("Chart of accounts exported successfully");
    } catch (error) {
      toast.error("Failed to export chart of accounts");
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
          <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <h1 className="text-2xl sm:text-3xl font-bold text-[#262B42] tracking-tight">Chart of Accounts</h1>
            <Button
              className="w-full sm:w-auto bg-[#275DF5] hover:bg-[#1740A8] text-white font-semibold px-6 py-2 rounded-lg shadow-none text-base"
              size="sm"
            >
              <Plus className="mr-2" size={18} />
              Add Account
            </Button>
          </div>

          <div className="mb-4 overflow-x-auto">
            <div className="flex flex-wrap gap-0.5 border border-[#E6E9F0] rounded-lg bg-[#F7F8FB] px-1 py-[3px] w-fit shadow-none min-w-0">
              {accountTabs.map((tab) => (
                <button
                  key={tab.label}
                  className={`
                    flex items-center px-3 sm:px-5 py-2 min-w-[90px] sm:min-w-[110px] rounded-md text-[14px] sm:text-[15px] font-medium transition-all border whitespace-nowrap
                    ${
                      activeTab === tab.label
                        ? "bg-[#275DF5] text-white border-[#275DF5] shadow"
                        : "bg-white text-[#24243A] border-transparent hover:text-[#275DF5] hover:bg-[#EFF3FF] hover:border-[#C3DAFE]"
                    }
                  `}
                  style={{
                    fontWeight: activeTab === tab.label ? 600 : 500,
                  }}
                  onClick={() => setActiveTab(tab.label)}
                  type="button"
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

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

            <div className="flex overflow-x-auto gap-1 bg-[#242B43] rounded-t-md rounded-b-none shadow-none min-h-[42px]">
              {[
                { label: "Create", icon: Plus },
                { label: "Update", icon: null },
                { label: "Merge", icon: null },
                { label: "Move", icon: null },
                { label: "Print", icon: null },
                { label: "Export", icon: FileExport, onClick: handleExport },
                { label: "Import", icon: Upload },
                { label: "Shortcuts", icon: null },
              ].map((action) => (
                <Button
                  key={action.label}
                  variant="ghost"
                  size={isMobile ? "sm" : "default"}
                  className="text-white font-medium px-4 sm:px-6 py-2 rounded-none bg-transparent hover:bg-[#1E253B] focus:bg-[#1E253B] whitespace-nowrap"
                  style={{ borderRadius: 0, border: "none", boxShadow: "none" }}
                  type="button"
                  tabIndex={-1}
                  onClick={action.onClick}
                  disabled={action.label === "Update" || action.label === "Merge" || action.label === "Move" || action.label === "Shortcuts"}
                >
                  {action.icon && <action.icon size={isMobile ? 14 : 16} className="mr-1" />}
                  <span className="text-[13px] sm:text-[14px]">{action.label}</span>
                </Button>
              ))}
            </div>
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
