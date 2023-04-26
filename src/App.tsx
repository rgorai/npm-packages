import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import CfgDemoPage from './Demos/ComplexFormGenerator/CfgDemoPage'
import Navbar from './Main/components/Navbar'
import DemoContainer from './Main/components/DemoContainer'
import Footer from './Main/components/Footer'
import DocumentationPage from './Main/components/DocumentationPage'

const APP_CONTENT: AppContent = [
  {
    name: 'Complex Form Generator',
    path: '/complex-form-generator',
    elements: {
      Demo: <CfgDemoPage />,
      Documentation: <DocumentationPage packageName="complex-form-generator" />,
      Code: <>cfg code</>,
    },
  },
  {
    name: 'ESlint Config',
    path: '/eslint-config',
    elements: {
      Demo: <>eslint config page</>,
      Documentation: <>eslint config docs</>,
      Code: <>eslint config code</>,
    },
  },
]

const App = () => {
  return (
    <div className="App">
      <BrowserRouter basename="/npm-packages">
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
              path="/"
              element={<Navigate replace to={`${APP_CONTENT[0].path}`} />}
            />

            <Route path="*" element={<>not found</>} />
          </Routes>
        </main>

        <Footer appContent={APP_CONTENT} />
      </BrowserRouter>
    </div>
  )
}

export default App
