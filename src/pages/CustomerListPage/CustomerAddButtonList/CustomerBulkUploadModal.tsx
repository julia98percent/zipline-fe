import { useState, useCallback } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Paper,
  CircularProgress,
} from "@mui/material";
import { useDropzone } from "react-dropzone";
import apiClient from "@apis/apiClient";
import { Link } from "react-router-dom";
import { AxiosError } from "axios";
import { showToast } from "@components/Toast/Toast";
interface Props {
  open: boolean;
  handleClose: () => void;
  fetchCustomerData: () => void;
}

interface ErrorResponse {
  message: string;
}

function CustomerBulkUploadModal({
  open,
  handleClose,
  fetchCustomerData,
}: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const uploadedFile = acceptedFiles[0];
    if (uploadedFile) {
      const fileExtension = uploadedFile.name.split(".").pop()?.toLowerCase();
      if (fileExtension !== "xlsx" && fileExtension !== "xls") {
        setError("엑셀 파일(.xlsx, .xls)만 업로드 가능합니다.");
        setFile(null);
        return;
      }
      setFile(uploadedFile);
      setError("");
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
        ".xlsx",
      ],
      "application/vnd.ms-excel": [".xls"],
    },
    multiple: false,
  });

  const handleUpload = async () => {
    if (!file || isLoading) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      setIsLoading(true);
      await apiClient.post("/customers/bulk", formData);
      showToast({
        message: "고객 정보를 업데이트 했습니다.",
        type: "success",
      });
      handleClose();
      fetchCustomerData();
    } catch (error) {
      console.log(error);
      const axiosError = error as AxiosError<ErrorResponse>;
      const errorMessage =
        axiosError.response?.data?.message ||
        "파일 업로드 중 오류가 발생했습니다.";
      setError(errorMessage);
      showToast({
        message: errorMessage,
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>고객 데이터 일괄 등록</DialogTitle>
      <DialogContent>
        <Typography
          variant="subtitle2"
          sx={{
            color: "#333333",
            fontWeight: 600,
            mb: 2,
          }}
        >
          엑셀 파일 업로드 정책
        </Typography>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5, mb: 3 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Typography variant="body2" color="text.secondary">
              • 파일 형식:
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: "#164F9E", fontWeight: 500 }}
            >
              .xlsx, .xls
            </Typography>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Typography variant="body2" color="text.secondary">
              • 파일 크기:
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: "#164F9E", fontWeight: 500 }}
            >
              10MB 이하
            </Typography>
          </Box>

          <Typography variant="body2" color="text.secondary">
            • 필수 입력 항목이 누락된 경우 업로드가 실패할 수 있습니다.
          </Typography>
        </Box>

        <Box
          sx={{
            backgroundColor: "#F8F9FA",
            p: 2,
            borderRadius: 1,
            border: "1px solid #E0E0E0",
          }}
        >
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            엑셀의 열 순서가 변경되면 업로드가 실패할 수 있으니,{" "}
            <Link
              to={import.meta.env.VITE_PROPERTY_EXCEL_TEMPLATE_URL}
              style={{
                color: "#164F9E",
                textDecoration: "none",
                fontWeight: 500,
              }}
            >
              제공되는 템플릿
            </Link>
            을 그대로 사용하는 것을 권장합니다.
          </Typography>
          <Typography variant="body2" sx={{ color: "#164F9E", mt: 1 }}>
            <Link
              to={import.meta.env.VITE_CUSTOMER_EXCEL_TEMPLATE_URL}
              style={{
                color: "#164F9E",
                textDecoration: "none",
                fontWeight: 500,
              }}
            >
              → 템플릿 다운로드
            </Link>
          </Typography>
        </Box>

        <Box sx={{ mt: 3 }}>
          <Typography
            variant="body2"
            sx={{ color: "#666666", mb: 2, fontWeight: 500 }}
          >
            • 지정된 입력 값 안내
          </Typography>

          <Box
            sx={{ display: "flex", flexDirection: "column", gap: 1.5, pl: 2 }}
          >
            <Box>
              <Typography
                variant="body2"
                sx={{ color: "#333333", fontWeight: 500, mb: 0.5 }}
              >
                고객 전화번호
              </Typography>
              <Typography variant="body2" color="text.secondary">
                형식:{" "}
                <Typography
                  component="span"
                  sx={{ color: "#164F9E", fontWeight: 500 }}
                >
                  000-0000-0000
                </Typography>
              </Typography>
            </Box>

            <Box>
              <Typography
                variant="body2"
                sx={{ color: "#333333", fontWeight: 500, mb: 0.5 }}
              >
                생일
              </Typography>
              <Typography variant="body2" color="text.secondary">
                형식:{" "}
                <Typography
                  component="span"
                  sx={{ color: "#164F9E", fontWeight: 500 }}
                >
                  YYYYMMDD (숫자 8자리)
                </Typography>
              </Typography>
            </Box>

            <Box>
              <Typography
                variant="body2"
                sx={{ color: "#333333", fontWeight: 500, mb: 0.5 }}
              >
                고객 역할 지정
              </Typography>
              <Typography variant="body2" color="text.secondary">
                임대인, 매도인, 임차인, 매수인 항목에{" "}
                <Typography
                  component="span"
                  sx={{ color: "#164F9E", fontWeight: 500 }}
                >
                  TRUE
                </Typography>{" "}
                또는{" "}
                <Typography
                  component="span"
                  sx={{ color: "#164F9E", fontWeight: 500 }}
                >
                  FALSE
                </Typography>
                로 입력
              </Typography>
            </Box>
          </Box>

          <Typography
            variant="body2"
            color="error"
            sx={{
              my: 1,
              fontSize: "12px",
              borderRadius: 1,
            }}
          >
            * 허용되지 않은 값이 입력될 경우, 업로드 과정에서 오류가 발생합니다.
          </Typography>
        </Box>

        <Paper
          {...getRootProps()}
          sx={{
            p: 3,
            textAlign: "center",
            cursor: "pointer",
            border: "2px dashed",
            borderColor: isDragActive ? "primary.main" : "grey.300",
            bgcolor: isDragActive ? "action.hover" : "background.paper",
            opacity: isLoading ? 0.5 : 1,
            pointerEvents: isLoading ? "none" : "auto",
          }}
        >
          <input {...getInputProps()} />
          {file ? (
            <Typography>{file.name}</Typography>
          ) : (
            <Typography>
              {isDragActive
                ? "파일을 여기에 놓으세요"
                : "파일을 드래그하거나 클릭하여 업로드하세요"}
            </Typography>
          )}
        </Paper>

        {error && (
          <Typography color="error" sx={{ mt: 1 }}>
            {error}
          </Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={isLoading}>
          취소
        </Button>
        <Button
          onClick={handleUpload}
          variant="contained"
          disabled={!file || isLoading}
          startIcon={
            isLoading ? <CircularProgress size={20} color="inherit" /> : null
          }
        >
          {isLoading ? "업로드 중..." : "업로드"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default CustomerBulkUploadModal;
