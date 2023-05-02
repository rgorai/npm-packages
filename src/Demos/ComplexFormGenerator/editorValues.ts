export const SEED_VALUE = `// import Editor from '@monaco-editor/react'

const DEMO_SEED: Seed = {
  string: '',
  number: 0,
  boolean: false,
  $useDateArea: { date: '2000-01-01' },
  $useTextArea: { 'A normal label': '', anotherOne: '' },
  $useCodeArea: {
    codeArea: {
      _value: \`list = [1, 2, 3]
for e in list:
    print(e)\`,
      _language: 'python',
      _instance: \`Editor\`,
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

const DEMO_COMPONENT = \`(
  <FormGenerator
    seed={DEMO_SEED}
    onChange={(payload) => setPayload(payload)}
    onSubmit={(payload) => {
      setShowSubmitMessage(true)
      console.log('payload passed to onSubmit:', payload)
    }}
    groupNestedObjects
  />
)\`
`

export const SEED_LIB = `type Keywords = {
  $useTextArea: Record<string, string>
  $useDateArea: Record<string, string>
  $useCodeArea: Record<
    string,
    {
      _value: string
      _language: 'plaintext' | 'abap' | 'apex' | 'azcli' | 'bat' | 'bicep' | 'cameligo' | 'clojure' | 'coffeescript' | 'c' | 'cpp' | 'csharp' | 'csp' | 'css' | 'cypher' | 'dart' | 'dockerfile' | 'ecl' | 'elixir' | 'flow9' | 'fsharp' | 'freemarker2' | 'freemarker2.tag-angle.interpolation-dollar' | 'freemarker2.tag-bracket.interpolation-dollar' | 'freemarker2.tag-angle.interpolation-bracket' | 'freemarker2.tag-bracket.interpolation-bracket' | 'freemarker2.tag-auto.interpolation-dollar' | 'freemarker2.tag-auto.interpolation-bracket' | 'go' | 'graphql' | 'handlebars' | 'hcl' | 'html' | 'ini' | 'java' | 'javascript' | 'julia' | 'kotlin' | 'less' | 'lexon' | 'lua' | 'liquid' | 'm3' | 'markdown' | 'mips' | 'msdax' | 'mysql' | 'objective-c' | 'pascal' | 'pascaligo' | 'perl' | 'pgsql' | 'php' | 'pla' | 'postiats' | 'powerquery' | 'powershell' | 'proto' | 'pug' | 'python' | 'qsharp' | 'r' | 'razor' | 'redis' | 'redshift' | 'restructuredtext' | 'ruby' | 'rust' | 'sb' | 'scala' | 'scheme' | 'scss' | 'shell' | 'sol' | 'aes' | 'sparql' | 'sql' | 'st' | 'swift' | 'systemverilog' | 'verilog' | 'tcl' | 'twig' | 'typescript' | 'vb' | 'wgsl' | 'xml' | 'yaml' | 'json'
      _instance: MemoExoticComponent<(props: EditorProps) => JSX.Element>
    }
  >
  $useSelectOptions: Record<
    string,
    {
      _defaultValue: string | string[]
      _options: {
        _value: string
        _label?: string
        _assocPayload?: Seed
      }[]
    }
  >
}

type Primitives = string | number | boolean

type SeedValue = Primitives | Seed | Seed[]

type Seed = {
  [key in keyof Keywords]?: Keywords[key]
} & {
  [key: string]: any
}
`
