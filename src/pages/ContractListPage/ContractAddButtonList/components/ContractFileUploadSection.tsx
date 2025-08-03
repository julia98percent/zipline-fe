import { Box, Typography } from "@mui/material";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import Button from "@components/Button";
import { useRef } from "react";

interface Props {
  files: File[];
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const ContractFileUploadSection = ({ files, handleFileChange }: Props) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileInputClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <>
      <div>
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
        <Typography
          variant="caption"
          display="block"
          className="mt-2 text-primary"
        >
          파일당 최대 10MB까지 업로드 가능합니다.
        </Typography>
      </div>

      {files.length > 0 && (
        <Box className="mb-4">
          <Typography variant="body2">업로드된 파일:</Typography>
          <ul>
            {files.map((file, idx) => (
              <li key={idx}>{file.name}</li>
            ))}
          </ul>
        </Box>
      )}
    </>
  );
};

export default ContractFileUploadSection;
