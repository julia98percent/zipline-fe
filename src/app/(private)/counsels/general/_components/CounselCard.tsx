import { Chip } from "@mui/material";
import dayjs from "dayjs";
import { Counsel } from "@/types/counsel";
import { SUCCESS, CUSTOMER_ROLES } from "@/constants/colors";

interface CounselCardProps {
  counsel: Counsel;
  onRowClick: (counselUid: number) => void;
}

const CounselCard = ({ counsel, onRowClick }: CounselCardProps) => {
  const isCompleted = !counsel.dueDate || counsel.completed;

  return (
    <div
      onClick={() => onRowClick(counsel.counselUid)}
      className="card p-5 cursor-pointer"
    >
      <div className="mb-2 font-medium text-gray-900">
        <span className="mr-1">{`[${counsel.type}]`}</span>
        <h4 className="inline">{counsel.title}</h4>
      </div>

      {/* 상담 정보 */}
      <div className="space-y-2 text-sm text-gray-600">
        <div className="flex items-center justify-center">
          <span className="mr-2">•</span>
          <div className="ml-2 flex-1">
            <p className="font-medium">
              고객 정보:{" "}
              <span className="font-bold">
                {counsel.customerName} / {counsel.customerPhoneNo}
              </span>
            </p>
          </div>
        </div>

        <div className="flex items-start">
          <span className="mr-2">•</span>
          <div className="ml-2 flex-1">
            <span className="font-medium">상담일:</span>
            <span className="ml-2">
              {dayjs(counsel.counselDate).format("YYYY-MM-DD")}
            </span>
          </div>
        </div>

        <div className="flex items-start">
          <span className="mr-2">•</span>
          <div className="ml-2 flex-1">
            <span className="font-medium">희망 의뢰 마감일:</span>
            <span className="ml-2">
              {counsel.dueDate
                ? dayjs(counsel.dueDate).format("YYYY-MM-DD")
                : "없음"}
            </span>
          </div>
        </div>
      </div>

      {/* 의뢰 상태 */}
      <div className="mt-2 flex justify-end">
        <Chip
          label={isCompleted ? "의뢰 마감" : "의뢰 진행 중"}
          sx={{
            color: isCompleted ? SUCCESS.alt : CUSTOMER_ROLES.tenant.text,
            backgroundColor: isCompleted ? SUCCESS.altLight : CUSTOMER_ROLES.tenant.background,
          }}
        ></Chip>
      </div>
    </div>
  );
};

export default CounselCard;
