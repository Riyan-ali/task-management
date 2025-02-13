import { dmsans } from "@/app/fonts/font";
import styles from "@/styles/modal.module.scss";
import { IoMdClose } from "react-icons/io";

const Modal = ({ children, headline, modalOpen, setModalOpen }) => {
  return (
    <div className={styles.backdrop}>
      <div className={styles.card}>
        <div className={styles.top}>
          <span className={`${dmsans.className} ${styles.heading}`}>{headline}</span>
          <span className={styles.close} onClick={() => setModalOpen(!modalOpen)}>
            <IoMdClose />
          </span>
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
};

export default Modal;
