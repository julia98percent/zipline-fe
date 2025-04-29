export interface AgentPropertyFilterRequest {
    legalDistrictCode?: string;
  
    type?: string; // SALE | DEPOSIT | MONTHLY
    category?: string; // ONE_ROOM | APARTMENT 등
  
    minDeposit?: number;
    maxDeposit?: number;
  
    minMonthlyRent?: number;
    maxMonthlyRent?: number;
  
    minPrice?: number;
    maxPrice?: number;
  
    minMoveInDate?: string;
    maxMoveInDate?: string;
  
    petsAllowed?: boolean;
  
    minFloor?: number;
    maxFloor?: number;
  
    hasElevator?: boolean;
  
    minConstructionYear?: number;
    maxConstructionYear?: number;
  
    minParkingCapacity?: number;
    maxParkingCapacity?: number;
  
    minNetArea?: number;
    maxNetArea?: number;
  
    minTotalArea?: number;
    maxTotalArea?: number;
  }
  