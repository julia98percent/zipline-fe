import { Box, Typography } from "@mui/material";
import dayjs from "dayjs";
import { PreCounsel } from "@ts/counsel";

interface PreCounselCardProps {
  counsel: PreCounsel;
  onRowClick: (surveyResponseUid: number) => void;
}

const PreCounselCard = ({ counsel, onRowClick }: PreCounselCardProps) => {
  return (
    <Box
      onClick={() => onRowClick(counsel.surveyResponseUid)}
      className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 cursor-pointer hover:shadow-md transition-shadow"
    >
      {/* 이름 */}
      <Typography variant="h6" className="font-medium text-gray-900 mb-2">
        {counsel.name || <span className="text-gray-400">이름 없음</span>}
      </Typography>

      {/* 상담 정보 */}
      <Box className="space-y-2 text-sm text-gray-600">
        <Box className="flex items-start">
          <span className="mr-2">•</span>
          <Box className="ml-2 flex-1">
            <span className="font-medium">전화번호:</span>
            <span className="ml-2">{counsel.phoneNumber}</span>
          </Box>
        </Box>

        <Box className="flex items-start">
          <span className="mr-2">•</span>
          <Box className="ml-2 flex-1">
            <span className="font-medium">상담 요청일:</span>
            <span className="ml-2">
              {dayjs(counsel.submittedAt).format("YYYY-MM-DD HH:mm")}
            </span>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default PreCounselCard;
