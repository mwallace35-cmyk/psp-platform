import styles from '@/app/homepage.module.css';

export default function ScrollIndicator() {
  return (
    <div className={styles.scrollIndicator}>
      <svg
        className={styles.scrollChevron}
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <polyline points="6 9 12 15 18 9" />
      </svg>
    </div>
  );
}
