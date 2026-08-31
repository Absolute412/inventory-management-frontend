import { Icon } from "@iconify/react";
import { useEffect, useRef, useState } from "react";

export const Selects = ({ 
    items, 
    value, 
    onChange,
    getLabel = (item) => item.name,
}) => {
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

    // console.log("value", value);
    // console.log("label", value ? getLabel(value) : null);

    return (
        <div ref={dropdownRef} className="relative">
            <button
                type="button"
                onClick={() => setIsOpen(prev => !prev)}
                className="flex items-center justify-between w-full rounded-xl border border-(--border) text-sm font-semibold
                bg-(--surface-elevated) hover:bg-(--surface-muted) px-3 py-2.5 transition duration-200 cursor-pointer"
            >
                {value ? getLabel(value) : "Select"}

                <Icon 
                    icon="mingcute:down-line" 
                    className={`text-xl transition transform ${isOpen ? "rotate-180" : ""}`} 
                />
            </button>

            {isOpen && (
                <div 
                    className="absolute top-full mt-4 border rounded-xl border-(--border) bg-(--surface-elevated) 
                    z-30 px-3 py-2.5 w-full max-h-44 shadow-(--shadow) overflow-y-auto custom-scrollbar"
                >
                    {items.map(item => (
                        <button
                            key={item.id}
                            type="button"
                            onClick={() => {
                                onChange(item);
                                setIsOpen(false);
                            }}
                            className="block w-full rounded-lg px-2 py-2 text-left text-sm hover:bg-(--surface-muted) cursor-pointer"
                        >
                            {getLabel(item)}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};