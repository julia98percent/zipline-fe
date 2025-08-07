import {
  Box,
  Typography,
  Card,
  CardContent,
  Chip,
  IconButton,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import ContractStatusStepper from "../ContractStatusStepper";
import {
  ContractCategory,
  ContractCategoryType,
  ContractCategoryColors,
  ContractDetail,
  ContractHistory,
} from "@ts/contract";
import Table, { ColumnConfig } from "@components/Table";
import Button from "@components/Button";
import { formatKoreanPrice } from "@utils/numberUtil";

interface CustomerInfo {
  name: string;
  uid: number;
  phoneNo: string;
}

interface ContractDetailContentViewProps {
  contract: ContractDetail;
  histories: ContractHistory[];
  getStatusLabel: (statusValue: string) => string;
  getStatusColor: (statusValue: string) => string;
  getCustomerNamesDisplay: (names: CustomerInfo[]) => string;
  onEditBasicInfo: () => void;
  onEditDocuments: () => void;
  onStatusChange?: (newStatus: "CANCELLED" | "TERMINATED") => void;
  onQuickStatusChange?: (newStatus: string) => void;
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
  onEditBasicInfo,
  onEditDocuments,
  onStatusChange,
  onQuickStatusChange,
}: ContractDetailContentViewProps) => {
  const historyColumns: ColumnConfig<HistoryRowData>[] = [
    {
      key: "prevStatus",
      label: "변경 전 상태",
      render: (value) => (
        <Chip
          label={getStatusLabel(value as string)}
          variant="outlined"
          className="font-medium text-xs h-7"
          style={{
            color: getStatusColor(value as string),
            borderColor: getStatusColor(value as string),
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
          className="font-medium text-xs h-7"
          style={{
            color: getStatusColor(value as string),
            borderColor: getStatusColor(value as string),
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
        className="h-6 font-medium text-xs"
        style={{
          color: categoryColor,
          borderColor: categoryColor,
        }}
      />
    );
  };

  const renderStatusChip = () => {
    return (
      <Chip
        label={getStatusLabel(contract.status)}
        variant="outlined"
        className="font-medium text-xs h-7"
        style={{
          color: getStatusColor(contract.status),
          borderColor: getStatusColor(contract.status),
        }}
      />
    );
  };

  return (
    <Box className="flex flex-col gap-6">
      <ContractStatusStepper
        currentStatus={contract.status}
        contractHistory={histories}
        onStatusChange={onStatusChange}
        onQuickStatusChange={onQuickStatusChange}
      />

      <Box className="flex gap-6">
        <Card className="flex-2 rounded-lg bg-white shadow-sm flex flex-col min-h-96">
          <CardContent className="flex-1 flex flex-col p-6">
            <Box className="flex justify-between items-center mb-4">
              <Typography className="text-xl font-bold text-primary">
                계약 기본 정보
              </Typography>
              <IconButton
                onClick={onEditBasicInfo}
                size="small"
                className="bg-gray-100 hover:bg-gray-300"
                title="계약 정보 수정"
              >
                <EditIcon fontSize="small" />
              </IconButton>
            </Box>
            <Box className="flex-1 overflow-y-auto">
              <Box className="flex gap-8 mb-4">
                <Box className="flex-1">
                  <InfoRow label="상태" value={renderStatusChip()} />
                  <InfoRow label="카테고리" value={renderCategoryChip()} />
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
                  <InfoRow
                    label="계약일"
                    value={contract.contractDate ?? "-"}
                  />
                  <InfoRow label="기타" value={contract.other ?? "-"} />
                </Box>
                <Box className="flex-1">
                  <InfoRow label="매물 주소" value={contract.propertyAddress} />
                  <InfoRow
                    label="보증금"
                    value={formatKoreanPrice(contract.deposit)}
                  />
                  <InfoRow
                    label="월세"
                    value={formatKoreanPrice(contract.monthlyRent)}
                  />
                  <InfoRow
                    label="매매가"
                    value={formatKoreanPrice(contract.price)}
                  />
                  <InfoRow
                    label="임대/매도인"
                    value={getCustomerNamesDisplay(contract.lessorOrSellerInfo)}
                  />
                  <InfoRow
                    label="임차/매수인"
                    value={getCustomerNamesDisplay(contract.lesseeOrBuyerInfo)}
                  />
                </Box>
              </Box>
            </Box>
          </CardContent>
        </Card>

        <Card className="flex-1 rounded-lg shadow-sm flex flex-col min-h-96">
          <CardContent className="flex-1 flex flex-col p-6">
            <Box className="flex justify-between items-center mb-4">
              <Typography className="text-xl font-bold text-primary">
                첨부 문서
              </Typography>
              <IconButton
                onClick={onEditDocuments}
                size="small"
                className="bg-gray-100 hover:bg-gray-300"
              >
                <EditIcon fontSize="small" />
              </IconButton>
            </Box>
            {contract.documents.length > 0 ? (
              <Box className="flex-1 overflow-y-auto">
                {contract.documents.map((doc, idx) => (
                  <Box
                    key={idx}
                    className="flex items-center justify-between border border-gray-300 rounded px-4 py-2 mb-2 transition-colors hover:bg-gray-100"
                  >
                    <Typography
                      className="flex-1 whitespace-nowrap overflow-hidden text-ellipsis mr-2"
                      title={doc.fileName}
                    >
                      📎 {doc.fileName}
                    </Typography>
                    <Button
                      download={doc.fileName}
                      target="_blank"
                      rel="noopener"
                      variant="outlined"
                      size="small"
                    >
                      <a href={doc.fileUrl}>다운로드</a>
                    </Button>
                  </Box>
                ))}
              </Box>
            ) : (
              <Box className="flex-1 flex justify-center items-center">
                <Typography color="text.secondary">첨부 문서 없음</Typography>
              </Box>
            )}
          </CardContent>
        </Card>
      </Box>

      {/* 하단: 상태 변경 이력 */}
      <Card className="rounded-lg bg-white shadow-sm">
        <CardContent>
          <Typography className="text-xl font-bold text-primary mb-4">
            계약 상태 변경 이력
          </Typography>
          {histories.length > 0 ? (
            <Table
              columns={historyColumns}
              bodyList={historyTableData}
              pagination={false}
              noDataMessage="히스토리 없음"
              className="shadow-none"
              sx={{
                "& .MuiTableContainer-root": {
                  maxHeight: "300px",
                  overflowY: "auto",
                },
              }}
            />
          ) : (
            <Box className="flex justify-center items-center h-30">
              <Typography color="text.secondary">히스토리 없음</Typography>
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

const InfoRow = ({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) => (
  <Box className="flex flex-col mb-3 min-h-10 break-all">
    <Typography
      color="text.secondary"
      className="text-xs font-medium mb-1 leading-tight"
    >
      {label}
    </Typography>
    <Box className="font-medium text-sm leading-tight">{value}</Box>
  </Box>
);

export default ContractDetailContentView;
