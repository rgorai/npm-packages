import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import CfgDemoPage from './Demos/ComplexFormGenerator/CfgDemoPage'
import Navbar from './Main/components/Navbar'
import DemoContainer from './Main/components/DemoContainer'
import Footer from './Main/components/Footer'
import CodePage from './Pages/components/CodePage'
import DocumentationPage from './Pages/components/DocumentationPage'

export const BASENAME = ''

const APP_CONTENT: AppContent = [
  {
    name: 'Complex Form Generator',
    path: BASENAME + '/complex-form-generator',
    elements: {
      Demo: <CfgDemoPage />,
      Documentation: <DocumentationPage readmeName="cfgReadme" />,
      Code: <CodePage packageName="complex-form-generator" />,
    },
  },
  {
    name: 'ESlint Config',
    path: BASENAME + '/eslint-config',
    elements: {
      Demo: <>eslint config page</>,
      Documentation: <DocumentationPage readmeName="eslintReadme" />,
      Code: <CodePage packageName="eslint-config" />,
    },
  },
]

const App = () => {
  return (
    <div className="App">
      <BrowserRouter>
        <Navbar appContent={APP_CONTENT} />

        <main>
          <Routes>
            {APP_CONTENT.map((e) => (
              <Route
                path={e.path}
                element={<DemoContainer basePath={e.path} {...e.elements} />}
                key={e.path}
              />
            ))}

            <Route
              path={BASENAME}
              element={<Navigate replace to={`${APP_CONTENT[0].path}`} />}
            />

            <Route path={BASENAME + '/*'} element={<>not found</>} />
          </Routes>
        </main>

        <Footer appContent={APP_CONTENT} />
      </BrowserRouter>
    </div>
  )
}

export default App
