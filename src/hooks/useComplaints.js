import { useContext } from "react";
import { ComplaintContext } from "../contexts/ComplaintContext";

export const useComplaints = () => useContext(ComplaintContext);