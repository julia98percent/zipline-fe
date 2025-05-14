import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Box,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
  Checkbox,
  InputAdornment,
  Select,
  MenuItem,
  InputLabel,
  SelectChangeEvent,
  Chip,
} from "@mui/material";
import Button from "@components/Button";
import TextField from "@components/TextField";
import apiClient from "@apis/apiClient";
import AddIcon from '@mui/icons-material/Add';
import { toast } from "react-toastify";

const phoneRegex = /^\d{3}-\d{3,4}-\d{4}$/;

interface CustomerAddModalProps {
  open: boolean;
  handleClose: () => void;
  fetchCustomerList: () => void;
}

interface CustomerFormData {
  name: string;
  phoneNo: string;
  birthDay: string;
  telProvider: string;
  legalDistrictCode: string;
  trafficSource: string;
  seller: boolean;
  buyer: boolean;
  tenant: boolean;
  landlord: boolean;
  minPrice: string;
  maxPrice: string;
  minRent: string;
  maxRent: string;
  minDeposit: string;
  maxDeposit: string;
  labelUids: number[];
}

interface Region {
  cortarNo: number;
  cortarName: string;
  centerLat: number;
  centerLon: number;
  level: number;
  parentCortarNo: number;
}

interface RegionState {
  sido: Region[];
  sigungu: Region[];
  dong: Region[];
  selectedSido: number | null;
  selectedSigungu: number | null;
  selectedDong: number | null;
  [key: string]: Region[] | number | null;
}

interface Label {
  uid: number;
  name: string;
}

const initialFormData: CustomerFormData = {
  name: '',
  phoneNo: '',
  birthDay: '',
  telProvider: 'SKT',
  legalDistrictCode: '',
  trafficSource: '',
  seller: false,
  buyer: false,
  tenant: false,
  landlord: false,
  minPrice: '',
  maxPrice: '',
  minRent: '',
  maxRent: '',
  minDeposit: '',
  maxDeposit: '',
  labelUids: [],
};

function CustomerAddModal({
  open,
  handleClose,
  fetchCustomerList,
}: CustomerAddModalProps) {
  const [formData, setFormData] = useState<CustomerFormData>(initialFormData);
  const [region, setRegion] = useState<RegionState>({
    sido: [],
    sigungu: [],
    dong: [],
    selectedSido: null,
    selectedSigungu: null,
    selectedDong: null,
  });
  const [labels, setLabels] = useState<Label[]>([]);
  const [selectedLabels, setSelectedLabels] = useState<Label[]>([]);
  const [isAddingLabel, setIsAddingLabel] = useState(false);
  const [newLabelName, setNewLabelName] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleRegionChange = (type: 'sido' | 'sigungu' | 'dong') => (event: SelectChangeEvent) => {
    const value = Number(event.target.value);
    const key = `selected${type.charAt(0).toUpperCase() + type.slice(1)}` as keyof RegionState;
    setRegion(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const onClose = () => {
    handleClose();
    setFormData(initialFormData);
  };

  const handleSubmit = async () => {
    try {
      // 선택된 지역 코드 (동 > 군구 > 시도 순으로 선택)
      const selectedRegion = region.selectedDong || region.selectedSigungu || region.selectedSido;

      // 쉼표가 포함된 문자열에서 숫자만 추출
      const parsePrice = (price: string) => {
        if (!price) return null;
        return Number(price.replace(/[^0-9]/g, ''));
      };

      const customerData = {
        name: formData.name,
        phoneNo: formData.phoneNo,
        birthDay: formData.birthDay,
        telProvider: formData.telProvider,
        legalDistrictCode: String(selectedRegion || ''),
        trafficSource: formData.trafficSource,
        landlord: formData.landlord,
        tenant: formData.tenant,
        buyer: formData.buyer,
        seller: formData.seller,
        minPrice: parsePrice(formData.minPrice),
        maxPrice: parsePrice(formData.maxPrice),
        minRent: parsePrice(formData.minRent),
        maxRent: parsePrice(formData.maxRent),
        minDeposit: parsePrice(formData.minDeposit),
        maxDeposit: parsePrice(formData.maxDeposit),
        labelUids: formData.labelUids,
      };

      // 고객 등록 API 호출
      const response = await apiClient.post("/customers", customerData);

      if (response.status === 201) {
        toast.success("고객 등록에 성공했습니다.");
        fetchCustomerList();  
        onClose();     
      }
    } catch (error) {
      toast.error("고객 등록 실패:", error);
    }
  };

  useEffect(() => {
    if (open) {
      // 시도 데이터 로드
      apiClient.get("/region/0")
        .then((res) => {
          if (res.data?.data) {
            setRegion(prev => ({ ...prev, sido: res.data.data }));
          }
        })
        .catch(console.error);
    } else {
      // 모달이 닫힐 때 지역 상태 초기화
      setRegion({
        sido: [],
        sigungu: [],
        dong: [],
        selectedSido: null,
        selectedSigungu: null,
        selectedDong: null,
      });
    }
  }, [open]);

  // 시도 선택 시 군구 로드
  useEffect(() => {
    if (!region.selectedSido) return;
    apiClient.get(`/region/${region.selectedSido}`)
      .then((res) => {
        if (res.data?.data) {
          setRegion(prev => ({
            ...prev,
            sigungu: res.data.data,
            selectedSigungu: null,
            selectedDong: null,
            dong: [],
          }));
        }
      })
      .catch(console.error);
  }, [region.selectedSido]);

  // 군구 선택 시 동 로드
  useEffect(() => {
    if (!region.selectedSigungu) return;
    apiClient.get(`/region/${region.selectedSigungu}`)
      .then((res) => {
        if (res.data?.data) {
          setRegion(prev => ({
            ...prev,
            dong: res.data.data,
            selectedDong: null,
          }));
        }
      })
      .catch(console.error);
  }, [region.selectedSigungu]);

  // 라벨 목록 불러오기
  const fetchLabels = async () => {
    try {
      const response = await apiClient.get("/labels");
      if (response.data?.data?.labels) {
        setLabels(response.data.data.labels);
      }
    } catch (error) {
      console.error("라벨 목록 불러오기 실패:", error);
    }
  };

  useEffect(() => {
    if (open) {
      fetchLabels();
    }
  }, [open]);

  // 새 라벨 추가
  const handleAddLabel = async () => {
    if (!newLabelName.trim()) return;

    try {
      await apiClient.post("/labels", { name: newLabelName });
      setNewLabelName('');
      setIsAddingLabel(false);
      fetchLabels(); // 라벨 목록 새로고침
    } catch (error) {
      console.error("라벨 추가 실패:", error);
    }
  };

  // 라벨 선택 처리
  const handleLabelSelect = (label: Label) => {
    const isSelected = selectedLabels.some(l => l.uid === label.uid);
    let newSelectedLabels: Label[];

    if (isSelected) {
      newSelectedLabels = selectedLabels.filter(l => l.uid !== label.uid);
    } else {
      newSelectedLabels = [...selectedLabels, label];
    }

    setSelectedLabels(newSelectedLabels);
    setFormData(prev => ({
      ...prev,
      labelUids: newSelectedLabels.map(l => l.uid)
    }));
  };

  const isSubmitButtonDisabled = !formData.name || !phoneRegex.test(formData.phoneNo);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '8px',
          maxHeight: '90vh'
        }
      }}
    >
      <DialogTitle sx={{ borderBottom: '1px solid #E0E0E0', pb: 2, fontWeight: 'bold' }}>
        기본 정보
      </DialogTitle>

      <DialogContent sx={{ mt: 2 }}>
        <Box sx={{ mb: 4 }}>
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>이름</Typography>
            <TextField
              name="name"
              value={formData.name}
              onChange={handleChange}
              fullWidth
              placeholder="이름을 입력하세요"
              size="small"
            />
          </Box>
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>전화번호</Typography>
            <TextField
              name="phoneNo"
              value={formData.phoneNo}
              onChange={handleChange}
              fullWidth
              placeholder="000-0000-0000"
              size="small"
            />
          </Box>
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>생년월일</Typography>
            <TextField
              name="birthDay"
              value={formData.birthDay}
              onChange={handleChange}
              fullWidth
              placeholder="YYYYMMDD"
              size="small"
              inputProps={{
                maxLength: 8,
              }}
            />
          </Box>

          <Box>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>통신사</Typography>
            <FormControl>
              <RadioGroup
                name="telProvider"
                value={formData.telProvider}
                onChange={handleChange}
                row
                sx={{ gap: 4 }}
              >
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <FormControlLabel value="SKT" control={<Radio />} label="SKT" />
                  <FormControlLabel value="SKT 알뜰폰" control={<Radio />} label="SKT 알뜰폰" />
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <FormControlLabel value="KT" control={<Radio />} label="KT" />
                  <FormControlLabel value="KT 알뜰폰" control={<Radio />} label="KT 알뜰폰" />
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <FormControlLabel value="LGU+" control={<Radio />} label="LGU+" />
                  <FormControlLabel value="LGU+ 알뜰폰" control={<Radio />} label="LGU+ 알뜰폰" />
                </Box>
              </RadioGroup>
            </FormControl>
          </Box>
        </Box>

        {/* 부가 정보 */}
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
          부가 정보
        </Typography>
        <Box sx={{ mb: 4 }}>
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>관심 지역</Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {["sido", "sigungu", "dong"].map((type) => (
                <FormControl fullWidth key={type} size="small">
                  <InputLabel>{type === "sido" ? "시/도" : type === "sigungu" ? "시/군/구" : "읍/면/동"}</InputLabel>
                  <Select
                    value={String(region[`selected${type.charAt(0).toUpperCase() + type.slice(1)}`] || '')}
                    onChange={handleRegionChange(type as any)}
                    label={type === "sido" ? "시/도" : type === "sigungu" ? "시/군/구" : "읍/면/동"}
                    disabled={type !== "sido" && !region[`selected${type === "dong" ? "Sigungu" : "Sido"}`]}
                  >
                    {(region[type] as Region[]).map((item: Region) => (
                      <MenuItem key={item.cortarNo} value={String(item.cortarNo)}>
                        {item.cortarName}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              ))}
            </Box>
          </Box>
          <Box>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>유입경로</Typography>
            <TextField
              name="trafficSource"
              value={formData.trafficSource}
              onChange={handleChange}
              fullWidth
              placeholder="유입경로를 입력하세요"
              size="small"
            />
          </Box>
        </Box>

        {/* 역할 */}
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
          역할
        </Typography>
        <Box sx={{ mb: 4, display: 'flex', gap: 4 }}>
          <FormControlLabel
            control={
              <Checkbox
                name="seller"
                checked={formData.seller}
                onChange={handleChange}
              />
            }
            label="매도자"
          />
          <FormControlLabel
            control={
              <Checkbox
                name="buyer"
                checked={formData.buyer}
                onChange={handleChange}
              />
            }
            label="매수자"
          />
          <FormControlLabel
            control={
              <Checkbox
                name="tenant"
                checked={formData.tenant}
                onChange={handleChange}
              />
            }
            label="임차인"
          />
          <FormControlLabel
            control={
              <Checkbox
                name="landlord"
                checked={formData.landlord}
                onChange={handleChange}
              />
            }
            label="임대인"
          />
        </Box>

        {/* 매매가 범위 - 매도자 또는 매수자 선택 시 */}
        {(formData.seller || formData.buyer) && (
          <>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
              희망 매매가 범위
            </Typography>
            <Box sx={{ mb: 4, display: "flex", gap: 2 }}>
              <TextField
                name="minPrice"
                value={formData.minPrice}
                onChange={handleChange}
                placeholder="최소 금액"
                size="small"
                fullWidth
                InputProps={{
                  endAdornment: <InputAdornment position="end">원</InputAdornment>,
                }}
                inputProps={{
                  type: "text",
                  pattern: "[0-9]*",
                  inputMode: "numeric",
                  onChange: (e) => {
                    const value = e.target.value.replace(/[^0-9]/g, '');
                    e.target.value = value ? new Intl.NumberFormat('ko-KR').format(Number(value)) : '';
                  },
                }}
              />
              <TextField
                name="maxPrice"
                value={formData.maxPrice}
                onChange={handleChange}
                placeholder="최대 금액"
                size="small"
                fullWidth
                InputProps={{
                  endAdornment: <InputAdornment position="end">원</InputAdornment>,
                }}
                inputProps={{
                  type: "text",
                  pattern: "[0-9]*",
                  inputMode: "numeric",
                  onChange: (e) => {
                    const value = e.target.value.replace(/[^0-9]/g, '');
                    e.target.value = value ? new Intl.NumberFormat('ko-KR').format(Number(value)) : '';
                  },
                }}
              />
            </Box>
          </>
        )}

        {/* 월세 및 보증금 범위 - 임차인 또는 임대인 선택 시 */}
        {(formData.tenant || formData.landlord) && (
          <>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
              희망 월세 범위
            </Typography>
            <Box sx={{ mb: 4, display: "flex", gap: 2 }}>
              <TextField
                name="minRent"
                value={formData.minRent}
                onChange={handleChange}
                placeholder="최소 금액"
                size="small"
                fullWidth
                InputProps={{
                  endAdornment: <InputAdornment position="end">원</InputAdornment>,
                }}
                inputProps={{
                  type: "text",
                  pattern: "[0-9]*",
                  inputMode: "numeric",
                  onChange: (e) => {
                    const value = e.target.value.replace(/[^0-9]/g, '');
                    e.target.value = value ? new Intl.NumberFormat('ko-KR').format(Number(value)) : '';
                  },
                }}
              />
              <TextField
                name="maxRent"
                value={formData.maxRent}
                onChange={handleChange}
                placeholder="최대 금액"
                size="small"
                fullWidth
                InputProps={{
                  endAdornment: <InputAdornment position="end">원</InputAdornment>,
                }}
                inputProps={{
                  type: "text",
                  pattern: "[0-9]*",
                  inputMode: "numeric",
                  onChange: (e) => {
                    const value = e.target.value.replace(/[^0-9]/g, '');
                    e.target.value = value ? new Intl.NumberFormat('ko-KR').format(Number(value)) : '';
                  },
                }}
              />
            </Box>

            <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
              희망 보증금 범위
            </Typography>
            <Box sx={{ mb: 4, display: "flex", gap: 2 }}>
              <TextField
                name="minDeposit"
                value={formData.minDeposit}
                onChange={handleChange}
                placeholder="최소 금액"
                size="small"
                fullWidth
                InputProps={{
                  endAdornment: <InputAdornment position="end">원</InputAdornment>,
                }}
                inputProps={{
                  type: "text",
                  pattern: "[0-9]*",
                  inputMode: "numeric",
                  onChange: (e) => {
                    const value = e.target.value.replace(/[^0-9]/g, '');
                    e.target.value = value ? new Intl.NumberFormat('ko-KR').format(Number(value)) : '';
                  },
                }}
              />
              <TextField
                name="maxDeposit"
                value={formData.maxDeposit}
                onChange={handleChange}
                placeholder="최대 금액"
                size="small"
                fullWidth
                InputProps={{
                  endAdornment: <InputAdornment position="end">원</InputAdornment>,
                }}
                inputProps={{
                  type: "text",
                  pattern: "[0-9]*",
                  inputMode: "numeric",
                  onChange: (e) => {
                    const value = e.target.value.replace(/[^0-9]/g, '');
                    e.target.value = value ? new Intl.NumberFormat('ko-KR').format(Number(value)) : '';
                  },
                }}
              />
            </Box>
          </>
        )}

        {/* 라벨 선택 */}
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              라벨 선택
            </Typography>
            <Button
              text="라벨 추가"
              startIcon={<AddIcon />}
              sx={{ color: '#6366F1' }}
              onClick={() => setIsAddingLabel(true)}
            />
          </Box>

          {/* 라벨 추가 입력 필드 */}
          {isAddingLabel && (
            <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
              <TextField
                size="small"
                value={newLabelName}
                onChange={(e) => setNewLabelName(e.target.value)}
                placeholder="새 라벨 이름"
                fullWidth
              />
              <Button
                text="추가"
                onClick={handleAddLabel}
                sx={{
                  backgroundColor: '#6366F1',
                  color: 'white',
                  '&:hover': {
                    backgroundColor: '#5457E5',
                  },
                }}
              />
              <Button
                text="취소"
                onClick={() => {
                  setIsAddingLabel(false);
                  setNewLabelName('');
                }}
                sx={{
                  color: '#6366F1',
                  borderColor: '#6366F1',
                }}
                variant="outlined"
              />
            </Box>
          )}

          {/* 라벨 목록 */}
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {labels.map((label) => (
              <Chip
                key={label.uid}
                label={label.name}
                onClick={() => handleLabelSelect(label)}
                onDelete={
                  selectedLabels.some(l => l.uid === label.uid)
                    ? () => handleLabelSelect(label)
                    : undefined
                }
                sx={{
                  backgroundColor: selectedLabels.some(l => l.uid === label.uid)
                    ? '#6366F1'
                    : 'transparent',
                  color: selectedLabels.some(l => l.uid === label.uid)
                    ? 'white'
                    : 'inherit',
                  border: '1px solid #6366F1',
                  '&:hover': {
                    backgroundColor: selectedLabels.some(l => l.uid === label.uid)
                      ? '#5457E5'
                      : 'rgba(99, 102, 241, 0.1)',
                  },
                }}
              />
            ))}
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 3, borderTop: '1px solid #E0E0E0' }}>
        <Button
          text="취소"
          onClick={onClose}
          variant="outlined"
          sx={{ color: '#6366F1', borderColor: '#6366F1' }}
        />
        <Button
          text="고객 추가하기"
          onClick={handleSubmit}
          variant="contained"
          sx={{ bgcolor: '#6366F1' }}
          disabled={isSubmitButtonDisabled}
        />
      </DialogActions>
    </Dialog>
  );
}

export default CustomerAddModal;
