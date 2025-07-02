import {
  Box,
  Typography,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";
import TextField from "@components/TextField";

interface BasicInfoSectionProps {
  name: string;
  phoneNo: string;
  birthday: string;
  telProvider: string;
  onFieldChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function BasicInfoSection({
  name,
  phoneNo,
  birthday,
  telProvider,
  onFieldChange,
}: BasicInfoSectionProps) {
  return (
    <Box sx={{ mb: 4 }}>
      <Box sx={{ mb: 2 }}>
        <Typography variant="subtitle2" sx={{ mb: 1 }}>
          이름
        </Typography>
        <TextField
          name="name"
          value={name}
          onChange={onFieldChange}
          fullWidth
          placeholder="이름을 입력하세요"
          size="small"
        />
      </Box>
      <Box sx={{ mb: 2 }}>
        <Typography variant="subtitle2" sx={{ mb: 1 }}>
          전화번호
        </Typography>
        <TextField
          name="phoneNo"
          value={phoneNo}
          onChange={onFieldChange}
          fullWidth
          placeholder="000-0000-0000"
          size="small"
        />
      </Box>
      <Box sx={{ mb: 2 }}>
        <Typography variant="subtitle2" sx={{ mb: 1 }}>
          생년월일
        </Typography>
        <TextField
          name="birthday"
          value={birthday}
          onChange={onFieldChange}
          fullWidth
          placeholder="YYYYMMDD"
          size="small"
          inputProps={{
            maxLength: 8,
          }}
        />
      </Box>

      <Box>
        <Typography variant="subtitle2" sx={{ mb: 1 }}>
          통신사
        </Typography>
        <FormControl>
          <RadioGroup
            name="telProvider"
            value={telProvider}
            onChange={onFieldChange}
            row
            sx={{ gap: 4 }}
          >
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              <FormControlLabel value="SKT" control={<Radio />} label="SKT" />
              <FormControlLabel
                value="SKT 알뜰폰"
                control={<Radio />}
                label="SKT 알뜰폰"
              />
            </Box>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              <FormControlLabel value="KT" control={<Radio />} label="KT" />
              <FormControlLabel
                value="KT 알뜰폰"
                control={<Radio />}
                label="KT 알뜰폰"
              />
            </Box>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              <FormControlLabel value="LGU+" control={<Radio />} label="LGU+" />
              <FormControlLabel
                value="LGU+ 알뜰폰"
                control={<Radio />}
                label="LGU+ 알뜰폰"
              />
            </Box>
          </RadioGroup>
        </FormControl>
      </Box>
    </Box>
  );
}
