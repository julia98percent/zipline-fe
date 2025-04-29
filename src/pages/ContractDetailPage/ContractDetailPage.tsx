import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import apiClient from "@apis/apiClient";
import {
  Box,
  Typography,
  CircularProgress,
  Card,
  CardContent,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Button,
} from "@mui/material";
import PageHeader from "@components/PageHeader/PageHeader";
import ContractEditModal from "@pages/ContractListPage/ContractAddButtonList/ContractEditModal";

const statusKoreanMap: Record<string, string> = {
  LISTED: "매물 등록됨",
  NEGOTIATING: "협상 중",
  INTENT_SIGNED: "가계약",
  CANCELLED: "계약 취소",
  CONTRACTED: "계약 체결",
  IN_PROGRESS: "계약 진행 중",
  PAID_COMPLETE: "잔금 지급 완료",
  REGISTERED: "등기 완료",
  MOVED_IN: "입주 완료",
  TERMINATED: "계약 해지",
};

const categoryKoreanMap: Record<string, string> = {
  SALE: "매매",
  DEPOSIT: "전세",
  MONTHLY: "월세",
};

function ContractDetailPage() {
  const { contractUid } = useParams<{ contractUid: string }>();
  const navigate = useNavigate();
  const [contract, setContract] = useState<any | null>(null);
  const [histories, setHistories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editModalOpen, setEditModalOpen] = useState(false);

  const handleEdit = () => {
    setEditModalOpen(true);
  };

  const handleDelete = () => {
    if (confirm("정말 삭제하시겠습니까?")) {
      apiClient
        .delete(`/contracts/${contractUid}`)
        .then(() => {
          alert("계약 삭제 성공");
          navigate("/contracts");
        })
        .catch((err) => {
          console.error("계약 삭제 실패", err);
          alert("계약 삭제 중 오류가 발생했습니다.");
        });
    }
  };

  useEffect(() => {
    if (contractUid) {
      Promise.all([
        apiClient.get(`/contracts/${contractUid}`),
        apiClient.get(`/contracts/${contractUid}/histories`),
      ])
        .then(([contractRes, historyRes]) => {
          setContract(contractRes.data.data);
          setHistories(historyRes.data.data);
        })
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [contractUid]);

  if (loading)
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <CircularProgress />
      </Box>
    );

  if (!contract) return <div>계약 정보를 불러올 수 없습니다.</div>;

  return (
    <Box sx={{ p: 4, backgroundColor: "#f7f7f7", minHeight: "100vh" }}>
      {editModalOpen && (
        <ContractEditModal
          open={editModalOpen}
          handleClose={() => setEditModalOpen(false)}
          fetchContractData={() => {
            apiClient.get(`/contracts/${contractUid}`).then((res) => {
              setContract(res.data.data);
            });
          }}
          contractUid={Number(contractUid)}
          initialData={contract}
        />
      )}

      <PageHeader title="계약 상세 조회" userName="사용자 이름" />

      <Box sx={{ padding: 1.5 }} />

      <Box display="flex" justifyContent="flex-end" mb={2} gap={1}>
        <Button variant="outlined" onClick={handleEdit}>
          수정
        </Button>
        <Button variant="outlined" color="error" onClick={handleDelete}>
          삭제
        </Button>
      </Box>

      {/* 계약 기본정보, 당사자 정보 */}
      <Box display="flex" gap={3} mb={3}>
        <Card sx={{ flex: 1 }}>
          <CardContent>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              계약 기본 정보
            </Typography>
            <InfoRow
              label="카테고리"
              value={
                <Chip
                  label={
                    categoryKoreanMap[contract.category] ?? contract.category
                  }
                  color="primary"
                  variant="outlined"
                  size="small"
                />
              }
            />
            <InfoRow
              label="상태"
              value={
                <Chip
                  label={statusKoreanMap[contract.status] ?? contract.status}
                  color="primary"
                  variant="outlined"
                  size="small"
                />
              }
            />
            <InfoRow label="계약 시작일" value={contract.contractStartDate} />
            <InfoRow label="계약 종료일" value={contract.contractEndDate} />
            {contract.status === "CANCELLED" && (
              <InfoRow
                label="계약 예상 종료일"
                value={contract.expectedContractEndDate}
              />
            )}
            <InfoRow label="매물 주소" value={contract.propertyAddress} />
            <InfoRow
              label="보증금"
              value={contract.deposit?.toLocaleString() + "원"}
            />
            <InfoRow
              label="월세"
              value={contract.monthlyRent?.toLocaleString() + "원"}
            />
            <InfoRow
              label="매매가"
              value={contract.price?.toLocaleString() + "원"}
            />
          </CardContent>
        </Card>

        <Card sx={{ flex: 1 }}>
          <CardContent>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              계약 당사자 정보
            </Typography>
            <InfoRow label="임대/매도인" value={contract.lessorOrSellerName} />
            <InfoRow
              label="임차/매수인"
              value={contract.lesseeOrBuyerName ?? "-"}
            />
            <InfoRow label="계약 체결일" value={contract.contractDate} />
          </CardContent>
        </Card>
      </Box>

      {/* 첨부문서, 히스토리 */}
      <Box display="flex" gap={3}>
        {/* 첨부 문서 */}
        <Card sx={{ flex: 1, minHeight: 200 }}>
          <CardContent>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              첨부 문서
            </Typography>
            {contract.documents.length > 0 ? (
              contract.documents.map((doc: any, idx: number) => (
                <Box
                  key={idx}
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                  sx={{
                    border: "1px solid #ddd",
                    borderRadius: 1,
                    px: 2,
                    py: 1,
                    mb: 1,
                    transition: "background-color 0.2s",
                    "&:hover": {
                      backgroundColor: "#f5f5f5",
                    },
                  }}
                >
                  <Typography
                    sx={{
                      flex: 0.6,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                    title={doc.fileName}
                  >
                    📎 {doc.fileName}
                  </Typography>
                  <Button
                    variant="outlined"
                    size="small"
                    component="a"
                    href={doc.fileUrl}
                    download={doc.fileName}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    다운로드
                  </Button>
                </Box>
              ))
            ) : (
              <Typography color="text.secondary">첨부 문서 없음</Typography>
            )}
          </CardContent>
        </Card>

        {/* 히스토리 */}
        <Card sx={{ flex: 1.4, minHeight: 200 }}>
          <CardContent>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              상태 변경 이력
            </Typography>
            {histories.length > 0 ? (
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>변경 전 상태</TableCell>
                    <TableCell>변경 후 상태</TableCell>
                    <TableCell>변경일</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {histories.map((h, idx) => (
                    <TableRow key={idx}>
                      <TableCell>
                        {statusKoreanMap[h.prevStatus] ?? h.prevStatus}
                      </TableCell>
                      <TableCell>
                        {statusKoreanMap[h.currentStatus] ?? h.currentStatus}
                      </TableCell>
                      <TableCell>{h.changedAt}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <Typography color="text.secondary" align="center">
                히스토리 없음
              </Typography>
            )}
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}

const InfoRow = ({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) => (
  <Box display="flex" justifyContent="space-between" mb={1}>
    <Typography color="text.secondary">{label}</Typography>
    <Typography>{value}</Typography>
  </Box>
);

export default ContractDetailPage;
