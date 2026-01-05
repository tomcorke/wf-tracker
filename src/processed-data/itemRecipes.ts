import recipeData from "./item-recipe-parts.json";

export const getItemRecipeParts = (
  uniqueName: string
): { uniqueName: string; name: string }[] => {
  return recipeData[uniqueName as keyof typeof recipeData] || [];
};
