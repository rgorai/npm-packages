import styles from '../styles/codePage.module.scss'

type Props = {
  packageName: string
}

const CodePage = ({ packageName }: Props) => {
  return (
    <div className={styles.pageContainer}>
      A local preview is in development. In the meantime, please visit the{' '}
      <a
        href={`https://github.com/rgorai/npm-packages/tree/main/src/Packages/${packageName}`}
        target="_blank"
        referrerPolicy="no-referrer"
      >
        repository on GitHub
      </a>
      .
    </div>
  )
}

export default CodePage
