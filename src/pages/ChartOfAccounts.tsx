
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
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";

// Hierarchical account data structure with debits/credits
const accountsData = {
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

interface AccountNode {
  code: string;
  name: string;
  type: string;
  balance: number;
  debits?: number;
  credits?: number;
  children?: Record<string, AccountNode>;
}

const getAccountTypeBadgeVariant = (type: string): string => {
  switch (type) {
    case "Asset":
      return "default";
    case "Liability":
      return "destructive";
    case "Equity":
      return "secondary";
    case "Revenue":
      return "outline"; 
    case "Expense":
      return "outline"; 
    default:
      return "default";
  }
};

const AccountItem = ({ 
  account, 
  searchQuery, 
  showDetails 
}: { 
  account: AccountNode; 
  searchQuery: string;
  showDetails: boolean;
}) => {
  const hasChildren = account.children && Object.keys(account.children).length > 0;
  
  // Hide accounts that don't match the search query (unless their children match)
  if (
    searchQuery && 
    !account.code.toLowerCase().includes(searchQuery.toLowerCase()) && 
    !account.name.toLowerCase().includes(searchQuery.toLowerCase())
  ) {
    // Check if any children match the search query
    let childrenMatch = false;
    if (hasChildren) {
      childrenMatch = Object.values(account.children!).some(
        child => 
          child.code.toLowerCase().includes(searchQuery.toLowerCase()) || 
          child.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    if (!childrenMatch) {
      return null;
    }
  }
  
  // Determine icon color based on account level and children
  const getFolderIconColor = () => {
    // Root accounts (1000, 2000, etc)
    if (account.code.length === 4 && account.code.endsWith('000')) {
      return "text-[#8B5CF6]"; // Vivid Purple for root accounts
    }
    // Sub-accounts with children
    if (hasChildren) {
      return "text-[#F97316]"; // Bright Orange for parent sub-accounts
    }
    // Sub-accounts without children (leaf nodes)
    return "text-[#0EA5E9]"; // Ocean Blue for leaf accounts
  };

  return (
    <AccordionItem value={account.code} className="border-none">
      <AccordionTrigger 
        className="hover:no-underline py-2 px-4"
        showChevron={hasChildren}
      >
        <div className="flex items-center gap-4 w-full">
          <FolderIcon className={`h-4 w-4 shrink-0 ${getFolderIconColor()}`} />
          <div className={`grid ${showDetails ? 'grid-cols-6' : 'grid-cols-4'} w-full gap-4`}>
            <span className="font-medium">{account.code}</span>
            <span className="font-medium">{account.name}</span>
            <span className="text-center">
              <Badge variant={getAccountTypeBadgeVariant(account.type)}>
                {account.type}
              </Badge>
            </span>
            <span className="text-right">${account.balance.toLocaleString()}</span>
            {showDetails && (
              <>
                <span className="text-right">${account.debits?.toLocaleString() || '0'}</span>
                <span className="text-right">${account.credits?.toLocaleString() || '0'}</span>
              </>
            )}
          </div>
        </div>
      </AccordionTrigger>
      {hasChildren && (
        <AccordionContent className="pl-8">
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
  );
};

const exportAccountsToCSV = () => {
  // Function to flatten hierarchical data
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
  
  // Generate CSV content
  const flatAccounts = flattenAccounts(accountsData);
  let csvContent = "Code,Name,Type,Balance,Debits,Credits,Level\n";
  
  flatAccounts.forEach((account) => {
    const level = (account as any).level;
    const indentation = "  ".repeat(level);
    csvContent += `${account.code},"${indentation}${account.name}",${account.type},${account.balance},${account.debits || 0},${account.credits || 0},${level}\n`;
  });
  
  // Create and download file
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
      Object.values(accounts).forEach(account => {
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
    <div className="min-h-screen">
      <Header />
      <div className="flex">
        <aside className="w-64 border-r bg-gray-50/40">
          <Sidebar />
        </aside>
        <main className="flex-1 p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold">Chart of Accounts</h1>
            <div className="flex items-center gap-2">
              <Button size="sm" onClick={expandAll}>Expand All</Button>
              <Button size="sm" onClick={collapseAll}>Collapse All</Button>
              <Button size="sm" onClick={exportAccountsToCSV} variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search accounts..."
                className="pl-8"
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

          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FolderIcon className="h-5 w-5" />
                Account Hierarchy
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <div className={`grid ${showDetails ? 'grid-cols-6' : 'grid-cols-4'} gap-4 py-2 px-4 border-b bg-muted/50`}>
                  <span className="font-medium">Code</span>
                  <span className="font-medium">Name</span>
                  <span className="font-medium text-center">Type</span>
                  <span className="text-right font-medium">Balance</span>
                  {showDetails && (
                    <>
                      <span className="text-right font-medium">Debits</span>
                      <span className="text-right font-medium">Credits</span>
                    </>
                  )}
                </div>
                <ScrollArea className="h-[500px]">
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

          <div className="text-sm text-muted-foreground mt-4">
            <h3 className="font-semibold mb-2">Legend</h3>
            <div className="flex flex-wrap gap-x-6 gap-y-2">
              <div className="flex items-center">
                <FolderIcon className="h-4 w-4 mr-2 text-[#8B5CF6]" />
                <span>Root Accounts</span>
              </div>
              <div className="flex items-center">
                <FolderIcon className="h-4 w-4 mr-2 text-[#F97316]" />
                <span>Parent Sub-Accounts</span>
              </div>
              <div className="flex items-center">
                <FolderIcon className="h-4 w-4 mr-2 text-[#0EA5E9]" />
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
