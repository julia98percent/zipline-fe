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
  CircularProgress,
} from "@mui/material";
import { formatDate } from "@utils/dateUtil";
import { Contract } from "@ts/contract";

interface ContractListProps {
  contractTab: "expiring" | "recent";
  currentContractList: Contract[];
  contractLoading: boolean;
  handleContractTabChange: (
    event: React.SyntheticEvent,
    newValue: "expiring" | "recent"
  ) => void;
}

const ContractList = ({
  contractTab,
  currentContractList,
  contractLoading,
  handleContractTabChange,
}: ContractListProps) => {
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
            계약 목록
          </Typography>
        </Box>
        <Tabs
          value={contractTab}
          onChange={handleContractTabChange}
          sx={{
            minHeight: "auto",
            "& .MuiTab-root": {
              minHeight: "32px",
              fontSize: "14px",
              padding: "6px 12px",
            },
          }}
        >
          <Tab label="만료 예정" value="expiring" sx={{ fontSize: "13px" }} />
          <Tab label="최신 계약" value="recent" sx={{ fontSize: "13px" }} />
        </Tabs>
      </Box>
      <Box sx={{ flex: 1, overflow: "auto" }}>
        {contractLoading ? (
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
                    임대인/매도인
                  </TableCell>
                  <TableCell sx={{ fontSize: "13px", fontWeight: 600 }}>
                    임차인/매수인
                  </TableCell>
                  <TableCell sx={{ fontSize: "13px", fontWeight: 600 }}>
                    종료일
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {currentContractList.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} align="center">
                      계약이 없습니다.
                    </TableCell>
                  </TableRow>
                ) : (
                  currentContractList.map((contract) => (
                    <TableRow
                      key={contract.uid}
                      hover
                      sx={{
                        cursor: "pointer",
                        "&:hover": {
                          backgroundColor: "rgba(22, 79, 158, 0.04)",
                        },
                      }}
                    >
                      <TableCell sx={{ fontSize: "12px" }}>
                        {contract.lessorOrSellerNames?.join(", ") || "-"}
                      </TableCell>
                      <TableCell sx={{ fontSize: "12px" }}>
                        {contract.lesseeOrBuyerNames?.join(", ") || "-"}
                      </TableCell>
                      <TableCell sx={{ fontSize: "12px" }}>
                        {contract.contractEndDate
                          ? formatDate(contract.contractEndDate)
                          : "-"}
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

export default ContractList;
