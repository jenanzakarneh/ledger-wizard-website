import React, { useState, useMemo, Fragment } from "react";
import { ChevronDown, Folder, FolderOpen } from "lucide-react";

interface AccountNode {
  code: string;
  name: string;
  type: "Asset" | "Liability" | "Equity" | "Revenue" | "Expense";
  balance: number;
  debits?: number;
  credits?: number;
  children?: Record<string, AccountNode>;
}

interface AccountsTableProps {
  accountsData: Record<string, AccountNode>;
  searchQuery: string;
}

type FlattenedAccount = {
  account: AccountNode;
  level: number;
  parentCodes: string[];
  path: string;
  hasChildren: boolean;
};

function flattenAccountsTree(
  accounts: Record<string, AccountNode>,
  expanded: Set<string>,
  parentCodes: string[] = [],
  level = 0,
  pathPrefix = ""
): FlattenedAccount[] {
  let flat: FlattenedAccount[] = [];
  Object.values(accounts).forEach((account) => {
    const codePath = [...parentCodes, account.code];
    const path = codePath.join("/");
    const hasChildren = !!account.children && Object.keys(account.children).length > 0;
    flat.push({
      account,
      level,
      parentCodes,
      path,
      hasChildren,
    });
    if (
      hasChildren &&
      expanded.has(path)
    ) {
      flat = [
        ...flat,
        ...flattenAccountsTree(account.children!, expanded, codePath, level + 1, path)
      ];
    }
  });
  return flat;
}

const getAllExpandablePaths = (accounts: Record<string, AccountNode>, parentCodes: string[] = []): string[] => {
  let paths: string[] = [];
  Object.values(accounts).forEach((account) => {
    const codePath = [...parentCodes, account.code];
    const path = codePath.join("/");
    if (account.children && Object.keys(account.children).length > 0) {
      paths.push(path);
      paths = paths.concat(getAllExpandablePaths(account.children, codePath));
    }
  });
  return paths;
};

const AccountsTable: React.FC<AccountsTableProps> = ({
  accountsData,
  searchQuery,
}) => {
  const [expanded, setExpanded] = useState<Set<string>>(
    () => new Set(Object.keys(accountsData).map((k) => k))
  );

  const allExpandablePaths = useMemo(
    () => getAllExpandablePaths(accountsData),
    [accountsData]
  );

  const handleToggle = (path: string) => {
    setExpanded((prev) => {
      const copy = new Set(prev);
      if (copy.has(path)) {
        copy.delete(path);
      } else {
        copy.add(path);
      }
      return copy;
    });
  };

  const handleCollapseAll = () => setExpanded(new Set());
  const handleExpandAll = () => setExpanded(new Set(allExpandablePaths));

  const rows = useMemo(
    () => flattenAccountsTree(accountsData, expanded),
    [accountsData, expanded]
  );

  const filteredRows = useMemo(() => {
    if (!searchQuery) return rows;
    const s = searchQuery.toLowerCase();
    return rows.filter(({ account }) =>
      account.code.toLowerCase().includes(s) ||
      account.name.toLowerCase().includes(s)
    );
  }, [rows, searchQuery]);

  return (
    <div>
      {/* Table */}
      <div className="overflow-x-auto rounded-b-lg">
        {/* Table header matching reference */}
        <div className="grid grid-cols-12 py-2 px-3 bg-[#2C355B] text-white font-bold text-sm rounded-t-lg border-b border-[#E0E1E9]">
          <div className="col-span-3 pl-2">Account path</div>
          <div className="col-span-3">Account name</div>
          <div className="col-span-2">English name</div>
          <div className="col-span-2 text-right">Total debit</div>
          <div className="col-span-1 text-right">Credit total</div>
          <div className="col-span-1 text-right">Balance</div>
        </div>
        <div>
          {filteredRows.length > 0 ? (
            filteredRows.map(({ account, level, path, hasChildren }, idx) => (
              <Fragment key={path}>
                <div
                  className={`
                    grid grid-cols-12 items-center text-[15px] border-b border-[#F3F3F6] last:border-0
                    ${idx % 2 === 0 ? "bg-white" : "bg-[#F8F9FB]"}
                  `}
                  style={{
                    minHeight: "44px",
                  }}
                >
                  {/* Path with indentation and collapse/expand */}
                  <div
                    className="flex items-center gap-2 col-span-3"
                    style={{ paddingLeft: `${level * 22 + 10}px` }}
                  >
                    {/* Collapse/expand icon */}
                    {hasChildren ? (
                      <button
                        onClick={() => handleToggle(path)}
                        aria-label={expanded.has(path) ? "Collapse" : "Expand"}
                        className="p-1 mr-1 hover:scale-110 rounded bg-[#F0F1FA] hover:bg-[#E9EFFF] transition"
                        style={{ lineHeight: 0 }}
                      >
                        {expanded.has(path) ? (
                          <ChevronDown size={17} className="text-[#4061D6]" />
                        ) : (
                          <ChevronRightIcon />
                        )}
                      </button>
                    ) : (
                      <span className="w-6" />
                    )}
                    {/* Blue/yellow folder icon */}
                    {hasChildren ? (
                      expanded.has(path) ? (
                        <FolderOpen size={19} strokeWidth={2} className="text-[#2486E9]" />
                      ) : (
                        <Folder size={19} strokeWidth={2} className="text-[#2486E9]/80" />
                      )
                    ) : (
                      <span style={{ display: "inline-block", width: 19 }} />
                    )}
                    <span className="ml-1 font-mono text-[#222]">{account.code}</span>
                  </div>
                  {/* Account name, bold for visual */}
                  <div className="col-span-3 font-semibold">{account.name}</div>
                  {/* English name - placeholder for demo */}
                  <div className="col-span-2 text-gray-600">Data</div>
                  <div className="col-span-2 text-right font-mono text-[#222]">{account.debits?.toLocaleString() ?? "0"}</div>
                  <div className="col-span-1 text-right font-mono text-[#222]">{account.credits?.toLocaleString() ?? "0"}</div>
                  <div className="col-span-1 text-right font-mono text-[#222]">{account.balance.toLocaleString()}</div>
                </div>
              </Fragment>
            ))
          ) : (
            <div className="py-8 text-center text-gray-500">No accounts found.</div>
          )}
        </div>
        {/* Pagination & totals, for reference: no real pagination logic */}
        <div className="flex justify-between items-center bg-[#F7F7FA] px-4 py-2 text-[13px] text-[#7A7B85] rounded-b-lg border-t border-[#E0E1E9]">
          <div>
            Showing 1 to {filteredRows.length} of 100 entries
          </div>
          <div className="flex gap-7 text-[#222] font-semibold">
            <span>2,037,131</span>
            <span>2,037,131</span>
            <span>JD2,037,131</span>
          </div>
          <div className="flex items-center gap-1">
            <button className="px-2 py-1 h-8 rounded bg-white border text-[#2C355B] border-[#C5C8D1] mr-1">Previous</button>
            <button className="px-2 py-1 h-8 rounded bg-[#2C355B] text-white border border-[#2C355B]">1</button>
            <button className="px-2 py-1 h-8 rounded bg-white border text-[#2C355B] border-[#C5C8D1]">2</button>
            <button className="px-2 py-1 h-8 rounded bg-white border text-[#2C355B] border-[#C5C8D1]">3</button>
            <button className="px-2 py-1 h-8 rounded bg-white border text-[#2C355B] border-[#C5C8D1]">4</button>
            <button className="px-2 py-1 h-8 rounded bg-white border text-[#2C355B] border-[#C5C8D1] ml-1">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
};

function ChevronRightIcon(props: React.ComponentProps<"svg">) {
  // Chevron right, styled blue
  return (
    <svg width={17} height={17} viewBox="0 0 16 16" fill="none" {...props}>
      <path d="M6 4L10 8L6 12" stroke="#4061D6" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export default AccountsTable;
