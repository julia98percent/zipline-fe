import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Typography, Tabs, Tab, Box } from "@mui/material";
import { FindIdTab, FindPasswordTab } from "./components";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`account-tabpanel-${index}`}
      aria-labelledby={`account-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

const FindAccountPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = searchParams.get("tab") === "password" ? 1 : 0;
  const [activeTab, setActiveTab] = useState(initialTab);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
    setSearchParams({ tab: newValue === 1 ? "password" : "id" });
  };

  const handleSwitchToPasswordTab = () => {
    setActiveTab(1);
    setSearchParams({ tab: "password" });
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <Typography
            variant="h5"
            component="h2"
            sx={{
              fontWeight: "bold",
              color: "#164F9E",
              mb: 2,
              textAlign: "center",
            }}
          >
            계정 정보 찾기
          </Typography>
        </div>

        <div>
          <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 2 }}>
            <Tabs
              value={activeTab}
              onChange={handleTabChange}
              aria-label="계정 정보 찾기 탭"
              sx={{
                "& .MuiTab-root": {
                  textTransform: "none",
                  fontSize: "1rem",
                  fontWeight: 500,
                  color: "#6B7280",
                  "&.Mui-selected": {
                    color: "#164F9E",
                    fontWeight: 600,
                  },
                },
                "& .MuiTabs-indicator": {
                  backgroundColor: "#164F9E",
                },
              }}
            >
              <Tab label="아이디 찾기" />
              <Tab label="비밀번호 찾기" />
            </Tabs>
          </Box>

          <TabPanel value={activeTab} index={0}>
            <FindIdTab
              isActive={activeTab === 0}
              onSwitchToPasswordTab={handleSwitchToPasswordTab}
            />
          </TabPanel>

          <TabPanel value={activeTab} index={1}>
            <FindPasswordTab isActive={activeTab === 1} />
          </TabPanel>

          <div className="flex justify-center items-center mt-8 space-x-4 text-sm">
            <Link to="/sign-in" className="text-gray-600 hover:text-primary">
              로그인
            </Link>
            <div className="w-px h-4 bg-gray-300"></div>
            <Link to="/sign-up" className="text-gray-600 hover:text-primary">
              회원가입
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FindAccountPage;
