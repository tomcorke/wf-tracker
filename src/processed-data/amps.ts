import { WeaponData, DataSet } from '../data-types';

export const lotus_Weapons_Corpus_OperatorAmplifiers_Set1_Barrel_CorpAmpSet1BarrelPartA: WeaponData = {
  "name": "Cantic Prism",
  "uniqueName": "/Lotus/Weapons/Corpus/OperatorAmplifiers/Set1/Barrel/CorpAmpSet1BarrelPartA",
  "productCategory": "Pistols"
};

export const lotus_Weapons_Sentients_OperatorAmplifiers_Set1_Barrel_SentAmpSet1BarrelPartC: WeaponData = {
  "name": "Granmu Prism",
  "uniqueName": "/Lotus/Weapons/Sentients/OperatorAmplifiers/Set1/Barrel/SentAmpSet1BarrelPartC",
  "productCategory": "Pistols"
};

export const lotus_Weapons_Corpus_OperatorAmplifiers_Set1_Barrel_CorpAmpSet1BarrelPartC: WeaponData = {
  "name": "Klamora Prism",
  "uniqueName": "/Lotus/Weapons/Corpus/OperatorAmplifiers/Set1/Barrel/CorpAmpSet1BarrelPartC",
  "productCategory": "Pistols"
};

export const lotus_Weapons_Corpus_OperatorAmplifiers_Set1_Barrel_CorpAmpSet1BarrelPartB: WeaponData = {
  "name": "Lega Prism",
  "uniqueName": "/Lotus/Weapons/Corpus/OperatorAmplifiers/Set1/Barrel/CorpAmpSet1BarrelPartB",
  "productCategory": "Pistols"
};

export const lotus_Weapons_Sentients_OperatorAmplifiers_SentTrainingAmplifier_SentAmpTrainingBarrel: WeaponData = {
  "name": "Mote Prism",
  "uniqueName": "/Lotus/Weapons/Sentients/OperatorAmplifiers/SentTrainingAmplifier/SentAmpTrainingBarrel",
  "productCategory": "Pistols"
};

export const lotus_Weapons_Sentients_OperatorAmplifiers_Set2_Barrel_SentAmpSet2BarrelPartA: WeaponData = {
  "name": "Rahn Prism",
  "uniqueName": "/Lotus/Weapons/Sentients/OperatorAmplifiers/Set2/Barrel/SentAmpSet2BarrelPartA",
  "productCategory": "Pistols"
};

export const lotus_Weapons_Sentients_OperatorAmplifiers_Set1_Barrel_SentAmpSet1BarrelPartA: WeaponData = {
  "name": "Raplak Prism",
  "uniqueName": "/Lotus/Weapons/Sentients/OperatorAmplifiers/Set1/Barrel/SentAmpSet1BarrelPartA",
  "productCategory": "Pistols"
};

export const lotus_Weapons_Sentients_OperatorAmplifiers_Set1_Barrel_SentAmpSet1BarrelPartB: WeaponData = {
  "name": "Shwaak Prism",
  "uniqueName": "/Lotus/Weapons/Sentients/OperatorAmplifiers/Set1/Barrel/SentAmpSet1BarrelPartB",
  "productCategory": "Pistols"
};

export const ampsByName = {
  "/Lotus/Weapons/Corpus/OperatorAmplifiers/Set1/Barrel/CorpAmpSet1BarrelPartA": lotus_Weapons_Corpus_OperatorAmplifiers_Set1_Barrel_CorpAmpSet1BarrelPartA,
  "/Lotus/Weapons/Sentients/OperatorAmplifiers/Set1/Barrel/SentAmpSet1BarrelPartC": lotus_Weapons_Sentients_OperatorAmplifiers_Set1_Barrel_SentAmpSet1BarrelPartC,
  "/Lotus/Weapons/Corpus/OperatorAmplifiers/Set1/Barrel/CorpAmpSet1BarrelPartC": lotus_Weapons_Corpus_OperatorAmplifiers_Set1_Barrel_CorpAmpSet1BarrelPartC,
  "/Lotus/Weapons/Corpus/OperatorAmplifiers/Set1/Barrel/CorpAmpSet1BarrelPartB": lotus_Weapons_Corpus_OperatorAmplifiers_Set1_Barrel_CorpAmpSet1BarrelPartB,
  "/Lotus/Weapons/Sentients/OperatorAmplifiers/SentTrainingAmplifier/SentAmpTrainingBarrel": lotus_Weapons_Sentients_OperatorAmplifiers_SentTrainingAmplifier_SentAmpTrainingBarrel,
  "/Lotus/Weapons/Sentients/OperatorAmplifiers/Set2/Barrel/SentAmpSet2BarrelPartA": lotus_Weapons_Sentients_OperatorAmplifiers_Set2_Barrel_SentAmpSet2BarrelPartA,
  "/Lotus/Weapons/Sentients/OperatorAmplifiers/Set1/Barrel/SentAmpSet1BarrelPartA": lotus_Weapons_Sentients_OperatorAmplifiers_Set1_Barrel_SentAmpSet1BarrelPartA,
  "/Lotus/Weapons/Sentients/OperatorAmplifiers/Set1/Barrel/SentAmpSet1BarrelPartB": lotus_Weapons_Sentients_OperatorAmplifiers_Set1_Barrel_SentAmpSet1BarrelPartB,
} as const;

export type AmpName = keyof typeof ampsByName;

export const ampsList: WeaponData[] = [
  lotus_Weapons_Corpus_OperatorAmplifiers_Set1_Barrel_CorpAmpSet1BarrelPartA,
  lotus_Weapons_Sentients_OperatorAmplifiers_Set1_Barrel_SentAmpSet1BarrelPartC,
  lotus_Weapons_Corpus_OperatorAmplifiers_Set1_Barrel_CorpAmpSet1BarrelPartC,
  lotus_Weapons_Corpus_OperatorAmplifiers_Set1_Barrel_CorpAmpSet1BarrelPartB,
  lotus_Weapons_Sentients_OperatorAmplifiers_SentTrainingAmplifier_SentAmpTrainingBarrel,
  lotus_Weapons_Sentients_OperatorAmplifiers_Set2_Barrel_SentAmpSet2BarrelPartA,
  lotus_Weapons_Sentients_OperatorAmplifiers_Set1_Barrel_SentAmpSet1BarrelPartA,
  lotus_Weapons_Sentients_OperatorAmplifiers_Set1_Barrel_SentAmpSet1BarrelPartB,
];

export const AMPS: DataSet<AmpName, WeaponData> = {
  itemNames: Object.keys(ampsByName) as AmpName[],
  itemsByName: ampsByName,
  items: ampsList,
  primes: undefined,
};