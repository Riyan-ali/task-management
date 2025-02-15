import Link from "next/link"
import styles from "./main.module.scss"
import { domine } from "@/app/fonts/font"

const Footer = () => {
  return (
    <div className={styles.wrapper}>
        <div className={styles.container}>
            <p className={domine.className}>This is designed and developed by <Link href={"https://www.linkedin.com/in/riyan-ali-1445951b8/"} target="_blank">Riyan Ali</Link></p>
        </div>
    </div>
  )
}

export default Footer