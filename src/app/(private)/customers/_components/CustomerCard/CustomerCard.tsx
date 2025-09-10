"use client";

import { Customer, Label } from "@/types/customer";
import {
  Typography,
  Chip,
  IconButton,
  TextField,
  Autocomplete,
  Tooltip,
} from "@mui/material";
import { formatPhoneNumber } from "@/utils/numberUtil";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/DeleteOutline";
import DoneIcon from "@mui/icons-material/Done";
import CloseIcon from "@mui/icons-material/Close";
import { CUSTOMER_TYPE_COLORS } from "@/constants/customer";
import { useCallback } from "react";

interface CustomerCardProps {
  customer: Customer;
  onRowClick?: (customer: Customer) => void;
  onEdit?: (customer: Customer) => void;
  onDelete?: (customer: Customer) => void;
  isEditing?: boolean;
  editingCustomer?: Customer;
  onEditChange?: (
    uid: number,
    field: keyof Customer,
    value: string | boolean | Label[]
  ) => void;
  onSave?: () => void;
  onCancel?: () => void;
  availableLabels?: Label[];
  onCreateLabel?: (name: string) => Promise<Label>;
  labelInputValue?: string;
  onLabelInputChange?: (value: string) => void;
}

const CustomerCard = ({
  customer,
  onRowClick,
  onEdit,
  onDelete,
  isEditing = false,
  editingCustomer,
  onEditChange,
  onSave,
  onCancel,
  availableLabels = [],
  onCreateLabel,
  labelInputValue = "",
  onLabelInputChange,
}: CustomerCardProps) => {
  const currentCustomer = isEditing ? editingCustomer || customer : customer;

  const handleCardClick = (e: React.MouseEvent) => {
    // 편집 모드이거나 버튼 클릭 시에는 카드 클릭 이벤트를 막음
    if (isEditing || (e.target as HTMLElement).closest("button")) {
      return;
    }
    onRowClick?.(customer);
  };

  // 전화번호 입력 처리
  const handlePhoneNumberChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const formattedPhoneNumber = formatPhoneNumber(e.target.value);
      onEditChange?.(customer.uid, "phoneNo", formattedPhoneNumber);
    },
    [customer.uid, onEditChange]
  );

  // 역할 배지 가져오기
  const getRoleBadges = () => {
    const badges = [];
    if (currentCustomer.tenant) {
      badges.push({
        label: CUSTOMER_TYPE_COLORS.tenant.label,
        backgroundColor: CUSTOMER_TYPE_COLORS.tenant.backgroundColor,
        color: CUSTOMER_TYPE_COLORS.tenant.color,
      });
    }
    if (currentCustomer.landlord) {
      badges.push({
        label: CUSTOMER_TYPE_COLORS.landlord.label,
        backgroundColor: CUSTOMER_TYPE_COLORS.landlord.backgroundColor,
        color: CUSTOMER_TYPE_COLORS.landlord.color,
      });
    }
    if (currentCustomer.buyer) {
      badges.push({
        label: CUSTOMER_TYPE_COLORS.buyer.label,
        backgroundColor: CUSTOMER_TYPE_COLORS.buyer.backgroundColor,
        color: CUSTOMER_TYPE_COLORS.buyer.color,
      });
    }
    if (currentCustomer.seller) {
      badges.push({
        label: CUSTOMER_TYPE_COLORS.seller.label,
        backgroundColor: CUSTOMER_TYPE_COLORS.seller.backgroundColor,
        color: CUSTOMER_TYPE_COLORS.seller.color,
      });
    }
    return badges;
  };

  return (
    <div className="cursor-pointer card w-full" onClick={handleCardClick}>
      <div className="p-4">
        {/* 헤더: 이름과 액션 버튼 */}
        <div className="flex items-center justify-between mb-2">
          {isEditing ? (
            <TextField
              size="small"
              value={currentCustomer.name}
              onChange={(e) =>
                onEditChange?.(customer.uid, "name", e.target.value)
              }
              placeholder="이름"
              className="flex-1 mr-2"
            />
          ) : (
            <Typography variant="h6" className="font-medium text-gray-900">
              {currentCustomer.name}
            </Typography>
          )}

          <div className="flex gap-1">
            {isEditing ? (
              <>
                <Tooltip title="저장">
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSave?.();
                    }}
                  >
                    <DoneIcon style={{ color: "#219653" }} />
                  </IconButton>
                </Tooltip>
                <Tooltip title="취소">
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      onCancel?.();
                    }}
                  >
                    <CloseIcon style={{ color: "#EB5757" }} />
                  </IconButton>
                </Tooltip>
              </>
            ) : (
              <>
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit?.(customer);
                  }}
                >
                  <EditIcon className="text-primary-dark" />
                </IconButton>
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete?.(customer);
                  }}
                >
                  <DeleteIcon className="text-neutral-800" />
                </IconButton>
              </>
            )}
          </div>
        </div>

        {/* 전화번호 */}
        {isEditing ? (
          <TextField
            size="small"
            value={currentCustomer.phoneNo}
            onChange={handlePhoneNumberChange}
            placeholder="전화번호 (예: 010-1234-5678)"
            type="tel"
            className="w-full mb-3"
          />
        ) : (
          <Typography variant="body2" className="text-gray-600 mb-3">
            {formatPhoneNumber(currentCustomer.phoneNo)}
          </Typography>
        )}

        {/* 역할 배지들과 라벨들을 한 줄로 표시 */}
        {isEditing ? (
          <div className="space-y-3">
            {/* 역할 편집 */}
            <div>
              <Typography
                variant="body2"
                className="text-gray-700 mb-2 font-medium"
              >
                고객 역할
              </Typography>
              <div className="flex flex-wrap gap-2">
                <Chip
                  label="임차인"
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    onEditChange?.(
                      customer.uid,
                      "tenant",
                      !currentCustomer.tenant
                    );
                  }}
                  className="cursor-pointer"
                  sx={{
                    backgroundColor: currentCustomer.tenant
                      ? "#FCE8D4"
                      : "#F5F5F5",
                    color: currentCustomer.tenant ? "#E67E00" : "#757575",
                    "&:hover": {
                      backgroundColor: currentCustomer.tenant
                        ? "#FCE8D4"
                        : "#E0E0E0",
                    },
                  }}
                />
                <Chip
                  label="임대인"
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    onEditChange?.(
                      customer.uid,
                      "landlord",
                      !currentCustomer.landlord
                    );
                  }}
                  className="cursor-pointer"
                  sx={{
                    backgroundColor: currentCustomer.landlord
                      ? "#FCDADA"
                      : "#F5F5F5",
                    color: currentCustomer.landlord ? "#D63939" : "#757575",
                    "&:hover": {
                      backgroundColor: currentCustomer.landlord
                        ? "#FCDADA"
                        : "#E0E0E0",
                    },
                  }}
                />
                <Chip
                  label="매수인"
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    onEditChange?.(
                      customer.uid,
                      "buyer",
                      !currentCustomer.buyer
                    );
                  }}
                  className="cursor-pointer"
                  sx={{
                    backgroundColor: currentCustomer.buyer
                      ? "#D4EDDC"
                      : "#F5F5F5",
                    color: currentCustomer.buyer ? "#0E8A3E" : "#757575",
                    "&:hover": {
                      backgroundColor: currentCustomer.buyer
                        ? "#D4EDDC"
                        : "#E0E0E0",
                    },
                  }}
                />
                <Chip
                  label="매도인"
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    onEditChange?.(
                      customer.uid,
                      "seller",
                      !currentCustomer.seller
                    );
                  }}
                  className="cursor-pointer"
                  sx={{
                    backgroundColor: currentCustomer.seller
                      ? "#D6E6F9"
                      : "#F5F5F5",
                    color: currentCustomer.seller ? "#1B64C2" : "#757575",
                    "&:hover": {
                      backgroundColor: currentCustomer.seller
                        ? "#D6E6F9"
                        : "#E0E0E0",
                    },
                  }}
                />
              </div>
            </div>

            {/* 라벨 편집 */}
            <div>
              <Typography
                variant="body2"
                className="text-gray-700 mb-2 font-medium"
              >
                라벨
              </Typography>
              <Autocomplete
                multiple
                freeSolo
                size="small"
                options={availableLabels}
                disableClearable
                blurOnSelect={false}
                clearOnBlur={false}
                handleHomeEndKeys={false}
                inputValue={labelInputValue}
                onInputChange={(_, newInputValue) => {
                  onLabelInputChange?.(newInputValue);
                }}
                getOptionLabel={(option) => {
                  return typeof option === "string" ? option : option.name;
                }}
                value={currentCustomer.labels || []}
                onChange={async (_, newValue) => {
                  const processedLabels: Label[] = [];
                  for (const value of newValue) {
                    if (typeof value === "object") {
                      processedLabels.push(value);
                    }
                  }
                  onEditChange?.(customer.uid, "labels", processedLabels);
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder="라벨 검색 및 추가"
                    onKeyDown={async (event) => {
                      if (event.key === "Enter") {
                        event.stopPropagation();
                        const currentInputValue = labelInputValue?.trim();
                        if (currentInputValue && onCreateLabel) {
                          try {
                            const newLabel = await onCreateLabel(
                              currentInputValue
                            );
                            const currentLabels = currentCustomer.labels || [];
                            onEditChange?.(customer.uid, "labels", [
                              ...currentLabels,
                              newLabel,
                            ]);
                            onLabelInputChange?.("");
                          } catch (error) {
                            console.error("Failed to create label:", error);
                          }
                        }
                      }
                    }}
                  />
                )}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip
                      {...getTagProps({ index })}
                      key={typeof option === "string" ? option : option.uid}
                      label={typeof option === "string" ? option : option.name}
                      size="small"
                      variant="outlined"
                    />
                  ))
                }
              />
            </div>
          </div>
        ) : (
          <div className="flex flex-wrap gap-1">
            {/* 역할 배지들 */}
            {getRoleBadges().map((badge, index) => (
              <Chip
                key={`role-${index}`}
                label={badge.label}
                size="small"
                style={{
                  backgroundColor: badge.backgroundColor,
                  color: badge.color,
                  fontSize: "12px",
                }}
              />
            ))}

            {/* 라벨들 */}
            {currentCustomer.labels && currentCustomer.labels.length > 0 && (
              <>
                {currentCustomer.labels.slice(0, 2).map((label) => (
                  <Chip
                    key={label.uid}
                    label={label.name}
                    size="small"
                    variant="outlined"
                    className="text-xs"
                    style={{ fontSize: "11px" }}
                  />
                ))}
                {currentCustomer.labels.length > 2 && (
                  <Chip
                    label={`+${currentCustomer.labels.length - 2}`}
                    size="small"
                    variant="outlined"
                    className="text-xs"
                    style={{ fontSize: "11px" }}
                  />
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerCard;
