import { create } from "zustand";
import z from "zod";

const ItemListDataSchema = z.object({
  id: z.string(),
  slug: z.string(),
  gameRef: z.string(),
});

const WarframeMarketV2ItemsSchema = z.object({
  data: ItemListDataSchema.array(),
});

const ItemDataSchema = z.object({
  id: z.string(),
  slug: z.string(),
  gameRef: z.string(),
  tags: z.array(z.string()),
  setRoot: z.boolean().optional(),
  setParts: z.array(z.string()).optional(),
  quantityInSet: z.number().optional(),
  tradeable: z.boolean().optional(),
});

const WarframeMarketV2ItemSetDataSchema = z.object({
  data: z.object({
    id: z.string(),
    items: z.array(ItemDataSchema),
  }),
});

const OrderDataSchema = z.object({
  id: z.string(),
  type: z.string(),
  platinum: z.number(),
  quantity: z.number(),
  perTrade: z.number(),
  visible: z.boolean(),
});

const WarframeMarketOrdersDataSchema = z.object({
  data: z.object({
    sell: z.array(OrderDataSchema),
  }),
});

let warframeMarketItemList: Promise<
  z.infer<typeof WarframeMarketV2ItemsSchema>
> | null = null;

const warframeMarketItemSetDataCache = new Map<
  string,
  z.infer<typeof ItemDataSchema>[]
>();

type ItemPriceCacheData = {
  price: number;
  timestamp: number;
};

const warframeMarketItemPriceCache = new Map<string, ItemPriceCacheData>();
const BASE_URL = "https://corsproxy.io/?url=https://api.warframe.market/v2";

const USE_STATIC_WARFRAME_MARKET_ITEMS = true;

const getWarframeMarketItemsList = async () => {
  if (warframeMarketItemList === null) {
    if (USE_STATIC_WARFRAME_MARKET_ITEMS) {
      const warframeMarketItemListImportData = await import(
        "./warframe-market-items.json"
      );
      warframeMarketItemList = new Promise((resolve, reject) => {
        try {
          const parsedData = WarframeMarketV2ItemsSchema.parse(
            warframeMarketItemListImportData.default
          );
          resolve(parsedData);
        } catch (error) {
          reject(error);
        }
      });
    } else {
      warframeMarketItemList = new Promise(async (resolve, reject) => {
        try {
          const response = await fetch(`${BASE_URL}/items`);
          const data = await response.json();
          const parsedData = WarframeMarketV2ItemsSchema.parse(data);
          resolve(parsedData);
        } catch (error) {
          reject(error);
        }
      });
    }
  }

  return warframeMarketItemList;
};

const getItemSetData = async (uniqueName: string) => {
  const itemList = await getWarframeMarketItemsList();

  const foundItem = itemList.data.find((item) => item.gameRef === uniqueName);

  if (!foundItem) {
    console.log(
      `Warframe Market: Item with uniqueName "${uniqueName}" not found.`
    );
    return null;
  }

  if (!warframeMarketItemSetDataCache.has(foundItem.id)) {
    const itemResponse = await fetch(`${BASE_URL}/item/${foundItem.slug}/set`);
    const itemData = await itemResponse.json();
    try {
      const parsedItemSetData =
        WarframeMarketV2ItemSetDataSchema.parse(itemData);
      warframeMarketItemSetDataCache.set(
        foundItem.id,
        parsedItemSetData.data.items
      );
    } catch (e) {
      console.error("Error parsing item set data:", e, itemData);
      throw e;
    }
  }

  return warframeMarketItemSetDataCache.get(foundItem.id);
};

const getItemPrice = async (itemSlug: string): Promise<number | null> => {
  const STALE_AGE = 1000 * 60 * 10; // 10 minutes

  const cachedPriceData = warframeMarketItemPriceCache.get(itemSlug);
  const now = Date.now();

  if (cachedPriceData && now - cachedPriceData.timestamp < STALE_AGE) {
    return cachedPriceData.price;
  }

  const ordersResponse = await fetch(`${BASE_URL}/orders/item/${itemSlug}/top`);

  const ordersData = await ordersResponse.json();
  const parsedOrdersData = WarframeMarketOrdersDataSchema.parse(ordersData);
  const sellOrders = parsedOrdersData.data.sell.filter(
    (order) => order.visible && order.quantity > 0
  );

  if (sellOrders.length === 0) {
    warframeMarketItemPriceCache.set(itemSlug, {
      price: -1,
      timestamp: now,
    });
    console.log(
      `Warframe Market: No sell orders found for item "${itemSlug}".`
    );
    return null;
  }

  const lowestPriceOrder = Math.min(
    ...sellOrders.map((order) => order.platinum)
  );
  const highestPriceOrder = Math.max(
    ...sellOrders.map((order) => order.platinum)
  );

  const getMedianPriceFromLowest5 = () => {
    const sortedPrices = sellOrders
      .map((order) => order.platinum)
      .sort((a, b) => a - b)
      .slice(0, 5);
    const mid = Math.floor(sortedPrices.length / 2);
    if (sortedPrices.length % 2 === 0) {
      return (sortedPrices[mid - 1] + sortedPrices[mid]) / 2;
    } else {
      return sortedPrices[mid];
    }
  };

  const medianPrice = getMedianPriceFromLowest5();

  warframeMarketItemPriceCache.set(itemSlug, {
    price: medianPrice,
    timestamp: now,
  });

  console.log(
    `Warframe Market: Median price for item "${itemSlug}" is ${medianPrice}p. Price range of ${lowestPriceOrder}p - ${highestPriceOrder}p from ${sellOrders.length} orders.`
  );
  return medianPrice;
};

type WarframeMarketItemPriceData = { slug: string; url: string; price: number };
type FailureCode = "item-not-found" | "no-sell-orders";
export type WarframeMarketDataStore = {
  getItemSetPrice: (
    uniqueName: string
  ) => Promise<WarframeMarketItemPriceData | null | FailureCode>;
  getItemPrice: (
    uniqueName: string
  ) => Promise<WarframeMarketItemPriceData | null | FailureCode>;
};

export const useWarframeMarket = create<WarframeMarketDataStore>()(() => ({
  getItemSetPrice: async (
    uniqueName: string
  ): Promise<WarframeMarketItemPriceData | null | FailureCode> => {
    const setData = await getItemSetData(uniqueName);

    if (!setData) {
      return "item-not-found";
    }

    const setItem = setData.find((item) => item.setRoot);

    if (!setItem) {
      return "item-not-found";
    }

    const price = await getItemPrice(setItem.slug);

    if (price === null) {
      return "no-sell-orders";
    }

    return {
      slug: setItem.slug,
      url: `https://warframe.market/items/${setItem.slug}`,
      price,
    };
  },
  getItemPrice: async (
    uniqueName: string
  ): Promise<WarframeMarketItemPriceData | null | FailureCode> => {
    const setData = await getItemSetData(uniqueName);

    if (!setData) {
      return "item-not-found";
    }

    const itemData = setData.find((item) => item.gameRef === uniqueName);

    if (!itemData) {
      return "item-not-found";
    }

    const price = await getItemPrice(itemData.slug);

    if (price === null) {
      return "no-sell-orders";
    }

    return {
      slug: itemData.slug,
      url: `https://warframe.market/items/${itemData.slug}`,
      price,
    };
  },
}));

// export const useItemData = (itemName: string) => {
//   const itemState = useDataStore(
//     useShallow((store) => store.itemStates[itemName] || {})
//   );

//   // Find some details to show for this item
//   const itemDetails = {}; // Replace with actual logic to find item details

//   return { itemState, itemDetails };
// };
