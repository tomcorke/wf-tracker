import classNames from "classnames";
import STYLES from "./multiStateCheckbox.module.css";
import { useDataStore } from "../storage/data-store";
import { useShallow } from "zustand/shallow";

type MultiStateCheckboxProps<T extends string> = {
  states: (T | undefined)[];
  value: T | undefined;
  onChange: (newValue: T | undefined) => void;
  large?: boolean;
};

export function MultiStateCheckbox<T extends string>({
  states,
  value,
  onChange,
  large = false,
}: MultiStateCheckboxProps<T>) {
  const cycleState = () => {
    const currentIndex = states.indexOf(value);
    const nextIndex = (currentIndex + 1) % states.length;
    onChange(states[nextIndex]);
  };

  return (
    <div
      className={classNames(STYLES.MultiStateCheckbox, {
        [STYLES.large]: large,
      })}
      onClick={(e) => {
        cycleState();
        e.stopPropagation();
      }}
      data-value={String(value)}
    >
      <div className={STYLES.inner}></div>
    </div>
  );
}

export function PersistentMultiStateCheckbox<T extends string>({
  states,
  initialValue,
  large = false,
  storageKey,
}: Pick<MultiStateCheckboxProps<T>, "states" | "large"> & {
  initialValue: T | undefined;
  storageKey: string;
}) {
  const setItemState = useDataStore((store) => store.setItemState);
  const itemState = useDataStore(
    useShallow((store) => store.itemStates[storageKey] || initialValue),
  );

  return (
    <MultiStateCheckbox
      states={states}
      value={itemState as T}
      onChange={(newValue) => setItemState(storageKey, newValue)}
      large={large}
    />
  );
}

export function PersistentSimpleCheckbox({
  initialValue = undefined,
  storageKey,
}: Pick<MultiStateCheckboxProps<"checked">, "large"> & {
  initialValue?: "checked";
  storageKey: string;
}) {
  return (
    <PersistentMultiStateCheckbox<"checked">
      states={[undefined, "checked"]}
      initialValue={initialValue}
      storageKey={storageKey}
    />
  );
}
