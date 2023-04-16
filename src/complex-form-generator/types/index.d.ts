declare module '*.scss'

type KeyWords = {
  $useTextArea?: string
  $useSelectOptions?: {
    _option: string
    _assocPayload?: Seed
  }[]
}

type UseSelectOptions = Pick<KeyWords, '$useSelectOptions'>

type Primitives = string | number | boolean

type Seed =
  | {
      [key: string]: Primitives | Seed | (Primitives | Seed)[]
    } & KeyWords
