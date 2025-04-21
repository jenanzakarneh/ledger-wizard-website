import { useState } from "react";
import { FolderIcon, Download, Search, Filter } from "lucide-react";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";

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

interface AccountNode {
  code: string;
  name: string;
  type: "Asset" | "Liability" | "Equity" | "Revenue" | "Expense";
  balance: number;
  debits?: number;
  credits?: number;
  children?: Record<string, AccountNode>;
}

const getAggregatedTotals = (account: AccountNode): { debits: number, credits: number, balance: number } => {
  if (!account.children) {
    return {
      debits: account.debits ?? 0,
      credits: account.credits ?? 0,
      balance: account.balance ?? 0,
    };
  }
  let debits = 0;
  let credits = 0;
  let balance = 0;
  Object.values(account.children).forEach(child => {
    const agg = getAggregatedTotals(child);
    debits += agg.debits;
    credits += agg.credits;
    balance += agg.balance;
  });
  return { debits, credits, balance };
};

const getAccountTypeBadgeVariant = (type: AccountNode["type"]): "default" | "destructive" | "secondary" | "outline" => {
  switch (type) {
    case "Asset":
      return "default";
    case "Liability":
      return "destructive";
    case "Equity":
      return "secondary";
    case "Revenue":
    case "Expense":
      return "outline";
    default:
      return "default";
  }
};

const AccountItem = ({
  account,
  searchQuery,
  showDetails,
}: {
  account: AccountNode;
  searchQuery: string;
  showDetails: boolean;
}) => {
  const hasChildren = account.children && Object.keys(account.children).length > 0;

  if (
    searchQuery &&
    !account.code.toLowerCase().includes(searchQuery.toLowerCase()) &&
    !account.name.toLowerCase().includes(searchQuery.toLowerCase())
  ) {
    let childrenMatch = false;
    if (hasChildren) {
      childrenMatch = Object.values(account.children!).some(
        (child) =>
          child.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
          child.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    if (!childrenMatch) {
      return null;
    }
  }

  const { debits, credits, balance } = hasChildren
    ? getAggregatedTotals(account)
    : {
        debits: account.debits ?? 0,
        credits: account.credits ?? 0,
        balance: account.balance ?? 0,
      };

  return (
    <>
      <AccordionItem value={account.code} className="border-none bg-gradient-to-r from-[#f0f4ff] to-[#dbe5ff] rounded-xl shadow-md mb-3">
        <AccordionTrigger className="hover:no-underline py-3 px-6 rounded-xl" showChevron={hasChildren}>
          <div className="flex items-center gap-5 w-full">
            <span>
              <svg
                className={`h-5 w-5 shrink-0 ${
                  account.code.length === 4 && account.code.endsWith("000")
                    ? "text-purple-600"
                    : hasChildren
                    ? "text-orange-500"
                    : "text-sky-500"
                }`}
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path d="M3 7a2 2 0 0 1 2-2h2.34a2 2 0 0 0 1.34-.47l1.64-1.53a2 2 0 0 1 1.34-.47H19a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7z" />
              </svg>
            </span>
            <div className={`grid ${showDetails ? "grid-cols-5" : "grid-cols-3"} w-full items-center`}>
              <span className="font-bold tracking-wider text-gray-700 bg-white/60 px-3 py-1 rounded-l-lg border-r border-gray-300">{account.code}</span>
              <span className="font-semibold text-gray-800 px-3 py-1 border-r border-gray-300">{account.name}</span>
              <span className="text-right font-mono text-lg text-purple-700 px-3 py-1">{`$${balance.toLocaleString()}`}</span>
              {showDetails && (
                <>
                  <span className="text-right font-mono text-green-600 px-3 py-1 border-l border-gray-300">{`$${debits.toLocaleString()}`}</span>
                  <span className="text-right font-mono text-red-600 px-3 py-1 border-l border-gray-300 rounded-r-lg">{`$${credits.toLocaleString()}`}</span>
                </>
              )}
            </div>
          </div>
        </AccordionTrigger>
        {hasChildren && (
          <AccordionContent className="pl-10">
            <Accordion type="multiple" className="w-full">
              {Object.values(account.children).map((childAccount) => (
                <AccountItem
                  key={childAccount.code}
                  account={childAccount}
                  searchQuery={searchQuery}
                  showDetails={showDetails}
                />
              ))}
            </Accordion>
          </AccordionContent>
        )}
      </AccordionItem>
      <Separator className="my-0 border-t border-gray-300" />
    </>
  );
};

const exportAccountsToCSV = () => {
  const flattenAccounts = (
    accounts: Record<string, AccountNode>,
    result: AccountNode[] = [],
    level = 0
  ): AccountNode[] => {
    Object.values(accounts).forEach((account) => {
      const accountWithLevel = { ...account, level };
      result.push(accountWithLevel);
      
      if (account.children) {
        flattenAccounts(account.children, result, level + 1);
      }
    });
    
    return result;
  };
  
  const flatAccounts = flattenAccounts(accountsData);
  let csvContent = "Code,Name,Type,Balance,Debits,Credits,Level\n";
  
  flatAccounts.forEach((account) => {
    const level = (account as any).level;
    const indentation = "  ".repeat(level);
    csvContent += `${account.code},"${indentation}${account.name}",${account.type},${account.balance},${account.debits || 0},${account.credits || 0},${level}\n`;
  });
  
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', 'chart_of_accounts.csv');
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const ChartOfAccounts = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showDetails, setShowDetails] = useState(false);
  const [expandedAccounts, setExpandedAccounts] = useState<string[]>([]);

  const expandAll = () => {
    const getAllAccountCodes = (accounts: Record<string, AccountNode>): string[] => {
      let codes: string[] = [];
      Object.values(accounts).forEach((account) => {
        codes.push(account.code);
        if (account.children) {
          codes = [...codes, ...getAllAccountCodes(account.children)];
        }
      });
      return codes;
    };

    setExpandedAccounts(getAllAccountCodes(accountsData));
  };

  const collapseAll = () => {
    setExpandedAccounts([]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fdfcfb] to-[#e2d1c3]">
      <Header />
      <div className="flex">
        <aside className="w-64 border-r bg-gradient-to-b from-[#f8fafc] to-[#eef1f8]">
          <Sidebar />
        </aside>
        <main className="flex-1 p-8">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-4xl font-extrabold bg-gradient-to-r from-purple-600 to-orange-500 bg-clip-text text-transparent drop-shadow-lg">
              Chart of Accounts
            </h1>
            <div className="flex items-center gap-2">
              <Button size="sm" className="font-bold" onClick={expandAll}>
                Expand All
              </Button>
              <Button size="sm" className="font-bold" onClick={collapseAll}>
                Collapse All
              </Button>
              <Button size="sm" onClick={exportAccountsToCSV} variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search accounts..."
                className="pl-8 rounded-xl bg-white/80 shadow-md"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm">
                  <Filter className="mr-2 h-4 w-4" />
                  Options
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <h4 className="font-medium leading-none">Display Options</h4>
                    <p className="text-sm text-muted-foreground">
                      Configure how account information is displayed
                    </p>
                  </div>
                  <div className="grid gap-2">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="show-details"
                        checked={showDetails}
                        onChange={() => setShowDetails(!showDetails)}
                      />
                      <label htmlFor="show-details">Show debits and credits</label>
                    </div>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>

          <Card className="mb-6 bg-white/80 border-none shadow-lg rounded-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl font-bold text-[#221F26]">
                <FolderIcon className="h-6 w-6 text-purple-600" />
                Account Hierarchy
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-xl shadow-inner border border-gray-300 bg-gradient-to-tl from-[#f0f4ff] to-[#dbe5ff]">
                <div
                  className={
                    "grid " +
                    (showDetails ? "grid-cols-5" : "grid-cols-3") +
                    " gap-4 py-3 px-6 border-b border-gray-300 bg-white/70 rounded-t-xl"
                  }
                >
                  <span className="font-semibold tracking-wider text-gray-900 text-lg border-r border-gray-300 px-3 rounded-l-lg">Code</span>
                  <span className="font-semibold tracking-wider text-gray-900 text-lg border-r border-gray-300 px-3">Name</span>
                  <span className="text-right font-semibold tracking-wider text-gray-900 text-lg px-3">Balance</span>
                  {showDetails && (
                    <>
                      <span className="text-right font-semibold tracking-wider text-green-700 text-lg border-l border-gray-300 px-3">Debits</span>
                      <span className="text-right font-semibold tracking-wider text-red-700 text-lg border-l border-gray-300 px-3 rounded-r-lg">Credits</span>
                    </>
                  )}
                </div>
                <ScrollArea className="h-[500px] px-2 py-2">
                  <Accordion
                    type="multiple"
                    className="w-full"
                    value={expandedAccounts}
                    onValueChange={setExpandedAccounts}
                  >
                    {Object.values(accountsData).map((account) => (
                      <AccountItem
                        key={account.code}
                        account={account}
                        searchQuery={searchQuery}
                        showDetails={showDetails}
                      />
                    ))}
                  </Accordion>
                </ScrollArea>
              </div>
            </CardContent>
          </Card>

          <div className="text-sm text-muted-foreground mt-6">
            <h3 className="font-semibold mb-2">Legend</h3>
            <div className="flex flex-wrap gap-x-6 gap-y-2">
              <div className="flex items-center">
                <FolderIcon className="h-4 w-4 mr-2 text-purple-600" />
                <span>Root Accounts</span>
              </div>
              <div className="flex items-center">
                <FolderIcon className="h-4 w-4 mr-2 text-orange-500" />
                <span>Parent Sub-Accounts</span>
              </div>
              <div className="flex items-center">
                <FolderIcon className="h-4 w-4 mr-2 text-sky-500" />
                <span>Leaf Accounts</span>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ChartOfAccounts;
