import React from "react";
import classNames from "classnames";
import styles from "./input.module.scss";

export interface InputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
}

export const Input = ({ value, onChange, placeholder }: InputProps) => {
  return <input className={styles.input} value={value} onChange={onChange} placeholder={placeholder} />;
};
