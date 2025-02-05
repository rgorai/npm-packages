import { Tab } from 'react-bootstrap'
import Tabs from 'react-bootstrap/esm/Tabs'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useEffect } from 'react'
import styles from '../styles/demoContainer.module.scss'
import { APP_NAME } from '../../constants'

type Props = {
  name: string
  basePath: string
  Demo: JSX.Element
  Documentation: JSX.Element
  Code: JSX.Element
}

const tabNames: Record<string, string> = {
  documentation: 'Documentation',
  demo: 'Demo',
  code: 'Code',
}

const DemoContainer = ({
  name,
  basePath,
  Demo,
  Documentation,
  Code,
}: Props) => {
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const currTab = params.get('currentTab') ?? 'documentation'

  useEffect(() => {
    document.title = `${tabNames[currTab]} | ${name} | ${APP_NAME}`
  }, [currTab, name])

  return (
    <div className={styles.demoContainer}>
      <Tabs
        className="mt-1"
        activeKey={currTab}
        onSelect={(key) => {
          if (key) navigate(`${basePath}?currentTab=${key}`)
        }}
        transition={false}
      >
        <Tab eventKey="documentation" title="Documentation">
          {Documentation}
        </Tab>
        <Tab eventKey="demo" title="Demo">
          {Demo}
        </Tab>
        <Tab eventKey="code" title="Code">
          {Code}
        </Tab>
      </Tabs>
    </div>
  )
}

export default DemoContainer
