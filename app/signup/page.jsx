import RegisterForm from "@/components/layout/Signup/Main"
import styles from "./main.module.scss"
import { dmsans } from "@/app/fonts/font"

export const metadata = {
    title: "Register Yourself",
    description: "Manage your daily tasks like a pro!",
  };

export default function Signup() {
    return (
        <div className={styles.wrapper}>
            <div className={styles.container}>
                <h1 className={dmsans.className}>New User Registration.</h1>
                <div className={styles.form}>
                <RegisterForm />
                </div>
            </div>
        </div>
    )
}