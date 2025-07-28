import { Box, Typography } from "@mui/material";
import dayjs from "dayjs";
import { Counsel } from "@ts/counsel";

interface CounselCardProps {
  counsel: Counsel;
  onRowClick: (counselUid: number) => void;
}

const CounselCard = ({ counsel, onRowClick }: CounselCardProps) => {
  const isCompleted = !counsel.dueDate || counsel.completed;

  return (
    <Box
      onClick={() => onRowClick(counsel.counselUid)}
      className={`bg-white p-4 rounded-lg shadow-sm cursor-pointer hover:shadow-md transition-shadow`}
    >
      {/* 제목 */}
      <Typography
        variant="h6"
        className="font-medium text-gray-900 mb-2 line-clamp-2"
      >
        {counsel.title}
      </Typography>

      {/* 상담 정보 */}
      <Box className="space-y-2 text-sm text-gray-600">
        <Box className="flex items-center justify-center">
          <span className="mr-2">•</span>
          <Box className="ml-2 flex-1">
            <p className="font-medium">
              상담 유형: <span className="font-bold">{counsel.type}</span>
            </p>
          </Box>
        </Box>

        <Box className="flex items-start">
          <span className="mr-2">•</span>
          <Box className="ml-2 flex-1">
            <span className="font-medium">상담일:</span>
            <span className="ml-2">
              {dayjs(counsel.counselDate).format("YYYY-MM-DD")}
            </span>
          </Box>
        </Box>

        <Box className="flex items-start">
          <span className="mr-2">•</span>
          <Box className="ml-2 flex-1">
            <span className="font-medium">희망 의뢰 마감일:</span>
            <span className="ml-2">
              {counsel.dueDate
                ? dayjs(counsel.dueDate).format("YYYY-MM-DD")
                : "없음"}
            </span>
          </Box>
        </Box>
      </Box>

      {/* 의뢰 상태 */}
      <Box className="mt-3 flex justify-end">
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
      </Box>
    </Box>
  );
};

export default CounselCard;
