import React from "react";
import {
  Box,
  Card,
  Typography,
  Tabs,
  Tab,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Chip,
  CircularProgress,
} from "@mui/material";
import { formatDate } from "@utils/dateUtil";
import { Counsel } from "@ts/counsel";

interface CounselListProps {
  counselTab: "request" | "latest";
  currentCounselList: Counsel[];
  counselLoading: boolean;
  handleCounselTabChange: (
    event: React.SyntheticEvent,
    newValue: "request" | "latest"
  ) => void;
  handleCounselClick: (counselId: number) => void;
}

const CounselList: React.FC<CounselListProps> = ({
  counselTab,
  currentCounselList,
  counselLoading,
  handleCounselTabChange,
  handleCounselClick,
}) => {
  return (
    <Card
      sx={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        boxShadow: "0 2px 6px rgba(0, 0, 0, 0.05)",
        borderRadius: "6px",
        backgroundColor: "#fff",
      }}
    >
      <Box
        sx={{
          p: 2,
          borderBottom: "1px solid #e0e0e0",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 1,
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 600, color: "#164f9e" }}>
            상담 목록
          </Typography>
        </Box>
        <Tabs
          value={counselTab}
          onChange={handleCounselTabChange}
          sx={{
            minHeight: "auto",
            "& .MuiTab-root": {
              minHeight: "32px",
              fontSize: "14px",
              padding: "6px 12px",
            },
          }}
        >
          <Tab label="마감일 순" value="request" sx={{ fontSize: "13px" }} />
          <Tab label="최신 순" value="latest" sx={{ fontSize: "13px" }} />
        </Tabs>
      </Box>
      <Box sx={{ flex: 1, overflow: "auto" }}>
        {counselLoading ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "200px",
            }}
          >
            <CircularProgress />
          </Box>
        ) : (
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontSize: "13px", fontWeight: 600 }}>
                    고객명
                  </TableCell>
                  <TableCell sx={{ fontSize: "13px", fontWeight: 600 }}>
                    제목
                  </TableCell>
                  <TableCell sx={{ fontSize: "13px", fontWeight: 600 }}>
                    마감일
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {currentCounselList.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} align="center">
                      상담이 없습니다.
                    </TableCell>
                  </TableRow>
                ) : (
                  currentCounselList.map((counsel) => (
                    <TableRow
                      key={counsel.counselUid}
                      hover
                      onClick={() => handleCounselClick(counsel.counselUid)}
                      sx={{
                        cursor: "pointer",
                        "&:hover": {
                          backgroundColor: "rgba(22, 79, 158, 0.04)",
                        },
                      }}
                    >
                      <TableCell sx={{ fontSize: "12px" }}>
                        {counsel.customerName}
                      </TableCell>
                      <TableCell sx={{ fontSize: "12px" }}>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                          }}
                        >
                          {counsel.title}
                          {counsel.completed && (
                            <Chip
                              label="완료"
                              size="small"
                              color="success"
                              sx={{ fontSize: "10px", height: "18px" }}
                            />
                          )}
                        </Box>
                      </TableCell>
                      <TableCell sx={{ fontSize: "12px" }}>
                        {formatDate(counsel.dueDate)}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>
    </Card>
  );
};

export default CounselList;
