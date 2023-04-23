import path from 'path'
import { useReducer, useRef, useState } from 'react'
import JSONPretty from 'react-json-pretty'
import jsonPrettyStyle from 'react-json-pretty/dist/1337'
import Editor, { OnChange, OnMount } from '@monaco-editor/react'
import * as monaco from 'monaco-editor'
import * as typescript from 'monaco-editor/esm/vs/language/typescript/monaco.contribution'
import FormGenerator from '../../Packages/complex-form-generator/src'
import styles from './cfgDemoPage.module.scss'

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
  const [seedCode, setSeedCode] = useState(seedValue)
  const [showSubmitMessage, setShowSubmitMessage] = useState(false)
  const editorRef = useRef<any>(null)

  const handleEditorMount: OnMount = (editor, monaco) => {
    monaco.languages.typescript.javascriptDefaults.setCompilerOptions({
      target: monaco.languages.typescript.ScriptTarget.ESNext,
      allowNonTsExtensions: true,
      moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
      include: ['tsconfig.json'],
      module: monaco.languages.typescript.ModuleKind.CommonJS,
    })

    editorRef.current = editor
  }

  const onEditorChange: OnChange = (value, ev) => {
    // console.log(value)
    if (value) {
      setSeedCode(value)
      console.log(ev)

      // monaco.languages.typescript.javascriptDefaults.setCompilerOptions({
      //   target: monaco.languages.typescript.ScriptTarget.ES2016,
      //   allowNonTsExtensions: true,
      // });
      // // typescript.get;

      // const worker = monaco.languages.typescript.getTypeScriptWorker()

      // // Get the text of the editor contents
      // const code = editorRef.current.getValue();

      // // Create a model for the editor contents
      // const modelUri = monaco.Uri.parse('file:///main.ts');
      // const model = monaco.editor.createModel(code, 'typescript', modelUri);

      // // Get the language service instance
      // const languageService = typescript.getLanguageService();

      // // Get the symbol information for the variable 'myVariable'
      // const position = model.getPositionAt(0);
      // const info = languageService.getSymbolInformation(
      //   model.getLanguageIdentifier(),
      //   model.uri.toString(),
      //   position,
      // );
      // const myVariable = info?.name;
    }
  }

  return (
    <div className={styles.cfgContainer}>
      <div className={styles.headers}>
        <h1>Seed Object</h1>
        <h1>Generated Form</h1>
        <h1>Parsed Payload</h1>
      </div>
      <div className={styles.content}>
        <div className={styles.editorContainer}>
          {/* <h1>Seed Object</h1> */}
          <div className={styles.editorWrapper}>
            <Editor
              height="75vh"
              language="typescript"
              value={seedValue}
              options={{
                minimap: { enabled: false },
                fontSize: 13,
              }}
              theme="vs-dark"
              onMount={handleEditorMount}
              onChange={onEditorChange}
            />
          </div>
        </div>

        <div className={styles.generatorContainer}>
          {/* <h1>Generated Form</h1> */}
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
          {/* <h1>Parsed Payload</h1> */}
          <JSONPretty data={payload} theme={jsonPrettyStyle} />
          {showSubmitMessage && (
            <div>
              {'Fired onSubmit with payload above! (verify in console)'}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default CfgDemoPage
