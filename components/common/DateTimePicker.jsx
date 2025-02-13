"use client";
import { ErrorMessage, useField } from "formik";
import styles from "@/styles/input.module.scss";
import { nunito } from "@/app/fonts/font";

const DateTimePicker = ({ label, name, value, onChange }) => {
  const [field, meta] = useField(name);

  const getCurrentDateTime = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  return (
    <div className={`${styles.main} ${nunito.className}`}>
      <label htmlFor={name}>{label}:</label>
      <input
        {...field}
        type="datetime-local"
        id={name}
        value={value}
        onChange={onChange}
        min={getCurrentDateTime()}
        className={meta.touched && meta.error ? styles.errorInput : ""}
      />
      <ErrorMessage name={name} component="span" className={styles.error} />
    </div>
  );
};

export default DateTimePicker;