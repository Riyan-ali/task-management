import { nunito } from "@/app/fonts/font";
import styles from "@/styles/loading.module.scss";

const Loading = () => {
  return (
    <div className={styles.backdrop}>
      <div className={styles.content}>
        <div className={styles.loader}></div>
      </div>
    </div>
  );
};

export default Loading;
