// import FormGenerator from 'complex-form-generator'
import { useState } from 'react'
import JSONPretty from 'react-json-pretty'
import jsonPrettyStyle from 'react-json-pretty/dist/1337'
import Editor, { OnMount } from '@monaco-editor/react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import FormGenerator from './Packages/complex-form-generator/src/FormGenerator'
// import AceEditor from 'react-ace'
// import "ace-builds/src-noconflict/mode-typescript"
// import CodeMirror from '@uiw/react-codemirror';
// import { typescript } from '@codemirror/lang-typescript'
import styles from './App.module.scss'
import CfgDemoPage from './Demos/ComplexFormGenerator/CfgDemoPage'
import Navbar from './Main/Navbar'
import DemoContainer from './Main/DemoContainer'

// import * as monaco from 'monaco-editor'

const APP_CONTENT: AppContent = [
  {
    name: 'Complex Form Generator',
    path: '/complex-form-generator',
    elements: {
      Demo: <CfgDemoPage />,
      Documentation: <>cfg docs</>,
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
                element={<DemoContainer {...e.elements} />}
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
      </BrowserRouter>
    </div>
  )
}

export default App
