import { useState, useCallback } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Paper,
  CircularProgress,
} from "@mui/material";
import { useDropzone } from "react-dropzone";
import { uploadPropertiesBulk } from "@apis/propertyService";
import { Link } from "react-router-dom";
import { AxiosError } from "axios";
import { showToast } from "@components/Toast";
import Button from "@components/Button";
import { FILE_ERROR_MESSAGES } from "@constants/clientErrorMessage";

interface Props {
  open: boolean;
  handleClose: () => void;
  fetchPropertyData: () => void;
}

interface ErrorResponse {
  message: string;
  code?: string;
  errors?: Array<{
    message: string;
    value: string;
    field: string;
    rowNum: number;
  }>;
}

function BulkUploadModal({ open, handleClose, fetchPropertyData }: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string>("");
  const [detailedErrors, setDetailedErrors] = useState<ErrorResponse["errors"]>(
    []
  );
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
      setDetailedErrors([]);
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
      const errorResponse = axiosError.response?.data;

      if (errorResponse?.errors && errorResponse.errors.length > 0) {
        setDetailedErrors(errorResponse.errors);
        setError(errorResponse.message || FILE_ERROR_MESSAGES.UPLOAD_FAILED);
      } else {
        const errorMessage =
          errorResponse?.message || FILE_ERROR_MESSAGES.UPLOAD_FAILED;
        setError(errorMessage);
        setDetailedErrors([]);
      }

      showToast({
        message: errorResponse?.message || FILE_ERROR_MESSAGES.UPLOAD_FAILED,
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
        <div className="flex flex-col gap-1 mb-6">
          <p className="text-gray-800 font-semibold">엑셀 파일 업로드 정책</p>

          <div className="flex items-center gap-2">
            <p className="text-secondary">
              • 파일 형식:{" "}
              <span className="font-medium text-primary">.xlsx, .xls</span>
            </p>
          </div>

          <div className="flex items-center gap-2">
            <p color="text.secondary">• 파일 크기:</p>
            <p className="font-medium text-primary">10MB 이하</p>
          </div>

          <p color="text.secondary">
            • 필수 입력 항목이 누락된 경우 업로드가 실패할 수 있습니다.
          </p>
          <p className="ml-4 font-medium text-primary">
            - 필수 항목: 고객명, 매물 주소, 매물 카테고리, 매물 유형, 공급면적,
            전용면적
          </p>
        </div>

        <div className="bg-gray-50 p-4 rounded border border-gray-300">
          <p color="text.secondary" className="mb-2">
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
          </p>
          <p className="text-primary mt-2">
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
          </p>
        </div>

        <div className="mt-6">
          <p className="text-gray-800 font-semibold">지정된 입력 값 안내</p>

          <p color="text.secondary" className="inline">
            • 매물 카테고리:{" "}
          </p>
          <span className="font-medium text-primary">
            아파트, 빌라, 상가, 오피스텔, 원룸, 투룸, 주택
          </span>
          <p color="text.secondary">
            • 매물 유형:{" "}
            <span className="font-medium text-primary">매매, 전세, 월세</span>
          </p>
        </div>

        <p className="my-2 text-xs text-red-500">
          * 허용되지 않은 값이 입력될 경우, 업로드 과정에서 오류가 발생합니다.
        </p>

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
            <p>{file.name}</p>
          ) : (
            <p>
              {isDragActive
                ? "파일을 여기에 놓으세요"
                : "파일을 드래그하거나 클릭하여 업로드하세요"}
            </p>
          )}
        </Paper>

        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded">
            <p className="text-red-700 font-medium mb-2">{error}</p>
            {detailedErrors && detailedErrors.length > 0 && (
              <div className="mt-3">
                <p className="text-red-600 text-sm font-medium mb-2">
                  상세 오류 내역:
                </p>
                <ul className="text-red-600 text-sm space-y-1">
                  {detailedErrors.map((err, index) => (
                    <li key={index} className="flex items-start">
                      <span className="inline-block w-1 h-1 bg-red-500 rounded-full mt-2 mr-2 flex-shrink-0" />
                      <span>
                        <strong>{err.rowNum}행</strong> - {err.message}
                        {err.value && (
                          <span className="text-red-500 ml-1">
                            (입력값: "{err.value}")
                          </span>
                        )}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
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
