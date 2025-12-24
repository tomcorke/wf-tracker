import { SentinelData, DataSet } from '../data-types';

export const venari: SentinelData = {
  "name": "Venari",
  "uniqueName": "/Lotus/Powersuits/Khora/Kavat/KhoraKavatPowerSuit",
  "productCategory": "SpecialItems"
};

export const venariPrime: SentinelData = {
  "name": "Venari Prime",
  "uniqueName": "/Lotus/Powersuits/Khora/Kavat/KhoraPrimeKavatPowerSuit",
  "productCategory": "SpecialItems"
};

export const specialCompanionsByName = {
  "Venari": venari,
  "Venari Prime": venariPrime,
} as const;

export type SpecialCompanionName = keyof typeof specialCompanionsByName;

export const specialCompanionPrimes = new Map<SentinelData, SentinelData>();
specialCompanionPrimes.set(venari, venariPrime);

export const SPECIALCOMPANIONS: DataSet<SpecialCompanionName, SentinelData> = {
  itemNames: Object.keys(specialCompanionsByName) as SpecialCompanionName[],
  itemsByName: specialCompanionsByName,
  primes: specialCompanionPrimes,
};