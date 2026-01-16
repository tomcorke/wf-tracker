import STYLES from "./multiStateCheckbox.module.css";

type MultiStateCheckboxProps<T> = {
  states: T[];
  value: T;
  onChange: (newValue: T) => void;
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
      data-value={value}
    >
      <div className={STYLES.inner}></div>
    </div>
  );
}
