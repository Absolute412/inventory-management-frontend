import { useContext } from "react";
import { ReportsContext } from "../contexts/ReportsContext";

export const useReports = () => useContext(ReportsContext);