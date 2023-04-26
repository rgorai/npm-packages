// eslint-disable-next-line spaced-comment
/// <reference types="react-scripts" />
declare module 'react-json-pretty/*'
declare module '*.md' {
  const value: string
  export default value
}

type AppContent = {
  name: string
  path: string
  elements: {
    Demo: JSX.Element
    Documentation: JSX.Element
    Code: JSX.Element
  }
}[]
