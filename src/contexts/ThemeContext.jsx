/* eslint-disable react-refresh/only-export-components */
import { createContext, useEffect, useState } from "react";

export const ThemeContext = createContext();

const THEME_KEY = "theme";

function getThemePreference() {
    if (typeof window === "undefined") return "light";

    const stored = localStorage.getItem(THEME_KEY);
    return stored === "dark" ? "dark" : "light";
}

function setThemePreference(theme) {
    if (typeof window === "undefined") return

    localStorage.setItem(THEME_KEY, theme === "dark" ? "dark" : "light");
}

export function ThemeProvider({ children }) {
    const [isDark, setIsDark] = useState(() => {
        return getThemePreference() === "dark";
    });

    useEffect(() => {
        document.documentElement.classList.toggle("dark", isDark);
        setThemePreference(isDark ? "dark" : "light");
    }, [isDark]);

    return (
        <ThemeContext.Provider value={{ isDark, setIsDark }}>
            {children}
        </ThemeContext.Provider>
    );
}