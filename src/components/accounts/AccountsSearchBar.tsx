
import React from 'react';
import { Input } from "@/components/ui/input";

interface AccountsSearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

const AccountsSearchBar: React.FC<AccountsSearchBarProps> = ({ 
  searchQuery, 
  onSearchChange 
}) => {
  return (
    <div className="w-full">
      <Input
        type="search"
        placeholder="Search by ..."
        className="w-full sm:max-w-xs text-[15px] px-3 py-2 h-10 border border-[#E6E9F0] rounded-lg bg-white shadow-none ring-0 focus:ring-2 focus:ring-[#275DF5]/15 focus:border-[#275DF5]"
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
      />
    </div>
  );
};

export default AccountsSearchBar;
