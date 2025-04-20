import { FolderIcon } from "lucide-react";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

// Hierarchical account data structure
const accountsData = {
  "1000": {
    code: "1000",
    name: "Assets",
    type: "Asset",
    balance: 150000,
    children: {
      "1100": {
        code: "1100",
        name: "Cash",
        type: "Asset",
        balance: 45000,
        children: {
          "1110": {
            code: "1110",
            name: "Bank Account",
            type: "Asset",
            balance: 35000,
          },
          "1120": {
            code: "1120",
            name: "Petty Cash",
            type: "Asset",
            balance: 10000,
          },
        },
      },
      "1200": {
        code: "1200",
        name: "Accounts Receivable",
        type: "Asset",
        balance: 105000,
      },
    },
  },
  "2000": {
    code: "2000",
    name: "Liabilities",
    type: "Liability",
    balance: 65000,
    children: {
      "2100": {
        code: "2100",
        name: "Accounts Payable",
        type: "Liability",
        balance: 45000,
      },
      "2200": {
        code: "2200",
        name: "Notes Payable",
        type: "Liability",
        balance: 20000,
      },
    },
  },
};

interface AccountNode {
  code: string;
  name: string;
  type: string;
  balance: number;
  children?: Record<string, AccountNode>;
}

const AccountItem = ({ account }: { account: AccountNode }) => {
  const hasChildren = account.children && Object.keys(account.children).length > 0;
  
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
      <AccordionTrigger className="hover:no-underline py-2 px-4">
        <div className="flex items-center gap-4 w-full">
          <FolderIcon className={`h-4 w-4 shrink-0 ${getFolderIconColor()}`} />
          <div className="grid grid-cols-4 w-full gap-4">
            <span className="font-medium">{account.code}</span>
            <span className="font-medium">{account.name}</span>
            <span className="text-muted-foreground">{account.type}</span>
            <span className="text-right">${account.balance.toLocaleString()}</span>
          </div>
        </div>
      </AccordionTrigger>
      {hasChildren && (
        <AccordionContent className="pl-8">
          <Accordion type="multiple" className="w-full">
            {Object.values(account.children).map((childAccount) => (
              <AccountItem key={childAccount.code} account={childAccount} />
            ))}
          </Accordion>
        </AccordionContent>
      )}
    </AccordionItem>
  );
};

const ChartOfAccounts = () => {
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
                <div className="grid grid-cols-4 gap-4 py-2 px-4 border-b bg-muted/50">
                  <span className="font-medium">Code</span>
                  <span className="font-medium">Name</span>
                  <span className="font-medium">Type</span>
                  <span className="text-right font-medium">Balance</span>
                </div>
                <Accordion type="multiple" className="w-full">
                  {Object.values(accountsData).map((account) => (
                    <AccountItem key={account.code} account={account} />
                  ))}
                </Accordion>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
};

export default ChartOfAccounts;
