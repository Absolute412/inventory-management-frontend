export const BRANCH_TYPE_CONFIG = {
  WATER: {
    label: "Water",
    statLabels: {
      primary: "Last Report Sachets",
      secondary: "Last Report Bottles",
    },
    statIcons: {
      primary: "streamline-plump:bag",
      secondary: "solar:bottle-bold",
    },
    trendLabels: {
      primary: "Sachets",
      secondary: "Bottles",
    },
    summary:
      "reports, inventory items, production totals, and branch complaints",
  },
  BUILDING_MATERIALS: {
    label: "Building Materials",
    statLabels: {
      primary: "Latest Material Volume",
      secondary: "Pending Deliveries",
    },
    statIcons: {
      primary: "material-symbols:inventory",
      secondary: "mdi:truck-delivery",
    },
    trendLabels: {
      primary: "Materials",
      secondary: "Deliveries",
    },
    summary:
      "reports, inventory items, material totals, and branch complaints",
  },
};
