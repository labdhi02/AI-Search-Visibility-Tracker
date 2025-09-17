import React, { useState } from "react";
import { FaCaretDown } from "react-icons/fa";

interface DropdownMenuProps {
  options: string[];
  selected: string;
  onSelect: (option: string) => void;
  buttonClassName?: string;
}

const DropdownMenu: React.FC<DropdownMenuProps> = ({
  options,
  selected,
  onSelect,
  buttonClassName = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (option: string) => {
    onSelect(option);
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block text-left">
      <button
        type="button"
        className={`flex items-center px-4 py-2 border border-gray-300 rounded-lg bg-white text-sm shadow-sm ${buttonClassName}`}
        onClick={() => setIsOpen((prev) => !prev)}
      >
        {selected === "All" ? "All APIs" : selected}
        <FaCaretDown className="ml-2" />
      </button>
      {isOpen && (
        <div className="origin-top-right absolute right-0 mt-2 w-40 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
          <div className="py-1">
            {options.map((option) => (
              <button
                key={option}
                className="block w-full text-left px-4 py-2 text-sm text-black hover:bg-gray-100"
                onClick={() => handleSelect(option)}
              >
                {option === "All" ? "All APIs" : option}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DropdownMenu;
