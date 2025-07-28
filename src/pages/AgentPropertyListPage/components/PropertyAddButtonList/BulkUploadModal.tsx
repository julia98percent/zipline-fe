import { useState, useCallback } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  Paper,
  CircularProgress,
} from "@mui/material";
import { useDropzone } from "react-dropzone";
import { uploadPropertiesBulk } from "@apis/propertyService";
import { Link } from "react-router-dom";
import { AxiosError } from "axios";
import { showToast } from "@components/Toast/Toast";
import Button from "@components/Button";

interface Props {
  open: boolean;
  handleClose: () => void;
  fetchPropertyData: () => void;
}

interface ErrorResponse {
  message: string;
}

function BulkUploadModal({ open, handleClose, fetchPropertyData }: Props) {
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

    try {
      setIsLoading(true);
      await uploadPropertiesBulk(file);
      showToast({
        message: "매물 정보를 업로드 했습니다.",
        type: "success",
      });
      handleClose();
      fetchPropertyData();
    } catch (error) {
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
      <DialogTitle>매물 데이터 일괄 등록</DialogTitle>
      <DialogContent>
        <Typography
          variant="subtitle2"
          className="text-gray-800 font-semibold mb-4"
        >
          엑셀 파일 업로드 정책
        </Typography>

        <Box className="flex flex-col gap-3 mb-6">
          <Box className="flex items-center gap-2">
            <Typography variant="body2" color="text.secondary">
              • 파일 형식:
            </Typography>
            <Typography variant="body2" className="font-medium text-primary">
              .xlsx, .xls
            </Typography>
          </Box>

          <Box className="flex items-center gap-2">
            <Typography variant="body2" color="text.secondary">
              • 파일 크기:
            </Typography>
            <Typography variant="body2" className="font-medium text-primary">
              10MB 이하
            </Typography>
          </Box>

          <Typography variant="body2" color="text.secondary">
            • 필수 입력 항목이 누락된 경우 업로드가 실패할 수 있습니다.
          </Typography>
        </Box>

        <Box className="bg-gray-50 p-4 rounded border border-gray-300">
          <Typography variant="body2" color="text.secondary" className="mb-2">
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
          <Typography variant="body2" className="text-primary mt-2">
            <Link
              to={import.meta.env.VITE_PROPERTY_EXCEL_TEMPLATE_URL}
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

        <Box className="mt-6">
          <Typography
            variant="body2"
            className="text-gray-700 mb-2 font-medium"
          >
            • 지정된 입력 값 안내
          </Typography>
          <Box className="pl-4">
            <Typography variant="body2" color="text.secondary" className="mb-2">
              - 매물 카테고리:{" "}
              <Typography component="span" className="font-medium text-primary">
                매매, 전세, 월세
              </Typography>
            </Typography>
            <Typography variant="body2" color="text.secondary">
              - 매물 유형:{" "}
              <Typography component="span" className="font-medium text-primary">
                아파트, 빌라, 상가, 오피스텔, 원룸, 투룸, 주택
              </Typography>
            </Typography>
          </Box>
          <Typography variant="body2" color="error" className="my-2 text-xs">
            * 허용되지 않은 값이 입력될 경우, 업로드 과정에서 오류가 발생합니다.
          </Typography>
        </Box>

        <Paper
          {...getRootProps()}
          className="p-6 text-center cursor-pointer border-2 border-dashed"
          style={{
            borderColor: isDragActive ? "#1976d2" : "#e0e0e0",
            backgroundColor: isDragActive ? "rgba(0, 0, 0, 0.04)" : "#ffffff",
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
          <Typography color="error" className="mt-2">
            {error}
          </Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button
          onClick={handleClose}
          disabled={isLoading}
          variant="outlined"
          color="primary"
        >
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

export default BulkUploadModal;
