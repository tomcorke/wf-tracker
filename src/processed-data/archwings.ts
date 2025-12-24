import { WarframeData, DataSet } from '../data-types';

export const aRCHWINGAmesha: WarframeData = {
  "name": "<ARCHWING> Amesha",
  "uniqueName": "/Lotus/Powersuits/Archwing/SupportJetPack/SupportJetPack",
  "parentName": "/Lotus/Types/Game/FlightJetPackItems/PlayerFlightJetPackItem",
  "productCategory": "SpaceSuits"
};

export const aRCHWINGElytron: WarframeData = {
  "name": "<ARCHWING> Elytron",
  "uniqueName": "/Lotus/Powersuits/Archwing/DemolitionJetPack/DemolitionJetPack",
  "parentName": "/Lotus/Types/Game/FlightJetPackItems/PlayerFlightJetPackItem",
  "productCategory": "SpaceSuits"
};

export const aRCHWINGItzal: WarframeData = {
  "name": "<ARCHWING> Itzal",
  "uniqueName": "/Lotus/Powersuits/Archwing/StealthJetPack/StealthJetPack",
  "parentName": "/Lotus/Types/Game/FlightJetPackItems/PlayerFlightJetPackItem",
  "productCategory": "SpaceSuits"
};

export const aRCHWINGOdonata: WarframeData = {
  "name": "<ARCHWING> Odonata",
  "uniqueName": "/Lotus/Powersuits/Archwing/StandardJetPack/StandardJetPack",
  "parentName": "/Lotus/Types/Game/FlightJetPackItems/PlayerFlightJetPackItem",
  "productCategory": "SpaceSuits"
};

export const aRCHWINGOdonataPrime: WarframeData = {
  "name": "<ARCHWING> Odonata Prime",
  "uniqueName": "/Lotus/Powersuits/Archwing/PrimeJetPack/PrimeJetPack",
  "parentName": "/Lotus/Powersuits/Archwing/StandardJetPack/StandardJetPack",
  "productCategory": "SpaceSuits"
};

export const archwingsByName = {
  "<ARCHWING> Amesha": aRCHWINGAmesha,
  "<ARCHWING> Elytron": aRCHWINGElytron,
  "<ARCHWING> Itzal": aRCHWINGItzal,
  "<ARCHWING> Odonata": aRCHWINGOdonata,
  "<ARCHWING> Odonata Prime": aRCHWINGOdonataPrime,
} as const;

export type ArchwingName = keyof typeof archwingsByName;

export const archwingPrimes = new Map<WarframeData, WarframeData>();
archwingPrimes.set(aRCHWINGOdonata, aRCHWINGOdonataPrime);

export const ARCHWINGS: DataSet<ArchwingName, WarframeData> = {
  itemNames: Object.keys(archwingsByName) as ArchwingName[],
  itemsByName: archwingsByName,
  primes: archwingPrimes,
};