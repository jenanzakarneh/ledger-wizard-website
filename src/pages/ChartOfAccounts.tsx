
import { useState } from "react";
import { Download, Filter } from "lucide-react";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import AccountsTable from "@/components/accounts/AccountsTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";

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

const exportAccountsToCSV = () => {
  function flatten(accounts: Record<string, any>, result: any[] = [], level = 0) {
    Object.values(accounts).forEach((account: any) => {
      result.push({ ...account, level });
      if (account.children) {
        flatten(account.children, result, level + 1);
      }
    });
    return result;
  }
  const flatAccounts = flatten(accountsData);
  let csvContent = "Code,Name,Balance,Debits,Credits,Level\n";
  flatAccounts.forEach((account: any) => {
    const indentation = "  ".repeat(account.level);
    csvContent += `${account.code},"${indentation}${account.name}",${account.balance},${account.debits || 0},${account.credits || 0},${account.level}\n`;
  });
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', 'chart_of_accounts.csv');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const ChartOfAccounts = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div className="min-h-screen bg-[#f9fbff]">
      <Header />
      <div className="flex">
        <aside className="w-56 border-r h-full min-h-screen bg-white">
          <Sidebar />
        </aside>
        <main className="flex-1 p-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-white bg-[#2887e0] px-6 py-3 rounded shadow">
              Chart of Accounts
            </h1>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                onClick={exportAccountsToCSV}
                className="bg-[#2887e0] hover:bg-[#216db8] text-white border-none font-bold"
              >
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-4 mb-4">
            <Input
              type="search"
              placeholder="Search accounts..."
              className="w-60 rounded border border-blue-200 bg-white ring-2 ring-blue-100 focus:ring-[#2887e0] focus:border-blue-400"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  className="bg-[#f4f9ff] text-[#2887e0] border border-blue-200 hover:bg-[#e5f2ff] hover:text-[#1a60ad]"
                  size="sm"
                  variant="outline"
                >
                  <Filter className="mr-2 h-4 w-4" />
                  Options
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-64">
                <div className="space-y-2">
                  <h4 className="font-semibold text-[#2887e0]">Display Options</h4>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="show-details"
                      checked={showDetails}
                      onChange={() => setShowDetails((v) => !v)}
                    />
                    <label htmlFor="show-details" className="text-sm">
                      Show debits and credits
                    </label>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
          <div className="rounded-xl bg-white shadow border border-blue-100 p-4">
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
