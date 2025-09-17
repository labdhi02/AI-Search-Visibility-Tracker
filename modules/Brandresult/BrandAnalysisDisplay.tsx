import React from "react";
import ReactMarkdown from "react-markdown";

type AnalysisData = {
  brand_visibility?: string;
  competitor_mentions?: string[];
  brand_sentiment?: string;
  competitor_analysis?: string;
};

type BrandAnalysisDisplayProps = {
  geminiResults: { gemini?: AnalysisData } | null;
  serpResults: { googleSerpAnalysis?: AnalysisData } | null;
  grokResults?: { grok?: AnalysisData } | null;
  loading: boolean;
  sheetStatus: null | "success" | "error";
};

function TableRow({ label, value }: { label: string; value?: string | string[] }) {
  const displayValue =
    Array.isArray(value) && value.length
      ? value.join(", ")
      : typeof value === "string" && value.trim()
      ? value
      : "-";

  return (
    <div className="grid grid-cols-3 gap-4 px-4 py-3">
      <span className="font-medium text-gray-700">{label}</span>
      <span className="col-span-2 text-gray-600 whitespace-pre-line">
        <ReactMarkdown>{displayValue}</ReactMarkdown>
      </span>
    </div>
  );
}

function renderTable(title: string, data?: AnalysisData) {
  if (!data) return null;
  return (
    <div className="mb-8 bg-white shadow-md rounded-lg overflow-hidden border border-gray-200">
      <div className="bg-gray-100 px-4 py-2 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
      </div>
      <div className="divide-y divide-gray-200">
        <TableRow label="Brand Visibility" value={data.brand_visibility} />
        <TableRow label="Competitor Mentions" value={data.competitor_mentions} />
        <TableRow label="Brand Sentiment" value={data.brand_sentiment} />
        <TableRow label="Competitor Analysis" value={data.competitor_analysis} />
      </div>
    </div>
  );
}

export default function BrandAnalysisDisplay({
  geminiResults,
  serpResults,
  grokResults,
  loading,
}: BrandAnalysisDisplayProps) {
  return (
    <div className="mt-6 space-y-6">
      {loading && <p className="text-gray-500">Loading...</p>}


      {geminiResults?.gemini &&
        renderTable("AI Brand Analysis Result (Gemini)", geminiResults.gemini)}

      {serpResults?.googleSerpAnalysis &&
        renderTable("AI Brand Analysis Result (Google SERP)", serpResults.googleSerpAnalysis)}

      {grokResults?.grok &&
        renderTable("AI Brand Analysis Result (Grok)", grokResults.grok)}
    </div>
  );
}
