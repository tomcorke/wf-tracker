import { WeaponData, DataSet } from '../data-types';



export const crewShipWeaponsByName = {

} as const;

export type CrewShipWeaponName = keyof typeof crewShipWeaponsByName;

export const CREWSHIPWEAPONS: DataSet<CrewShipWeaponName, WeaponData> = {
  itemNames: Object.keys(crewShipWeaponsByName) as CrewShipWeaponName[],
  itemsByName: crewShipWeaponsByName,
  primes: undefined,
};