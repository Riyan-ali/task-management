import { ErrorMessage, useField } from "formik";
import styles from "@/styles/input.module.scss";
import { nunito } from "@/app/fonts/font";

const TextArea = ({ label, name, type, placeholder, value, onChange }) => {
  const [field, meta] = useField(name);

  return (
    <div className={`${styles.main} ${nunito.className}`}>
      <label htmlFor={name}>{label}:</label>
      <textarea
        {...field}
        type={type}
        id={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={meta.touched && meta.error ? styles.errorInput : ""}
      />
      <ErrorMessage name={name} component="span" className={styles.error} />
    </div>
  );
};

export default TextArea;