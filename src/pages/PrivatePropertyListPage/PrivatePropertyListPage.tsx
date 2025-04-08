import { useEffect, useState, useCallback } from "react";
import apiClient from "@apis/apiClient";
import PropertyAddButtonList from "./PropertyAddButtonList";
import PropertyTable from "./PropertyTable";
import { Box } from "@mui/material";

export interface PropertyItem {
  uid: number;
  customerName: string;
  address: string;
  deposit: number | null;
  monthlyRent: number | null;
  price: number;
  type: "SALE" | "DEPOSIT" | "MONTHLY";
  moveInDate: string | null;
  realCategory:
    | "ONE_ROOM"
    | "TWO_ROOM"
    | "APARTMENT"
    | "VILLA"
    | "HOUSE"
    | "OFFICETEL"
    | "COMMERCIAL";
  petsAllowed: boolean;
  floor: number | null;
  hasElevator: boolean;
  constructionYear: number | null;
  parkingCapacity: number | null;
  netArea: number;
  totalArea: number;
  details: string | null;
}

function PrivatePropertyListPage() {
  const [privatePropertyList, setPrivatePropertyList] = useState<
    PropertyItem[]
  >([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchPropertyData = useCallback(() => {
    setLoading(true);

    apiClient
      .get("/properties")
      .then((res) => {
        const agentPropertyData = res?.data?.data?.agentProperty;
        if (agentPropertyData) {
          setPrivatePropertyList(agentPropertyData);
        } else {
          setPrivatePropertyList([]);
        }
      })
      .catch((error) => {
        console.error("Failed to fetch properties:", error);

        setPrivatePropertyList([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    fetchPropertyData();
  }, [fetchPropertyData]);

  return (
    <Box>
      <PropertyAddButtonList />
      <PropertyTable loading={loading} propertyList={privatePropertyList} />
    </Box>
  );
}

export default PrivatePropertyListPage;
