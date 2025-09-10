import { useState, useEffect, useRef } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  IconButton,
} from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import { ContractDetail } from "@/types/contract";
import { updateContract, ContractRequest } from "@/apis/contractService";
import { showToast } from "@/components/Toast";
import Button from "@/components/Button";

interface ContractDocumentsEditModalProps {
  open: boolean;
  onClose: () => void;
  contract: ContractDetail;
  onSuccess: () => void;
}

const ContractDocumentsEditModal = ({
  open,
  onClose,
  contract,
  onSuccess,
}: ContractDocumentsEditModalProps) => {
  const [documents, setDocuments] = useState<ContractDetail["documents"]>([]);
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open && contract) {
      setDocuments([...contract.documents]);
      setNewFiles([]);
    }
  }, [open, contract]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);

    const oversizedFiles = files.filter((file) => file.size > 10 * 1024 * 1024);
    if (oversizedFiles.length > 0) {
      showToast({
        message: `파일 크기가 너무 큽니다 (최대 10MB): ${oversizedFiles
          .map((f) => f.name)
          .join(", ")}`,
        type: "error",
      });
      return;
    }

    setNewFiles((prev) => [...prev, ...files]);
  };

  const handleFileInputClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveExistingDocument = (index: number) => {
    setDocuments((prev) => prev.filter((_, i) => i !== index));
  };

  const handleRemoveNewFile = (index: number) => {
    setNewFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      if (
        !contract.lessorOrSellerInfo ||
        contract.lessorOrSellerInfo.length === 0
      ) {
        showToast({
          message:
            "임대인/매도인 정보가 없습니다. 계약 당사자를 먼저 설정해주세요.",
          type: "error",
        });
        return;
      }

      if (
        !contract.lesseeOrBuyerInfo ||
        contract.lesseeOrBuyerInfo.length === 0
      ) {
        showToast({
          message:
            "임차인/매수인 정보가 없습니다. 계약 당사자를 먼저 설정해주세요.",
          type: "error",
        });
        return;
      }

      if (!contract.propertyUid) {
        showToast({
          message: "매물 정보가 없습니다. 페이지를 새로고침해주세요.",
          type: "error",
        });
        return;
      }

      const lessorUids = contract.lessorOrSellerInfo
        .map((party) => party.uid)
        .filter(Boolean);
      const lesseeUids = contract.lesseeOrBuyerInfo
        .map((party) => party.uid)
        .filter(Boolean);

      if (lessorUids.length === 0 || lesseeUids.length === 0) {
        console.error(
          "UID 추출 실패 - lessorUids:",
          lessorUids,
          "lesseeUids:",
          lesseeUids
        );
        showToast({
          message:
            "계약 당사자의 UID 정보가 없습니다. 계약 당사자를 다시 설정해주세요.",
          type: "error",
        });
        return;
      }

      const requestPayload: ContractRequest = {
        category: contract.category,
        contractDate: contract.contractDate,
        contractStartDate: contract.contractStartDate,
        contractEndDate: contract.contractEndDate,
        expectedContractEndDate: contract.expectedContractEndDate,
        deposit: contract.deposit || 0,
        monthlyRent: contract.monthlyRent || 0,
        price: contract.price || 0,
        lessorOrSellerUids: lessorUids,
        lesseeOrBuyerUids: lesseeUids,
        propertyUid: contract.propertyUid,
        status: contract.status,
        other: contract.other || null,
      };

      const docsToKeep = documents.map((doc) => ({
        fileName: doc.fileName,
        fileUrl: doc.fileUrl,
      }));

      const formDataToSend = new FormData();

      formDataToSend.append(
        "existingDocuments",
        new Blob([JSON.stringify(docsToKeep)], { type: "application/json" })
      );

      newFiles.forEach((file) => {
        formDataToSend.append("files", file);
      });

      formDataToSend.append(
        "contractRequestDTO",
        new Blob([JSON.stringify(requestPayload)], {
          type: "application/json",
        })
      );

      await updateContract(contract.uid, formDataToSend);

      showToast({
        message: "첨부 문서가 성공적으로 수정되었습니다.",
        type: "success",
      });

      onSuccess();
      onClose();
    } catch (error: unknown) {
      console.error("첨부 문서 수정 실패:", error);

      const axiosError = error as {
        response?: { status?: number; data?: { message?: string } };
      };

      if (axiosError.response?.status === 413) {
        showToast({
          message:
            "업로드하려는 파일이 너무 큽니다. 파일 크기를 10MB 이하로 줄여주세요.",
          type: "error",
        });
      } else if (axiosError.response?.status === 400) {
        const errorMessage =
          axiosError.response?.data?.message || "잘못된 요청입니다.";
        showToast({
          message: `${errorMessage} 파일 형식이나 계약 정보를 확인해주세요.`,
          type: "error",
        });
      } else if (axiosError.response?.status === 404) {
        showToast({
          message: "계약 정보를 찾을 수 없습니다. 페이지를 새로고침해주세요.",
          type: "error",
        });
      } else {
        const errorMessage =
          axiosError.response?.data?.message ||
          "문서 수정 중 오류가 발생했습니다.";
        showToast({
          message: errorMessage,
          type: "error",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth={false}
      PaperProps={{
        className: "w-[90vw] sm:w-[50vw] h-175 max-h-[90vh] rounded-lg",
      }}
    >
      <DialogTitle className="border-b text-primary font-bold border-gray-200">
        첨부 문서 수정
      </DialogTitle>
      <DialogContent className="bg-neutral-100 flex flex-col gap-3 p-3">
        <div className="flex flex-col gap-4 mt-4">
          <div className="w-full p-5 card">
            <input
              ref={fileInputRef}
              accept="*/*"
              className="hidden"
              type="file"
              multiple
              onChange={handleFileUpload}
            />
            <Button
              variant="outlined"
              startIcon={<UploadFileIcon />}
              className="w-full"
              disabled={isLoading}
              onClick={handleFileInputClick}
            >
              파일 추가
            </Button>
            <p className="text-sm text-neutral-500 mt-1 px-1">
              파일당 최대 10MB까지 업로드 가능합니다.
            </p>
          </div>
          {documents.length > 0 && (
            <div className="flex flex-col p-5 card">
              <h6 className="font-semibold">기존 문서</h6>
              <List className="p-0">
                {documents.map((doc, index) => (
                  <ListItem key={index} divider>
                    <span>{doc.fileName || `문서 ${index + 1}`}</span>
                    <IconButton
                      edge="end"
                      color="error"
                      onClick={() => handleRemoveExistingDocument(index)}
                    >
                      <DeleteOutlineIcon />
                    </IconButton>
                  </ListItem>
                ))}
              </List>
            </div>
          )}
          {newFiles.length > 0 && (
            <div className="p-5 card">
              <h6 className="font-semibold">새로 추가된 문서</h6>
              <List className="p-0">
                {newFiles.map((file, index) => (
                  <ListItem key={index} divider>
                    <ListItemText
                      primary={file.name}
                      secondary={`크기: ${(file.size / 1024 / 1024).toFixed(
                        2
                      )} MB`}
                    />

                    <IconButton
                      edge="end"
                      color="error"
                      onClick={() => handleRemoveNewFile(index)}
                    >
                      <DeleteOutlineIcon />
                    </IconButton>
                  </ListItem>
                ))}
              </List>
            </div>
          )}
          {documents.length === 0 && newFiles.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <p>첨부된 문서가 없습니다.</p>
            </div>
          )}
        </div>
      </DialogContent>
      <DialogActions>
        <Button
          variant="outlined"
          color="info"
          onClick={handleClose}
          disabled={isLoading}
        >
          취소
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          color="primary"
          disabled={isLoading}
        >
          {isLoading ? "저장 중..." : "저장"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ContractDocumentsEditModal;
