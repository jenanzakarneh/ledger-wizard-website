
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

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

interface FlattenedAccount extends Omit<AccountNode, 'children'> {
  level: number;
}

const flattenAccountsHierarchical = (
  accounts: Record<string, AccountNode>,
  level = 0
): FlattenedAccount[] => {
  const flattened: FlattenedAccount[] = [];
  
  Object.values(accounts).forEach((account) => {
    flattened.push({
      code: account.code,
      name: account.name,
      type: account.type,
      balance: account.balance,
      debits: account.debits || 0,
      credits: account.credits || 0,
      level,
    });

    if (account.children) {
      flattened.push(...flattenAccountsHierarchical(account.children, level + 1));
    }
  });

  return flattened;
};

const exportToExcel = (accounts: Record<string, AccountNode>) => {
  const flattenedAccounts = flattenAccountsHierarchical(accounts);
  
  const excelData = flattenedAccounts.map(account => ({
    Code: account.code,
    Name: '  '.repeat(account.level) + account.name,
    Type: account.type,
    Balance: account.balance,
    Debits: account.debits,
    Credits: account.credits,
  }));

  const worksheet = XLSX.utils.json_to_sheet(excelData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Chart of Accounts');
  
  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  const excelFile = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  
  saveAs(excelFile, `chart-of-accounts-${new Date().toISOString().split('T')[0]}.xlsx`);
};

const exportToPDF = (accounts: Record<string, AccountNode>) => {
  const flattenedAccounts = flattenAccountsHierarchical(accounts);
  const doc = new jsPDF();

  doc.setFont('helvetica');
  doc.setFontSize(16);
  doc.text('Chart of Accounts', 14, 15);
  doc.setFontSize(10);
  doc.text(`Generated on ${new Date().toLocaleDateString()}`, 14, 22);

  const tableData = flattenedAccounts.map(account => [
    account.code,
    '  '.repeat(account.level) + account.name,
    account.type,
    account.balance.toLocaleString(),
    account.debits?.toLocaleString() || '0',
    account.credits?.toLocaleString() || '0',
  ]);

  doc.autoTable({
    head: [['Code', 'Name', 'Type', 'Balance', 'Debits', 'Credits']],
    body: tableData,
    startY: 25,
    styles: { fontSize: 8 },
    headStyles: { fillColor: [44, 53, 91] },
  });

  doc.save(`chart-of-accounts-${new Date().toISOString().split('T')[0]}.pdf`);
};

export type ExportFormat = 'pdf' | 'excel';

export const exportAccounts = (
  accounts: Record<string, AccountNode>,
  format: ExportFormat
) => {
  switch (format) {
    case 'excel':
      exportToExcel(accounts);
      break;
    case 'pdf':
      exportToPDF(accounts);
      break;
  }
};

