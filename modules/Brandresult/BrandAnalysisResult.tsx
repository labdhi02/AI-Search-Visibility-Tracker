import { useEffect, useState } from "react";
import BrandAnalysisDisplay from "./BrandAnalysisDisplay";

type AnalysisData = {
  brand_visibility?: string;
  competitor_mentions?: string[];
  brand_sentiment?: string;
  competitor_analysis?: string;
};

type ApiResult = {
  gemini?: AnalysisData;
  googleSerpAnalysis?: AnalysisData;
  grok?: AnalysisData;
};

type Props = { brandName: string; selectedApi: string };

// Helpers 
const normalize = (obj: unknown): AnalysisData => {
  const data = obj as Partial<AnalysisData> | undefined;
  return {
    brand_visibility: data?.brand_visibility || "",
    competitor_mentions: Array.isArray(data?.competitor_mentions) ? data.competitor_mentions : [],
    brand_sentiment: data?.brand_sentiment || "",
    competitor_analysis: data?.competitor_analysis || "",
  };
};

const fetchApi = async (url: string, brandName: string, key: keyof ApiResult) => {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ brandName }),
  });
  const data = await res.json();
  if (key === "grok") {
    try {
      return { [key]: typeof data.output === "string" ? JSON.parse(data.output) : data.output };
    } catch {
      return { [key]: data.output || data };
    }
  }
  return data;
};

// ---------- Component ----------
export default function BrandAnalysisResult({ brandName, selectedApi }: Props) {
  const [state, setState] = useState<{
    gemini: ApiResult | null;
    serp: ApiResult | null;
    grok: ApiResult | null;
    loading: boolean;
    sheetStatus: null | "success" | "error";
    stored: boolean;
  }>({ gemini: null, serp: null, grok: null, loading: false, sheetStatus: null, stored: false });

  // reset storage flag when brandName changes
  useEffect(() => setState((s) => ({ ...s, stored: false })), [brandName]);

  // fetch APIs
  useEffect(() => {
    if (!brandName) return setState((s) => ({ ...s, gemini: null, serp: null, grok: null }));

    (async () => {
      setState((s) => ({ ...s, loading: true }));
      const [g, sData, gr] = await Promise.all([
        fetchApi("/api/gemini", brandName, "gemini"),
        fetchApi("/api/serp", brandName, "googleSerpAnalysis"),
        fetchApi("/api/grok", brandName, "grok"),
      ]);
      setState((s) => ({ ...s, gemini: g, serp: sData, grok: gr, loading: false }));
    })();
  }, [brandName]);

  // save to Google Sheets
  useEffect(() => {
    const { gemini, serp, grok, loading, stored } = state;
    if (!brandName || !gemini || !serp || loading || stored) return;

    const userId = localStorage.getItem("userId") || "";
    let userEmail = localStorage.getItem("userEmail") || "";
    if (!userEmail) {
      try {
        userEmail = JSON.parse(localStorage.getItem("user") || "{}").email || "";
      } catch {}
    }

    const payload = {
      userId,
      userEmail,
      queryName: brandName,
      gemini: normalize(gemini.gemini),
      googleSerpAnalysis: normalize(serp.googleSerpAnalysis),
      grok: normalize(grok?.grok),
    };

    (async () => {
      try {
        const res = await fetch("/api/google-sheet", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        setState((s) => ({
          ...s,
          sheetStatus: res.ok ? "success" : "error",
          stored: res.ok,
        }));
      } catch {
        setState((s) => ({ ...s, sheetStatus: "error" }));
      }
    })();
  }, [brandName, state.gemini, state.serp, state.grok, state.loading, state.stored]);

  if (!brandName) return null;

  return (
    <BrandAnalysisDisplay
      geminiResults={selectedApi === "All" || selectedApi === "Gemini" ? state.gemini : null}
      serpResults={selectedApi === "All" || selectedApi === "Google SERP" ? state.serp : null}
      grokResults={selectedApi === "All" || selectedApi === "Grok" ? state.grok : null}
      loading={state.loading}
      sheetStatus={state.sheetStatus}
    />
  );
}
