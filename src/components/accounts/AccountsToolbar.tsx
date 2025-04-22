
import { FileText, FileExcel } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { type ExportFormat } from "@/utils/exportAccounts";

interface AccountsToolbarProps {
  onExport: (format: ExportFormat) => void;
}

const AccountsToolbar = ({ onExport }: AccountsToolbarProps) => {
  const isMobile = useIsMobile();

  return (
    <div className="flex overflow-x-auto gap-1 bg-[#242B43] rounded-t-md rounded-b-none shadow-none min-h-[42px]">
      {[
        { label: "Create", icon: null },
        { label: "Update", icon: null },
        { label: "Merge", icon: null },
        { label: "Move", icon: null },
        { label: "Print", icon: null },
      ].map((action) => (
        <Button
          key={action.label}
          variant="ghost"
          size={isMobile ? "sm" : "default"}
          className="text-white font-medium px-4 sm:px-6 py-2 rounded-none bg-transparent hover:bg-[#1E253B] focus:bg-[#1E253B] whitespace-nowrap"
          style={{ borderRadius: 0, border: "none", boxShadow: "none" }}
          type="button"
          tabIndex={-1}
          disabled={action.label === "Update" || action.label === "Merge" || action.label === "Move"}
        >
          {action.icon && <action.icon size={isMobile ? 14 : 16} className="mr-1" />}
          <span className="text-[13px] sm:text-[14px]">{action.label}</span>
        </Button>
      ))}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size={isMobile ? "sm" : "default"}
            className="text-white font-medium px-4 sm:px-6 py-2 rounded-none bg-transparent hover:bg-[#1E253B] focus:bg-[#1E253B] whitespace-nowrap"
            style={{ borderRadius: 0, border: "none", boxShadow: "none" }}
          >
            <FileText size={isMobile ? 14 : 16} className="mr-1" />
            <span className="text-[13px] sm:text-[14px]">Export</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[150px]">
          <DropdownMenuItem onClick={() => onExport('pdf')}>
            <FileText className="mr-2 h-4 w-4" />
            <span>Export as PDF</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onExport('excel')}>
            <FileExcel className="mr-2 h-4 w-4" />
            <span>Export as Excel</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default AccountsToolbar;
