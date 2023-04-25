import { Tab } from 'react-bootstrap'
import Tabs from 'react-bootstrap/esm/Tabs'
import styles from '../styles/demoContainer.module.scss'

type Props = {
  Demo: JSX.Element
  Documentation: JSX.Element
  Code: JSX.Element
}

const DemoContainer = ({ Demo, Documentation, Code }: Props) => {
  return (
    <div className={styles.demoContainer}>
      <Tabs className="mt-1" defaultActiveKey="demo" transition={false}>
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
