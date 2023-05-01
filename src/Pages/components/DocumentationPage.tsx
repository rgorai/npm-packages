import { useCallback, useEffect, useState } from 'react'
import MarkdownPreview from '@uiw/react-markdown-preview'
import styles from '../styles/documentationPage.module.scss'

type Props = {
  readmeName: string
}

const DocumentationPage = ({ readmeName }: Props) => {
  const [readmeValue, setReadmeValue] = useState('')
  const [readmes, setReadmes] = useState<Record<string, any>>({})

  const getReadmes = useCallback(async () => {
    const { default: cfgReadme } = await import(
      `/node_modules/complex-form-generator/README.md`
    )
    const { default: eslintReadme } = await import(
      `/node_modules/@rgorai/eslint-config/README.md`
    )
    setReadmes({ cfgReadme, eslintReadme })
  }, [])

  useEffect(() => {
    getReadmes()
  }, [getReadmes])

  useEffect(() => {
    fetch(readmes[readmeName])
      .then((response) => response.text())
      .then((text) => setReadmeValue(text))
      .catch((err) => console.error('readme fetch error', String(err)))
  }, [readmeName, readmes])

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
