import { WeaponData, DataSet } from '../data-types';

export const arbucep: WeaponData = {
  "name": "Arbucep",
  "uniqueName": "/Lotus/Weapons/Tenno/Archwing/Primary/NokkoArchGun/NokkoArchGun",
  "productCategory": "SpaceGuns",
  "slot": 1
};

export const cortege: WeaponData = {
  "name": "Cortege",
  "uniqueName": "/Lotus/Weapons/Tenno/Archwing/Primary/ThanoTechArchGun/ThanoTechArchGun",
  "productCategory": "SpaceGuns",
  "slot": 1
};

export const corvas: WeaponData = {
  "name": "Corvas",
  "uniqueName": "/Lotus/Weapons/Tenno/Archwing/Primary/LaunchGrenade/ArchCannon",
  "productCategory": "SpaceGuns",
  "slot": 1
};

export const corvasPrime: WeaponData = {
  "name": "Corvas Prime",
  "uniqueName": "/Lotus/Weapons/Tenno/Archwing/Primary/PrimeCorvas/PrimeCorvasWeapon",
  "productCategory": "SpaceGuns",
  "slot": 1
};

export const cyngas: WeaponData = {
  "name": "Cyngas",
  "uniqueName": "/Lotus/Weapons/Tenno/Archwing/Primary/ArchBurstGun/ArchBurstGun",
  "productCategory": "SpaceGuns",
  "slot": 1
};

export const dualDecurion: WeaponData = {
  "name": "Dual Decurion",
  "uniqueName": "/Lotus/Weapons/Tenno/Archwing/Primary/ArchwingHeavyPistols/ArchHeavyPistols",
  "productCategory": "SpaceGuns",
  "slot": 1
};

export const fluctus: WeaponData = {
  "name": "Fluctus",
  "uniqueName": "/Lotus/Weapons/Tenno/Archwing/Primary/RocketArtillery/ArchRocketCrossbow",
  "productCategory": "SpaceGuns",
  "slot": 1
};

export const grattler: WeaponData = {
  "name": "Grattler",
  "uniqueName": "/Lotus/Weapons/Tenno/Archwing/Primary/RepurposedGrineerAntiAircraftGun/ArchGRNAAGun",
  "productCategory": "SpaceGuns",
  "slot": 1
};

export const imperator: WeaponData = {
  "name": "Imperator",
  "uniqueName": "/Lotus/Weapons/Tenno/Archwing/Primary/FoldingMachineGun/ArchMachineGun",
  "productCategory": "SpaceGuns",
  "slot": 1
};

export const imperatorVandal: WeaponData = {
  "name": "Imperator Vandal",
  "uniqueName": "/Lotus/Weapons/Tenno/Archwing/Primary/FoldingMachineGun/ArchMachineGunVandal",
  "productCategory": "SpaceGuns",
  "slot": 1
};

export const kuvaAyanga: WeaponData = {
  "name": "Kuva Ayanga",
  "uniqueName": "/Lotus/Weapons/Grineer/HeavyWeapons/GrnHeavyGrenadeLauncher",
  "productCategory": "SpaceGuns",
  "slot": 1
};

export const kuvaGrattler: WeaponData = {
  "name": "Kuva Grattler",
  "uniqueName": "/Lotus/Weapons/Grineer/KuvaLich/HeavyWeapons/Grattler/KuvaGrattler",
  "productCategory": "SpaceGuns",
  "slot": 1
};

export const larkspur: WeaponData = {
  "name": "Larkspur",
  "uniqueName": "/Lotus/Weapons/Tenno/Archwing/Primary/TnShieldframeArchGun/TnShieldFrameArchGun",
  "productCategory": "SpaceGuns",
  "slot": 1
};

export const larkspurPrime: WeaponData = {
  "name": "Larkspur Prime",
  "uniqueName": "/Lotus/Weapons/Tenno/Archwing/Primary/PrimeLarkspur/PrimeLarkspurWeapon",
  "productCategory": "SpaceGuns",
  "slot": 1
};

export const mandonel: WeaponData = {
  "name": "Mandonel",
  "uniqueName": "/Lotus/Weapons/Tenno/Archwing/Primary/TnConcreteArchgun/TnConcreteArchgunWeapon",
  "productCategory": "SpaceGuns",
  "slot": 1
};

export const mausolon: WeaponData = {
  "name": "Mausolon",
  "uniqueName": "/Lotus/Weapons/Tenno/Archwing/Primary/ThanoTechArchLongGun/ThanoTechLongGun",
  "productCategory": "SpaceGuns",
  "slot": 1
};

export const morgha: WeaponData = {
  "name": "Morgha",
  "uniqueName": "/Lotus/Weapons/Tenno/Archwing/Primary/ThanoTechGrenadeLaunch/ThanoTechGrenadeLauncher",
  "productCategory": "SpaceGuns",
  "slot": 1
};

export const phaedra: WeaponData = {
  "name": "Phaedra",
  "uniqueName": "/Lotus/Weapons/Tenno/Archwing/Primary/ArchLongRifle/ArchLongRifle",
  "productCategory": "SpaceGuns",
  "slot": 1
};

export const prismaDualDecurions: WeaponData = {
  "name": "Prisma Dual Decurions",
  "uniqueName": "/Lotus/Weapons/Tenno/Archwing/Primary/ArchwingHeavyPistols/Prisma/PrismaArchHeavyPistols",
  "productCategory": "SpaceGuns",
  "slot": 1
};

export const velocitus: WeaponData = {
  "name": "Velocitus",
  "uniqueName": "/Lotus/Weapons/Tenno/Archwing/Primary/Railgun/ArchRailgun",
  "productCategory": "SpaceGuns",
  "slot": 1
};

export const archwingGunsByName = {
  "Arbucep": arbucep,
  "Cortege": cortege,
  "Corvas": corvas,
  "Corvas Prime": corvasPrime,
  "Cyngas": cyngas,
  "Dual Decurion": dualDecurion,
  "Fluctus": fluctus,
  "Grattler": grattler,
  "Imperator": imperator,
  "Imperator Vandal": imperatorVandal,
  "Kuva Ayanga": kuvaAyanga,
  "Kuva Grattler": kuvaGrattler,
  "Larkspur": larkspur,
  "Larkspur Prime": larkspurPrime,
  "Mandonel": mandonel,
  "Mausolon": mausolon,
  "Morgha": morgha,
  "Phaedra": phaedra,
  "Prisma Dual Decurions": prismaDualDecurions,
  "Velocitus": velocitus,
} as const;

export type ArchwingGunName = keyof typeof archwingGunsByName;

export const archwingGunPrimes = new Map<WeaponData, WeaponData>();
archwingGunPrimes.set(corvas, corvasPrime);
archwingGunPrimes.set(larkspur, larkspurPrime);

export const ARCHWINGGUNS: DataSet<ArchwingGunName, WeaponData> = {
  itemNames: Object.keys(archwingGunsByName) as ArchwingGunName[],
  itemsByName: archwingGunsByName,
  primes: archwingGunPrimes,
};