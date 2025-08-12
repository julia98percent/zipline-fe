import Table, { ColumnConfig, RowData } from "@components/Table";
import { MessageHistory } from "@ts/message";
import { translateMessageStatusToKorean } from "@utils/messageUtil";
import Status from "@components/Status";
import dayjs from "dayjs";

interface Props {
  messageList: MessageHistory[];
  onRowClick: (rowData: MessageHistory) => void;
}

type MessageHistoryTable = MessageHistory & RowData;

const MessageHistoryListView = ({ messageList, onRowClick }: Props) => {
  const columns: ColumnConfig<MessageHistoryTable>[] = [
    {
      key: "dateCreated",
      label: "발송 요청일",
      align: "left",
      render: (value) =>
        value ? dayjs(value as string).format("YYYY-MM-DD HH:mm:ss") : "-",
    },
    {
      key: "status",
      label: "상태",
      align: "left",
      render: (_, row) => (
        <Status
          text={translateMessageStatusToKorean(row.status as string)}
          color={
            row.status === "COMPLETE"
              ? "GREEN"
              : row.status === "FAILED"
              ? "RED"
              : "GRAY"
          }
        />
      ),
    },
    {
      key: "dateCompleted",
      label: "발송 완료일",
      align: "left",
      render: (value) =>
        value ? dayjs(value as string).format("YYYY-MM-DD HH:mm:ss") : "-",
    },
  ];

  const tableData: MessageHistoryTable[] = messageList.map((message) => ({
    ...message,
    id: message.groupId,
  }));

  return (
    <div className="w-full mt-0">
      <Table<MessageHistoryTable>
        columns={columns}
        bodyList={tableData}
        pagination={false}
        handleRowClick={(message) => onRowClick(message)}
        className="min-w-[650px]  rounded-lg shadow-sm"
        sx={{
          "& .MuiTableCell-root": {
            maxWidth: "300px",
            whiteSpace: "normal",
            padding: "12px 16px",
          },
          "& .MuiTableCell-head": {
            fontWeight: 600,
            position: "sticky",
            top: 0,
            background: "#fff",
            zIndex: 2,
          },
          "& .MuiTableContainer-root": {
            borderRadius: "8px",
          },
        }}
      />
    </div>
  );
};

export default MessageHistoryListView;
