import itemDropSources from "./item-drop-sources.json";
import { wikiVendorData } from "./wiki-vendor-data";

type ItemSource = { source: string[]; type: string };

const MANUAL_ITEM_SOURCES: { [displayName: string]: ItemSource[] } = {};

// Items only available directly from the market for credits
const MARKET_AVAILABLE_DIRECT_CREDIT_ITEMS: string[] = [
  "Braton",
  "MK1-Braton",
  "MK1-Paris",
  "MK1-Strun",
  "Strun",
  "Aklato",
  "Lato",
  "Lex",
  "MK1-Furis",
  "MK1-Kunai",
  "MK1-Bo",
  "MK1-Furax",
];
// Warframes and weapons available in the market
const MARKET_AVAILABLE_ITEM_BLUEPRINTS: string[] = [
  // Warframes
  "Ash",
  "Caliban",
  "Ember",
  "Equinox",
  "Excalibur",
  "Frost",
  "Gauss",
  "Grendel",
  "Hydroid",
  "Limbo",
  "Loki",
  "Mag",
  "Mesa",
  "Mirage",
  "Nekros",
  "Nova",
  "Nyx",
  "Oberon",
  "Rhino",
  "Saryn",
  "Trinity",
  "Valkyr",
  "Vauban",
  // Weapons
  "Afuris",
  "Akbolto",
  "Akbronco",
  "Akjagara",
  "Aklex",
  "Akmagnus",
  "Aksomati",
  "Akvasto",
  "Akzani",
  "Amphis",
  "Angstrum",
  "Ankyros",
  "Arca Titron",
  "Astilla",
  "Atomos",
  "Atterax",
  "Ballistica",
  "Bo",
  "Boltace",
  "Bolto",
  "Boltor",
  "Bronco",
  "Burston",
  "Cadus",
  "Cernos",
  "Cestra",
  "Cobra & Crane",
  "Corinth",
  "Corvas",
  "Cyngas",
  "Destreza",
  "Dragon Nikana",
  "Drakgoon",
  "Dual Cleavers",
  "Dual Decurion",
  "Duel Ether",
  "Dual Heat Swords",
  "Dual Kamas",
  "Dual Keres",
  "Dual Skana",
  "Dual Zoren",
  "Ether Reaper",
  "Ether Sword",
  "Exergis",
  "Fang",
  "Fragor",
  "Fulmin",
  "Furax",
  "Furis",
  "Fusilai",
  "Galatine",
  "Galvacord",
  "Gammacor",
  "Grakata",
  "Gram",
  "Halikar",
  "Harpak",
  "Hek",
  "Hikou",
  "Hind",
  "Hirudo",
  "Hystrix",
  "Kama",
  "Karak",
  "Karyst",
  "Kestrel",
  "Knell",
  "Kogake",
  "Kohm",
  "Kraken",
  "Korhkur",
  "Kronen",
  "Kulstar",
  "Kunai",
  "Latron",
  "Lecta",
  "Lesion",
  "Magistar",
  "Magnus",
  "Mire",
  "Mutalist Cernos",
  "Nagantaka",
  "Nami Solo",
  "Ninkondi",
  "Obex",
  "Ohma",
  "Orthos",
  "Pandero",
  "Panthera",
  "Paris",
  "Penta",
  "Phaedra",
  "Phantasma",
  "Plinx",
  "Proboscis Cernos",
  "Pulmonars",
  "Quatz",
  "Redeemer",
  "Ripkas",
  "Rubico",
  "Sarpa",
  "Scindo",
  "Sibear",
  "Skana",
  "Sobek",
  "Soma",
  "Sonicor",
  "Spira",
  "Stradavar",
  "Stug",
  "Tatsu",
  "Tekko",
  "Tetra",
  "Tiberon",
  "Tigris",
  "Tipedo",
  "Tonkor",
  "Twin Basolk",
  "Twin Grakatas",
  "Twin Rogga",
  "Twin Vipers",
  "Tysis",
  "Vasto",
  "Vectis",
  "Velox",
  "Viper",
  "Volnus",
  "Vulkar",
  "Zarr",
  "Zhuge",
  "Agkuza",
  "Centaur",
  "Kaszas",
  "Onorix",
  "Rathbone",
  // Companions
  "Carrier",
  "Dethcube",
  "Diriga",
  "Shade",
  "Taxon",
  "Wyrm",
];

const warframeAndParts = (name: string) => [
  name,
  `${name} Systems`,
  `${name} Neuroptics`,
  `${name} Chassis`,
];
const archwing = (name: string) => [
  name,
  `${name} Wings`,
  `${name} Systems`,
  `${name} Harness`,
];
const CLAN_DOJO_AVAILABLE_ITEM_BLUEPRINTS: {
  [researchType: string]: string[];
} = {
  "Bio Lab": [
    "Torid",
    "Scoliac",
    "Mios",
    "Cerata",
    "Hema",
    "Dual Ichor",
    "Djinn",
    "Acrid",
    "Embolist",
    "Synapse",
    "Pupacyst",
    "Mutalist Quanta",
    "Paracyst",
    "Bubonico",
    "Caustacyst",
    "Catabolyst",
    "Dual Toxocyst",
    "Pox",
  ],
  "Chem Lab": [
    "Sydon",
    "Win Krohkur",
    "Kesheg",
    "Nukor",
    "Marelok",
    "Kohmak",
    "Jat Kittag",
    "Jat Kusar",
    "Ignis",
    "Ogris",
    "Knux",
    "Grattler",
    "Ack & Brunt",
    "Javlok",
    "Ignis Wraith",
    "Grinlok",
    "Argonak",
    "Buzlok",
  ],
  "Energy Lab": [
    "Seeo",
    "Prova",
    "Supra",
    "Quanta",
    "Falcor",
    "Dera",
    "Spectra",
    "Cycron",
    "Cyanex",
    "Komorex",
    "Arca Scisco",
    "Lanka",
    "Opticor",
    "Helios",
    "Convectrix",
    "Arca Plasmor",
    "Flux Rifle",
    "Amprex",
    "Staticor",
    "Lenz",
    "Glaxion",
    "Ferrox",
    "Dual Cestra",
    "Kreska",
    "Ocucor",
    "Battacor",
  ],
  "Tenno Lab": [
    "Akstiletto",
    "Zakti",
    "Sybaris",
    "Venka",
    "Gunsen",
    "Veldt",
    "Tenora",
    "Pyrana",
    "Nikana",
    "Daikyu",
    "Baza",
    "Attica",
    "Anku",
    "Cassowar",
    ...warframeAndParts("Banshee"),
    "Castanas",
    "Talons",
    "Dual Raza",
    "Fluctus",
    "Gazal Machete",
    "Nami Skyla",
    "Tonbo",
    "Venato",
    "Scourge",
    "Shaku",
    "Okina",
    "Masseter",
    "Lacera",
    "Guandao",
    "Endura",
    "Dark Split-Sword",
    ...warframeAndParts("Nezha"),
    "Silva & Aegis",
    "Velocitus",
    ...warframeAndParts("Volt"),
    ...warframeAndParts("Wukong"),
    ...warframeAndParts("Zephyr"),
    ...archwing("Amesha"),
    ...archwing("Elytron"),
    ...archwing("Itzal"),
  ],
  "Orokin Lab": [],
  "Ventkids' Bash Lab": [
    "Ghoulsaw",
    "Ghoulsaw Blade",
    "Ghoulsaw Chassis",
    "Ghoulsaw Engine",
    "Ghoulsaw Grip",
    "Yareli Chassis",
    "Yareli Neuroptics",
    "Yareli Systems",
  ],
  "Dry Dock": [],
  "Dagath's Hollow": [
    ...warframeAndParts("Dagath"),
    "Dorrclave",
    "Doorclave Blade",
    "Doorclave Hilt",
    "Doorclave Hook",
    "Doorclave String",
  ],
};

for (const item of MARKET_AVAILABLE_DIRECT_CREDIT_ITEMS) {
  MANUAL_ITEM_SOURCES[item.toLowerCase()] = [
    { source: ["Market (Direct purchase for credits)"], type: "Market" },
  ];
}
for (const item of MARKET_AVAILABLE_ITEM_BLUEPRINTS) {
  MANUAL_ITEM_SOURCES[`${item} Blueprint`.toLowerCase()] = [
    { source: ["Market"], type: "Market" },
  ];
}
for (const [researchType, items] of Object.entries(
  CLAN_DOJO_AVAILABLE_ITEM_BLUEPRINTS
)) {
  for (const item of items) {
    MANUAL_ITEM_SOURCES[`${item} Blueprint`.toLowerCase()] = [
      { source: [`Clan Dojo (${researchType})`], type: "Clan Dojo" },
    ];
  }
}

export const getItemSources = (
  uniqueName: string,
  displayName?: string
): ItemSource[] => {
  const dropSources =
    itemDropSources[uniqueName as keyof typeof itemDropSources] || [];
  const vendorSources: ItemSource[] = [];

  if (displayName) {
    for (const [vendorName, vendorInfo] of Object.entries(
      wikiVendorData.Vendors
    )) {
      const offerings = vendorInfo.Offerings || [];
      for (const offering of offerings) {
        if (
          typeof offering.Name === "string" &&
          offering.Name === displayName
        ) {
          const sourceStringParts = [vendorName];
          if (offering.Prereq !== undefined) {
            if (typeof offering.Prereq === "number") {
              const prereqRank = vendorInfo.Ranks?.[offering.Prereq];
              if (prereqRank) {
                sourceStringParts.push(
                  `Rank: ${offering.Prereq} - ${prereqRank}`
                );
              }
            }
          }
          vendorSources.push({
            source: [sourceStringParts.join(", ")],
            type: "Vendor",
          });
        }
      }
    }

    if (MANUAL_ITEM_SOURCES[displayName.toLowerCase()]) {
      vendorSources.push(...MANUAL_ITEM_SOURCES[displayName.toLowerCase()]);
    }
  }

  return [...dropSources, ...vendorSources];
};
