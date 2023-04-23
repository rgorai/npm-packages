import styles from './logo.module.scss'

const Logo = () => (
  <div className={styles.logoContainer}>
    <span className={styles.firstName}>
      Ron<span className={styles.lastName}>Gorai</span>
      <span className={styles.npm}>NPM</span>
    </span>
  </div>
)

export default Logo
