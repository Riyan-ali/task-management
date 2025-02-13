import Image from "next/image"
import styles from "./main.module.scss"
import notLoggedIn from "@/public/images/no-login.png"
import { nunito } from "@/app/fonts/font"

const NotLoggedIn = () => {
  return (
    <div className={styles.main}>
        <div className={styles.image}>
            <Image src={notLoggedIn} alt="The user is not logged in" layout="responsive"
            width={200} 
            height={100} />
            <p className={nunito.className}>Please first login to add your tasks</p>
        </div>
    </div>
  )
}

export default NotLoggedIn