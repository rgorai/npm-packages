import { useState } from 'react'
import JSONPretty from 'react-json-pretty'
import jsonPrettyStyle from 'react-json-pretty/dist/1337'
import Editor, { OnMount } from '@monaco-editor/react'
import FormGenerator from '../../Packages/complex-form-generator/src'
import styles from './cfgDemoPage.module.scss'
// import * as monaco from 'monaco-editor'

const TEST_SEED: Seed = {
  title: '',
  $useTextArea: { hello: '', again: '' },
  $noKey: 'A TEST',
  actions: [
    // { $noKey: 'testing' },
    {
      label: '',
      params: '',
      disableOnSubmit: false,
      $useSelectOptions: {
        type: [
          {
            _option: 'button',
          },
          {
            _option: 'link',
            _defaultOption: true,
            _assocPayload: {
              disableForm: false,
              url: '',
              $useCodeArea: {
                lol: {
                  _value: '',
                  _language: 'java',
                },
              },
              listOfSelect: [
                {
                  $useSelectOptions: {
                    target: [
                      { _option: '_blank' },
                      { _option: '_self' },
                      { _option: '_parent' },
                    ],
                    testing: [
                      {
                        _option: 'hello',
                        // _assocPayload: { hello: '', hi: 'hi' },
                      },
                      {
                        _option: 'hahaha',
                        _assocPayload: { haha: '', lol: 'hahahaha' },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
        anotherOne: [{ _option: 'hello' }, { _option: 'hello again' }],
      },
    },
  ],
  moreStuffAfter: '',
}

const seedValue = `const TEST_SEED: Seed = {
  title: '',
  $useTextArea: { hello: '', again: '' },
  $noKey: 'A TEST',
  actions: [
    // { $noKey: 'testing' },
    {
      label: '',
      params: '',
      disableOnSubmit: false,
      $useSelectOptions: {
        type: [
          {
            _option: 'button',
          },
          {
            _option: 'link',
            _defaultOption: true,
            _assocPayload: {
              disableForm: false,
              url: '',
              $useCodeArea: {
                lol: {
                  _value: '',
                  _language: 'java',
                },
              },
              listOfSelect: [
                {
                  $useSelectOptions: {
                    target: [
                      { _option: '_blank' },
                      { _option: '_self' },
                      { _option: '_parent' },
                    ],
                    testing: [
                      {
                        _option: 'hello',
                        // _assocPayload: { hello: '', hi: 'hi' },
                      },
                      {
                        _option: 'hahaha',
                        _assocPayload: { haha: '', lol: 'hahahaha' },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
        anotherOne: [{ _option: 'hello' }, { _option: 'hello again' }],
      },
    },
  ],
  moreStuffAfter: '',
}`

const CfgDemoPage = () => {
  const [payload, setPayload] = useState({})
  const [showSubmitMessage, setShowSubmitMessage] = useState(false)

  const handleEditorMount: OnMount = (editor, monaco) => {
    monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
      target: monaco.languages.typescript.ScriptTarget.ESNext,
      allowNonTsExtensions: true,
      moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
      typeRoots: ['node_modules/@types'],
      module: monaco.languages.typescript.ModuleKind.CommonJS,
    })
  }

  return (
    <div className={styles.cfgContainer}>
      <div className={styles.editorContainer}>
        <h1>Seed Object</h1>
        <div className={styles.editorWrapper}>
          <Editor
            height="90vh"
            language="typescript"
            value={seedValue}
            options={{
              minimap: { enabled: false },
              fontSize: 13,
            }}
            theme="vs-dark"
            onMount={handleEditorMount}
          />
        </div>
      </div>

      <div className={styles.generatorContainer}>
        <h1>Generated Form</h1>
        <FormGenerator
          seed={TEST_SEED}
          onChange={(payload) => setPayload(payload)}
          onSubmit={(payload) => {
            setShowSubmitMessage(true)
            console.log('payload value in onSubmit:', payload)
          }}
        />
      </div>

      <div className={styles.jsonContainer}>
        <h1>Parsed Payload</h1>
        <JSONPretty data={payload} theme={jsonPrettyStyle} />
        {showSubmitMessage && (
          <div>{'Fired onSubmit with payload above! (verify in console)'}</div>
        )}
      </div>
    </div>
  )
}

export default CfgDemoPage
