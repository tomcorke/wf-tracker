import { WarframeData, DataSet } from '../data-types';

export const lotus_Powersuits_Archwing_SupportJetPack_SupportJetPack: WarframeData = {
  "name": "Amesha",
  "uniqueName": "/Lotus/Powersuits/Archwing/SupportJetPack/SupportJetPack",
  "parentName": "/Lotus/Types/Game/FlightJetPackItems/PlayerFlightJetPackItem",
  "productCategory": "SpaceSuits"
};

export const lotus_Powersuits_Archwing_DemolitionJetPack_DemolitionJetPack: WarframeData = {
  "name": "Elytron",
  "uniqueName": "/Lotus/Powersuits/Archwing/DemolitionJetPack/DemolitionJetPack",
  "parentName": "/Lotus/Types/Game/FlightJetPackItems/PlayerFlightJetPackItem",
  "productCategory": "SpaceSuits"
};

export const lotus_Powersuits_Archwing_StealthJetPack_StealthJetPack: WarframeData = {
  "name": "Itzal",
  "uniqueName": "/Lotus/Powersuits/Archwing/StealthJetPack/StealthJetPack",
  "parentName": "/Lotus/Types/Game/FlightJetPackItems/PlayerFlightJetPackItem",
  "productCategory": "SpaceSuits"
};

export const lotus_Powersuits_Archwing_StandardJetPack_StandardJetPack: WarframeData = {
  "name": "Odonata",
  "uniqueName": "/Lotus/Powersuits/Archwing/StandardJetPack/StandardJetPack",
  "parentName": "/Lotus/Types/Game/FlightJetPackItems/PlayerFlightJetPackItem",
  "productCategory": "SpaceSuits"
};

export const lotus_Powersuits_Archwing_PrimeJetPack_PrimeJetPack: WarframeData = {
  "name": "Odonata Prime",
  "uniqueName": "/Lotus/Powersuits/Archwing/PrimeJetPack/PrimeJetPack",
  "parentName": "/Lotus/Powersuits/Archwing/StandardJetPack/StandardJetPack",
  "productCategory": "SpaceSuits"
};

export const archwingsByName = {
  "/Lotus/Powersuits/Archwing/SupportJetPack/SupportJetPack": lotus_Powersuits_Archwing_SupportJetPack_SupportJetPack,
  "/Lotus/Powersuits/Archwing/DemolitionJetPack/DemolitionJetPack": lotus_Powersuits_Archwing_DemolitionJetPack_DemolitionJetPack,
  "/Lotus/Powersuits/Archwing/StealthJetPack/StealthJetPack": lotus_Powersuits_Archwing_StealthJetPack_StealthJetPack,
  "/Lotus/Powersuits/Archwing/StandardJetPack/StandardJetPack": lotus_Powersuits_Archwing_StandardJetPack_StandardJetPack,
  "/Lotus/Powersuits/Archwing/PrimeJetPack/PrimeJetPack": lotus_Powersuits_Archwing_PrimeJetPack_PrimeJetPack,
} as const;

export type ArchwingName = keyof typeof archwingsByName;

export const archwingPrimes = new Map<WarframeData, WarframeData>();
archwingPrimes.set(lotus_Powersuits_Archwing_StandardJetPack_StandardJetPack, lotus_Powersuits_Archwing_PrimeJetPack_PrimeJetPack);

export const archwingsList: WarframeData[] = [
  lotus_Powersuits_Archwing_SupportJetPack_SupportJetPack,
  lotus_Powersuits_Archwing_DemolitionJetPack_DemolitionJetPack,
  lotus_Powersuits_Archwing_StealthJetPack_StealthJetPack,
  lotus_Powersuits_Archwing_StandardJetPack_StandardJetPack,
  lotus_Powersuits_Archwing_PrimeJetPack_PrimeJetPack,
];

export const ARCHWINGS: DataSet<ArchwingName, WarframeData> = {
  itemNames: Object.keys(archwingsByName) as ArchwingName[],
  itemsByName: archwingsByName,
  items: archwingsList,
  primes: archwingPrimes,
};