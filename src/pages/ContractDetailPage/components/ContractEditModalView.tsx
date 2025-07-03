import {
  Modal,
  Box,
  Typography,
  MenuItem,
  TextField,
  Button as MuiButton,
  Autocomplete,
} from "@mui/material";
import { Dayjs } from "dayjs";
import { DesktopDatePicker } from "@mui/x-date-pickers";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { InsertDriveFile } from "@mui/icons-material";
import Button from "@components/Button";
import { CONTRACT_STATUS_OPTION_LIST } from "@constants/contract";
import { AgentPropertyResponse, CustomerResponse } from "@apis/contractService";

type ContractStatus = (typeof CONTRACT_STATUS_OPTION_LIST)[number]["value"];

export interface ContractFormData {
  category: string | null;
  contractDate: Dayjs | null;
  contractStartDate: Dayjs | null;
  contractEndDate: Dayjs | null;
  expectedContractEndDate: Dayjs | null;
  deposit: string;
  monthlyRent: string;
  price: string;
  lessorUids: number[];
  lesseeUids: number[];
  propertyUid: string | null;
  status: ContractStatus | "";
}

interface FormErrors {
  category?: string;
  contractDate?: string;
  contractStartDate?: string;
  contractEndDate?: string;
  expectedContractEndDate?: string;
  deposit?: string;
  monthlyRent?: string;
  price?: string;
  lessorUid?: string;
  lesseeUid?: string;
  propertyUid?: string;
  status?: string;
}

interface ContractEditModalViewProps {
  open: boolean;
  onClose: () => void;
  formData: ContractFormData;
  onUpdateFormData: (field: keyof ContractFormData, value: unknown) => void;
  errors: FormErrors;
  customerOptions: CustomerResponse[];
  propertyOptions: AgentPropertyResponse[];
  newFiles: File[];
  existingDocuments: {
    documentName: string;
    documentUrl: string;
    deleted?: boolean;
  }[];
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveExistingDoc: (idx: number) => void;
  onRemoveNewFile: (idx: number) => void;
  onSubmit: () => void;
}

const ContractEditModalView = ({
  open,
  onClose,
  formData,
  onUpdateFormData,
  errors,
  customerOptions,
  propertyOptions,
  newFiles,
  existingDocuments,
  onFileChange,
  onRemoveExistingDoc,
  onRemoveNewFile,
  onSubmit,
}: ContractEditModalViewProps) => {
  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "40vw",
          bgcolor: "white",
          p: 4,
          borderRadius: 2,
          maxHeight: "90vh",
          overflowY: "auto",
        }}
      >
        <Typography variant="h6" sx={{ mb: 2 }}>
          계약 수정
        </Typography>

        <TextField
          select
          label="계약 카테고리"
          value={formData.category ?? ""}
          onChange={(e) => {
            const val = e.target.value;
            onUpdateFormData("category", val === "" ? null : val);
          }}
          error={!!errors.category}
          helperText={errors.category}
          fullWidth
          sx={{ mb: 2 }}
        >
          <MenuItem value="SALE">매매</MenuItem>
          <MenuItem value="DEPOSIT">전세</MenuItem>
          <MenuItem value="MONTHLY">월세</MenuItem>
        </TextField>

        <TextField
          select
          label="계약 상태 *"
          value={formData.status}
          onChange={(e) =>
            onUpdateFormData("status", e.target.value as ContractStatus)
          }
          error={!!errors.status}
          helperText={errors.status}
          fullWidth
          sx={{ mb: 2 }}
        >
          {CONTRACT_STATUS_OPTION_LIST.map((s) => (
            <MenuItem key={s.value} value={s.value}>
              {s.label}
            </MenuItem>
          ))}
        </TextField>

        <Autocomplete
          multiple
          options={customerOptions}
          getOptionLabel={(option) => option.name}
          value={customerOptions.filter((option) =>
            formData.lessorUids.includes(option.uid)
          )}
          onChange={(_, newValue) => {
            onUpdateFormData(
              "lessorUids",
              newValue.map((option) => option.uid)
            );
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="임대/매도자 선택 *"
              error={!!errors.lessorUid}
              helperText={errors.lessorUid}
            />
          )}
          fullWidth
          sx={{ mb: 2 }}
        />

        <Autocomplete
          multiple
          options={customerOptions}
          getOptionLabel={(option) => option.name}
          value={customerOptions.filter((option) =>
            formData.lesseeUids.includes(option.uid)
          )}
          onChange={(_, newValue) => {
            onUpdateFormData(
              "lesseeUids",
              newValue.map((option) => option.uid)
            );
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="임차/매수자 선택"
              error={!!errors.lesseeUid}
              helperText={errors.lesseeUid}
            />
          )}
          fullWidth
          sx={{ mb: 2 }}
        />

        <TextField
          select
          label="매물 선택"
          value={
            formData.propertyUid !== null ? String(formData.propertyUid) : ""
          }
          onChange={(e) =>
            onUpdateFormData("propertyUid", Number(e.target.value))
          }
          error={!!errors.propertyUid}
          helperText={errors.propertyUid}
          fullWidth
          sx={{ mb: 2 }}
        >
          {propertyOptions.map((p) => (
            <MenuItem key={p.uid} value={String(p.uid)}>
              {p.address}
            </MenuItem>
          ))}
        </TextField>

        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DesktopDatePicker
            label="계약일"
            value={formData.contractDate}
            onChange={(value) => onUpdateFormData("contractDate", value)}
            format="YYYY. MM. DD"
            slotProps={{
              textField: {
                fullWidth: true,
                error: !!errors.contractDate,
                helperText: errors.contractDate,
              },
            }}
          />
          <Box sx={{ display: "flex", gap: 2, my: 2 }}>
            <DesktopDatePicker
              label="시작일"
              value={formData.contractStartDate}
              onChange={(value) => onUpdateFormData("contractStartDate", value)}
              format="YYYY. MM. DD"
              slotProps={{
                textField: {
                  fullWidth: true,
                  error: !!errors.contractStartDate,
                  helperText: errors.contractStartDate,
                },
              }}
            />
            <DesktopDatePicker
              label="종료일"
              value={formData.contractEndDate}
              onChange={(value) => onUpdateFormData("contractEndDate", value)}
              format="YYYY. MM. DD"
              slotProps={{
                textField: {
                  fullWidth: true,
                  error: !!errors.contractEndDate,
                  helperText: errors.contractEndDate,
                },
              }}
            />
          </Box>
          <DesktopDatePicker
            label="예상 종료일"
            value={formData.expectedContractEndDate}
            onChange={(value) =>
              onUpdateFormData("expectedContractEndDate", value)
            }
            format="YYYY. MM. DD"
            slotProps={{ textField: { fullWidth: true } }}
          />
        </LocalizationProvider>

        <TextField
          label="보증금 (숫자)"
          value={formData.deposit}
          onChange={(e) => onUpdateFormData("deposit", e.target.value)}
          error={!!errors.deposit}
          helperText={errors.deposit}
          type="number"
          fullWidth
          sx={{ mt: 2 }}
        />
        <TextField
          label="월세 (숫자)"
          value={formData.monthlyRent}
          onChange={(e) => onUpdateFormData("monthlyRent", e.target.value)}
          error={!!errors.monthlyRent}
          helperText={errors.monthlyRent}
          type="number"
          fullWidth
          sx={{ mt: 2 }}
        />
        <TextField
          label="매매가 (숫자)"
          value={formData.price}
          onChange={(e) => onUpdateFormData("price", e.target.value)}
          error={!!errors.price}
          helperText={errors.price}
          type="number"
          fullWidth
          sx={{ mt: 2 }}
        />

        <MuiButton
          variant="outlined"
          component="label"
          sx={{ my: 2 }}
          fullWidth
        >
          파일 선택
          <input type="file" hidden multiple onChange={onFileChange} />
        </MuiButton>

        {(existingDocuments.filter((doc) => !doc.deleted).length > 0 ||
          newFiles.length > 0) && (
          <Box sx={{ mt: 2 }}>
            <Typography sx={{ mb: 1 }} fontWeight="bold">
              첨부한 문서
            </Typography>

            {[
              ...existingDocuments.filter((doc) => !doc.deleted),
              ...newFiles,
            ].map((item, idx) => {
              const isExisting = "documentUrl" in item;
              const fileName = isExisting ? item.documentName : item.name;
              const fileSize = !isExisting
                ? (item.size / 1024 / 1024).toFixed(2) + " MB"
                : null;

              return (
                <Box
                  key={idx}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    px: 2,
                    py: 1,
                    border: "1px solid #ddd",
                    borderRadius: 1,
                    mb: 1,
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <InsertDriveFile color="action" />
                    {isExisting ? (
                      <a
                        href={item.documentUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ textDecoration: "none", color: "#333" }}
                      >
                        {fileName}
                      </a>
                    ) : (
                      <Typography>{fileName}</Typography>
                    )}
                    {fileSize && (
                      <Typography variant="caption" sx={{ color: "gray" }}>
                        ({fileSize})
                      </Typography>
                    )}
                  </Box>

                  <MuiButton
                    onClick={() => {
                      if (isExisting) {
                        const index = existingDocuments.findIndex(
                          (doc) => doc.documentUrl === item.documentUrl
                        );
                        onRemoveExistingDoc(index);
                      } else {
                        const index = newFiles.findIndex(
                          (file) =>
                            file.name === item.name && file.size === item.size
                        );
                        onRemoveNewFile(index);
                      }
                    }}
                    sx={{ minWidth: "auto", color: "red" }}
                  >
                    ❌
                  </MuiButton>
                </Box>
              );
            })}
          </Box>
        )}
        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
          <Button
            text="수정"
            onClick={onSubmit}
            sx={{
              mt: 2,
              color: "white !important",
              backgroundColor: "#164F9E",
            }}
          />
        </Box>
      </Box>
    </Modal>
  );
};

export default ContractEditModalView;
