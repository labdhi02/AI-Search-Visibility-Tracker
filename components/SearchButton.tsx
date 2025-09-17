import React, { useState } from "react";
import { FaCaretDown } from "react-icons/fa";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import DropdownMenu from "./DropdownMenu";

interface SearchButtonProps {
  brandName: string;
  userId: number | null;
  queriesLeft: number | null;
  setSearchedBrand: (brand: string) => void;
  refreshQueries: () => void;
  selectedApi: string;
  setSelectedApi: (api: string) => void;
}

const SearchButton: React.FC<SearchButtonProps> = ({
  brandName,
  userId,
  queriesLeft,
  setSearchedBrand,
  refreshQueries,
  selectedApi,
  setSelectedApi,
}) => {
  const handleSearch = async () => {
    if (!userId || queriesLeft === 0) return;
    setSearchedBrand(brandName);
    await fetch("/api/queries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId }),
    });
    refreshQueries();
  };

  
  // Disabled state (queries limit reached)
  if (queriesLeft === 0) {
    return (
      <div className="flex gap-2 items-center">
        <Tooltip>
          <TooltipTrigger asChild>
            <span>
              <button
                className="ml-2 px-4 py-2 w-24 rounded-lg bg-gray-300 text-gray-600 cursor-not-allowed opacity-70 font-medium shadow-sm"
                disabled
              >
                Search
              </button>
            </span>
          </TooltipTrigger>
          <TooltipContent>
            <p className="text-sm text-gray-700">Your queries reached the limit</p>
          </TooltipContent>
        </Tooltip>
      </div>
    );
  }

  return (
    <div className="flex gap-2 items-center">
      <button
        onClick={handleSearch}
        disabled={!brandName || queriesLeft === 0}
        className={`ml-2 px-4 py-2 w-24 rounded-lg font-medium shadow-sm transition-colors duration-200 
          ${
            !brandName || queriesLeft === 0
              ? "bg-gray-300 text-gray-600 cursor-not-allowed"
              : "bg-black hover:bg-black text-white"
          }`}
      >
        Search
      </button>
    </div>
  );
};

export default SearchButton;