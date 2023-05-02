import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import cx from 'classnames'
import styles from '../styles/homePage.module.scss'

const PROFILE_IMG_SRC = `${process.env.PUBLIC_URL}/profile-image.webp`

type Props = {
  appContent: AppContent
}

const HomePage = ({ appContent }: Props) => {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    document.title = `Welcome | Ron Gorai NPM`
    const profileImg = document.createElement('img')
    profileImg.onload = () => setLoading(false)
    profileImg.src = PROFILE_IMG_SRC
  }, [])

  return (
    <div className={styles.homePageContainer}>
      {!loading && (
        <>
          <div className={styles.messageContainer}>
            <div className={styles.title}>{"Ron Gorai's NPM Platform"}</div>
            <div className={styles.welcome}>
              Welcome to my NPM package platform! Here, you can view demos,
              documentation, and code for my NPM packages.
            </div>
            <div className={styles.startLinksContainer}>
              {appContent.map((e, i) => (
                <Link
                  className={cx('text-primary', styles.startLink)}
                  to={e.path}
                  key={i}
                >
                  {e.name}
                </Link>
              ))}
            </div>
          </div>
          <div>
            <img
              className={styles.profileImg}
              src={PROFILE_IMG_SRC}
              alt="Profile Portrait"
            />
          </div>
        </>
      )}
    </div>
  )
}

export default HomePage
