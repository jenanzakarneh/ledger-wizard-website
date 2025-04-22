
import { Plus, Upload, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";

interface AccountsToolbarProps {
  onExport: () => void;
}

const AccountsToolbar = ({ onExport }: AccountsToolbarProps) => {
  const isMobile = useIsMobile();

  return (
    <div className="flex overflow-x-auto gap-1 bg-[#242B43] rounded-t-md rounded-b-none shadow-none min-h-[42px]">
      {[
        { label: "Create", icon: Plus },
        { label: "Update", icon: null },
        { label: "Merge", icon: null },
        { label: "Move", icon: null },
        { label: "Print", icon: null },
        { label: "Export", icon: FileText, onClick: onExport },
        { label: "Import", icon: Upload },
        { label: "Shortcuts", icon: null },
      ].map((action) => (
        <Button
          key={action.label}
          variant="ghost"
          size={isMobile ? "sm" : "default"}
          className="text-white font-medium px-4 sm:px-6 py-2 rounded-none bg-transparent hover:bg-[#1E253B] focus:bg-[#1E253B] whitespace-nowrap"
          style={{ borderRadius: 0, border: "none", boxShadow: "none" }}
          type="button"
          tabIndex={-1}
          onClick={action.onClick}
          disabled={action.label === "Update" || action.label === "Merge" || action.label === "Move" || action.label === "Shortcuts"}
        >
          {action.icon && <action.icon size={isMobile ? 14 : 16} className="mr-1" />}
          <span className="text-[13px] sm:text-[14px]">{action.label}</span>
        </Button>
      ))}
    </div>
  );
};

export default AccountsToolbar;
