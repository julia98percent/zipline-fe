import { useState, useEffect } from "react";
import Select, { MenuItem } from "@components/Select";
import TextField from "@components/TextField";
import RegionSelector from "@components/RegionSelector";
import { SelectChangeEvent } from "@mui/material";
import { formatPhoneNumber } from "@utils/numberUtil";
import { Customer } from "@ts/customer";
import { Region } from "@ts/region";
import { fetchSido, fetchSigungu, fetchDong } from "@apis/regionService";

interface CustomerBasicInfoProps {
  customer: Customer;
  isEditing: boolean;
  editedCustomer: Customer | null;
  onInputChange: (
    field: keyof Customer,
    value: string | number | boolean | null | { uid: number; name: string }[]
  ) => void;
}

const CustomerBasicInfo = ({
  customer,
  isEditing,
  editedCustomer,
  onInputChange,
}: CustomerBasicInfoProps) => {
  const [regions, setRegions] = useState<Region[]>([]);
  const [sigunguOptions, setSigunguOptions] = useState<Region[]>([]);
  const [dongOptions, setDongOptions] = useState<Region[]>([]);
  const [selectedSido, setSelectedSido] = useState<number>(0);
  const [selectedGu, setSelectedGu] = useState<number>(0);
  const [selectedDong, setSelectedDong] = useState<number>(0);

  useEffect(() => {
    const loadRegions = async () => {
      try {
        const sidoData = await fetchSido();
        setRegions(sidoData);
      } catch (error) {
        console.error("시/도 데이터 로드 실패:", error);
      }
    };
    loadRegions();
  }, []);

  useEffect(() => {
    if (selectedSido) {
      const loadSigungu = async () => {
        try {
          const sigunguData = await fetchSigungu(selectedSido);
          setSigunguOptions(sigunguData);
          setSelectedGu(0);
          setDongOptions([]);
        } catch (error) {
          console.error("시/군/구 데이터 로드 실패:", error);
        }
      };
      loadSigungu();
    } else {
      setSigunguOptions([]);
      setDongOptions([]);
      setSelectedGu(0);
    }
  }, [selectedSido]);

  useEffect(() => {
    if (selectedGu) {
      const loadDong = async () => {
        try {
          const dongData = await fetchDong(selectedGu);
          setDongOptions(dongData);
          setSelectedDong(0);
        } catch (error) {
          console.error("동 데이터 로드 실패:", error);
        }
      };
      loadDong();
    } else {
      setDongOptions([]);
      setSelectedDong(0);
    }
  }, [selectedGu]);

  const handleSidoChange = (event: SelectChangeEvent<number>) => {
    const value = Number(event.target.value);
    setSelectedSido(value);
    const selectedRegion = regions.find((r) => r.cortarNo === value);
    if (selectedRegion) {
      onInputChange("preferredRegion", selectedRegion.cortarName);
    }
  };

  const handleGuChange = (event: SelectChangeEvent<number>) => {
    const value = Number(event.target.value);
    setSelectedGu(value);
    const selectedRegion = sigunguOptions.find((r) => r.cortarNo === value);
    if (selectedRegion) {
      onInputChange("preferredRegion", selectedRegion.cortarName);
    }
  };

  const handleDongChange = (event: SelectChangeEvent<number>) => {
    const value = Number(event.target.value);
    setSelectedDong(value);
    const selectedRegion = dongOptions.find((r) => r.cortarNo === value);
    if (selectedRegion) {
      onInputChange("preferredRegion", selectedRegion.cortarName);
    }
  };

  const formatBirthDay = (birthday: string | null) => {
    if (!birthday) return "-";
    return birthday.replace(/(\d{4})(\d{2})(\d{2})/, "$1.$2.$3");
  };

  return (
    <div className="flex-grow p-6 rounded-lg bg-white shadow-sm mt-2">
      <h6 className="mb-4 font-bold text-xl text-primary">기본 정보</h6>
      <div className="flex flex-wrap gap-4">
        <div className="flex-[0_0_calc(50%-8px)]">
          <div className="text-sm text-gray-600 mb-1">이름</div>
          {isEditing ? (
            <TextField
              fullWidth
              size="small"
              value={editedCustomer?.name || ""}
              onChange={(e) => onInputChange("name", e.target.value)}
            />
          ) : (
            <div className="text-base">{customer.name}</div>
          )}
        </div>
        <div className="flex-[0_0_calc(50%-8px)]">
          <div className="text-sm text-gray-600 mb-1">전화번호</div>
          {isEditing ? (
            <TextField
              fullWidth
              size="small"
              value={formatPhoneNumber(editedCustomer?.phoneNo ?? "")}
              onChange={(e) => onInputChange("phoneNo", e.target.value)}
            />
          ) : (
            <div className="text-base">{customer.phoneNo}</div>
          )}
        </div>
        <div className="flex-[0_0_calc(50%-8px)]">
          <div className="text-sm text-gray-600 mb-1">통신사</div>
          {isEditing ? (
            <Select
              value={editedCustomer?.telProvider || ""}
              onChange={(e) => onInputChange("telProvider", e.target.value)}
              size="small"
            >
              <MenuItem value="SKT">SKT</MenuItem>
              <MenuItem value="KT">KT</MenuItem>
              <MenuItem value="LGU+">LGU+</MenuItem>
              <MenuItem value="SKT 알뜰폰">SKT 알뜰폰</MenuItem>
              <MenuItem value="KT 알뜰폰">KT 알뜰폰</MenuItem>
              <MenuItem value="LGU+ 알뜰폰">LGU+ 알뜰폰</MenuItem>
            </Select>
          ) : (
            <div className="text-base">{customer.telProvider || "-"}</div>
          )}
        </div>
        <div className="flex-[0_0_calc(100%)]">
          <div className="text-sm text-gray-600 mb-1">희망 지역</div>
          {isEditing ? (
            <div className="grid grid-cols-3 gap-2">
              <RegionSelector
                label="시/도"
                value={selectedSido}
                regions={regions}
                onChange={handleSidoChange}
              />
              <RegionSelector
                label="시/군/구"
                value={selectedGu}
                regions={sigunguOptions}
                onChange={handleGuChange}
                disabled={!selectedSido}
              />
              <RegionSelector
                label="동"
                value={selectedDong}
                regions={dongOptions}
                onChange={handleDongChange}
                disabled={!selectedGu}
              />
            </div>
          ) : (
            <div className="text-base">{customer.preferredRegion || "-"}</div>
          )}
        </div>
        <div className="flex-[0_0_calc(50%-8px)]">
          <div className="text-sm text-gray-600 mb-1">생년월일</div>
          {isEditing ? (
            <TextField
              fullWidth
              size="small"
              value={editedCustomer?.birthday || ""}
              onChange={(e) => onInputChange("birthday", e.target.value)}
              placeholder="YYYYMMDD"
            />
          ) : (
            <div className="text-base">{formatBirthDay(customer.birthday)}</div>
          )}
        </div>
        <div className="flex-[0_0_calc(50%-8px)]">
          <div className="text-sm text-gray-600 mb-1">유입 경로</div>
          {isEditing ? (
            <TextField
              fullWidth
              size="small"
              value={editedCustomer?.trafficSource || ""}
              onChange={(e) => onInputChange("trafficSource", e.target.value)}
            />
          ) : (
            <div className="text-base">{customer.trafficSource || "-"}</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerBasicInfo;
