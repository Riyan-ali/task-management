"use client";
import { useState } from "react";
import styles from "./main.module.scss";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import Loading from "@/components/common/Loading";
import Input from "@/components/common/Input";
import { domine, nunito } from "@/app/fonts/font";
import ky from "ky";
import toast from "react-hot-toast";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

const RegisterForm = () => {
  const initialValues = {
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  };

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const router = useRouter();

  const validationSchema = Yup.object({
    firstName: Yup.string()
      .required("Please enter your first name")
      .min(2, "First name must be at least 2 characters")
      .max(20, "First name can't be more than 20 characters")
      .matches(
        /^[a-zA-Z\s]*$/,
        "Numbers or special characters are not allowed"
      ),

    lastName: Yup.string()
      .required("Please enter your last name")
      .min(2, "Last name must be at least 2 characters")
      .max(20, "Last name can't be more than 20 characters")
      .matches(
        /^[a-zA-Z\s]*$/,
        "Numbers or special characters are not allowed"
      ),

    email: Yup.string()
      .email("Invalid email address")
      .required("Please enter your email"),

    password: Yup.string()
      .required("Please enter your password")
      .min(5, "Password must be at least 5 characters")
      .max(20, "Password can't be more than 20 characters"),

    confirmPassword: Yup.string()
      .required("Please re-enter your password")
      .oneOf([Yup.ref("password")], "Passwords must match."),
  });

  const submitHandler = async (values, { resetForm }) => {
    setError(null);
    setLoading(true);

    try {
      const response = await ky
        .post("/api/signup", {
          json: { data: values },
          throwHttpErrors: false,
        })
        .json();

      if (response.success) {
        toast.success(response.message);

        // Automatically log in the user after successful registration
        const loginResponse = await signIn("credentials", {
          redirect: false,
          email: values.email,
          password: values.password,
        });

        setLoading(false);

        if (loginResponse.ok) {
          toast.success("Logged in successfully!");
          return router.push("/"); // Redirect to homepage
        } else {
          setError(loginResponse.error || "Login failed after registration.");
        }

        resetForm();
      } else {
        setLoading(false);
        setError(response.message);
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
                label="First Name"
                name="firstName"
                type="text"
                placeholder="John"
                value={values.firstName}
                onChange={handleChange}
              />
              <Input
                label="Last Name"
                name="lastName"
                type="text"
                placeholder="Doe"
                value={values.lastName}
                onChange={handleChange}
              />
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
              <Input
                label="Confirm Password"
                name="confirmPassword"
                type={passwordVisible ? "text" : "password"}
                value={values.confirmPassword}
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
                  Register
                </button>
              </div>
              <p className={`${styles.switch} ${nunito.className}`}>
                Already have an account?{" "}
                <span>
                  <Link href={"/login"}>Login Instead</Link>
                </span>
              </p>
            </Form>
          )}
        </Formik>
      </div>
    </>
  );
};

export default RegisterForm;
