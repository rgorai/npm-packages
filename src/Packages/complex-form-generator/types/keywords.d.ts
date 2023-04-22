import { IAceEditorProps } from 'react-ace'

declare global {
  type KeyObject<T> = { [key: string]: T }

  type Keywords = {
    $useTextArea: KeyObject<string>
    $useSelectOptions: KeyObject<
      {
        _option: string
        _defaultOption?: boolean
        _assocPayload?: Seed
      }[]
    >
    $useCodeArea: KeyObject<{
      _value: string
      _language: string
      _props?: { [key: keyof IAceEditorProps]: IAceEditorProps[key] }
    }>
  }

  type UseKeyword<T> = Keywords[T][string]

  type UseTextArea = UseKeyword<'$useTextArea'>

  type UseSelectOptions = UseKeyword<'$useSelectOptions'>

  type UseCodeArea = UseKeyword<'$useCodeArea'>
}
