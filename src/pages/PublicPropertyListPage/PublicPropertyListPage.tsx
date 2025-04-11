/* eslint-disable */

import { useState, useCallback } from "react";
import apiClient from "@apis/apiClient";
import PublicPropertyTable from "./PublicPropertyTable";
import {
  Box,
  Typography,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
} from "@mui/material";
import CORTAR_NO from "./PublicPropertyTable/cortarNo.json";

export interface PublicPropertyItem {
  id: number;
  articleId: string;
  regionCode: string;
  category: string;
  buildingName: string;
  description: string;
  buildingType: string;
  price: number;
  deposit: number;
  monthlyRent: number;
  longitude: number;
  latitude: number;
  supplyArea: number;
  exclusiveArea: number;
  platform: string;
  platformUrl: string;
  createdAt: string;
  updatedAt: string;
}

function PublicPropertyListPage() {
  const [publicPropertyList, setPublicPropertyList] = useState<
    PublicPropertyItem[]
  >([]);

  const [selectedGu, setSelectedGu] = useState("");
  const [selectedDong, setSelectedDong] = useState("");
  const [selectedRegionCode, setSelectedRegionCode] = useState("0");

  const handleGuChange = (e: any) => {
    setSelectedGu(e.target.value);
    setSelectedDong("");
  };

  const handleDongChange = (e: any) => {
    setSelectedDong(e.target.value);
    const selectedDongCode = e.target.value;
    setSelectedRegionCode(selectedDongCode || "0");
  };

  const [loading, setLoading] = useState<boolean>(false);

  const fetchPropertyData = useCallback((regionCode: string) => {
    setLoading(true);
    apiClient
      .get(`/v1/property-articles/region/${regionCode}`)
      .then((res) => {
        const agentPropertyData = res?.data?.content;
        if (agentPropertyData) {
          setPublicPropertyList(agentPropertyData);
        } else {
          setPublicPropertyList([]);
        }
      })
      .catch((error) => {
        console.error("Failed to fetch properties:", error);
        setPublicPropertyList([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading)
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress color="primary" />
      </Box>
    );

  return (
    <Box sx={{ padding: "32px" }}>
      <div className="flex items-center justify-between">
        <Typography
          variant="h6"
          sx={{ mb: 2, minWidth: "max-content", display: "inline", margin: 0 }}
        >
          공개 매물 목록
        </Typography>
      </div>
      <div style={{ padding: "20px", maxWidth: "400px", margin: "auto" }}>
        <FormControl fullWidth style={{ marginBottom: "20px" }}>
          <InputLabel id="gu-label">구</InputLabel>
          <Select
            labelId="gu-label"
            value={selectedGu}
            onChange={handleGuChange}
          >
            <MenuItem value="">
              <em>구 선택</em>
            </MenuItem>
            {CORTAR_NO["서울시"].map((gu) => (
              <MenuItem key={gu.code} value={gu.name}>
                {gu.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl fullWidth style={{ marginBottom: "20px" }}>
          <InputLabel id="dong-label">동</InputLabel>
          <Select
            labelId="dong-label"
            value={selectedDong}
            onChange={handleDongChange}
            disabled={!selectedGu}
          >
            <MenuItem value="">
              <em>동 선택</em>
            </MenuItem>
            {selectedGu &&
              CORTAR_NO["서울시"]
                ?.find((gu) => gu.name === selectedGu)
                ?.districts.map((dong) => (
                  <MenuItem key={dong.code} value={dong.code}>
                    {dong.name}
                  </MenuItem>
                ))}
          </Select>
        </FormControl>
        <Button
          variant="contained"
          color="primary"
          disabled={!selectedDong}
          onClick={() => {
            fetchPropertyData(selectedRegionCode);
          }}
        >
          검색
        </Button>
      </div>
      <PublicPropertyTable propertyList={publicPropertyList} />
    </Box>
  );
}

export default PublicPropertyListPage;
