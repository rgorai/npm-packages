declare module '*.scss'

// type Keywords = {
//   $useTextArea?: string
//   $useSelectOptions?: {
//     _option: string
//     _assocPayload?: Seed
//   }[]
// }

type Keywords = {
  $noKey: SeedValue
  $useTextArea: { [key: string]: string }
  $useSelectOptions: {
    [key: string]: {
      _option: string
      _assocPayload?: Seed
    }[]
  }
}

type UseTextArea = Keywords['$useTextArea']
type UseSelectOptions = Keywords['$useSelectOptions']

type Primitives = string | number | boolean

type SeedValue = Primitives | Seed | Seed[] // | Primitives[]

type Seed = {
  [key: string]: SeedValue
} & {
  [key in keyof Keywords]?: Keywords[key]
}

type Keychain = (string | number)[]
