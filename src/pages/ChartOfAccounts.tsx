
import { ChartBar } from "lucide-react";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

// Sample data - in a real app, this would come from your database
const accounts = [
  { code: "1000", name: "Assets", type: "Asset", balance: 150000 },
  { code: "1100", name: "Cash", type: "Asset", balance: 45000 },
  { code: "2000", name: "Liabilities", type: "Liability", balance: 65000 },
  { code: "3000", name: "Equity", type: "Equity", balance: 85000 },
  { code: "4000", name: "Revenue", type: "Revenue", balance: 120000 },
  { code: "5000", name: "Expenses", type: "Expense", balance: 35000 },
];

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
                <ChartBar className="h-5 w-5" />
                Account Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Account Code</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead className="text-right">Balance</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {accounts.map((account) => (
                    <TableRow key={account.code}>
                      <TableCell>{account.code}</TableCell>
                      <TableCell>{account.name}</TableCell>
                      <TableCell>{account.type}</TableCell>
                      <TableCell className="text-right">
                        ${account.balance.toLocaleString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
};

export default ChartOfAccounts;
