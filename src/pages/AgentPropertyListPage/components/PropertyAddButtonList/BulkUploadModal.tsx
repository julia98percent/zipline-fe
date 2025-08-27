import { useState, useCallback } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
} from "@mui/material";
import { useDropzone } from "react-dropzone";
import { uploadPropertiesBulk } from "@apis/propertyService";
import { Link } from "react-router-dom";
import { AxiosError } from "axios";
import { showToast } from "@components/Toast";
import Button from "@components/Button";
import { FILE_ERROR_MESSAGES } from "@constants/clientErrorMessage";
import InfoField from "@components/InfoField";

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
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth={false}
      PaperProps={{
        className: "w-[90vw] md:w-[80vw] max-h-[90vh] rounded-lg",
      }}
    >
      <DialogTitle className="border-b text-primary font-bold border-gray-200">
        매물 데이터 일괄 등록
      </DialogTitle>
      <DialogContent className="bg-neutral-100 flex flex-col gap-3 p-3">
        <div className="p-5 card">
          <h6 className="text-lg font-semibold mb-2">엑셀 파일 업로드 정책</h6>

          <div className="flex flex-col mb-4">
            <InfoField
              label="• 파일 형식:"
              value={
                <span className="text-sm font-medium text-primary">
                  .xlsx, .xls
                </span>
              }
              className="flex flex-row items-center"
            />
            <InfoField
              label="• 파일 크기:"
              value={
                <span className="text-sm font-medium text-primary">
                  10MB 이하
                </span>
              }
              className="flex flex-row items-center"
            />

            <p className="text-sm text-neutral-600 py-1">
              • 필수 입력 항목이 누락된 경우 업로드가 실패할 수 있습니다.
            </p>

            <p className="text-sm ml-4 font-medium text-primary">
              - 필수 항목: 고객명, 매물 주소, 매물 카테고리, 매물 유형,
              공급면적, 전용면적
            </p>
          </div>

          <div className="bg-gray-50 p-4 rounded border border-gray-300">
            <p className="text-sm text-neutral-800 mb-2">
              엑셀의 열 순서가 변경되면 업로드가 실패할 수 있으니,{" "}
              <Link
                to={import.meta.env.VITE_PROPERTY_EXCEL_TEMPLATE_URL}
                className="text-primary font-medium"
              >
                제공되는 템플릿
              </Link>
              을 그대로 사용하는 것을 권장합니다.
            </p>
            <p className="text-primary mt-2">
              <Link
                to={import.meta.env.VITE_PROPERTY_EXCEL_TEMPLATE_URL}
                className="text-primary font-medium"
              >
                → 템플릿 다운로드
              </Link>
            </p>
          </div>
        </div>
        <div className="p-5 card">
          <h6 className="text-md font-semibold mb-2">✔️ 지정된 입력 값 안내</h6>

          <InfoField
            label="• 매물 카테고리:"
            value={
              <span className="text-sm font-medium text-primary">
                아파트, 빌라, 상가, 오피스텔, 원룸, 투룸, 주택
              </span>
            }
            className="flex flex-row items-center"
          />

          <InfoField
            label="• 매물 유형:"
            value={
              <span className="text-sm font-medium text-primary">
                매매, 전세, 월세
              </span>
            }
            className="flex flex-row items-center"
          />

          <p className="my-1 text-sm text-red-600">
            • 허용되지 않은 값이 입력될 경우, 업로드 과정에서 오류가 발생합니다.
          </p>
        </div>
        <div
          {...getRootProps()}
          className={`p-5 text-center cursor-pointer card border border-dashed ${
            isDragActive
              ? "border-primary bg-primary/5"
              : "border-gray-300 bg-white"
          } ${isLoading ? "opacity-50 pointer-events-none" : "opacity-100"}`}
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
        </div>

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
          color="info"
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
