import z from "zod";
import { create } from "zustand";

const oracleDataSchema = z.object({
  expiry: z.number(),
  rot: z.literal("A").or(z.literal("B")).or(z.literal("C")),
  vaultRot: z.literal("A").or(z.literal("B")).or(z.literal("C")),
});

export type OracleData = z.infer<typeof oracleDataSchema>;

type OracleDataStore = {
  oracleData: OracleData | null;
};

let oracleDataFetchPromise: Promise<OracleData | null> | null = null;

const fetchOracleData = async (
  setData: (data: OracleData) => void,
): Promise<OracleData | null> => {
  try {
    const response = await fetch("https://oracle.browse.wf/bounty-cycle");
    const data = await response.json();
    const oracleData = oracleDataSchema.parse(data);

    // schedule new fetch when the data expires
    const now = Date.now();
    const delay = oracleData.expiry - now + 10000; // add 10 second buffer
    setTimeout(() => {
      oracleDataFetchPromise = fetchOracleData(setData);
    }, delay);

    setData(oracleData);
    return oracleData;
  } catch (error) {
    console.error("Error fetching oracle data:", error);
    // schedule new fetch in 30 seconds on error
    setTimeout(() => {
      oracleDataFetchPromise = fetchOracleData(setData);
    }, 30000);
    return null;
  }
};

export const useOracle = create<OracleDataStore>()(() => ({
  oracleData: null,
}));

if (!oracleDataFetchPromise) {
  oracleDataFetchPromise = fetchOracleData((newData) =>
    useOracle.setState({ oracleData: newData }),
  );
}
