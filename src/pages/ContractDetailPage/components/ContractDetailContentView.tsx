import {
  Box,
  Typography,
  Card,
  CardContent,
  Chip,
  Button,
} from "@mui/material";
import {
  ContractCategory,
  ContractCategoryType,
  ContractCategoryColors,
  ContractDetail,
  ContractHistory,
} from "@ts/contract";
import Table, { ColumnConfig } from "@components/Table";

interface ContractDetailContentViewProps {
  contract: ContractDetail;
  histories: ContractHistory[];
  getStatusLabel: (statusValue: string) => string;
  getStatusColor: (statusValue: string) => string;
  getCustomerNamesDisplay: (names: string[] | undefined | null) => string;
  formatPrice: (price: number | null | undefined, suffix?: string) => string;
}

interface HistoryRowData {
  id: string | number;
  prevStatus: string;
  currentStatus: string;
  changedAt: string;
  [key: string]: unknown;
}

const ContractDetailContentView = ({
  contract,
  histories,
  getStatusLabel,
  getStatusColor,
  getCustomerNamesDisplay,
  formatPrice,
}: ContractDetailContentViewProps) => {
  const historyColumns: ColumnConfig<HistoryRowData>[] = [
    {
      key: "prevStatus",
      label: "변경 전 상태",
      render: (value) => (
        <Chip
          label={getStatusLabel(value as string)}
          variant="outlined"
          sx={{
            color: getStatusColor(value as string),
            borderColor: getStatusColor(value as string),
            fontWeight: 500,
            fontSize: 13,
            height: 28,
          }}
        />
      ),
    },
    {
      key: "currentStatus",
      label: "변경 후 상태",
      render: (value) => (
        <Chip
          label={getStatusLabel(value as string)}
          variant="outlined"
          sx={{
            color: getStatusColor(value as string),
            borderColor: getStatusColor(value as string),
            fontWeight: 500,
            fontSize: 13,
            height: 28,
          }}
        />
      ),
    },
    {
      key: "changedAt",
      label: "변경일",
    },
  ];

  const historyTableData: HistoryRowData[] = histories.map((h, idx) => ({
    id: idx,
    prevStatus: h.prevStatus,
    currentStatus: h.currentStatus,
    changedAt: h.changedAt,
  }));

  const renderCategoryChip = () => {
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
  };

  const renderStatusChip = () => {
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
  };

  return (
    <>
      {/* 계약 기본정보, 당사자 정보 */}
      <Box display="flex" gap={3} mb={3}>
        <Card sx={{ flex: 1, borderRadius: 2 }}>
          <CardContent>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              계약 기본 정보
            </Typography>
            <InfoRow label="카테고리" value={renderCategoryChip()} />
            <InfoRow label="상태" value={renderStatusChip()} />
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
            <InfoRow label="보증금" value={formatPrice(contract.deposit)} />
            <InfoRow label="월세" value={formatPrice(contract.monthlyRent)} />
            <InfoRow label="매매가" value={formatPrice(contract.price)} />
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
              <Table
                columns={historyColumns}
                bodyList={historyTableData}
                pagination={false}
                noDataMessage="히스토리 없음"
                sx={{
                  boxShadow: "none",
                  "& .MuiTableContainer-root": {
                    maxHeight: "300px",
                  },
                }}
              />
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

export default ContractDetailContentView;
