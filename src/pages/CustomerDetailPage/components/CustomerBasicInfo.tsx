import Select, { MenuItem } from "@components/Select";
import TextField from "@components/TextField";
import { formatPhoneNumber } from "@utils/numberUtil";
import { Customer } from "@ts/customer";

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
  const formatBirthDay = (birthday: string | null) => {
    if (!birthday) return "-";
    return birthday.replace(/(\d{4})(\d{2})(\d{2})/, "$1.$2.$3");
  };

  return (
    <div className="flex-grow bg-white p-6 rounded-lg mt-2">
      <h6 className="mb-4 text-[#164F9E] font-bold text-lg">기본 정보</h6>
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
        <div className="flex-[0_0_calc(50%-8px)]">
          <div className="text-sm text-gray-600 mb-1">희망 지역</div>
          {isEditing ? (
            <Select
              value={editedCustomer?.preferredRegion || ""}
              onChange={(e) => onInputChange("preferredRegion", e.target.value)}
              size="small"
              showEmptyOption
              emptyText="희망 지역을 선택하세요"
            >
              <MenuItem value="서울">서울</MenuItem>
              <MenuItem value="부산">부산</MenuItem>
              <MenuItem value="대구">대구</MenuItem>
              <MenuItem value="인천">인천</MenuItem>
              <MenuItem value="광주">광주</MenuItem>
              <MenuItem value="대전">대전</MenuItem>
              <MenuItem value="울산">울산</MenuItem>
              <MenuItem value="세종">세종</MenuItem>
              <MenuItem value="경기">경기</MenuItem>
              <MenuItem value="강원">강원</MenuItem>
              <MenuItem value="충북">충북</MenuItem>
              <MenuItem value="충남">충남</MenuItem>
              <MenuItem value="전북">전북</MenuItem>
              <MenuItem value="전남">전남</MenuItem>
              <MenuItem value="경북">경북</MenuItem>
              <MenuItem value="경남">경남</MenuItem>
              <MenuItem value="제주">제주</MenuItem>
            </Select>
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
