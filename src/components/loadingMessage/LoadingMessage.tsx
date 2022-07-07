import React from "react";
import styles from "./loadingMessage.module.scss";

export const LoadingMessage = () => {
  return (
    <div className={styles.loading_message}>
      <span className={styles.loading_message__text}>Loading...</span>
    </div>
  );
};
