import { useCallback, useEffect, useRef, useState } from 'react'
import JSONPretty from 'react-json-pretty'
import jsonPrettyStyle from 'react-json-pretty/dist/1337'
import Editor, { OnChange, OnMount } from '@monaco-editor/react'
import FormGenerator from 'complex-form-generator'
import styles from './cfgDemoPage.module.scss'
import { SEED_LIB, SEED_VALUE } from './editorValues'

const DEMO_SEED: Seed = {
  string: '',
  number: 0,
  boolean: false,
  $useDateArea: { date: '2000-01-01' },
  $useTextArea: { 'A normal label': '', anotherOne: '' },
  $useCodeArea: {
    codeArea: {
      _value: `list = [1, 2, 3]
for e in list:
    print(e)`,
      _language: 'python',
      _instance: Editor,
    },
  },
  $useSelectOptions: {
    selectOptions: {
      _defaultValue: 'option2',
      _options: [
        { _value: 'option1', _label: 'A custom option label' },
        { _value: 'option2' },
        {
          _value: 'option3',
          _assocPayload: {
            keep: 'nesting',
            excitement: 100,
            $useDateArea: { today: '' },
          },
        },
      ],
    },
  },
  array: [
    {
      key1: 'a default value',
      key2: 24,
      key3: false,
      $useTextArea: { inArray: '' },
      $useSelectOptions: {
        multiSelect: {
          _defaultValue: [],
          _options: [
            { _value: 'hey' },
            { _value: 'there', _assocPayload: { very: false } },
            { _value: 'buddy', _assocPayload: { tired: true } },
            { _value: 'boy' },
          ],
        },
      },
    },
  ],
  object: {
    first: '',
    second: 96,
    third: {
      nested: true,
      thanks: "you're welcome",
    },
  },
}

const CfgDemoPage = () => {
  const [payload, setPayload] = useState({})
  const [editorValue, setEditorValue] = useState(SEED_VALUE)
  const [showSubmitMessage, setShowSubmitMessage] = useState(false)
  const editorRef = useRef<any>(null)

  const handleEditorMount: OnMount = useCallback((editor, monaco) => {
    monaco.languages.typescript.typescriptDefaults.addExtraLib(SEED_LIB)
    editorRef.current = editor
  }, [])

  const onEditorChange: OnChange = (value) => {
    if (value) setEditorValue(value)
  }

  useEffect(() => {
    setShowSubmitMessage(false)
  }, [payload])

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
              value={editorValue}
              options={{
                minimap: { enabled: false },
                fontSize: 13,
                lineDecorationsWidth: 0,
                lineNumbersMinChars: 4,
                automaticLayout: true,
              }}
              theme="vs-dark"
              onMount={handleEditorMount}
              onChange={onEditorChange}
            />
          </div>
          <div className="text-center mt-2">
            <small>
              <strong>Notes:</strong> This code editor does not change the
              output of the generated demo form, but you can still experiment
              with different seeds. Monaco Editor does not support JSX.
            </small>
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
            groupNestedObjects
          />
        </div>

        <div className={styles.jsonContainer}>
          <JSONPretty data={payload} theme={jsonPrettyStyle} />
          {showSubmitMessage && (
            <div className="card mt-3 p-2 bg-warning text-center">
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
