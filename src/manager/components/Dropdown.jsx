import { Icon } from "@iconify/react";
import { useEffect, useRef, useState } from "react";

export const Dropdown = ({ icon="", filter, options, onSelect }) => {
    const [isOpen, setIsOpen] = useState(false);

    const dropdownRef = useRef(null);

    useEffect(() => {
        const handlePointerDown = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setIsOpen(false);
            }
        };

        const handleKeyDown = (e) => {
            if (e.key === "Escape") setIsOpen(false);
        };

        document.addEventListener("pointerdown", handlePointerDown, true);
        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("pointerdown", handlePointerDown, true);
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, []);

    return (
        <div ref={dropdownRef} className="relative">
            <button
                type="button"
                onClick={() => setIsOpen(prev => !prev)}
                className="flex items-center justify-between gap-3 px-4 py-2.5 rounded-lg bg-(--surface) hover:bg-(--surface-elevated) 
                text-sm text-(--text-muted) shadow-(--shadow) cursor-pointer"
            >
                <Icon icon={icon} />

                <span className="">{filter}</span>

                <Icon icon="mingcute:down-line" className={`transition transform ${isOpen ? "rotate-180" : ""}`} />
            </button>

            {isOpen && (
                <div className="absolute top-full mt-4 w-full border-(--border) rounded-xl bg-(--surface) z-30 shadow-(--shadow)">
                    {options.map(option => (
                        <button
                            type="button"
                            key={option}
                            onClick={() => {
                                onSelect(option);
                                setIsOpen(false);
                            }}
                            className="block w-full rounded-lg p-2 text-left text-sm whitespace-nowrap hover:bg-(--surface-elevated) cursor-pointer"
                        >
                            {option}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};