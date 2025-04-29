import apiClient from "@apis/apiClient";
import FilterListIcon from "@mui/icons-material/FilterList";
import {
  Box,
  Button,
  CircularProgress,
  Paper,
  SelectChangeEvent,
  Typography
} from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import PublicPropertyFilterModal from "./PublicPropertyFilterModal/PublicPropertyFilterModal";
import PublicPropertyTable from "./PublicPropertyTable";
import CORTAR_NO from "./PublicPropertyTable/cortarNo.json";

export interface KakaoAddress {
  road_address?: {
    address_name: string;
    region_1depth_name: string;
    region_2depth_name: string;
    region_3depth_name: string;
    road_name: string;
    underground_yn: string;
    main_building_no: string;
    sub_building_no: string;
    building_name: string;
    zone_no: string;
  };
  address?: {
    address_name: string;
    region_1depth_name: string;
    region_2depth_name: string;
    region_3depth_name: string;
    mountain_yn: string;
    main_address_no: string;
    sub_address_no: string;
  };
}

export interface Address {
  text: string;
  type: string;
  zipcode: string;
}

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
  address?: KakaoAddress;
}

export interface SearchParams {
  page: number;
  size: number;
  sortFields: {
    [key: string]: string;
  };
  regionCode?: string;
  buildingName?: string;
  buildingType?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  minDeposit?: number;
  maxDeposit?: number;
  minMonthlyRent?: number;
  maxMonthlyRent?: number;
  minExclusiveArea?: number;
  maxExclusiveArea?: number;
  minSupplyArea?: number;
  maxSupplyArea?: number;
}

const BUILDING_TYPES = [
  "단독/다가구",
  "사무실",
  "건물",
  "빌라",
  "상가",
  "토지",
  "상가주택",
  "아파트",
  "한옥주택",
  "연립",
  "오피스텔",
  "다세대",
  "원룸",
  "재개발",
  "고시원",
  "공장/창고",
  "지식산업센터",
  "아파트분양권",
  "오피스텔분양권",
  "재건축",
  "전원주택",
];

const CATEGORY_OPTIONS = [
  { value: "SALE", label: "매매" },
  { value: "MONTHLY", label: "월세" },
  { value: "DEPOSIT", label: "전세" },
];

function PublicPropertyListPage() {
  const [publicPropertyList, setPublicPropertyList] = useState<PublicPropertyItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [showFilterModal, setShowFilterModal] = useState<boolean>(false);
  const [totalElements, setTotalElements] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);

  // Location fields
  const [selectedSido, setSelectedSido] = useState("");
  const [selectedGu, setSelectedGu] = useState("");
  const [selectedDong, setSelectedDong] = useState("");
  const [selectedRegionCode, setSelectedRegionCode] = useState("");

  // Search params - manage all filter state here
  const [searchParams, setSearchParams] = useState<SearchParams>({
    page: 0,
    size: 20,
    sortFields: { id: "ASC" },
    category: "",
    buildingType: "",
    buildingName: "",
    minPrice: undefined,
    maxPrice: undefined,
    minDeposit: undefined,
    maxDeposit: undefined,
    minMonthlyRent: undefined,
    maxMonthlyRent: undefined,
    minExclusiveArea: undefined,
    maxExclusiveArea: undefined,
    minSupplyArea: undefined,
    maxSupplyArea: undefined,
  });

  // Handle location selection
  const handleSidoChange = (event: SelectChangeEvent<string>) => {
    const value = event.target.value;
    setSelectedSido(value);
    setSelectedGu("");
    setSelectedDong("");
    setSelectedRegionCode("");
  };

  const handleGuChange = (event: SelectChangeEvent<string>) => {
    const value = event.target.value;
    setSelectedGu(value);
    setSelectedDong("");
    setSelectedRegionCode("");
  };

  const handleDongChange = (event: SelectChangeEvent<string>) => {
    const value = event.target.value;
    setSelectedDong(value);

    // Find the selected dong code
    if (value) {
      const selectedSidoObj = CORTAR_NO[selectedSido as keyof typeof CORTAR_NO];
      const selectedGuObj = selectedSidoObj.find((gu: { name: string }) => gu.name === selectedGu);
      const selectedDongObj = selectedGuObj?.districts.find((dong: { name: string }) => dong.name === value);
      if (selectedDongObj) {
        setSelectedRegionCode(selectedDongObj.code);
        setSearchParams(prev => ({ ...prev, regionCode: selectedDongObj.code }));
      }
    } else {
      setSelectedRegionCode("");
    }
  };

  // Handle filter modal
  const handleFilterApply = (newFilters: Partial<SearchParams>) => {
    // If newFilters is empty (reset case), set to initial state
    if (Object.keys(newFilters).length === 0) {
      setSearchParams({
        page: 0,
        size: 20,
        sortFields: { id: "ASC" },
        category: "",
        buildingType: "",
        buildingName: "",
        minPrice: undefined,
        maxPrice: undefined,
        minDeposit: undefined,
        maxDeposit: undefined,
        minMonthlyRent: undefined,
        maxMonthlyRent: undefined,
        minExclusiveArea: undefined,
        maxExclusiveArea: undefined,
        minSupplyArea: undefined,
        maxSupplyArea: undefined,
      });
    } else {
      // Normal apply case - update only the changed fields
      setSearchParams(prev => ({
        ...prev,
        ...newFilters,
        page: 0 // Reset to first page when filters change
      }));
    }
  };

  // Handle sort
  const handleSort = (field: string) => {
    setSearchParams(prev => {
      const currentSort = prev.sortFields[field];
      const newSortFields: { [key: string]: string } = {};

      // If clicking on the active sort, toggle direction
      if (currentSort) {
        newSortFields[field] = currentSort === "ASC" ? "DESC" : "ASC";
      } else {
        // If clicking on a new sort, make it the only active sort
        newSortFields[field] = "ASC";
      }

      return {
        ...prev,
        sortFields: newSortFields,
        page: 0 // Reset to first page when sort changes
      };
    });
  };

  // Function to get address from coordinates using Kakao API
  const getAddressFromCoordinates = async (latitude: number, longitude: number): Promise<KakaoAddress | null> => {
    try {
      const KAKAO_API_KEY = import.meta.env.VITE_KAKAO_MAP_SECRET;
      const response = await fetch(
        `https://dapi.kakao.com/v2/local/geo/coord2address.json?` +
        `x=${longitude}&` +
        `y=${latitude}&` +
        `input_coord=WGS84`,
        {
          headers: {
            'Authorization': `KakaoAK ${KAKAO_API_KEY}`,
            'Content-Type': 'application/json',
          }
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (data.documents && data.documents.length > 0) {
        return data.documents[0];
      }
      return null;
    } catch (error) {
      console.error("Failed to get address from Kakao API:", error);
      return null;
    }
  };

  // Fetch property data with all search parameters
  const fetchPropertyData = useCallback(async () => {
    setLoading(true);

    // Construct query parameters
    const queryParams = new URLSearchParams();

    // Add only essential parameters
    queryParams.append("page", searchParams.page.toString());
    queryParams.append("size", searchParams.size.toString());
    queryParams.append("sortFields", JSON.stringify(searchParams.sortFields));

    // Only add other parameters if they have actual values
    if (searchParams.regionCode) {
      queryParams.append("regionCode", searchParams.regionCode);
    }

    if (searchParams.buildingName) {
      queryParams.append("buildingName", searchParams.buildingName);
    }

    if (searchParams.buildingType) {
      queryParams.append("buildingType", searchParams.buildingType);
    }

    if (searchParams.category) {
      queryParams.append("category", searchParams.category);
    }

    // Add price ranges only if they have non-zero values
    if (searchParams.minPrice) {
      queryParams.append("minPrice", searchParams.minPrice.toString());
    }
    if (searchParams.maxPrice) {
      queryParams.append("maxPrice", searchParams.maxPrice.toString());
    }

    if (searchParams.minDeposit) {
      queryParams.append("minDeposit", searchParams.minDeposit.toString());
    }
    if (searchParams.maxDeposit) {
      queryParams.append("maxDeposit", searchParams.maxDeposit.toString());
    }

    if (searchParams.minMonthlyRent) {
      queryParams.append("minMonthlyRent", searchParams.minMonthlyRent.toString());
    }
    if (searchParams.maxMonthlyRent) {
      queryParams.append("maxMonthlyRent", searchParams.maxMonthlyRent.toString());
    }

    // Add area ranges only if they have non-zero values
    if (searchParams.minExclusiveArea) {
      queryParams.append("minExclusiveArea", searchParams.minExclusiveArea.toString());
    }
    if (searchParams.maxExclusiveArea) {
      queryParams.append("maxExclusiveArea", searchParams.maxExclusiveArea.toString());
    }

    if (searchParams.minSupplyArea) {
      queryParams.append("minSupplyArea", searchParams.minSupplyArea.toString());
    }
    if (searchParams.maxSupplyArea) {
      queryParams.append("maxSupplyArea", searchParams.maxSupplyArea.toString());
    }

    try {
      const res = await apiClient.get(`/property-articles/search?${queryParams.toString()}`);
      const propertyData = res?.data?.content;
      const total = res?.data?.totalElements;
      const pages = res?.data?.totalPages;
      
      if (propertyData) {
        // Set the property data first
        setPublicPropertyList(propertyData);
        setTotalElements(total);
        setTotalPages(pages);

        // Then fetch addresses in the background
        const fetchAddresses = async () => {
          const propertiesWithAddresses = await Promise.all(
            propertyData.map(async (property: PublicPropertyItem) => {
              const address = await getAddressFromCoordinates(property.latitude, property.longitude);
              return {
                ...property,
                address: address || {}
              };
            })
          );
          setPublicPropertyList(propertiesWithAddresses);
        };

        // Start fetching addresses without waiting
        fetchAddresses();
      } else {
        setPublicPropertyList([]);
        setTotalElements(0);
        setTotalPages(0);
      }
    } catch (error) {
      console.error("Failed to fetch properties:", error);
      setPublicPropertyList([]);
      setTotalElements(0);
      setTotalPages(0);
    } finally {
      setLoading(false);
    }
  }, [searchParams]);

  // Fetch data on initial load and when search params change
  useEffect(() => {
    fetchPropertyData();
  }, [fetchPropertyData]);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <CircularProgress color="primary" />
      </Box>
    );
  }

  return (
    <Box sx={{ padding: "32px" }}>
      <Paper elevation={3} sx={{ padding: 3, marginBottom: 3 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 1 }}>
          <Typography variant="h5" fontWeight="bold">
            공개 매물 검색 결과 : {totalElements} 건
        </Typography>
        
          <Box sx={{ display: "flex", justifyContent: "center", mt: 1}}>
            <Button
              startIcon={<FilterListIcon />}
              color={showFilterModal ? "primary" : "inherit"}
              variant={showFilterModal ? "contained" : "outlined"}
              onClick={() => setShowFilterModal(true)}
            >
              상세 필터
            </Button>
          </Box>
        </Box>
      </Paper>

      {/* Results Section */}
      <Paper elevation={3} sx={{ padding: 3 }}>
        <PublicPropertyTable 
          propertyList={publicPropertyList} 
          totalElements={totalElements}
          totalPages={totalPages}
          page={searchParams.page}
          rowsPerPage={searchParams.size}
          onPageChange={(newPage) => setSearchParams(prev => ({ ...prev, page: newPage }))}
          onRowsPerPageChange={(newSize) => setSearchParams(prev => ({ ...prev, size: newSize, page: 0 }))}
          onSort={handleSort}
          sortFields={searchParams.sortFields}
        />
      </Paper>

      <PublicPropertyFilterModal
        open={showFilterModal}
        onClose={() => setShowFilterModal(false)}
        onApply={handleFilterApply}
        filters={searchParams}
        selectedSido={selectedSido}
        selectedGu={selectedGu}
        selectedDong={selectedDong}
        onSidoChange={handleSidoChange}
        onGuChange={handleGuChange}
        onDongChange={handleDongChange}
      />
    </Box>
  );
}

export default PublicPropertyListPage;
