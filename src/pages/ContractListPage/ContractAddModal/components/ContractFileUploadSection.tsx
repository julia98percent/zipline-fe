import UploadFileIcon from "@mui/icons-material/UploadFile";
import DeleteIcon from "@mui/icons-material/DeleteOutlineRounded";
import IconButton from "@mui/material/IconButton";
import Button from "@components/Button";
import { useRef } from "react";
import { Divider } from "@mui/material";

interface Props {
  files: File[];
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFileRemove: (index: number) => void;
}

const ContractFileUploadSection = ({
  files,
  handleFileChange,
  onFileRemove,
}: Props) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileInputClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="p-5 card">
      <input
        ref={fileInputRef}
        accept="*/*"
        style={{ display: "none" }}
        type="file"
        multiple
        onChange={handleFileChange}
      />
      <Button
        variant="outlined"
        startIcon={<UploadFileIcon />}
        onClick={handleFileInputClick}
        fullWidth
      >
        파일 추가
      </Button>
      <p className="text-sm text-neutral-500 my-1 px-1">
        파일당 최대 10MB까지 업로드 가능합니다.
      </p>
      {files.length > 0 && (
        <div className="mb-4">
          <Divider className="my-4" />
          <span className="text-sm font-medium mb-2 block">업로드된 파일:</span>
          <div className="space-y-2">
            {files.map((file, idx) => (
              <div
                key={idx}
                className="flex items-center border border-neutral-300 rounded-lg p-2 bg-neutral-50"
              >
                <span className="text-sm text-gray-700 truncate flex-1 mr-2">
                  {file.name}
                </span>
                <IconButton
                  size="small"
                  onClick={() => onFileRemove(idx)}
                  className="text-red-500 hover:bg-red-50"
                  title="파일 제거"
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ContractFileUploadSection;
