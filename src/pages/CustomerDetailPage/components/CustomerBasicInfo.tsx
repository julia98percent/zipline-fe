import { useState, useEffect } from "react";
import Select, { MenuItem } from "@components/Select";
import TextField from "@components/TextField";
import RegionSelector from "@components/RegionSelector";
import { SelectChangeEvent } from "@mui/material";
import { formatPhoneNumber } from "@utils/numberUtil";
import { Customer } from "@ts/customer";
import { Region } from "@ts/region";
import { fetchSido, fetchSigungu, fetchDong } from "@apis/regionService";
import { RegionHierarchy } from "@utils/regionUtil";
import InfoField from "@components/InfoField";

interface CustomerBasicInfoProps {
  customer: Customer;
  isEditing: boolean;
  editedCustomer: Customer | null;
  onInputChange: (
    field: keyof Customer,
    value: string | number | boolean | null | { uid: number; name: string }[]
  ) => void;
  initialRegionValueList?: RegionHierarchy | null;
}

const CustomerBasicInfo = ({
  customer,
  isEditing,
  editedCustomer,
  onInputChange,
  initialRegionValueList,
}: CustomerBasicInfoProps) => {
  const [sidoOptions, setSidoOptions] = useState<Region[]>([]);
  const [sigunguOptions, setSigunguOptions] = useState<Region[]>([]);
  const [dongOptions, setDongOptions] = useState<Region[]>([]);
  const [selectedSido, setSelectedSido] = useState<number | null>(null);
  const [selectedGu, setSelectedGu] = useState<number | null>(null);
  const [selectedDong, setSelectedDong] = useState<number | null>(null);

  useEffect(() => {
    const loadRegions = async () => {
      try {
        const sidoData = await fetchSido();
        setSidoOptions(sidoData);
      } catch (error) {
        console.error("시/도 데이터 로드 실패:", error);
      }
    };
    loadRegions();
  }, []);

  useEffect(() => {
    const getInitialRegionValuesByCode = async () => {
      if (!customer.preferredRegion || !initialRegionValueList) {
        return;
      }

      try {
        const { sidoCode, sigunguCode, dongCode } = initialRegionValueList;

        if (sidoCode && sidoOptions.length > 0) {
          const sigunguData = await fetchSigungu(sidoCode);

          setSigunguOptions(sigunguData);

          if (sigunguCode) {
            const dongData = await fetchDong(sigunguCode);
            setDongOptions(dongData);
          }
        }

        setSelectedSido(sidoCode);
        setSelectedGu(sigunguCode || null);
        setSelectedDong(dongCode || null);
      } catch (error) {
        console.error("지역 코드로 초기화 실패:", error);
      }
    };

    if (isEditing && customer.preferredRegion && sidoOptions.length > 0) {
      getInitialRegionValuesByCode();
    } else if (!isEditing) {
      setSelectedSido(null);
      setSelectedGu(null);
      setSelectedDong(null);
      setSigunguOptions([]);
      setDongOptions([]);
    }
  }, [isEditing, customer.preferredRegion, sidoOptions]);

  const handleSidoChange = async (event: SelectChangeEvent<number>) => {
    const value = Number(event.target.value);
    setSelectedSido(value);

    // 시/군/구, 동 초기화
    setSelectedGu(null);
    setSelectedDong(null);
    setSigunguOptions([]);
    setDongOptions([]);

    // 시/군/구 데이터 로드
    if (value > 0) {
      try {
        const sigunguData = await fetchSigungu(value);
        setSigunguOptions(sigunguData);
      } catch (error) {
        console.error("시/군/구 데이터 로드 실패:", error);
      }
    }

    const selectedRegion = sidoOptions.find((r) => r.cortarNo === value);
    if (selectedRegion) {
      onInputChange("preferredRegion", selectedRegion.cortarNo);
    }
  };

  const handleGuChange = async (event: SelectChangeEvent<number>) => {
    const value = Number(event.target.value);
    setSelectedGu(value);

    // 동 초기화
    setSelectedDong(null);
    setDongOptions([]);

    // 동 데이터 로드
    if (value > 0) {
      try {
        const dongData = await fetchDong(value);
        setDongOptions(dongData);
      } catch (error) {
        console.error("동 데이터 로드 실패:", error);
      }
    }

    const selectedRegion = sigunguOptions.find((r) => r.cortarNo === value);
    if (selectedRegion) {
      onInputChange("preferredRegion", selectedRegion.cortarNo);
    }
  };

  const handleDongChange = (event: SelectChangeEvent<number>) => {
    const value = Number(event.target.value);
    setSelectedDong(value);
    const selectedRegion = dongOptions.find((r) => r.cortarNo === value);
    if (selectedRegion) {
      onInputChange("preferredRegion", selectedRegion.cortarNo);
    }
  };

  const formatBirthDay = (birthday: string | null) => {
    if (!birthday) return "-";
    return birthday.replace(/(\d{4})(\d{2})(\d{2})/, "$1.$2.$3");
  };

  const handleChangeBirthday = (value: string) => {
    const formattedValue = value.replace(/\D/g, "").slice(0, 8);
    onInputChange("birthday", formattedValue);
  };

  return (
    <div className="card p-5">
      <h6 className="text-lg font-semibold text-primary mb-2">기본 정보</h6>
      <div className="grid grid-cols-2 gap-4">
        <InfoField
          label="이름"
          value={
            isEditing ? (
              <TextField
                fullWidth
                size="small"
                value={editedCustomer?.name || ""}
                onChange={(e) => onInputChange("name", e.target.value)}
              />
            ) : (
              customer.name
            )
          }
        />
        <InfoField
          label="전화번호"
          value={
            isEditing ? (
              <TextField
                fullWidth
                size="small"
                value={formatPhoneNumber(editedCustomer?.phoneNo ?? "")}
                onChange={(e) => onInputChange("phoneNo", e.target.value)}
              />
            ) : (
              customer.phoneNo
            )
          }
        />
        <InfoField
          className="w-full"
          label="통신사"
          value={
            isEditing ? (
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
              customer.telProvider || "-"
            )
          }
        />
        <InfoField
          label="관심 지역"
          value={
            isEditing ? (
              <div className="grid grid-cols-1 gap-2">
                <RegionSelector
                  label="시/도"
                  value={selectedSido || 0}
                  regions={sidoOptions}
                  onChange={handleSidoChange}
                />
                <RegionSelector
                  label="시/군/구"
                  value={selectedGu || 0}
                  regions={sigunguOptions}
                  onChange={handleGuChange}
                  disabled={!selectedSido}
                />
                <RegionSelector
                  label="동"
                  value={selectedDong || 0}
                  regions={dongOptions}
                  onChange={handleDongChange}
                  disabled={!selectedGu}
                />
              </div>
            ) : (
              customer.preferredRegionKR || "-"
            )
          }
        />
        <InfoField
          label="생년월일"
          value={
            isEditing ? (
              <TextField
                fullWidth
                size="small"
                value={editedCustomer?.birthday || ""}
                onChange={(e) => handleChangeBirthday(e.target.value)}
                placeholder="YYYYMMDD"
                inputProps={{ maxLength: 8 }}
              />
            ) : (
              formatBirthDay(customer.birthday)
            )
          }
        />
        <InfoField
          label="유입 경로"
          value={
            isEditing ? (
              <TextField
                fullWidth
                value={editedCustomer?.trafficSource || ""}
                onChange={(e) => onInputChange("trafficSource", e.target.value)}
                size="small"
              />
            ) : (
              customer.trafficSource || "-"
            )
          }
        />
      </div>
    </div>
  );
};

export default CustomerBasicInfo;
