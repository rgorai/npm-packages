import styles from './eslintDemo.module.scss'

const EslintDemoPage = () => {
  return (
    <div className={styles.pageContainer}>
      <figure>
        <video controls autoPlay>
          <source
            src={process.env.PUBLIC_URL + '/eslint-config-demo.webm'}
            type="video/webm"
          />
        </video>
        <figcaption>
          A glimpse of some of my linting rules and a demonstration of my{' '}
          <code>yarn lint</code> script at work in a React application.
        </figcaption>
      </figure>
    </div>
  )
}

export default EslintDemoPage
