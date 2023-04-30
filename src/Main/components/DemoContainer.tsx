import { Tab } from 'react-bootstrap'
import Tabs from 'react-bootstrap/esm/Tabs'
import { useNavigate, useSearchParams } from 'react-router-dom'
import styles from '../styles/demoContainer.module.scss'

type Props = {
  basePath: string
  Demo: JSX.Element
  Documentation: JSX.Element
  Code: JSX.Element
}

const DemoContainer = ({ basePath, Demo, Documentation, Code }: Props) => {
  const [params] = useSearchParams()
  const navigate = useNavigate()
  return (
    <div className={styles.demoContainer}>
      <Tabs
        className="mt-1"
        activeKey={params.get('currentTab') ?? 'demo'}
        onSelect={(key) => {
          if (key) navigate(`${basePath}?currentTab=${key}`)
        }}
        transition={false}
      >
        <Tab eventKey="demo" title="Demo">
          {Demo}
        </Tab>
        <Tab eventKey="documentation" title="Documentation">
          {Documentation}
        </Tab>
        <Tab eventKey="code" title="Code">
          {Code}
        </Tab>
      </Tabs>
    </div>
  )
}

export default DemoContainer
