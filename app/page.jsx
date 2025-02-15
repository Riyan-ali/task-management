import { dmsans, domine } from "./fonts/font";
import styles from "./main.module.scss";
import Link from "next/link";
import { getServerSession } from "next-auth";
import Main from "@/components/layout/Home/Main";
import NotLoggedIn from "@/components/layout/Empty/NotLoggedIn";
import Profile from "@/components/layout/Profile/Main";

export const metadata = {
  title: "Task Management - Riyan Ali",
  description: "Manage your daily tasks like a pro!",
};

export default async function Home() {
  const session = await getServerSession();

  return (
    <>
      <div className={styles.wrapper}>
        <div className={styles.container}>
          <div className={styles.headline}>
            <h1 className={dmsans.className}>Task Management App</h1>
            {session ? (
              <Profile />
            ) : (
              <div className={`${styles.login} ${domine.className}`}>
                <Link href={"/login"}>
                  <button>Login</button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {session ? (
        <Main />
      ) : (
        <div className={styles.wrapper}>
          <div className={styles.container}>
            <NotLoggedIn />
          </div>
        </div>
      )}
    </>
  );
}
