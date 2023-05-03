import { BrowserRouter, Route, Routes } from 'react-router-dom'
import CfgDemoPage from './Demos/ComplexFormGenerator/CfgDemoPage'
import Navbar from './Main/components/Navbar'
import DemoContainer from './Main/components/DemoContainer'
import Footer from './Main/components/Footer'
import CodePage from './Pages/components/CodePage'
import DocumentationPage from './Pages/components/DocumentationPage'
import HomePage from './Pages/components/HomePage'
import EslintDemoPage from './Demos/EslintConfig/EslintDemoPage'

const APP_CONTENT: AppContent = [
  {
    name: 'Complex Form Generator',
    path: '/complex-form-generator',
    elements: {
      Demo: <CfgDemoPage />,
      Documentation: <DocumentationPage readmeName="cfgReadme" />,
      Code: <CodePage packageName="complex-form-generator" />,
    },
  },
  {
    name: 'ESLint Config',
    path: '/eslint-config',
    elements: {
      Demo: <EslintDemoPage />,
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
                element={
                  <DemoContainer
                    name={e.name}
                    basePath={e.path}
                    {...e.elements}
                  />
                }
                key={e.path}
              />
            ))}

            <Route path={'/'} element={<HomePage appContent={APP_CONTENT} />} />

            <Route path="*" element={<>not found</>} />
          </Routes>
        </main>

        <Footer appContent={APP_CONTENT} />
      </BrowserRouter>
    </div>
  )
}

export default App
