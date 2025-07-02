import { Box, Typography, Button as MuiButton } from "@mui/material";

interface Props {
  files: File[];
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const ContractFileUploadSection = ({ files, handleFileChange }: Props) => {
  return (
    <>
      <MuiButton variant="outlined" component="label" sx={{ my: 2 }} fullWidth>
        파일 업로드
        <input type="file" hidden multiple onChange={handleFileChange} />
      </MuiButton>

      {files.length > 0 && (
        <Box sx={{ mb: 2 }}>
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
