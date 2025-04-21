import { useState } from "react";
import { Download, Plus, Upload, Pencil, Folder, FolderOpen } from "lucide-react";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import AccountsTable from "@/components/accounts/AccountsTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const accountsData = {
  "1000": {
    code: "1000",
    name: "Assets",
    type: "Asset" as const,
    balance: 150000,
    debits: 175000,
    credits: 25000,
    children: {
      "1100": {
        code: "1100",
        name: "Cash",
        type: "Asset" as const,
        balance: 45000,
        debits: 55000,
        credits: 10000,
        children: {
          "1110": {
            code: "1110",
            name: "Bank Account",
            type: "Asset" as const,
            balance: 35000,
            debits: 40000,
            credits: 5000,
          },
          "1120": {
            code: "1120",
            name: "Petty Cash",
            type: "Asset" as const,
            balance: 10000,
            debits: 15000,
            credits: 5000,
          },
        },
      },
      "1200": {
        code: "1200",
        name: "Accounts Receivable",
        type: "Asset" as const,
        balance: 105000,
        debits: 120000,
        credits: 15000,
      },
    },
  },
  "2000": {
    code: "2000",
    name: "Liabilities",
    type: "Liability" as const,
    balance: 65000,
    debits: 15000,
    credits: 80000,
    children: {
      "2100": {
        code: "2100",
        name: "Accounts Payable",
        type: "Liability" as const,
        balance: 45000,
        debits: 10000,
        credits: 55000,
      },
      "2200": {
        code: "2200",
        name: "Notes Payable",
        type: "Liability" as const,
        balance: 20000,
        debits: 5000,
        credits: 25000,
      },
    },
  },
  "3000": {
    code: "3000",
    name: "Equity",
    type: "Equity" as const,
    balance: 85000,
    debits: 5000,
    credits: 90000,
    children: {
      "3100": {
        code: "3100",
        name: "Common Stock",
        type: "Equity" as const,
        balance: 50000,
        debits: 0,
        credits: 50000,
      },
      "3200": {
        code: "3200",
        name: "Retained Earnings",
        type: "Equity" as const,
        balance: 35000,
        debits: 5000,
        credits: 40000,
      },
    },
  },
  "4000": {
    code: "4000",
    name: "Revenue",
    type: "Revenue" as const,
    balance: 120000,
    debits: 0,
    credits: 120000,
    children: {
      "4100": {
        code: "4100",
        name: "Sales Revenue",
        type: "Revenue" as const,
        balance: 120000,
        debits: 0,
        credits: 120000,
      },
    },
  },
  "5000": {
    code: "5000",
    name: "Expenses",
    type: "Expense" as const,
    balance: 65000,
    debits: 65000,
    credits: 0,
    children: {
      "5100": {
        code: "5100",
        name: "Rent Expense",
        type: "Expense" as const,
        balance: 20000,
        debits: 20000,
        credits: 0,
      },
      "5200": {
        code: "5200",
        name: "Utilities Expense",
        type: "Expense" as const,
        balance: 15000,
        debits: 15000,
        credits: 0,
      },
      "5300": {
        code: "5300",
        name: "Salaries Expense",
        type: "Expense" as const,
        balance: 30000,
        debits: 30000,
        credits: 0,
      },
    },
  },
};

const accountTabs = [
  "All",
  "Assets",
  "Liabilities",
  "Capital & equity",
  "Income",
  "Trade Expenses",
  "Expenses",
];

const ChartOfAccounts = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("Assets");

  return (
    <div className="min-h-screen bg-[#F1F0FB]">
      <Header />
      <div className="flex">
        <aside className="w-56 border-r h-full min-h-screen bg-white">
          <Sidebar />
        </aside>
        <main className="flex-1 p-0 sm:p-8">
          {/* Page heading */}
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <h1 className="text-3xl font-bold text-[#1EAEDB] tracking-tight mb-2 sm:mb-0">Chart of Accounts</h1>
            <Button className="bg-[#1EAEDB] hover:bg-[#0FA0CE] text-white font-semibold px-5 py-2 rounded-lg shadow-sm" size="sm">
              <Plus className="mr-2" size={18} />
              Add Account
            </Button>
          </div>
          {/* Tabs */}
          <div className="mb-6">
            <div className="flex gap-3 rounded-lg bg-white p-2 w-fit shadow border border-[#D8E7F7]">
              {accountTabs.map((tab) => (
                <button
                  key={tab}
                  className={`px-5 py-2 rounded-lg text-[15px] font-semibold transition border-2
                    ${activeTab === tab ? "bg-[#1EAEDB] text-white border-[#1EAEDB] shadow" : "bg-white text-[#1EAEDB] border-transparent hover:border-[#C8C8C9]"}
                  `}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
          {/* Actions Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center mb-3 gap-2 sm:gap-0">
            <Input
              type="search"
              placeholder="Search chart of accounts"
              className="max-w-xs text-[15px] px-3 py-2 h-10 border border-[#C8C8C9] rounded-lg bg-white shadow-sm ring-0 focus:ring-2 focus:ring-[#1EAEDB]/20 focus:border-[#1EAEDB]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <div className="flex flex-row gap-2 ml-auto">
              <Button variant="outline" className="border-[#D8E7F7] bg-white text-[#1EAEDB] hover:bg-[#E8F6FC] px-4 py-2 rounded-lg font-semibold">
                <Upload className="mr-2" size={18} />
                Import
              </Button>
              <Button variant="outline" className="border-[#D8E7F7] bg-white text-[#1EAEDB] hover:bg-[#E8F6FC] px-4 py-2 rounded-lg font-semibold">
                <Download className="mr-2" size={18} />
                Export
              </Button>
            </div>
          </div>
          {/* Card/Table */}
          <div className="rounded-xl bg-white shadow-xl border border-[#D8E7F7] p-0 mt-2">
            <AccountsTable
              accountsData={accountsData}
              searchQuery={searchQuery}
            />
          </div>
        </main>
      </div>
    </div>
  );
};

export default ChartOfAccounts;
