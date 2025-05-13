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
import { toast } from "react-toastify";
import { AxiosError } from "axios";

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

    const formData = new FormData();
    formData.append("file", file);

    try {
      setIsLoading(true);
      await apiClient.post("/properties/bulk", formData);
      toast.success("매물 정보 업로드에 성공했습니다");
      handleClose();
      fetchPropertyData();
    } catch (error) {
      console.log(error);
      const axiosError = error as AxiosError<ErrorResponse>;
      const errorMessage =
        axiosError.response?.data?.message ||
        "파일 업로드 중 오류가 발생했습니다.";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>매물 데이터 일괄 등록</DialogTitle>
      <DialogContent>
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            엑셀 파일 업로드 정책
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            • 엑셀 파일(.xlsx, .xls)만 업로드 가능합니다.
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            • 파일 크기는 10MB 이하로 제한됩니다.
          </Typography>
          <Typography variant="body2" color="text.secondary">
            • 필수 입력 항목이 누락된 경우 업로드가 실패할 수 있습니다.
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

export default BulkUploadModal;
