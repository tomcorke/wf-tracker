import classNames from "classnames";
import { MultiStateCheckbox } from "../multiStateCheckbox";
import { useDataStore } from "../storage/data-store";
import STYLE from "./trackedItem.module.css";
import { useShallow } from "zustand/shallow";

type PersistentTrackedItemProps<T extends string> = {
  label: string;
  itemKey: string;
  states: T[];
  initialValue: T | undefined;
  highlight?: (state: T | undefined) => boolean;
  highlightClassName?: string;
};

export const PersistentTrackedItem = <T extends string>({
  label,
  itemKey,
  states,
  initialValue,
  highlight,
  highlightClassName,
}: PersistentTrackedItemProps<T>) => {
  const scopedItemKey = `<CUSTOM>_${itemKey}`;
  const { itemState, setItemState } = useDataStore(
    useShallow((store) => ({
      itemState: store.itemStates[scopedItemKey],
      setItemState: store.setItemState,
    }))
  );

  const currentState: string | undefined = itemState || initialValue;
  if (currentState && !states.includes(currentState as any)) {
    setItemState(scopedItemKey, initialValue);
  }

  const handleStateChange = (newState: T | undefined) => {
    setItemState(scopedItemKey, newState);
  };

  const isHighlighted = highlight
    ? highlight(currentState as T | undefined)
    : false;

  return (
    <div
      className={classNames(
        STYLE.PersistentTrackedItem,
        {
          [STYLE.highlighted]: isHighlighted,
          [STYLE[highlightClassName || ""]]:
            isHighlighted && highlightClassName,
        },
        STYLE[String(currentState) as any]
      )}
    >
      <label>
        <span>{label}</span>
        <MultiStateCheckbox
          states={[undefined, ...states] as const}
          value={currentState as T | undefined}
          onChange={handleStateChange}
        />
      </label>
    </div>
  );
};
