import { CUSTOMER_ROLES } from "./colors";

export const CUSTOMER_TYPE_COLORS = {
  tenant: {
    backgroundColor: CUSTOMER_ROLES.tenant.background,
    color: CUSTOMER_ROLES.tenant.text,
    label: CUSTOMER_ROLES.tenant.label,
  },
  landlord: {
    backgroundColor: CUSTOMER_ROLES.landlord.background,
    color: CUSTOMER_ROLES.landlord.text,
    label: CUSTOMER_ROLES.landlord.label,
  },
  buyer: {
    backgroundColor: CUSTOMER_ROLES.buyer.background,
    color: CUSTOMER_ROLES.buyer.text,
    label: CUSTOMER_ROLES.buyer.label,
  },
  seller: {
    backgroundColor: CUSTOMER_ROLES.seller.background,
    color: CUSTOMER_ROLES.seller.text,
    label: CUSTOMER_ROLES.seller.label,
  },
} as const;
