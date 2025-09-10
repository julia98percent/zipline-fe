import { Chip, IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import ContractStatusStepper from "../ContractStatusStepper";
import {
  ContractCategory,
  ContractCategoryType,
  ContractCategoryColors,
  ContractDetail,
  ContractHistory,
} from "@/types/contract";
import Table, { ColumnConfig } from "@/components/Table";
import Button from "@/components/Button";
import { formatKoreanPrice } from "@/utils/numberUtil";
import InfoField from "@/components/InfoField";

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

  const downloadFile = (fileUrl: string, fileName: string): void => {
    const link = document.createElement("a");
    link.href = fileUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
    <div className="flex flex-col gap-6">
      <ContractStatusStepper
        currentStatus={contract.status}
        contractHistory={histories}
        onStatusChange={onStatusChange}
        onQuickStatusChange={onQuickStatusChange}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 ">
        <div className="flex-2 rounded-lg bg-white shadow-sm flex flex-col min-h-96">
          <div className="flex-1 flex flex-col p-6">
            <div className="flex justify-between items-center mb-4">
              <h6 className="text-lg font-bold text-primary">계약 기본 정보</h6>
              <IconButton
                onClick={onEditBasicInfo}
                size="small"
                className="bg-gray-100 hover:bg-gray-300"
                title="계약 정보 수정"
              >
                <EditIcon fontSize="small" />
              </IconButton>
            </div>
            <InfoField label="매물 주소" value={contract.propertyAddress} />

            <div className="grid grid-cols-2 gap-2">
              <InfoField label="상태" value={renderStatusChip()} />
              <InfoField label="카테고리" value={renderCategoryChip()} />
              <InfoField
                label="계약 시작일"
                value={contract.contractStartDate ?? "-"}
              />
              <InfoField
                label="계약 종료일"
                value={contract.contractEndDate ?? "-"}
              />
              {contract.status === "CANCELLED" && (
                <InfoField
                  label="계약 예상 종료일"
                  value={contract.expectedContractEndDate ?? "-"}
                />
              )}
              <InfoField label="계약일" value={contract.contractDate ?? "-"} />
              <InfoField label="기타" value={contract.other ?? "-"} />

              {contract.deposit !== null && contract.deposit < 0 && (
                <InfoField
                  label="보증금"
                  value={formatKoreanPrice(contract.deposit)}
                />
              )}
              {contract.monthlyRent !== null && contract.monthlyRent < 0 && (
                <InfoField
                  label="월세"
                  value={formatKoreanPrice(contract.monthlyRent)}
                />
              )}
              {contract.price !== null && contract.price < 0 && (
                <InfoField
                  label="매매가"
                  value={formatKoreanPrice(contract.price)}
                />
              )}
              <InfoField
                label="임대/매도인"
                value={getCustomerNamesDisplay(contract.lessorOrSellerInfo)}
              />
              <InfoField
                label="임차/매수인"
                value={getCustomerNamesDisplay(contract.lesseeOrBuyerInfo)}
              />
            </div>
          </div>
        </div>

        <div className="flex-1 flex flex-col min-h-96 card">
          <div className="flex-1 flex flex-col p-6">
            <div className="flex justify-between items-center mb-4">
              <h6 className="text-lg font-bold text-primary">첨부 문서</h6>
              <IconButton
                onClick={onEditDocuments}
                size="small"
                className="bg-gray-100 hover:bg-gray-300"
              >
                <EditIcon fontSize="small" />
              </IconButton>
            </div>
            {contract.documents.length > 0 ? (
              <div className="flex-1 overflow-y-auto">
                {contract.documents.map((doc, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between border border-gray-300 rounded px-4 py-2 mb-2 transition-colors hover:bg-gray-100"
                  >
                    <h6
                      className="flex-1 whitespace-nowrap overflow-hidden text-ellipsis mr-2"
                      title={doc.fileName}
                    >
                      📎 {doc.fileName}
                    </h6>
                    <Button
                      download={doc.fileName}
                      rel="noopener"
                      variant="outlined"
                      size="small"
                      onClick={() => {
                        downloadFile(doc.fileUrl, doc.fileName);
                      }}
                    >
                      다운로드
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex-1 flex justify-center items-center">
                <h6 color="text.secondary">첨부 문서 없음</h6>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 하단: 상태 변경 이력 */}

      <div className="card p-5 h-full">
        <h6 className="text-lg font-bold text-primary mb-2">
          계약 상태 변경 이력
        </h6>
        {histories.length > 0 ? (
          <>
            <div className="hidden sm:block">
              <Table
                columns={historyColumns}
                bodyList={historyTableData}
                pagination={false}
                noDataMessage="히스토리 없음"
                sx={{
                  "& .MuiTableContainer-root": {
                    maxHeight: "300px",
                    overflowY: "auto",
                  },
                }}
              />
            </div>

            <div className="block sm:hidden space-y-3 max-h-80 overflow-y-auto">
              {histories.map((history, index) => (
                <div
                  key={index}
                  className="border border-neutral-300 rounded-lg p-4 bg-neutral-50"
                >
                  <div className="w-full flex flex-col sm:flex-row justify-between items-center gap-2">
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-2">
                        {history.prevStatus && (
                          <>
                            <Chip
                              label={getStatusLabel(history.prevStatus)}
                              variant="outlined"
                              size="small"
                              className="font-medium text-xs h-6"
                              style={{
                                color: getStatusColor(history.prevStatus),
                                borderColor: getStatusColor(history.prevStatus),
                              }}
                            />
                            <span className="text-xs text-gray-400">→</span>
                          </>
                        )}
                        <Chip
                          label={getStatusLabel(history.currentStatus)}
                          variant="outlined"
                          size="small"
                          className="font-medium text-xs h-6"
                          style={{
                            color: getStatusColor(history.currentStatus),
                            borderColor: getStatusColor(history.currentStatus),
                          }}
                        />
                      </div>
                    </div>
                    <span className="text-xs text-gray-500 whitespace-nowrap ml-2">
                      {history.changedAt}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="flex justify-center items-center h-30">
            <h6 color="text.secondary">히스토리 없음</h6>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContractDetailContentView;
