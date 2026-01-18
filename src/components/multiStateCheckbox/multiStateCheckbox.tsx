import classNames from "classnames";
import STYLES from "./multiStateCheckbox.module.css";

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
