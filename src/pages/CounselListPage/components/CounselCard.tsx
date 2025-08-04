import { Typography } from "@mui/material";
import dayjs from "dayjs";
import { Counsel } from "@ts/counsel";

interface CounselCardProps {
  counsel: Counsel;
  onRowClick: (counselUid: number) => void;
}

const CounselCard = ({ counsel, onRowClick }: CounselCardProps) => {
  const isCompleted = !counsel.dueDate || counsel.completed;

  return (
    <div
      onClick={() => onRowClick(counsel.counselUid)}
      className={`bg-white p-4 rounded-lg shadow-sm cursor-pointer hover:shadow-md transition-shadow`}
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
        <Typography
          variant="body2"
          className="py-1 px-3 rounded-full text-xs font-medium"
          sx={{
            color: isCompleted ? "#219653" : "#F2994A",
            backgroundColor: isCompleted ? "#E9F7EF" : "#FEF5EB",
          }}
        >
          {isCompleted ? "의뢰 마감" : "의뢰 진행 중"}
        </Typography>
      </div>
    </div>
  );
};

export default CounselCard;
