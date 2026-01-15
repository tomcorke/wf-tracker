import { use } from "react";
import { useWarframeMarket } from "../storage/warframe-market";
import STYLES from "./inlinePrice.module.css";

export const InlinePrice = ({
  uniqueName,
  useSet = true,
}: {
  uniqueName: string;
  useSet?: boolean;
}) => {
  const { getItemSetPrice, getItemPrice } = useWarframeMarket();
  const getPriceFunction = useSet ? getItemSetPrice : getItemPrice;
  const priceResult = use(getPriceFunction(uniqueName));
  return (
    <span className={STYLES.InlinePrice}>
      {priceResult === "item-not-found" || !priceResult ? null : priceResult ===
        "no-sell-orders" ? (
        "No sell orders found"
      ) : (
        <a
          className={STYLES.priceValue}
          href={priceResult.url}
          target="_blank"
          rel="noopener noreferrer"
        >
          {priceResult.price}p
        </a>
      )}
    </span>
  );
};
