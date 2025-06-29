import React from "react";
import {
  Box,
  Card,
  Typography,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";
import { formatDate } from "@utils/dateUtil";
import { PreCounsel } from "@ts/counsel";

interface SurveyListProps {
  surveyResponses: PreCounsel[];
  handleSurveyClick: (surveyResponseUid: number) => void;
}

const SurveyList: React.FC<SurveyListProps> = ({
  surveyResponses,
  handleSurveyClick,
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
        p: 2,
      }}
    >
      <Box
        sx={{
          borderBottom: "1px solid #e0e0e0",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Typography
          variant="h6"
          sx={{ fontWeight: 600, pb: 1, color: "#164f9e" }}
        >
          신규 설문
        </Typography>
      </Box>
      <Box sx={{ flex: 1, overflow: "auto" }}>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontSize: "13px", fontWeight: 600 }}>
                  이름
                </TableCell>
                <TableCell sx={{ fontSize: "13px", fontWeight: 600 }}>
                  연락처
                </TableCell>
                <TableCell sx={{ fontSize: "13px", fontWeight: 600 }}>
                  작성일
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Array.isArray(surveyResponses) &&
              surveyResponses.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} align="center">
                    신규 설문이 없습니다.
                  </TableCell>
                </TableRow>
              ) : (
                Array.isArray(surveyResponses) &&
                surveyResponses.map((res) => (
                  <TableRow
                    key={res.surveyResponseUid}
                    hover
                    onClick={() => handleSurveyClick(res.surveyResponseUid)}
                    sx={{
                      cursor: "pointer",
                      "&:hover": {
                        backgroundColor: "rgba(22, 79, 158, 0.04)",
                      },
                    }}
                  >
                    <TableCell sx={{ fontSize: "12px" }}>{res.name}</TableCell>
                    <TableCell sx={{ fontSize: "12px" }}>
                      {res.phoneNumber}
                    </TableCell>
                    <TableCell sx={{ fontSize: "12px" }}>
                      {formatDate(res.submittedAt)}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Card>
  );
};

export default SurveyList;
