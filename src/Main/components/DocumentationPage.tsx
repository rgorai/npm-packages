import { useEffect, useState } from 'react'
import MarkdownPreview from '@uiw/react-markdown-preview'
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
      <MarkdownPreview
        source={readmeValue}
        wrapperElement={{
          'data-color-mode': 'light',
        }}
      />
    </div>
  )
}

export default DocumentationPage
