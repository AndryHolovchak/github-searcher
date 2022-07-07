import React from "react";
import styles from "./desktopInfoScreen.module.scss";

export const DesktopInfoScreen = () => {
  return (
    <div className={styles.desktop_info_screen}>
      <h1 className={styles.desktop_info_screen__title}>Please, use mobile version</h1>
    </div>
  );
};
