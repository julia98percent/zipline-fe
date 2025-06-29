import {
  Box,
  Typography,
  Card,
  CardContent,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Button,
} from "@mui/material";
import { CONTRACT_STATUS_OPTION_LIST } from "@constants/contract";
import {
  ContractCategory,
  ContractCategoryType,
  ContractCategoryColors,
  ContractDetail,
  ContractHistory,
} from "@ts/contract";

const CONTRACT_STATUS_COLORS: Record<string, string> = {
  LISTED: "#9e9e9e",
  NEGOTIATING: "#0288d1",
  INTENT_SIGNED: "#f57c00",
  CANCELLED: "#d32f2f",
  CONTRACTED: "#388e3c",
  IN_PROGRESS: "#1976d2",
  PAID_COMPLETE: "#7b1fa2",
  REGISTERED: "#388e3c",
  MOVED_IN: "#388e3c",
  TERMINATED: "#d32f2f",
};

const getStatusLabel = (statusValue: string): string => {
  const statusOption = CONTRACT_STATUS_OPTION_LIST.find(
    (option) => option.value === statusValue
  );
  return statusOption ? statusOption.label : statusValue;
};

const getStatusColor = (statusValue: string): string => {
  return CONTRACT_STATUS_COLORS[statusValue] || "#9e9e9e";
};

interface Props {
  contract: ContractDetail;
  histories: ContractHistory[];
}

const getCustomerNamesDisplay = (names: string[] | undefined | null) => {
  if (!names || names.length === 0) return "-";
  return names.join(", ");
};

const ContractDetailContent = ({ contract, histories }: Props) => {
  return (
    <>
      {/* 계약 기본정보, 당사자 정보 */}
      <Box display="flex" gap={3} mb={3}>
        <Card sx={{ flex: 1, borderRadius: 2 }}>
          <CardContent>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              계약 기본 정보
            </Typography>
            <InfoRow
              label="카테고리"
              value={(() => {
                if (!contract.category) return "-";

                const isValidCategory = (
                  category: string
                ): category is ContractCategoryType => {
                  return category in ContractCategory;
                };

                const categoryLabel = isValidCategory(contract.category)
                  ? ContractCategory[contract.category]
                  : contract.category;

                const categoryColor = isValidCategory(contract.category)
                  ? ContractCategoryColors[contract.category]
                  : "#999";

                return (
                  <Chip
                    label={categoryLabel}
                    variant="outlined"
                    sx={{
                      height: 26,
                      color: categoryColor,
                      borderColor: categoryColor,
                      fontWeight: 500,
                      fontSize: 13,
                    }}
                  />
                );
              })()}
            />
            <InfoRow
              label="상태"
              value={(() => {
                return (
                  <Chip
                    label={getStatusLabel(contract.status)}
                    variant="outlined"
                    sx={{
                      color: getStatusColor(contract.status),
                      borderColor: getStatusColor(contract.status),
                      fontWeight: 500,
                      fontSize: 13,
                      height: 28,
                    }}
                  />
                );
              })()}
            />
            <InfoRow
              label="계약 시작일"
              value={contract.contractStartDate ?? "-"}
            />
            <InfoRow
              label="계약 종료일"
              value={contract.contractEndDate ?? "-"}
            />
            {contract.status === "CANCELLED" && (
              <InfoRow
                label="계약 예상 종료일"
                value={contract.expectedContractEndDate ?? "-"}
              />
            )}
            <InfoRow label="매물 주소" value={contract.propertyAddress} />
            <InfoRow
              label="보증금"
              value={
                contract.deposit && contract.deposit > 0
                  ? `${contract.deposit.toLocaleString()}원`
                  : "- 원"
              }
            />
            <InfoRow
              label="월세"
              value={
                contract.monthlyRent && contract.monthlyRent > 0
                  ? `${contract.monthlyRent.toLocaleString()}원`
                  : "- 원"
              }
            />
            <InfoRow
              label="매매가"
              value={
                contract.price && contract.price > 0
                  ? `${contract.price.toLocaleString()}원`
                  : "- 원"
              }
            />
          </CardContent>
        </Card>

        <Card sx={{ flex: 1, borderRadius: 2 }}>
          <CardContent>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              계약 당사자 정보
            </Typography>
            <InfoRow
              label="임대/매도인"
              value={getCustomerNamesDisplay(contract.lessorOrSellerNames)}
            />
            <InfoRow
              label="임차/매수인"
              value={getCustomerNamesDisplay(contract.lesseeOrBuyerNames)}
            />
            <InfoRow label="계약일" value={contract.contractDate ?? "-"} />
          </CardContent>
        </Card>
      </Box>

      {/* 첨부문서, 히스토리 */}
      <Box display="flex" gap={3}>
        <Card sx={{ flex: 1, minHeight: 200, borderRadius: 2 }}>
          <CardContent>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              첨부 문서
            </Typography>
            {contract.documents.length > 0 ? (
              contract.documents.map((doc, idx) => (
                <Box
                  key={idx}
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                  sx={{
                    border: "1px solid #ddd",
                    borderRadius: 1,
                    px: 2,
                    py: 1,
                    mb: 1,
                    transition: "background-color 0.2s",
                    "&:hover": {
                      backgroundColor: "#f5f5f5",
                    },
                  }}
                >
                  <Typography
                    sx={{
                      flex: 0.6,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                    title={doc.fileName}
                  >
                    📎 {doc.fileName}
                  </Typography>
                  <Button
                    variant="outlined"
                    size="small"
                    component="a"
                    href={doc.fileUrl}
                    download={doc.fileName}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    다운로드
                  </Button>
                </Box>
              ))
            ) : (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  minHeight: "200px",
                }}
              >
                <Typography color="text.secondary">첨부 문서 없음</Typography>
              </Box>
            )}
          </CardContent>
        </Card>

        <Card sx={{ flex: 1.4, minHeight: 200, borderRadius: 2 }}>
          <CardContent>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              상태 변경 이력
            </Typography>
            {histories.length > 0 ? (
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>변경 전 상태</TableCell>
                    <TableCell>변경 후 상태</TableCell>
                    <TableCell>변경일</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {histories.map((h, idx) => (
                    <TableRow key={idx}>
                      <TableCell>
                        <Chip
                          label={getStatusLabel(h.prevStatus)}
                          variant="outlined"
                          sx={{
                            color: getStatusColor(h.prevStatus),
                            borderColor: getStatusColor(h.prevStatus),
                            fontWeight: 500,
                            fontSize: 13,
                            height: 28,
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={getStatusLabel(h.currentStatus)}
                          variant="outlined"
                          sx={{
                            color: getStatusColor(h.currentStatus),
                            borderColor: getStatusColor(h.currentStatus),
                            fontWeight: 500,
                            fontSize: 13,
                            height: 28,
                          }}
                        />
                      </TableCell>
                      <TableCell>{h.changedAt}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  minHeight: "200px",
                }}
              >
                <Typography color="text.secondary">히스토리 없음</Typography>
              </Box>
            )}
          </CardContent>
        </Card>
      </Box>
    </>
  );
};

const InfoRow = ({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) => (
  <Box
    display="flex"
    justifyContent="space-between"
    alignItems="center"
    mb={1.5}
    sx={{ minHeight: 28 }}
  >
    <Typography color="text.secondary" sx={{ minWidth: 100 }}>
      {label}
    </Typography>
    <Box>{value}</Box>
  </Box>
);

export default ContractDetailContent;
