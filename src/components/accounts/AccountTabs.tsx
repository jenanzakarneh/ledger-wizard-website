
import { accountTabs } from "@/data/accountsData";

interface AccountTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const AccountTabs = ({ activeTab, onTabChange }: AccountTabsProps) => {
  return (
    <div className="mb-4 overflow-x-auto">
      <div className="flex flex-wrap gap-0.5 border border-[#E6E9F0] rounded-lg bg-[#F7F8FB] px-1 py-[3px] w-fit shadow-none min-w-0">
        {accountTabs.map((tab) => (
          <button
            key={tab.label}
            className={`
              flex items-center px-3 sm:px-5 py-2 min-w-[90px] sm:min-w-[110px] rounded-md text-[14px] sm:text-[15px] font-medium transition-all border whitespace-nowrap
              ${
                activeTab === tab.label
                  ? "bg-[#275DF5] text-white border-[#275DF5] shadow"
                  : "bg-white text-[#24243A] border-transparent hover:text-[#275DF5] hover:bg-[#EFF3FF] hover:border-[#C3DAFE]"
              }
            `}
            style={{
              fontWeight: activeTab === tab.label ? 600 : 500,
            }}
            onClick={() => onTabChange(tab.label)}
            type="button"
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default AccountTabs;
