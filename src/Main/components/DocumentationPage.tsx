import { useEffect, useState } from 'react'
import { ReactMarkdown } from 'react-markdown/lib/react-markdown'
import styles from '../styles/documentationPage.module.scss'

type Props = {
  packageName: string
}

const DocumentationPage = ({ packageName }: Props) => {
  const [readmeValue, setReadmeValue] = useState('')

  useEffect(() => {
    import(`../../Packages/${packageName}/README.md`).then((res) => {
      fetch(res.default)
        .then((response) => response.text())
        .then((text) => setReadmeValue(text))
        .catch((err) => console.error('readme fetch error', String(err)))
    })
  }, [packageName])

  return (
    <div className={styles.pageContainer}>
      <ReactMarkdown children={readmeValue} />
    </div>
  )
}

export default DocumentationPage
