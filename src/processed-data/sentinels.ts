import { SentinelData, DataSet } from '../data-types';

export const carrier: SentinelData = {
  "name": "Carrier",
  "uniqueName": "/Lotus/Types/Sentinels/SentinelPowersuits/CarrierPowerSuit",
  "productCategory": "Sentinels"
};

export const carrierPrime: SentinelData = {
  "name": "Carrier Prime",
  "uniqueName": "/Lotus/Types/Sentinels/SentinelPowersuits/PrimeCarrierPowerSuit",
  "productCategory": "Sentinels"
};

export const dethcube: SentinelData = {
  "name": "Dethcube",
  "uniqueName": "/Lotus/Types/Sentinels/SentinelPowersuits/DethCubePowerSuit",
  "productCategory": "Sentinels"
};

export const dethcubePrime: SentinelData = {
  "name": "Dethcube Prime",
  "uniqueName": "/Lotus/Types/Sentinels/SentinelPowersuits/PrimeDethCubePowerSuit",
  "productCategory": "Sentinels"
};

export const diriga: SentinelData = {
  "name": "Diriga",
  "uniqueName": "/Lotus/Types/Sentinels/SentinelPowersuits/ArcDronePowerSuit",
  "productCategory": "Sentinels"
};

export const djinn: SentinelData = {
  "name": "Djinn",
  "uniqueName": "/Lotus/Types/Sentinels/SentinelPowersuits/GubberPowerSuit",
  "productCategory": "Sentinels"
};

export const helios: SentinelData = {
  "name": "Helios",
  "uniqueName": "/Lotus/Types/Sentinels/SentinelPowersuits/MeleePetPowerSuit",
  "productCategory": "Sentinels"
};

export const heliosPrime: SentinelData = {
  "name": "Helios Prime",
  "uniqueName": "/Lotus/Types/Sentinels/SentinelPowersuits/PrimeHeliosPowerSuit",
  "productCategory": "Sentinels"
};

export const nautilus: SentinelData = {
  "name": "Nautilus",
  "uniqueName": "/Lotus/Types/Sentinels/SentinelPowersuits/EmpyreanSentinelPowerSuit",
  "productCategory": "Sentinels"
};

export const nautilusPrime: SentinelData = {
  "name": "Nautilus Prime",
  "uniqueName": "/Lotus/Types/Sentinels/SentinelPowersuits/NautilusPrimeSentinelPowerSuit",
  "productCategory": "Sentinels"
};

export const oxylus: SentinelData = {
  "name": "Oxylus",
  "uniqueName": "/Lotus/Types/Sentinels/SentinelPowersuits/RadarPowerSuit",
  "productCategory": "Sentinels"
};

export const prismaShade: SentinelData = {
  "name": "Prisma Shade",
  "uniqueName": "/Lotus/Types/Sentinels/SentinelPowersuits/PrismaShadePowerSuit",
  "productCategory": "Sentinels"
};

export const shade: SentinelData = {
  "name": "Shade",
  "uniqueName": "/Lotus/Types/Sentinels/SentinelPowersuits/ShadePowerSuit",
  "productCategory": "Sentinels"
};

export const shadePrime: SentinelData = {
  "name": "Shade Prime",
  "uniqueName": "/Lotus/Types/Sentinels/SentinelPowersuits/PrimeShadePowerSuit",
  "productCategory": "Sentinels"
};

export const taxon: SentinelData = {
  "name": "Taxon",
  "uniqueName": "/Lotus/Types/Sentinels/SentinelPowersuits/TnSentinelCrossPowerSuit",
  "productCategory": "Sentinels"
};

export const wyrm: SentinelData = {
  "name": "Wyrm",
  "uniqueName": "/Lotus/Types/Sentinels/SentinelPowersuits/WyrmPowerSuit",
  "productCategory": "Sentinels"
};

export const wyrmPrime: SentinelData = {
  "name": "Wyrm Prime",
  "uniqueName": "/Lotus/Types/Sentinels/SentinelPowersuits/PrimeWyrmPowerSuit",
  "productCategory": "Sentinels"
};

export const sentinelsByName = {
  "Carrier": carrier,
  "Carrier Prime": carrierPrime,
  "Dethcube": dethcube,
  "Dethcube Prime": dethcubePrime,
  "Diriga": diriga,
  "Djinn": djinn,
  "Helios": helios,
  "Helios Prime": heliosPrime,
  "Nautilus": nautilus,
  "Nautilus Prime": nautilusPrime,
  "Oxylus": oxylus,
  "Prisma Shade": prismaShade,
  "Shade": shade,
  "Shade Prime": shadePrime,
  "Taxon": taxon,
  "Wyrm": wyrm,
  "Wyrm Prime": wyrmPrime,
} as const;

export type SentinelName = keyof typeof sentinelsByName;

export const sentinelPrimes = new Map<SentinelData, SentinelData>();
sentinelPrimes.set(carrier, carrierPrime);
sentinelPrimes.set(dethcube, dethcubePrime);
sentinelPrimes.set(helios, heliosPrime);
sentinelPrimes.set(nautilus, nautilusPrime);
sentinelPrimes.set(shade, shadePrime);
sentinelPrimes.set(wyrm, wyrmPrime);

export const SENTINELS: DataSet<SentinelName, SentinelData> = {
  itemNames: Object.keys(sentinelsByName) as SentinelName[],
  itemsByName: sentinelsByName,
  primes: sentinelPrimes,
};