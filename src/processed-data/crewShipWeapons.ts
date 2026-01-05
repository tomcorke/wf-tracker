import { WeaponData, DataSet } from '../data-types';



export const crewShipWeaponsByName = {

} as const;

export type CrewShipWeaponName = keyof typeof crewShipWeaponsByName;

export const crewShipWeaponsList: WeaponData[] = [

];

export const CREWSHIPWEAPONS: DataSet<CrewShipWeaponName, WeaponData> = {
  itemNames: Object.keys(crewShipWeaponsByName) as CrewShipWeaponName[],
  itemsByName: crewShipWeaponsByName,
  items: crewShipWeaponsList,
  primes: undefined,
};