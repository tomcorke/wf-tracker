import { PropsWithChildren } from "react";

import STYLES from "./Button.module.css";

export const Button = ({ children }: PropsWithChildren<{}>) => {
  return <button className={STYLES.Button}>{children}</button>;
};
