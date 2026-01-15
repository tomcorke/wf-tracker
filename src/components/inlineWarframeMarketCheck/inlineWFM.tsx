import STYLES from "./inlineWFM.module.css";

type InlineWFMProps = {
  uniqueName: string;
};

// const SimplePriceDisplay = ({ uniqueName }: { uniqueName: string }) => {
//   const { getItemSetPrice } = useWarframeMarket();
//   if (!priceFetchPromises[uniqueName]) {
//     priceFetchPromises[uniqueName] = getItemSetPrice(uniqueName);
//     setTimeout(() => delete priceFetchPromises[uniqueName], 5 * 60 * 1000); // cache for 5 minutes
//   }
//   const priceResult = use(priceFetchPromises[uniqueName]);
//   return (
//     <span className={STYLES.priceDisplay}>
//       {priceResult === "item-not-found" || !priceResult ? null : priceResult ===
//         "no-sell-orders" ? (
//         "No sell orders found"
//       ) : (
//         <span className={STYLES.priceValue}>{priceResult.price}p</span>
//       )}
//     </span>
//   );
// };

export const InlineWFM = ({ uniqueName }: InlineWFMProps) => {
  return <span className={STYLES.inlineWFM}>WFM</span>;
};
