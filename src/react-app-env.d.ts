// eslint-disable-next-line spaced-comment
/// <reference types="react-scripts" />
declare module 'react-json-pretty/*'
declare module '@codemirror/*'

type AppContent = {
  name: string
  path: string
  elements: {
    Demo: JSX.Element
    Documentation: JSX.Element
    Code: JSX.Element
  }
}[]
