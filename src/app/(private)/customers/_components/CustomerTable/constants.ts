import { ColumnConfig } from "@/components/Table/Table";
import { Customer } from "@/types/customer";

export const CUSTOMER_TABLE_COLUMNS: ColumnConfig<Customer>[] = [
  {
    key: "name",
    label: "이름",
    align: "left",
    width: "130px",
  },
  {
    key: "phoneNo",
    label: "전화번호",
    align: "left",
    width: "160px",
  },
  {
    key: "roles",
    label: "역할",
    align: "left",
    width: "200px",
  },
  {
    key: "labels",
    label: "라벨",
    align: "left",
    width: "300px",
  },
  {
    key: "actions",
    label: "",
    align: "center",
    width: "100px",
  },
];
