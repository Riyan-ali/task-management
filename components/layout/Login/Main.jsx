"use client";
import { useState } from "react";
import styles from "./main.module.scss";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import Loading from "@/components/common/Loading";
import Input from "@/components/common/Input";
import { domine, nunito } from "@/app/fonts/font";
import { signIn } from "next-auth/react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import Link from "next/link";

const LoginForm = () => {
  const initialValues = {
    email: "",
    password: "",
  };

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const router = useRouter();

  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Invalid email address")
      .required("Please enter your email"),
    password: Yup.string().required("Please enter your password"),
  });

  const submitHandler = async (values, { resetForm }) => {
    setError(null);
    setLoading(true);

    try {
      const response = await signIn("credentials", {
        redirect: false,
        email: values.email,
        password: values.password,
      });

      setLoading(false);

      if (response.ok) {
        toast.success("Logged in successfully");
        return router.push("/");
      } else {
        setError(response.error || "Invalid credentials");
      }
    } catch (error) {
      setLoading(false);
      setError(error.message);
    }
  };

  return (
    <>
      {loading && <Loading />}
      <div className={styles.card}>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={submitHandler}
        >
          {({ resetForm, handleChange, values }) => (
            <Form>
              <Input
                label="Email"
                name="email"
                type="email"
                placeholder="john@example.com"
                value={values.email}
                onChange={handleChange}
              />
              <Input
                label="Password"
                name="password"
                type={passwordVisible ? "text" : "password"}
                value={values.password}
                onChange={handleChange}
              />

              <div className={styles.password}>
                <p
                  className={nunito.className}
                  onClick={() => setPasswordVisible(!passwordVisible)}
                >
                  {passwordVisible ? "Hide Password" : "Show Password"}
                </p>
              </div>

              {error && (
                <div className={`${styles.error} ${nunito.className}`}>
                  {error}
                </div>
              )}

              <div className={`${styles.buttons} ${domine.className}`}>
                <button
                  type="button"
                  onClick={() => {
                    resetForm();
                    setError(null);
                  }}
                  className={styles.reset}
                >
                  Reset
                </button>
                <button className={styles.submit} type="submit">
                  Login
                </button>
              </div>
              <p className={`${styles.switch} ${nunito.className}`}>
                Don&apos;t have an account?{" "}
                <span>
                  <Link href={"/signup"}>Register Now</Link>
                </span>
              </p>
            </Form>
          )}
        </Formik>
      </div>
    </>
  );
};

export default LoginForm;
