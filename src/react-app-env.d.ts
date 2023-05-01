// eslint-disable-next-line spaced-comment
/// <reference types="react-scripts" />
declare module 'react-json-pretty'
declare module 'react-json-pretty/dist/1337'
declare module 'complex-form-generator/README.md'
declare module '@rgorai/eslint-config/README.md'

type AppContent = {
  name: string
  path: string
  elements: {
    Demo: JSX.Element
    Documentation: JSX.Element
    Code: JSX.Element
  }
}[]
