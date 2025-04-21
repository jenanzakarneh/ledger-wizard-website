import { useState } from "react";
import { Download, Filter, Plus, Upload, Pencil, Folder, FolderOpen } from "lucide-react";
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
  const [showDetails, setShowDetails] = useState(false);
  const [activeTab, setActiveTab] = useState("Assets");

  return (
    <div className="min-h-screen bg-[#f6f7fa]">
      <Header />
      <div className="flex">
        <aside className="w-56 border-r h-full min-h-screen bg-white">
          <Sidebar />
        </aside>
        <main className="flex-1 p-8">
          {/* Page heading */}
          <div className="mb-3 flex items-center justify-between">
            <h1 className="text-2xl font-semibold text-[#2C355B] tracking-tight">Chart of Accounts</h1>
          </div>
          {/* Tabs */}
          <div className="mb-3">
            <div className="flex gap-3">
              {accountTabs.map((tab) => (
                <button
                  key={tab}
                  className={`px-5 py-2 rounded-full text-sm font-semibold transition
                    ${activeTab === tab ? "bg-[#2C355B] text-white shadow-sm" : "bg-white text-[#2C355B] border"} 
                  `}
                  style={{
                    borderColor: "#E0E1E9",
                    borderWidth: activeTab === tab ? 0 : 1,
                  }}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
          {/* Actions Bar */}
          <div className="flex items-center mb-3">
            <div className="flex flex-1 items-center gap-2">
              <Input
                type="search"
                placeholder="Search by ..."
                className="max-w-xs text-[15px] px-3 py-2 h-9 border border-[#D2D7E3] rounded-md bg-white shadow-sm ring-0 focus:ring-2 focus:ring-[#2C355B]/30 focus:border-[#2C355B]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex flex-row gap-2 ml-auto">
              <Button className="bg-[#2C355B] hover:bg-[#212845] text-white font-semibold px-4 py-2 rounded-md shadow-sm" size="sm">
                <Plus className="mr-2" size={18} />
                Add Account
              </Button>
            </div>
          </div>
          <div className="mb-5 w-full px-2">
            <div className="flex flex-row flex-wrap items-center gap-2 bg-[#2C355B] w-full px-4 h-11 rounded-t-lg">
              <Button size="sm" variant="ghost" className="text-white font-semibold hover:bg-[#3F4866]/40 px-3 py-1">
                <Plus className="mr-2" size={16} /> Create
              </Button>
              <Button size="sm" variant="ghost" className="text-white font-semibold hover:bg-[#3F4866]/40 px-3 py-1">
                <Pencil className="mr-2" size={16} /> Update
              </Button>
              <Button size="sm" variant="ghost" className="text-white font-semibold hover:bg-[#3F4866]/40 px-3 py-1">
                <Plus className="mr-2" size={16} /> Merge
              </Button>
              <Button size="sm" variant="ghost" className="text-white font-semibold hover:bg-[#3F4866]/40 px-3 py-1">
                <Plus className="mr-2" size={16} /> Move
              </Button>
              <Button size="sm" variant="ghost" className="text-white font-semibold hover:bg-[#3F4866]/40 px-3 py-1">
                <Upload className="mr-2" size={16} /> Print
              </Button>
              <Button size="sm" variant="ghost" className="text-white font-semibold hover:bg-[#3F4866]/40 px-3 py-1">
                <Download className="mr-2" size={16} /> Export
              </Button>
              <Button size="sm" variant="ghost" className="text-white font-semibold hover:bg-[#3F4866]/40 px-3 py-1">
                <Upload className="mr-2" size={16} /> Import
              </Button>
              <Button size="sm" variant="ghost" className="text-white font-semibold hover:bg-[#3F4866]/40 px-3 py-1">
                <Plus className="mr-2" size={16} /> Shortcuts
              </Button>
              {/* Filler to align right */}
              <div className="flex-1" />
            </div>
          </div>
          {/* Card */}
          <div className="rounded-lg bg-white shadow border border-[#E0E1E9] p-0">
            <AccountsTable
              accountsData={accountsData}
              searchQuery={searchQuery}
              showDetails={showDetails}
            />
          </div>
        </main>
      </div>
    </div>
  );
};

export default ChartOfAccounts;
