
import React, { useState, useMemo, Fragment } from "react";
import { ChevronDown, ChevronUp, Folder, FolderOpen } from "lucide-react";

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
  showDetails: boolean;
}

type FlattenedAccount = {
  account: AccountNode;
  level: number;
  parentCodes: string[];
  path: string; // concatenated string of codes (for unique keys)
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
  showDetails,
}) => {
  const [expanded, setExpanded] = useState<Set<string>>(
    () => new Set(Object.keys(accountsData).map((k) => k)) // root nodes expanded by default
  );

  // All expandable paths
  const allExpandablePaths = useMemo(
    () => getAllExpandablePaths(accountsData),
    [accountsData]
  );

  // Toggle logic for expanding/collapsing one node
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

  // Collapse/expand all
  const handleCollapseAll = () => setExpanded(new Set());
  const handleExpandAll = () => setExpanded(new Set(allExpandablePaths));

  // Flatten according to expanded/collapsed state
  const rows = useMemo(
    () => flattenAccountsTree(accountsData, expanded),
    [accountsData, expanded]
  );

  // Search logic - show row if code or name matches
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
      {/* Controls */}
      <div className="flex gap-2 mb-2">
        <button
          onClick={handleExpandAll}
          className="border px-2 py-1 rounded bg-gray-50 text-gray-700 hover:bg-gray-100 transition"
        >
          Expand All
        </button>
        <button
          onClick={handleCollapseAll}
          className="border px-2 py-1 rounded bg-gray-50 text-gray-700 hover:bg-gray-100 transition"
        >
          Collapse All
        </button>
      </div>

      <div className="border rounded bg-white">
        <div className="grid grid-cols-12 py-2 border-b bg-gray-50 font-semibold text-sm">
          <div className="col-span-3 pl-3">Code</div>
          <div className="col-span-5">Name</div>
          <div className="col-span-2 text-right pr-4">Balance</div>
          {showDetails && (
            <>
              <div className="col-span-1 text-right pr-2">Debits</div>
              <div className="col-span-1 text-right pr-3">Credits</div>
            </>
          )}
        </div>
        <div>
          {filteredRows.length > 0 ? (
            filteredRows.map(({ account, level, path, hasChildren }, idx) => (
              <Fragment key={path}>
                <div
                  className={`grid grid-cols-12 items-center text-sm border-b last:border-0 hover:bg-gray-50 transition-colors`}
                  style={{ background: level === 0 ? "#fafbfc" : undefined }}
                >
                  {/* Code (indented with collapse icon/folder) */}
                  <div className="flex items-center gap-2 col-span-3 pl-3" style={{ paddingLeft: `${level * 16 + 12}px` }}>
                    {/* Collapse/expand icon if has children */}
                    {hasChildren ? (
                      <button
                        onClick={() => handleToggle(path)}
                        aria-label={expanded.has(path) ? "Collapse" : "Expand"}
                        className="p-1 hover-scale rounded hover:bg-gray-200"
                        style={{ lineHeight: 0 }}
                      >
                        {expanded.has(path) ? (
                          <ChevronDown size={16} className="text-gray-700" />
                        ) : (
                          <ChevronRightIcon />
                        )}
                      </button>
                    ) : null}
                    {/* Folder icon if has children, else invisible placeholder for alignment */}
                    {hasChildren ? (
                      expanded.has(path) ? (
                        <FolderOpen size={16} className="text-gray-600" />
                      ) : (
                        <Folder size={16} className="text-gray-400" />
                      )
                    ) : (
                      <span style={{ display: "inline-block", width: 16 }} />
                    )}
                    <span className="font-mono">{account.code}</span>
                  </div>
                  {/* Name */}
                  <div className="col-span-5 truncate">{account.name}</div>
                  {/* Balance */}
                  <div className="col-span-2 pr-4 text-right font-mono text-gray-900">
                    ${account.balance.toLocaleString()}
                  </div>
                  {showDetails && (
                    <>
                      <div className="col-span-1 pr-2 text-right text-green-700 font-mono">
                        ${account.debits?.toLocaleString() ?? "0"}
                      </div>
                      <div className="col-span-1 pr-3 text-right text-red-700 font-mono">
                        ${account.credits?.toLocaleString() ?? "0"}
                      </div>
                    </>
                  )}
                </div>
              </Fragment>
            ))
          ) : (
            <div className="py-8 text-center text-gray-500">No accounts found.</div>
          )}
        </div>
      </div>
    </div>
  );
};

function ChevronRightIcon(props: React.ComponentProps<"svg">) {
  // This is a non-lucide fallback for right chevron since lucide-react's doesn't have ChevronRight in allowed list
  return (
    <svg width={16} height={16} viewBox="0 0 16 16" fill="none" {...props}>
      <path d="M6 4L10 8L6 12" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export default AccountsTable;
