"use client";

import { useState, useCallback, useRef } from "react";

// ── Full labels taxonomy ──────────────────────────────────────────────────
const LABELS = {
  TRANSPORT: ["climate_ghg_emissions","transport_electrification","low_carbon_fuels","transport_demand_management","land_use_and_smart_growth","public_and_active_transportation","transport_infrastructure","climate_resilience_and_adaptation","transport_equity_and_access","transport_safety","freight_and_goods_movement","transport_funding_and_finance","governance_and_regulation","mobility_innovation_and_technology","air_quality_and_health","behavior_change_policies","vehicle_standards_and_efficiency","accessibility_and_disability"],
  AGRICULTURE_AND_RURAL_DEVELOPMENT: ["climate_smart_agriculture","sustainable_land_management","soil_health_and_erosion_control","water_efficiency_and_irrigation","biodiversity_and_agroforestry","livestock_emissions_and_manure","crop_diversification_and_food_security","agricultural_value_chains_and_markets","rural_infrastructure_and_connectivity","land_tenure_and_property_rights","agricultural_extension_and_capacity","gender_and_inclusion_in_agriculture","disaster_risk_management_in_agriculture","pesticide_and_chemical_management"],
  EDUCATION: ["access_to_basic_education","secondary_and_tertiary_education","technical_and_vocational_training","digital_learning_and_infrastructure","teacher_training_and_quality","curriculum_reform_and_standards","inclusive_education_gender_disability","early_childhood_development","education_finance_and_governance","learning_assessment_and_outcomes","school_infrastructure_and_safe_schools","climate_and_environmental_education"],
  ENERGY: ["renewable_energy_generation","energy_efficiency_and_demand_side","grid_modernization_and_reliability","off_grid_and_distributed_energy","fossil_fuel_phaseout_and_transition","energy_access_and_energy_poverty","clean_cooking_and_heating","energy_sector_governance_and_regulation","energy_pricing_and_subsidy_reform","energy_resilience_and_disaster_risk"],
  ENVIRONMENT_AND_NATURAL_DISASTERS: ["climate_mitigation_general","climate_adaptation_general","disaster_risk_reduction","ecosystem_conservation_and_biodiversity","protected_areas_and_land_use_planning","coastal_and_marine_management","pollution_control_and_waste_management","environmental_impact_assessment","environmental_governance_and_institutions","environmental_monitoring_and_data"],
  FINANCIAL_MARKETS: ["financial_sector_regulation_and_supervision","capital_markets_development","banking_sector_resilience","green_bonds_and_sustainable_finance","sme_finance_and_access_to_credit","financial_inclusion_and_digital_finance","microfinance_and_rural_finance","payment_systems_and_financial_infrastructure","anti_money_laundering_and_kyc","consumer_protection_and_financial_literacy"],
  HEALTH: ["primary_health_care_systems","communicable_disease_control","non_communicable_diseases","maternal_child_and_reproductive_health","health_emergency_preparedness","health_infrastructure_and_equipment","health_workforce_and_training","health_financing_and_insurance","digital_health_and_information_systems","environmental_health_and_sanitation","mental_health_and_psychosocial_support","health_equity_gender_and_vulnerable_groups"],
  INDUSTRY: ["industrial_policy_and_competitiveness","manufacturing_upgrading_and_innovation","resource_efficiency_and_circular_economy","industrial_energy_efficiency","industrial_pollution_control","industrial_parks_and_zones","sme_industrial_development","workforce_skills_and_industry_4_0","industrial_safety_and_labor_standards","industrial_value_chains_and_export"],
  PRIVATE_FIRMS_AND_SME_DEVELOPMENT: ["business_environment_and_regulation","entrepreneurship_and_startups","sme_access_to_finance","business_development_services","value_chain_and_cluster_development","corporate_governance_and_transparency","innovation_and_productivity_support","women_led_and_inclusive_enterprises","digitalization_of_smes"],
  REFORM_MODERNIZATION_OF_THE_STATE: ["public_financial_management","tax_policy_and_administration","civil_service_reform_and_hr","decentralization_and_local_governance","e_government_and_digital_transformation","transparency_anticorruption_and_accountability","regulatory_quality_and_oversight","justice_sector_and_rule_of_law","public_investment_management","state_owned_enterprise_reform"],
  REGIONAL_INTEGRATION: ["cross_border_trade_facilitation","regional_infrastructure_connectivity","regional_energy_markets","regional_financial_integration","migration_and_labor_mobility","regional_environmental_cooperation","regional_institutional_frameworks","regional_security_and_resilience"],
  SCIENCE_AND_TECHNOLOGY: ["research_and_development_systems","innovation_policy_and_startup_ecosystems","digital_infrastructure_and_broadband","data_governance_and_cybersecurity","technology_transfer_and_commercialization","stem_education_and_skills","govtech_and_public_sector_innovation","climate_and_green_technology"],
  SOCIAL_INVESTMENT: ["social_protection_and_safety_nets","poverty_targeting_and_inclusion","labor_market_programs_and_skills","gender_equality_and_womens_empowerment","youth_employment_and_inclusion","indigenous_peoples_and_vulnerable_groups","housing_subsidies_and_social_programs","community_driven_development","social_cohesion_and_conflict_prevention"],
  SUSTAINABLE_TOURISM: ["sustainable_tourism_planning_and_zoning","eco_tourism_and_nature_based_tourism","cultural_heritage_preservation","tourism_value_chains_and_smes","tourism_resilience_and_disaster_risk","tourism_environmental_management","community_based_tourism_and_inclusion","tourism_infrastructure_and_services","tourism_governance_and_destination_management"],
  TRADE: ["trade_policy_and_tariff_reform","trade_facilitation_and_customs","export_promotion_and_diversification","trade_in_services_and_digital_trade","regional_trade_agreements","standards_and_quality_infrastructure","trade_finance_and_logistics","inclusive_trade_msmes_and_gender","trade_adjustment_and_competitiveness"],
  URBAN_DEVELOPMENT_AND_HOUSING: ["urban_planning_and_land_use","affordable_housing_and_slum_upgrading","urban_transport_and_mobility","municipal_services_water_waste_energy","urban_resilience_and_disaster_risk","smart_cities_and_digital_urban_services","urban_governance_and_municipal_finance","public_spaces_and_urban_environment","social_inclusion_and_informal_settlements"],
  WATER_AND_SANITATION: ["water_supply_and_distribution","wastewater_treatment_and_reuse","sanitation_and_hygiene_behaviors","integrated_water_resources_management","irrigation_and_multiuse_water_systems","water_quality_and_pollution_control","flood_risk_management_and_drainage","water_utilities_governance_and_tariffs","rural_water_and_sanitation_access","climate_resilient_water_infrastructure"],
};

const SECTOR_COLORS = {
  TRANSPORT: "#3b82f6",
  AGRICULTURE_AND_RURAL_DEVELOPMENT: "#22c55e",
  EDUCATION: "#f59e0b",
  ENERGY: "#f97316",
  ENVIRONMENT_AND_NATURAL_DISASTERS: "#10b981",
  FINANCIAL_MARKETS: "#6366f1",
  HEALTH: "#ec4899",
  INDUSTRY: "#8b5cf6",
  PRIVATE_FIRMS_AND_SME_DEVELOPMENT: "#14b8a6",
  REFORM_MODERNIZATION_OF_THE_STATE: "#64748b",
  REGIONAL_INTEGRATION: "#0ea5e9",
  SCIENCE_AND_TECHNOLOGY: "#a855f7",
  SOCIAL_INVESTMENT: "#ef4444",
  SUSTAINABLE_TOURISM: "#84cc16",
  TRADE: "#f59e0b",
  URBAN_DEVELOPMENT_AND_HOUSING: "#06b6d4",
  WATER_AND_SANITATION: "#3b82f6",
};

function riskColor(score) {
  if (score >= 0.7) return { bg: "#1a0a0a", border: "#7f1d1d", badge: "#ef4444", label: "HIGH" };
  if (score >= 0.4) return { bg: "#1a1200", border: "#78350f", badge: "#f59e0b", label: "MEDIUM" };
  return { bg: "#0a1a0a", border: "#14532d", badge: "#22c55e", label: "LOW" };
}

// ── Extract PDF text via pdf.js CDN ───────────────────────────────────────
async function extractPdfText(file) {
  return new Promise((resolve, reject) => {
    if (window.pdfjsLib) {
      doExtract(window.pdfjsLib, file, resolve, reject);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js";
    script.onload = () => {
      window.pdfjsLib.GlobalWorkerOptions.workerSrc =
        "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
      doExtract(window.pdfjsLib, file, resolve, reject);
    };
    script.onerror = () => reject(new Error("Failed to load pdf.js"));
    document.head.appendChild(script);
  });
}

async function doExtract(pdfjsLib, file, resolve, reject) {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    let fullText = "";
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      fullText += content.items.map((item) => item.str).join(" ") + "\n";
    }
    resolve(fullText);
  } catch (e) {
    reject(e);
  }
}

// ── Semantic chunking ─────────────────────────────────────────────────────
function chunkText(text, maxChars = 600) {
  const paragraphs = text.split(/\n{2,}|\.\s{2,}/).filter((p) => p.trim().length > 80);
  const chunks = [];
  let buffer = "";
  for (const para of paragraphs) {
    if ((buffer + para).length > maxChars && buffer) {
      chunks.push(buffer.trim());
      buffer = para;
    } else {
      buffer += " " + para;
    }
  }
  if (buffer.trim().length > 80) chunks.push(buffer.trim());
  return chunks.slice(0, 30);
}

// ── Claude API call via Next.js proxy route ───────────────────────────────
async function analyzeChunks(chunks, onProgress) {
  const taxonomyStr = Object.entries(LABELS)
    .map(([sector, topics]) => `${sector}: ${topics.join(", ")}`)
    .join("\n");

  const SYSTEM = `You are a compliance analyst for the Inter-American Development Bank (IDB).
Analyze document chunks for risks and compliance issues using this sector taxonomy:
${taxonomyStr}

IDB Policy compliance rules to check:
- Environmental and Social Framework (ESF): Projects must assess environmental/social impacts
- Procurement Policy: Clear procurement methods, anti-corruption measures required
- Gender Policy: Must address gender equity and women's empowerment
- Indigenous Peoples Policy: FPIC required when indigenous peoples are affected
- Fiduciary Standards: Financial controls, audit requirements, accountability measures
- Climate Change Policy: Must consider climate risks and GHG emissions
- Debt Sustainability: Loan terms must align with borrower capacity

For each chunk, respond ONLY with a valid JSON array. No markdown, no preamble.
Each item: {
  "chunk_index": number,
  "has_risk": boolean,
  "risk_score": 0.0-1.0,
  "compliance_status": "Compliant" | "Non-Compliant" | "Needs Review" | "N/A",
  "sector": one of the sector keys above or null,
  "risk_labels": array of matching label strings from the taxonomy,
  "risk_explanation": "1-2 sentence explanation of the risk or why it's compliant",
  "policy_violations": array of IDB policy names being violated (empty if compliant),
  "evidence_text": "the most relevant 20-30 word excerpt from the chunk"
}`;

  const batches = [];
  for (let i = 0; i < chunks.length; i += 5) {
    batches.push(chunks.slice(i, i + 5).map((c, j) => ({ index: i + j, text: c })));
  }

  const allResults = [];
  for (let b = 0; b < batches.length; b++) {
    onProgress(Math.round((b / batches.length) * 85));
    try {
      const resp = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: SYSTEM,
          messages: [{ role: "user", content: `Analyze these chunks:\n${JSON.stringify(batches[b], null, 2)}` }],
        }),
      });
      const data = await resp.json();
      const raw = data.content?.map((c) => c.text || "").join("") || "[]";
      const clean = raw.replace(/```json|```/g, "").trim();
      allResults.push(...JSON.parse(clean));
    } catch (e) {
      console.error("Batch error:", e);
    }
  }
  onProgress(100);
  return allResults;
}

// ── Gauge component ───────────────────────────────────────────────────────
function Gauge({ score }) {
  const pct = Math.round(score * 100);
  const color = score >= 0.7 ? "#ef4444" : score >= 0.4 ? "#f59e0b" : "#22c55e";
  const r = 36, cx = 44, cy = 44;
  const circ = 2 * Math.PI * r;
  const dash = (pct / 100) * circ;
  return (
    <svg width={88} height={88} viewBox="0 0 88 88">
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#1e293b" strokeWidth={8} />
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={color} strokeWidth={8}
        strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
        transform={`rotate(-90 ${cx} ${cy})`}
        style={{ transition: "stroke-dasharray 0.5s ease" }} />
      <text x={cx} y={cy + 5} textAnchor="middle" fontSize={15} fontWeight="bold" fill={color}>{pct}%</text>
    </svg>
  );
}

// ── Main App ──────────────────────────────────────────────────────────────
export default function TextGuard() {
  const [phase, setPhase] = useState("upload");
  const [progress, setProgress] = useState(0);
  const [fileName, setFileName] = useState("");
  const [chunks, setChunks] = useState([]);
  const [results, setResults] = useState([]);
  const [activeFilter, setActiveFilter] = useState("ALL");
  const [expandedChunk, setExpandedChunk] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef();

  const processFile = useCallback(async (file) => {
    if (!file || file.type !== "application/pdf") {
      alert("Please upload a PDF file.");
      return;
    }
    setFileName(file.name);
    setPhase("analyzing");
    setProgress(5);
    try {
      const text = await extractPdfText(file);
      setProgress(20);
      const ch = chunkText(text);
      setChunks(ch);
      setProgress(30);
      const res = await analyzeChunks(ch, (p) => setProgress(30 + Math.round(p * 0.65)));
      setResults(res);
      setPhase("results");
    } catch (e) {
      alert("Error: " + e.message);
      setPhase("upload");
    }
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setDragOver(false);
    processFile(e.dataTransfer.files[0]);
  }, [processFile]);

  // Derived stats
  const riskChunks = results.filter((r) => r.has_risk);
  const nonCompliant = results.filter((r) => r.compliance_status === "Non-Compliant");
  const needsReview = results.filter((r) => r.compliance_status === "Needs Review");
  const docScore = results.length ? results.reduce((s, r) => s + (r.risk_score || 0), 0) / results.length : 0;
  const sectorCounts = {};
  riskChunks.forEach((r) => { if (r.sector) sectorCounts[r.sector] = (sectorCounts[r.sector] || 0) + 1; });
  const allSectors = ["ALL", ...Object.keys(sectorCounts)];
  const filteredResults = results.filter((r) => activeFilter === "ALL" || r.sector === activeFilter);
  const violatedPolicies = [...new Set(results.flatMap((r) => r.policy_violations || []))];

  // ── Upload ──────────────────────────────────────────────────────────────
  if (phase === "upload") {
    return (
      <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #0f172a 0%, #1e3a5f 100%)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontFamily: "'Inter', sans-serif", padding: 24 }}>
        <div style={{ marginBottom: 24, textAlign: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, justifyContent: "center", marginBottom: 8 }}>
            <div style={{ width: 40, height: 40, background: "linear-gradient(135deg, #3b82f6, #8b5cf6)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>🛡️</div>
            <span style={{ fontSize: 26, fontWeight: 800, color: "#fff", letterSpacing: "-0.5px" }}>TextGuard <span style={{ color: "#60a5fa" }}>3.0</span></span>
          </div>
          <p style={{ color: "#94a3b8", fontSize: 14, margin: 0 }}>IDB Document Risk & Compliance Analyzer · Powered by Claude AI</p>
        </div>

        <div
          onDrop={handleDrop}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onClick={() => fileRef.current.click()}
          style={{ width: "100%", maxWidth: 520, background: dragOver ? "rgba(59,130,246,0.15)" : "rgba(255,255,255,0.05)", border: `2px dashed ${dragOver ? "#3b82f6" : "#334155"}`, borderRadius: 20, padding: "48px 32px", textAlign: "center", cursor: "pointer", transition: "all 0.2s", backdropFilter: "blur(10px)" }}
        >
          <div style={{ fontSize: 48, marginBottom: 16 }}>📄</div>
          <p style={{ color: "#e2e8f0", fontWeight: 600, fontSize: 16, marginBottom: 8 }}>Drop your IDB TC Abstract or Project Doc here</p>
          <p style={{ color: "#64748b", fontSize: 13, margin: 0 }}>PDF format · Up to 30 chunks analyzed</p>
          <input ref={fileRef} type="file" accept=".pdf" style={{ display: "none" }} onChange={(e) => processFile(e.target.files[0])} />
        </div>

        <div style={{ marginTop: 32, display: "flex", gap: 16, flexWrap: "wrap", justifyContent: "center" }}>
          {["Risk Detection", "Compliance Check", "Policy Mapping", "Evidence Pinpointing"].map((f) => (
            <span key={f} style={{ background: "rgba(255,255,255,0.07)", color: "#94a3b8", padding: "6px 14px", borderRadius: 20, fontSize: 12, border: "1px solid #1e293b" }}>✓ {f}</span>
          ))}
        </div>

        <div style={{ marginTop: 24, padding: "16px 24px", background: "rgba(59,130,246,0.1)", border: "1px solid rgba(59,130,246,0.3)", borderRadius: 12, maxWidth: 520, width: "100%" }}>
          <p style={{ color: "#93c5fd", fontSize: 12, margin: 0 }}>
            ℹ️ Classifies chunks against 17 IDB sectors, 150+ risk labels, and checks against IDB Environmental, Procurement, Gender, Indigenous Peoples, and Fiduciary policies.
          </p>
        </div>
      </div>
    );
  }

  // ── Analyzing ───────────────────────────────────────────────────────────
  if (phase === "analyzing") {
    const steps = [
      { label: "Extracting PDF text", done: progress > 15 },
      { label: "Semantic chunking", done: progress > 28 },
      { label: "Classifying via Claude API", done: progress > 90 },
      { label: "Aggregating scores", done: progress === 100 },
    ];
    return (
      <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #0f172a 0%, #1e3a5f 100%)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontFamily: "'Inter', sans-serif", padding: 24 }}>
        <div style={{ width: "100%", maxWidth: 480, textAlign: "center" }}>
          <div style={{ fontSize: 48, marginBottom: 20 }}>⚙️</div>
          <h2 style={{ color: "#fff", fontSize: 20, fontWeight: 700, marginBottom: 4 }}>Analyzing Document</h2>
          <p style={{ color: "#64748b", fontSize: 13, marginBottom: 32 }}>{fileName}</p>
          <div style={{ background: "#1e293b", borderRadius: 8, height: 8, marginBottom: 24, overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${progress}%`, background: "linear-gradient(90deg, #3b82f6, #8b5cf6)", borderRadius: 8, transition: "width 0.3s ease" }} />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {steps.map((s, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, opacity: s.done ? 1 : 0.4 }}>
                <span style={{ width: 20, height: 20, borderRadius: "50%", background: s.done ? "#22c55e" : "#334155", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, flexShrink: 0, color: "#fff" }}>
                  {s.done ? "✓" : i + 1}
                </span>
                <span style={{ color: s.done ? "#e2e8f0" : "#64748b", fontSize: 13 }}>{s.label}</span>
              </div>
            ))}
          </div>
          <p style={{ color: "#475569", fontSize: 12, marginTop: 24 }}>{progress}% complete</p>
        </div>
      </div>
    );
  }

  // ── Results ─────────────────────────────────────────────────────────────
  const colors = riskColor(docScore);
  return (
    <div style={{ minHeight: "100vh", background: "#0f172a", fontFamily: "'Inter', sans-serif", color: "#e2e8f0" }}>
      {/* Header */}
      <div style={{ background: "rgba(255,255,255,0.03)", borderBottom: "1px solid #1e293b", padding: "16px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 20 }}>🛡️</span>
          <span style={{ fontWeight: 800, fontSize: 18 }}>TextGuard <span style={{ color: "#60a5fa" }}>3.0</span></span>
          <span style={{ color: "#475569", fontSize: 13 }}>· {fileName}</span>
        </div>
        <button onClick={() => { setPhase("upload"); setResults([]); setChunks([]); }} style={{ background: "#1e293b", border: "1px solid #334155", color: "#94a3b8", padding: "6px 14px", borderRadius: 8, cursor: "pointer", fontSize: 13 }}>
          ← New Document
        </button>
      </div>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "24px 16px" }}>
        {/* Summary cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16, marginBottom: 24 }}>
          <div style={{ background: "#1e293b", border: `1px solid ${colors.border}`, borderRadius: 16, padding: 20, display: "flex", alignItems: "center", gap: 16 }}>
            <Gauge score={docScore} />
            <div>
              <p style={{ color: "#64748b", fontSize: 11, margin: "0 0 4px 0", textTransform: "uppercase", letterSpacing: 1 }}>Doc Risk Score</p>
              <span style={{ background: colors.badge, color: "#fff", padding: "2px 8px", borderRadius: 4, fontSize: 11, fontWeight: 700 }}>{colors.label} RISK</span>
            </div>
          </div>
          {[
            { label: "Chunks Analyzed", value: results.length, icon: "📑", color: "#3b82f6" },
            { label: "Risk Flags", value: riskChunks.length, icon: "⚠️", color: "#f59e0b" },
            { label: "Non-Compliant", value: nonCompliant.length, icon: "❌", color: "#ef4444" },
            { label: "Needs Review", value: needsReview.length, icon: "🔍", color: "#8b5cf6" },
            { label: "Policy Violations", value: violatedPolicies.length, icon: "📋", color: "#ec4899" },
          ].map((c) => (
            <div key={c.label} style={{ background: "#1e293b", border: "1px solid #334155", borderRadius: 16, padding: 20 }}>
              <p style={{ color: "#64748b", fontSize: 11, margin: "0 0 8px 0", textTransform: "uppercase", letterSpacing: 1 }}>{c.icon} {c.label}</p>
              <p style={{ color: c.color, fontSize: 28, fontWeight: 800, margin: 0 }}>{c.value}</p>
            </div>
          ))}
        </div>

        {/* Policy violations banner */}
        {violatedPolicies.length > 0 && (
          <div style={{ background: "#1e293b", border: "1px solid #7f1d1d", borderRadius: 16, padding: 20, marginBottom: 24 }}>
            <p style={{ color: "#fca5a5", fontWeight: 700, fontSize: 14, margin: "0 0 12px 0" }}>🚨 IDB Policy Areas Flagged</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {violatedPolicies.map((p) => (
                <span key={p} style={{ background: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.4)", color: "#fca5a5", padding: "4px 10px", borderRadius: 6, fontSize: 12 }}>{p}</span>
              ))}
            </div>
          </div>
        )}

        {/* Sidebar + chunks */}
        <div style={{ display: "grid", gridTemplateColumns: "200px 1fr", gap: 20 }}>
          <div style={{ background: "#1e293b", border: "1px solid #334155", borderRadius: 16, padding: 16, height: "fit-content" }}>
            <p style={{ color: "#64748b", fontSize: 11, textTransform: "uppercase", letterSpacing: 1, margin: "0 0 12px 0" }}>Filter by Sector</p>
            {allSectors.map((s) => (
              <button key={s} onClick={() => setActiveFilter(s)} style={{ width: "100%", textAlign: "left", background: activeFilter === s ? "rgba(59,130,246,0.2)" : "transparent", border: "none", color: activeFilter === s ? "#60a5fa" : "#94a3b8", padding: "7px 10px", borderRadius: 8, cursor: "pointer", fontSize: 12, fontWeight: activeFilter === s ? 700 : 400, marginBottom: 2, borderLeft: activeFilter === s ? "3px solid #3b82f6" : "3px solid transparent" }}>
                {s === "ALL" ? "All Chunks" : s.replace(/_/g, " ")}
                {s !== "ALL" && <span style={{ float: "right", background: "#334155", borderRadius: 4, padding: "0 5px", fontSize: 10 }}>{sectorCounts[s]}</span>}
              </button>
            ))}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {filteredResults.map((r) => {
              const c = riskColor(r.risk_score || 0);
              const sectorColor = SECTOR_COLORS[r.sector] || "#64748b";
              const isExpanded = expandedChunk === r.chunk_index;
              const chunk = chunks[r.chunk_index] || "";
              return (
                <div key={r.chunk_index} style={{ background: "#1e293b", border: `1px solid ${r.has_risk ? c.border : "#334155"}`, borderRadius: 16, overflow: "hidden" }}>
                  <div onClick={() => setExpandedChunk(isExpanded ? null : r.chunk_index)} style={{ padding: "16px 20px", cursor: "pointer", display: "flex", alignItems: "flex-start", gap: 14 }}>
                    <div style={{ flexShrink: 0, width: 48, height: 48, borderRadius: "50%", background: `${c.badge}22`, border: `2px solid ${c.badge}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                      <span style={{ color: c.badge, fontSize: 13, fontWeight: 800, lineHeight: 1 }}>{Math.round((r.risk_score || 0) * 100)}</span>
                      <span style={{ color: c.badge, fontSize: 8 }}>RISK</span>
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 6 }}>
                        <span style={{ color: "#94a3b8", fontSize: 11 }}>Chunk #{r.chunk_index + 1}</span>
                        {r.sector && <span style={{ background: `${sectorColor}22`, border: `1px solid ${sectorColor}66`, color: sectorColor, padding: "1px 8px", borderRadius: 4, fontSize: 10, fontWeight: 700 }}>{r.sector.replace(/_/g, " ")}</span>}
                        <span style={{ background: r.compliance_status === "Non-Compliant" ? "#7f1d1d" : r.compliance_status === "Needs Review" ? "#451a03" : "#14532d", color: r.compliance_status === "Non-Compliant" ? "#fca5a5" : r.compliance_status === "Needs Review" ? "#fde68a" : "#86efac", padding: "1px 8px", borderRadius: 4, fontSize: 10, fontWeight: 700 }}>
                          {r.compliance_status}
                        </span>
                        {r.has_risk && <span style={{ background: "#7c2d12", color: "#fed7aa", padding: "1px 8px", borderRadius: 4, fontSize: 10, fontWeight: 700 }}>⚠ RISK</span>}
                      </div>
                      {r.evidence_text && <p style={{ color: "#e2e8f0", fontSize: 13, margin: "0 0 6px 0", fontStyle: "italic", borderLeft: "2px solid #475569", paddingLeft: 10 }}>"{r.evidence_text}"</p>}
                      <p style={{ color: "#94a3b8", fontSize: 12, margin: 0 }}>{r.risk_explanation}</p>
                      {r.risk_labels?.length > 0 && (
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 8 }}>
                          {r.risk_labels.map((l) => <span key={l} style={{ background: "#0f172a", border: "1px solid #334155", color: "#64748b", padding: "2px 7px", borderRadius: 4, fontSize: 10 }}>{l.replace(/_/g, " ")}</span>)}
                        </div>
                      )}
                    </div>
                    <span style={{ color: "#475569", fontSize: 16, flexShrink: 0 }}>{isExpanded ? "▲" : "▼"}</span>
                  </div>
                  {isExpanded && (
                    <div style={{ borderTop: "1px solid #334155", padding: "16px 20px" }}>
                      {r.policy_violations?.length > 0 && (
                        <div style={{ marginBottom: 12 }}>
                          <p style={{ color: "#fca5a5", fontSize: 11, fontWeight: 700, margin: "0 0 6px 0", textTransform: "uppercase", letterSpacing: 1 }}>Policy Violations</p>
                          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                            {r.policy_violations.map((v) => <span key={v} style={{ background: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.4)", color: "#fca5a5", padding: "3px 9px", borderRadius: 6, fontSize: 11 }}>{v}</span>)}
                          </div>
                        </div>
                      )}
                      <p style={{ color: "#64748b", fontSize: 11, fontWeight: 700, margin: "0 0 8px 0", textTransform: "uppercase", letterSpacing: 1 }}>Full Chunk Text</p>
                      <p style={{ color: "#94a3b8", fontSize: 12, lineHeight: 1.7, margin: 0, background: "#0f172a", padding: 14, borderRadius: 10, border: "1px solid #1e293b" }}>{chunk}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
