import { useEffect, useState } from 'react'
import MarkdownPreview from '@uiw/react-markdown-preview'
import cfgReadme from 'complex-form-generator/README.md'
import eslintReadme from '@rgorai/eslint-config/README.md'
import styles from '../styles/documentationPage.module.scss'

type Props = {
  readmeName: string
}

const DocumentationPage = ({ readmeName }: Props) => {
  const [readmeValue, setReadmeValue] = useState('')
  const [readmes, setReadmes] = useState<Record<string, any>>({})

  useEffect(() => {
    setReadmes({ cfgReadme, eslintReadme })
  }, [])

  useEffect(() => {
    if (readmes[readmeName])
      fetch(readmes[readmeName])
        .then((response) => response.text())
        .then((text) => setReadmeValue(text))
        .catch((err) => console.error('readme fetch error', String(err)))
  }, [readmeName, readmes])

  return (
    <div className={styles.pageContainer}>
      <MarkdownPreview
        source={readmeValue}
        wrapperElement={{ 'data-color-mode': 'light' }}
      />
    </div>
  )
}

export default DocumentationPage
