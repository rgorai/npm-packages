import { Link } from 'react-router-dom'
import styles from '../styles/logo.module.scss'

type Props = {
  personal?: true
}

const conditionalLink = (condition: boolean, children: JSX.Element) =>
  condition ? (
    <Link
      to="https://rongorai.com"
      target="_blank"
      referrerPolicy="no-referrer"
    >
      {children}
    </Link>
  ) : (
    children
  )

const Logo = ({ personal }: Props) => (
  <div className={styles.logoContainer}>
    {conditionalLink(
      !!personal,
      <span className={styles.firstName}>
        Ron<span className={styles.lastName}>Gorai</span>
        {!personal && <span className={styles.npm}>NPM</span>}
      </span>
    )}
  </div>
)

export default Logo
