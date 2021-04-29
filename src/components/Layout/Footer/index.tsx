import React from "react";
import classNames from "classnames";

import Button from "../../Button";

import { useAppContext } from "../../AppContext";

import History from "../../../assets/icons/history.svg";

import styles from "./Footer.module.scss";

function Footer() {
  const { isAuthenticated, handleTransactionsBar } = useAppContext();

  return (
    <div
      className={classNames(styles.Footer, {
        [styles.isAuthenticated]: isAuthenticated,
      })}
    >
      <div className={styles.Versioning}>
        <div className={styles.Version}>Version 0.1.0-beta</div>
      </div>
      {isAuthenticated && (
        <Button
          type="button"
          onClick={() => handleTransactionsBar(true)}
          className={styles.HistoryButton}
          noStyle
        >
          <History className={styles.HistoryIcon} />
        </Button>
      )}
    </div>
  );
}

export default Footer;
