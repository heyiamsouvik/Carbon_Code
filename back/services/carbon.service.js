const axios = require("axios");

const REGION_CARBON_INTENSITY = {
  "us-east-1": 0.00000012,
  "us-west-1": 0.00000009,
  "eu-west-1": 0.00000006,
  "eu-central-1": 0.00000005,
  "ap-south-1": 0.00000014,
  "gcp-us-central1": 0.00000007,
  "gcp-europe-west1": 0.00000004,
  "azure-eastus": 0.00000011,
  "azure-westeurope": 0.00000005
};

const CLIMATIQ_REGION_MAP = {
  "us-east-1": "US",
  "us-west-1": "US",
  "eu-west-1": "GB",
  "eu-central-1": "DE",
  "ap-south-1": "IN",
  "gcp-us-central1": "US",
  "gcp-europe-west1": "DE",
  "azure-eastus": "US",
  "azure-westeurope": "NL"
};

const executionWeightToKwh = (executionWeight) => {
  const weight = Number(executionWeight);

  if (!Number.isFinite(weight) || weight <= 0) {
    return 0;
  }

  return weight / 1_000_000_000;
};


exports.estimateCarbon = async ({ executionWeight, region }) => {
  const intensity = REGION_CARBON_INTENSITY[region] || 0.0000001;
  const climatiqRegion = CLIMATIQ_REGION_MAP[region];
  const estimatedKwh = executionWeightToKwh(executionWeight);

  const CLIMATIQ_SUPPORTED_REGIONS = ["US", "GB", "DE", "NL", "FR"];

  const ruleBased = () => ({
    estimatedCO2kg: Number((executionWeight * intensity).toFixed(6)),
    estimatedEnergy: estimatedKwh,
    source: "rule-based",
    methodology: "Static analysis × execution weight × regional carbon intensity"
  });

  // fallback if API key is missing or region unsupported
  if (!process.env.CLIMATIQ_API_KEY || !CLIMATIQ_SUPPORTED_REGIONS.includes(climatiqRegion)) {
    return ruleBased();
  }

  try {
    // 1️⃣ Search for an emission factor
    const searchResp = await axios.get(
      "https://api.climatiq.io/data/v1/search",
      {
        headers: {
          Authorization: `Bearer ${process.env.CLIMATIQ_API_KEY}`
        },
        params: {
          query: "electricity",   // general electricity factor
          region: climatiqRegion,
          data_version: "^21"
        },
        timeout: 5000
      }
    );

    if (!searchResp.data?.results?.length) {
      console.warn("No Climatiq emission factor found, using fallback");
      return ruleBased();
    }

    const factorId = searchResp.data.results[0].id;

    // 2️⃣ Estimate emissions
    const estimateResp = await axios.post(
      "https://api.climatiq.io/data/v1/estimate",
      {
        emission_factor: { id: factorId },
        parameters: {
          energy: estimatedKwh,
          energy_unit: "kWh"
        }
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.CLIMATIQ_API_KEY}`,
          "Content-Type": "application/json"
        },
        timeout: 5000
      }
    );

    return {
      estimatedCO2kg: Number(estimateResp.data.co2e.toFixed(6)),
      estimatedEnergy: estimatedKwh,
      source: "climatiq-api",
      methodology: "Climatiq emission factor ID + execution energy"
    };
  } catch (error) {
    console.warn("Climatiq failed → fallback", {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data
    });
    return ruleBased();
  }
};
