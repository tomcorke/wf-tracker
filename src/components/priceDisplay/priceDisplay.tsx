import { use } from "react";
import { useWarframeMarket } from "../storage/warframe-market";

import STYLES from "./priceDisplay.module.css";

export const PriceDisplay = ({ uniqueName }: { uniqueName: string }) => {
  const { getItemSetPrice } = useWarframeMarket();
  const priceResult = use(getItemSetPrice(uniqueName));
  return (
    <div className={STYLES.PriceDisplay}>
      {priceResult === "item-not-found" || !priceResult ? null : priceResult ===
        "no-sell-orders" ? (
        "No sell orders found"
      ) : (
        <>
          Lowest set price:{" "}
          <span className={STYLES.priceValue}>{priceResult.price}p</span>
          <div className={STYLES.warframeMarketLink}>
            <a href={priceResult.url} target="_blank" rel="noopener noreferrer">
              View on Warframe Market
            </a>
          </div>
        </>
      )}
    </div>
  );
};
