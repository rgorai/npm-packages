import path from 'path'
import { useEffect, useReducer, useRef, useState } from 'react'
import JSONPretty from 'react-json-pretty'
import jsonPrettyStyle from 'react-json-pretty/dist/1337'
import Editor, { OnChange, OnMount } from '@monaco-editor/react'
import * as monaco from 'monaco-editor'
import * as typescript from 'monaco-editor/esm/vs/language/typescript/monaco.contribution'
import * as ts from 'typescript'
import FormGenerator from '../../Packages/complex-form-generator/src'
import styles from './cfgDemoPage.module.scss'

const DEMO_SEED: Seed = {
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
  anObject: {
    hello: '',
    goodbye: '',
    sucker: {
      yes: '',
      nested: true,
    },
  },
}

const seedValue = `const DEMO_SEED: Seed = {
  title: '',
  $useTextArea: { hello: '', again: '' },
  actions: [
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

const SEED_LIB = `type Keywords = {
  $useTextArea: Record<string, string>
  $useSelectOptions: Record<
    string,
    {
      _option: string
      _defaultOption?: boolean
      _assocPayload?: Seed
    }[]
  >
  $useCodeArea: Record<
    string,
    {
      _value: string
      _language: string
      _props?: { [key: keyof IAceEditorProps]: IAceEditorProps[key] }
    }
  >
}

type Primitives = string | number | boolean

type SeedValue = Primitives | Seed | Seed[]

type Seed = {
  [key: string]: SeedValue
} & {
  [key in keyof Keywords]?: Keywords[key]
}`

const CfgDemoPage = () => {
  const [payload, setPayload] = useState({})
  const [seedCodeStr, setSeedCodeStr] = useState(seedValue)
  const [showSubmitMessage, setShowSubmitMessage] = useState(false)
  const editorRef = useRef<any>(null)

  const handleEditorMount: OnMount = (editor, monaco) => {
    monaco.languages.typescript.typescriptDefaults.addExtraLib(SEED_LIB)
    editorRef.current = editor
  }

  const onEditorChange: OnChange = (value, ev) => {
    // console.log(value)
    if (value) {
      setSeedCodeStr(value)
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

  useEffect(() => {
    setShowSubmitMessage(false)
  }, [payload])

  useEffect(() => {
    const sourceFile = ts.createSourceFile(
      'temp.ts',
      seedCodeStr,
      ts.ScriptTarget.Latest
    )
    const variables: { [name: string]: any } = {}
    function visit(node: ts.Node) {
      if (ts.isVariableDeclaration(node)) {
        const name = node.name.getText(sourceFile)
        const { initializer } = node
        if (initializer) {
          // variables[name] = eval(initializer.getText(sourceFile))
        }
      }
      ts.forEachChild(node, visit)
    }
    visit(sourceFile)
    console.log('HERE', variables)
  }, [seedCodeStr])

  return (
    <div className={styles.cfgContainer}>
      <div className={styles.headers}>
        <h1>Seed Object</h1>
        <h1>Generated Form</h1>
        <h1>Parsed Payload</h1>
      </div>
      <div className={styles.content}>
        <div className={styles.editorContainer}>
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
          <FormGenerator
            seed={DEMO_SEED}
            onChange={(payload) => setPayload(payload)}
            onSubmit={(payload) => {
              setShowSubmitMessage(true)
              console.log('payload passed to onSubmit:', payload)
            }}
            floatingLabels
            // groupNestedChildren
          />
        </div>

        <div className={styles.jsonContainer}>
          <JSONPretty data={payload} theme={jsonPrettyStyle} />
          {showSubmitMessage && (
            <div className="card mt-3 p-3 bg-warning text-center">
              <div>{'Fired onSubmit with payload above!'}</div>
              <div className="text-muted">{'(verify in console)'}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default CfgDemoPage
