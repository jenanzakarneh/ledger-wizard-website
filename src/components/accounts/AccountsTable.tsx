
import React from "react";

interface AccountNode {
  code: string;
  name: string;
  type: "Asset" | "Liability" | "Equity" | "Revenue" | "Expense";
  balance: number;
  debits?: number;
  credits?: number;
  children?: Record<string, AccountNode>;
}

function flattenAccounts(
  accounts: Record<string, AccountNode>,
  result: AccountNode[] = [],
  parentLevel = 0
): { account: AccountNode; level: number }[] {
  let flattened: { account: AccountNode; level: number }[] = [];
  Object.values(accounts).forEach((account) => {
    flattened.push({ account, level: parentLevel });
    if (account.children) {
      flattened = [
        ...flattened,
        ...flattenAccounts(account.children, [], parentLevel + 1),
      ];
    }
  });
  return flattened;
}

interface AccountsTableProps {
  accountsData: Record<string, AccountNode>;
  searchQuery: string;
  showDetails: boolean;
}

const AccountsTable: React.FC<AccountsTableProps> = ({
  accountsData,
  searchQuery,
  showDetails,
}) => {
  const rows = flattenAccounts(accountsData);

  const filteredRows = rows.filter(({ account }) => {
    if (!searchQuery) return true;
    const s = searchQuery.toLowerCase();
    return (
      account.code.toLowerCase().includes(s) ||
      account.name.toLowerCase().includes(s)
    );
  });

  return (
    <div className="overflow-x-auto border rounded bg-white mt-2">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gray-50 border-b">
            <th className="p-2 text-left font-semibold text-gray-700">Code</th>
            <th className="p-2 text-left font-semibold text-gray-700">Name</th>
            <th className="p-2 text-right font-semibold text-gray-700">Balance</th>
            {showDetails && (
              <>
                <th className="p-2 text-right font-semibold text-gray-700">Debits</th>
                <th className="p-2 text-right font-semibold text-gray-700">Credits</th>
              </>
            )}
          </tr>
        </thead>
        <tbody>
          {filteredRows.map(({ account, level }, idx) => (
            <tr
              key={account.code}
              className="border-b last:border-0 hover:bg-gray-50 transition-colors"
            >
              <td className="p-2 font-mono text-gray-800">{account.code}</td>
              <td className="p-2 text-gray-900" style={{ paddingLeft: `${level * 20}px` }}>
                {account.name}
              </td>
              <td className="p-2 text-right font-mono text-gray-900">
                ${account.balance.toLocaleString()}
              </td>
              {showDetails && (
                <>
                  <td className="p-2 text-right text-green-700 font-mono">
                    ${account.debits?.toLocaleString() ?? "0"}
                  </td>
                  <td className="p-2 text-right text-red-700 font-mono">
                    ${account.credits?.toLocaleString() ?? "0"}
                  </td>
                </>
              )}
            </tr>
          ))}
          {filteredRows.length === 0 && (
            <tr>
              <td colSpan={showDetails ? 5 : 3} className="p-4 text-center text-gray-500">No accounts found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AccountsTable;
