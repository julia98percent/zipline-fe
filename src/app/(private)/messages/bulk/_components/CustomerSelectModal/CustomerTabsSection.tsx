import { Tab, Tabs } from "@mui/material";

interface CustomerTabsSectionProps {
  selectedTab: number;
  totalCount: number;
  selectedCustomersCount: number;
  onTabChange: (newValue: number) => void;
}

export default function CustomerTabsSection({
  selectedTab,
  totalCount,
  selectedCustomersCount,
  onTabChange,
}: CustomerTabsSectionProps) {
  return (
    <div className="border-b border-gray-200 mb-4">
      <Tabs
        value={selectedTab}
        onChange={(_, newValue) => onTabChange(newValue)}
        sx={{
          "& .MuiTab-root": {
            minWidth: "auto",
            px: 2,
            py: 1,
          },
          "& .Mui-selected": {
            color: "#164F9E !important",
          },
          "& .MuiTabs-indicator": {
            backgroundColor: "#164F9E",
          },
        }}
      >
        <Tab label={`선택 가능한 고객 (${totalCount}명)`} />
        <Tab label={`선택된 고객 (${selectedCustomersCount}명)`} />
      </Tabs>
    </div>
  );
}
