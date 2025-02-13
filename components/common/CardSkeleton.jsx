import styles from "@/styles/skeleton.module.scss";

const CardSkeleton = () => {
  return (
    <div className={styles.skeletonContainer}>
      {[1, 2, 3].map((item) => (
        <div key={item} className={styles.skeletonCard}></div>
      ))}
    </div>
  );
};

export default CardSkeleton;
