import { PropsWithChildren, useRef, useState } from "react";

import STYLES from "./Button.module.css";
import classNames from "classnames";

type ButtonProps = PropsWithChildren<{
  small?: boolean;
  bold?: boolean;
  onClick: () => void;
  requireConfirmation?: boolean;
  confirmationText?: string;
}>;

export const Button = ({
  children,
  small,
  bold,
  onClick,
  requireConfirmation,
  confirmationText,
}: ButtonProps) => {
  const [waitingForConfirmation, setWaitingForConfirmation] = useState(false);
  const confirmationTimeout = useRef<NodeJS.Timeout | null>(null);

  return (
    <button
      className={classNames(STYLES.Button, {
        [STYLES.small]: small,
        [STYLES.bold]: bold,
        [STYLES.waitingForConfirmation]: waitingForConfirmation,
      })}
      onClick={() => {
        if (!requireConfirmation) {
          onClick();
          return;
        }

        if (waitingForConfirmation) {
          onClick();
          setWaitingForConfirmation(false);
          if (confirmationTimeout.current) {
            clearTimeout(confirmationTimeout.current);
            confirmationTimeout.current = null;
          }
        } else {
          setWaitingForConfirmation(true);
          confirmationTimeout.current = setTimeout(() => {
            setWaitingForConfirmation(false);
          }, 3000);
        }
      }}
    >
      {waitingForConfirmation ? confirmationText || "Confirm" : children}
    </button>
  );
};
