import STYLES from "./multiStateCheckbox.module.css";

type MultiStateCheckboxProps<T extends string> = {
  states: (T | undefined)[];
  value: T | undefined;
  onChange: (newValue: T | undefined) => void;
};

export function MultiStateCheckbox<T extends string>({
  states,
  value,
  onChange,
}: MultiStateCheckboxProps<T>) {
  const cycleState = () => {
    const currentIndex = states.indexOf(value);
    const nextIndex = (currentIndex + 1) % states.length;
    onChange(states[nextIndex]);
  };

  return (
    <div
      className={STYLES.MultiStateCheckbox}
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
