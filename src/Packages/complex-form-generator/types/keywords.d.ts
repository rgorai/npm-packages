import { IAceEditorProps } from 'react-ace'

declare global {
  type Keywords = {
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

  type UseKeyword<T> = Keywords[T][string]

  type UseTextArea = UseKeyword<'$useTextArea'>

  type UseSelectOptions = UseKeyword<'$useSelectOptions'>

  type UseCodeArea = UseKeyword<'$useCodeArea'>
}
