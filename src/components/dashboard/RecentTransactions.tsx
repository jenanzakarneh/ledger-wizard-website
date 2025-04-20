
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const RecentTransactions = () => {
  const transactions = [
    {
      id: 1,
      description: "Office Supplies",
      amount: "-$250.00",
      date: "2024-04-20",
      category: "Expenses",
    },
    {
      id: 2,
      description: "Client Payment",
      amount: "+$1,200.00",
      date: "2024-04-19",
      category: "Income",
    },
    {
      id: 3,
      description: "Utilities",
      amount: "-$145.00",
      date: "2024-04-18",
      category: "Expenses",
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Transactions</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Description</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell>{transaction.description}</TableCell>
                <TableCell>{transaction.category}</TableCell>
                <TableCell>{transaction.date}</TableCell>
                <TableCell className={`text-right ${
                  transaction.amount.startsWith("+") ? "text-green-600" : "text-red-600"
                }`}>
                  {transaction.amount}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default RecentTransactions;
