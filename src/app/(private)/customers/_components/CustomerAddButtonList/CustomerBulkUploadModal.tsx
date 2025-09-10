"use client";

import { useState, useCallback } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  CircularProgress,
} from "@mui/material";
import { useDropzone } from "react-dropzone";
import { uploadCustomersBulk } from "@/apis/customerService";
import CustomLink from "@/components/CustomLink";
import { AxiosError } from "axios";
import { showToast } from "@/components/Toast";
import Button from "@/components/Button";
import InfoField from "@/components/InfoField";

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

    try {
      setIsLoading(true);
      await uploadCustomersBulk(file);
      showToast({
        message: "고객 정보를 업데이트 했습니다.",
        type: "success",
      });
      handleClose();
      fetchCustomerData();
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
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth={false}
      PaperProps={{
        className: "w-[90vw] md:w-[80vw] max-h-[90vh] rounded-lg",
      }}
    >
      <DialogTitle className="border-b text-primary font-bold border-gray-200">
        고객 데이터 일괄 등록
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
          </div>

          <div className="bg-gray-50 p-4 rounded border border-gray-300">
            <p className="text-sm text-neutral-800 mb-2">
              엑셀의 열 순서가 변경되면 업로드가 실패할 수 있으니,{" "}
              <CustomLink
                href={process.env.NEXT_PUBLIC_PROPERTY_EXCEL_TEMPLATE_URL!}
                className="text-primary font-medium"
              >
                제공되는 템플릿
              </CustomLink>
              을 그대로 사용하는 것을 권장합니다.
            </p>
            <span className="text-primary mt-2">
              <CustomLink
                href={process.env.NEXT_PUBLIC_CUSTOMER_EXCEL_TEMPLATE_URL!}
                className="text-primary font-medium"
              >
                → 템플릿 다운로드
              </CustomLink>
            </span>
          </div>
        </div>
        <div className="p-5 card">
          <h6 className="text-md font-semibold mb-2">✔️ 지정된 입력 값 안내</h6>

          <InfoField
            label="• 고객 전화번호 형식:"
            value={
              <span className="text-sm font-medium text-primary">
                000-0000-0000
              </span>
            }
            className="flex flex-row items-center"
          />

          <InfoField
            label="• 생일 형식:"
            value={
              <span className="text-sm font-medium text-primary">
                YYYYMMDD (숫자 8자리)
              </span>
            }
            className="flex flex-row items-center"
          />

          <InfoField
            label="• 고객 역할 지정:"
            value={
              <p className="text-sm">
                임대인, 매도인, 임차인, 매수인 항목에{" "}
                <span className="font-medium text-primary">TRUE</span> 또는{" "}
                <span className="font-medium text-primary">FALSE</span>로 입력
              </p>
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
            <span>{file.name}</span>
          ) : (
            <p>
              {isDragActive
                ? "파일을 여기에 놓으세요"
                : "파일을 드래그하거나 클릭하여 업로드하세요"}
            </p>
          )}
        </div>

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

export default CustomerBulkUploadModal;
