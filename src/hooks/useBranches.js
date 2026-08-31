import { useContext } from "react";
import { BranchContext } from "../contexts/BranchContext";

export const useBranches = () => useContext(BranchContext);