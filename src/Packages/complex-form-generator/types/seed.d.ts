type Primitives = string | number | boolean

// TODO: find a way to enforce one element for seed array
type SeedValue = Primitives | Seed | Seed[] // | Exclude<any, Keywords>

type Seed = {
  [key: string]: SeedValue
} & {
  [key in keyof Keywords]?: Keywords[key]
}

type Keychain = (string | number)[]
