
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

const AccountsHeader = () => {
  return (
    <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      <h1 className="text-2xl sm:text-3xl font-bold text-[#262B42] tracking-tight">Chart of Accounts</h1>
      <Button
        className="w-full sm:w-auto bg-[#275DF5] hover:bg-[#1740A8] text-white font-semibold px-6 py-2 rounded-lg shadow-none text-base"
        size="sm"
      >
        <Plus className="mr-2" size={18} />
        Add Account
      </Button>
    </div>
  );
};

export default AccountsHeader;
