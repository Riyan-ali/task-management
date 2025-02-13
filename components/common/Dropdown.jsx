"use client";
import { ErrorMessage, useField } from "formik";
import styles from "@/styles/input.module.scss";
import { nunito } from "@/app/fonts/font";

const Dropdown = ({ label, name, options, value, onChange }) => {
  const [field, meta] = useField(name);

  return (
    <div className={`${styles.main} ${nunito.className}`}>
      <label htmlFor={name}>{label}:</label>
      <select
        {...field}
        id={name}
        value={value}
        onChange={onChange}
        className={meta.touched && meta.error ? styles.errorInput : ""}
      >
        <option value="">Select {label}</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      <ErrorMessage name={name} component="span" className={styles.error} />
    </div>
  );
};

export default Dropdown;
