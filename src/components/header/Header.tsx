import classNames from "classnames";
import React from "react";
import styles from "./header.module.scss";

export interface HeaderProps {
  title: string;
  children: React.ReactElement;
  className?: string;
}

export const Header = ({ title, children, className }: HeaderProps) => {
  return (
    <div className={classNames([styles.header, className])}>
      <h1 className={styles.header__title}>{title}</h1>
      {children}
    </div>
  );
};
