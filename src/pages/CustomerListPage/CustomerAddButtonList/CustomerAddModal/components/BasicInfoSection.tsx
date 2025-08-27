import {
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
  onNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPhoneChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBirthdayChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onTelProviderChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFieldBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
}

export default function BasicInfoSection({
  name,
  phoneNo,
  birthday,
  telProvider,
  onNameChange,
  onPhoneChange,
  onBirthdayChange,
  onTelProviderChange,
  onFieldBlur,
}: BasicInfoSectionProps) {
  return (
    <div className="p-5 card">
      <h5 className="text-lg font-bold mb-4">기본 정보</h5>
      <div className="flex flex-col gap-5 mb-4">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <TextField
            name="name"
            value={name}
            onChange={onNameChange}
            fullWidth
            label="이름"
            placeholder="이름을 입력하세요"
            required
            inputProps={{
              maxLength: 50,
            }}
          />

          <TextField
            name="phoneNo"
            value={phoneNo}
            onChange={onPhoneChange}
            onBlur={onFieldBlur}
            fullWidth
            label="전화번호"
            placeholder="전화번호를 입력하세요"
            required
          />

          <TextField
            name="birthday"
            value={birthday}
            onChange={onBirthdayChange}
            fullWidth
            label="생년월일"
            placeholder="YYYYMMDD"
            inputProps={{
              maxLength: 8,
            }}
          />
        </div>
        <div>
          <h6 className="font-semibold">통신사</h6>
          <FormControl>
            <RadioGroup
              name="telProvider"
              value={telProvider}
              onChange={onTelProviderChange}
              row
              className="gap-1"
            >
              <div>
                <FormControlLabel value="SKT" control={<Radio />} label="SKT" />
                <FormControlLabel value="KT" control={<Radio />} label="KT" />
                <FormControlLabel
                  value="LGU+"
                  control={<Radio />}
                  label="LGU+"
                />
              </div>
              <div>
                <FormControlLabel
                  value="SKT_MVNO"
                  control={<Radio />}
                  label="SKT 알뜰폰"
                />
                <FormControlLabel
                  value="KT_MVNO"
                  control={<Radio />}
                  label="KT 알뜰폰"
                />
                <FormControlLabel
                  value="LGU+_MVNO"
                  control={<Radio />}
                  label="LGU+ 알뜰폰"
                />
              </div>
            </RadioGroup>
          </FormControl>
        </div>
      </div>
    </div>
  );
}
