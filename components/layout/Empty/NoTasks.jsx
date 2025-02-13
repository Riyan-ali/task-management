import Image from "next/image"
import styles from "./main.module.scss"
import noTasks from "@/public/images/no-tasks.jpg"
import { nunito } from "@/app/fonts/font"

const NoTasks = () => {
  return (
    <div className={styles.main}>
        <div className={styles.image}>
            <Image src={noTasks} alt="The user is not logged in" layout="responsive"
            width={200} 
            height={100} />
            <p className={nunito.className}>You don't have any tasks, try adding one.</p>
        </div>
    </div>
  )
}

export default NoTasks