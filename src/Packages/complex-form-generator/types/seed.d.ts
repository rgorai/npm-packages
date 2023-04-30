type Primitives = string | number | boolean

type SeedValue = Primitives | Seed | Seed[]

type Seed = {
  [key: string]: SeedValue
} & {
  [key in keyof Keywords]?: Keywords[key]
}

type Keychain = (string | number)[]
