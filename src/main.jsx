import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { App } from "./App";
import { AuthProvider } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import { InventoryProvider } from "./contexts/InventoryContext";
import { ReportsProvider } from "./contexts/ReportsContext";
import { ComplaintProvider } from "./contexts/ComplaintContext";
import { BranchProvider } from "./contexts/BranchContext";
import { UserProvider } from "./contexts/UserContext";
import { NotificationProvider } from "./contexts/NotificationContext";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <BranchProvider>
          <UserProvider>
            <InventoryProvider>
              <ReportsProvider>
                <ComplaintProvider>
                  <NotificationProvider>
                    <App />
                  </NotificationProvider>
                </ComplaintProvider>
              </ReportsProvider>
            </InventoryProvider>
          </UserProvider>
        </BranchProvider>
      </AuthProvider>
    </ThemeProvider>
  </StrictMode>,
);
