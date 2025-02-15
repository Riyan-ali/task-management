import { dmsans } from "@/app/fonts/font";
import styles from "./main.module.scss"
import LoginForm from "@/components/layout/Login/Main";

export const metadata = {
    title: "Login Now",
    description: "Manage your daily tasks like a pro!",
  };

export default function Signup() {
    return (
        <div className={styles.wrapper}>
            <div className={styles.container}>
                <h1 className={dmsans.className}>Login Now.</h1>
                <div className={styles.form}>
                <LoginForm />
                </div>
            </div>
        </div>
    )
}