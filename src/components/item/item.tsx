import { useShallow } from "zustand/shallow";
import { useDataStore } from "../storage/data-store";
import STYLES from "./item.module.css";
import classNames from "classnames";

type ItemProps = {
  name: string;
};

const formatName = (name: string) => {
  return name.replace("<ARCHWING>", "");
};

export const Item = ({ name }: ItemProps) => {
  const state = useDataStore(
    useShallow((store) => store.itemStates[name] || {})
  );

  const setItemState = useDataStore((store) => store.setItemState);

  return (
    <div
      className={classNames(STYLES.Item, { [STYLES.mastered]: state.mastered })}
      onClick={() => setItemState(name, { mastered: !state.mastered })}
    >
      <div className={STYLES.name}>{formatName(name)}</div>
      <div className={STYLES.controls}>
        <input
          type="checkbox"
          className={STYLES.checkbox}
          checked={!!state.mastered}
          readOnly
        />
      </div>
    </div>
  );
};

type ItemWithPrimeProps = {
  baseName: string;
  primeName: string;
};

export const ItemWithPrime = ({ baseName, primeName }: ItemWithPrimeProps) => {
  const baseItemState = useDataStore(
    useShallow((store) => store.itemStates[baseName] || {})
  );
  const primeItemState = useDataStore(
    useShallow((store) => store.itemStates[primeName] || {})
  );

  const setItemState = useDataStore((store) => store.setItemState);

  return (
    <div className={classNames(STYLES.Item, STYLES.split)}>
      <div
        className={classNames(STYLES.section, {
          [STYLES.mastered]: baseItemState.mastered,
        })}
        onClick={() =>
          setItemState(baseName, { mastered: !baseItemState.mastered })
        }
      >
        <div className={STYLES.name}>{formatName(baseName)}</div>
        <div className={STYLES.controls}>
          <input
            type="checkbox"
            className={STYLES.checkbox}
            checked={!!baseItemState.mastered}
            readOnly
          />
        </div>
      </div>
      <div
        className={classNames(STYLES.section, {
          [STYLES.mastered]: primeItemState.mastered,
        })}
        onClick={() =>
          setItemState(primeName, { mastered: !primeItemState.mastered })
        }
      >
        <div className={STYLES.name}>Prime</div>
        <div className={STYLES.controls}>
          <input
            type="checkbox"
            className={STYLES.checkbox}
            checked={!!primeItemState.mastered}
            readOnly
          />
        </div>
      </div>
    </div>
  );
};
