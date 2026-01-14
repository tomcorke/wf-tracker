import { JSX, PropsWithChildren } from "react";
import STYLES from "./section.module.css";
import classNames from "classnames";

type RowProps = PropsWithChildren<{}>;

const Row = ({ children }: RowProps) => {
  return <div className={STYLES.row}>{children}</div>;
};

type SectionProps = {
  title: JSX.Element | string;
  children?: Array<JSX.Element | string | null>;
  removePadding?: boolean;
};

export const Section = ({
  title,
  children = [],
  removePadding,
}: SectionProps) => {
  return (
    <div
      className={classNames(STYLES.Section, {
        [STYLES.removeItemPadding]: removePadding,
      })}
    >
      <div className={STYLES.title}>{title}</div>
      {children.map((row, index) => {
        return <Row key={index}>{row}</Row>;
      })}
    </div>
  );
};
