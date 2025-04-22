
import { saveAs } from 'file-saver';

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

const flattenAccounts = (
  accounts: Record<string, AccountNode>,
  parentCode = ""
): AccountNode[] => {
  const flattened: AccountNode[] = [];
  
  Object.values(accounts).forEach((account) => {
    flattened.push({
      code: account.code,
      name: account.name,
      type: account.type,
      balance: account.balance,
      debits: account.debits || 0,
      credits: account.credits || 0,
    });

    if (account.children) {
      flattened.push(...flattenAccounts(account.children, account.code));
    }
  });

  return flattened;
};

export const exportAccountsToCSV = (accounts: Record<string, AccountNode>) => {
  const flattenedAccounts = flattenAccounts(accounts);
  
  const headers = ['Code', 'Name', 'Type', 'Balance', 'Debits', 'Credits'];
  const csvContent = [
    headers.join(','),
    ...flattenedAccounts.map(account => [
      account.code,
      `"${account.name}"`,
      account.type,
      account.balance,
      account.debits,
      account.credits
    ].join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
  saveAs(blob, `chart-of-accounts-${new Date().toISOString().split('T')[0]}.csv`);
};
