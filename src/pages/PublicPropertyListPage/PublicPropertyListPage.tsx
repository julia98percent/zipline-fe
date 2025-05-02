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
  };

  const handleGuChange = (event: SelectChangeEvent<string>) => {
    const value = event.target.value;
    setSelectedGu(value);
    setSelectedDong("");
  };

  const handleDongChange = (event: SelectChangeEvent<string>) => {
    const value = event.target.value;
    setSelectedDong(value);

    // Find the selected dong code
    if (value) {
      // Need to fetch region data or pass it down if needed here
      // Assuming CORTAR_NO structure was correct, but fetching is better
      // const selectedSidoObj = CORTAR_NO[selectedSido as keyof typeof CORTAR_NO];
      // const selectedGuObj = selectedSidoObj?.find((gu: { name: string }) => gu.name === selectedGu);
      // const selectedDongObj = selectedGuObj?.districts.find((dong: { name: string }) => dong.name === value);
      // if (selectedDongObj) {
      //   setSearchParams(prev => ({ ...prev, regionCode: selectedDongObj.code }));
      // }
    } else {
      // Clear region code if dong is deselected
      setSearchParams(prev => ({ ...prev, regionCode: undefined }));
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

  // Handle sort reset
  const handleSortReset = () => {
    setSearchParams(prev => ({
      ...prev,
      sortFields: { id: 'ASC' }, // Reset sort to default
      page: 0 // Reset to first page
    }));
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

    // Create a temporary copy of searchParams to potentially modify for the API call
    const apiParams = { ...searchParams };

    // Adjust min values for ASC sorting to avoid 0/nulls at the top
    const activeSortField = Object.keys(apiParams.sortFields)[0];
    const sortDirection = apiParams.sortFields[activeSortField];

    if (sortDirection === 'ASC') {
      if (activeSortField === 'price' && !apiParams.minPrice) {
        apiParams.minPrice = 1;
      }
      if (activeSortField === 'deposit' && !apiParams.minDeposit) {
        apiParams.minDeposit = 1;
      }
      if (activeSortField === 'monthlyRent' && !apiParams.minMonthlyRent) {
        apiParams.minMonthlyRent = 1;
      }
      if (activeSortField === 'exclusiveArea' && !apiParams.minExclusiveArea) {
        apiParams.minExclusiveArea = 1; // Assuming area can't be < 1
      }
      if (activeSortField === 'supplyArea' && !apiParams.minSupplyArea) {
        apiParams.minSupplyArea = 1; // Assuming area can't be < 1
      }
    }

    // Construct query parameters using the potentially modified apiParams
    const queryParams = new URLSearchParams();

    // Add only essential parameters
    queryParams.append("page", apiParams.page.toString());
    queryParams.append("size", apiParams.size.toString());
    queryParams.append("sortFields", JSON.stringify(apiParams.sortFields));

    // Only add other parameters if they have actual values in apiParams
    if (apiParams.regionCode) {
      queryParams.append("regionCode", apiParams.regionCode);
    }

    if (apiParams.buildingName) {
      queryParams.append("buildingName", apiParams.buildingName);
    }

    if (apiParams.buildingType) {
      queryParams.append("buildingType", apiParams.buildingType);
    }

    if (apiParams.category) {
      queryParams.append("category", apiParams.category);
    }

    // Add price ranges only if they have values in apiParams
    if (apiParams.minPrice) {
      queryParams.append("minPrice", apiParams.minPrice.toString());
    }
    if (apiParams.maxPrice) {
      queryParams.append("maxPrice", apiParams.maxPrice.toString());
    }

    if (apiParams.minDeposit) {
      queryParams.append("minDeposit", apiParams.minDeposit.toString());
    }
    if (apiParams.maxDeposit) {
      queryParams.append("maxDeposit", apiParams.maxDeposit.toString());
    }

    if (apiParams.minMonthlyRent) {
      queryParams.append("minMonthlyRent", apiParams.minMonthlyRent.toString());
    }
    if (apiParams.maxMonthlyRent) {
      queryParams.append("maxMonthlyRent", apiParams.maxMonthlyRent.toString());
    }

    // Add area ranges only if they have values in apiParams
    if (apiParams.minExclusiveArea) {
      queryParams.append("minExclusiveArea", apiParams.minExclusiveArea.toString());
    }
    if (apiParams.maxExclusiveArea) {
      queryParams.append("maxExclusiveArea", apiParams.maxExclusiveArea.toString());
    }

    if (apiParams.minSupplyArea) {
      queryParams.append("minSupplyArea", apiParams.minSupplyArea.toString());
    }
    if (apiParams.maxSupplyArea) {
      queryParams.append("maxSupplyArea", apiParams.maxSupplyArea.toString());
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

          <Box sx={{ display: "flex", justifyContent: "center", mt: 1 }}>
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
          category={searchParams.category}
          onSortReset={handleSortReset}
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
