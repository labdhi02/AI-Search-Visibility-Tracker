"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import BrandAnalysisResult from "@/modules/Brandresult/BrandAnalysisResult";
import { useQueriesLeft } from "@/modules/queries/hooks/useQueriesLeft";
import SearchButton from "@/components/SearchButton";
import DropdownMenu from "@/components/DropdownMenu";

export default function Home() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [brandName, setBrandName] = useState("");
  const [searchedBrand, setSearchedBrand] = useState("");
  const [userId, setUserId] = useState<number | null>(null);
  const [selectedApi, setSelectedApi] = useState<string>("All");
  const apiOptions = ["All", "Gemini", "Google SERP", "Grok"];
  const { queriesLeft, fetchQueries } = useQueriesLeft({ userId });

  useEffect(() => {
    const token = localStorage.getItem("jwtToken");
    if (!token) {
      router.replace("/login");
    } else {
      setIsAuthenticated(true);
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        setUserId(payload.id);
      } catch (e) {
        setUserId(null);
      }
    }
  }, [router]);

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-4xl mx-auto px-6 py-10 font-sans">
        {/* Info Section */}
        <div className="mb-8 bg-white rounded-xl shadow-md p-6 border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800 mb-2">
            Brand Analysis Overview
          </h2>
          <p className="text-gray-600 text-sm leading-relaxed">
            Based on your queries, we will do an AI-powered analysis of your
            brand&apos;s online presence.
          </p>
          <ul className="list-disc pl-5 mt-4 space-y-2 text-gray-600 text-sm">
            <li>
              <span className="font-medium">Multi-Engine Data Collection:</span>{" "}
              Automated querying of Google SERP APIs, Gemini API, and Grok API
            </li>
            <li>
              <span className="font-medium">Intelligent Brand Detection:</span>{" "}
              Parse AI responses to find brand mentions, positioning, sentiment,
              and competitor analysis
            </li>
          </ul>
        </div>

        {/* Queries Left */}
        <div className="mb-4 text-gray-700 text-sm">
          <strong className="font-semibold">Queries Left:</strong>{" "}
          {queriesLeft !== null ? queriesLeft : "..."}
        </div>

        {/* Search Section */}
        <div className="flex flex-col sm:flex-row items-center gap-3 mb-6">
          <input
            type="text"
            placeholder="Enter your brand name..."
            value={brandName}
            onChange={(e) => setBrandName(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg w-72 focus:outline-none focus:ring-2 focus:ring-black focus:border-black text-sm"
          />
          <DropdownMenu
            options={apiOptions}
            selected={selectedApi}
            onSelect={setSelectedApi}
          />
          <SearchButton
            brandName={brandName}
            userId={userId}
            queriesLeft={queriesLeft}
            setSearchedBrand={setSearchedBrand}
            refreshQueries={fetchQueries}
            selectedApi={selectedApi}
            setSelectedApi={setSelectedApi}
          />
        </div>

        {/* Results */}
        <div className="mt-6">
          <BrandAnalysisResult
            brandName={searchedBrand}
            selectedApi={selectedApi}
          />
        </div>
      </div>
    </div>
  );
}
