import itemSources from "./item-drop-sources.json";

type ItemSource = { source: string[]; type: string };

export const getItemSources = (uniqueName: string): ItemSource[] => {
  return itemSources[uniqueName as keyof typeof itemSources] || [];
};
