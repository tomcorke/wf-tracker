import { SentinelData, DataSet } from '../data-types';

export const lotus_Powersuits_Khora_Kavat_KhoraKavatPowerSuit: SentinelData = {
  "name": "Venari",
  "uniqueName": "/Lotus/Powersuits/Khora/Kavat/KhoraKavatPowerSuit",
  "productCategory": "SpecialItems"
};

export const lotus_Powersuits_Khora_Kavat_KhoraPrimeKavatPowerSuit: SentinelData = {
  "name": "Venari Prime",
  "uniqueName": "/Lotus/Powersuits/Khora/Kavat/KhoraPrimeKavatPowerSuit",
  "productCategory": "SpecialItems"
};

export const specialCompanionsByName = {
  "/Lotus/Powersuits/Khora/Kavat/KhoraKavatPowerSuit": lotus_Powersuits_Khora_Kavat_KhoraKavatPowerSuit,
  "/Lotus/Powersuits/Khora/Kavat/KhoraPrimeKavatPowerSuit": lotus_Powersuits_Khora_Kavat_KhoraPrimeKavatPowerSuit,
} as const;

export type SpecialCompanionName = keyof typeof specialCompanionsByName;

export const specialCompanionPrimes = new Map<SentinelData, SentinelData>();
specialCompanionPrimes.set(lotus_Powersuits_Khora_Kavat_KhoraKavatPowerSuit, lotus_Powersuits_Khora_Kavat_KhoraPrimeKavatPowerSuit);

export const specialCompanionsList: SentinelData[] = [
  lotus_Powersuits_Khora_Kavat_KhoraKavatPowerSuit,
  lotus_Powersuits_Khora_Kavat_KhoraPrimeKavatPowerSuit,
];

export const SPECIALCOMPANIONS: DataSet<SpecialCompanionName, SentinelData> = {
  itemNames: Object.keys(specialCompanionsByName) as SpecialCompanionName[],
  itemsByName: specialCompanionsByName,
  items: specialCompanionsList,
  primes: specialCompanionPrimes,
};