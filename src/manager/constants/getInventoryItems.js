import { BUILDING_ITEMS } from "./buildingItems";
import { WATER_ITEMS } from "./waterItems";

export const getInventoryItems = (branchType) => {
    switch (branchType) {
        case "WATER":
            return WATER_ITEMS

        case "BUILDING_MATERIALS":
            return BUILDING_ITEMS;

        default:
            return [];
    }
};