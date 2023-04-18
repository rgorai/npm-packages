// const KEYWORDS: (keyof Keywords)[] = [
//   '$noKey',
//   '$useTextArea',
//   '$useSelectOptions'
// ]

const keywordChecks = {
  isNoKey: (key: string, value: any): value is SeedValue => key === '$noKey',

  isTextArea: (key: string, value: any): value is UseTextArea[string] =>
    key === '$useTextArea',

  isSelectOptions: (
    key: string,
    value: any
  ): value is UseSelectOptions[string] => key === '$useSelectOptions',
}

export const { isNoKey, isTextArea, isSelectOptions } = keywordChecks

// export const isTextArea = (
//   key: string,
//   value: any
// ): value is UseTextArea[string] => key === '$useTextArea'

// export const isSelectOptions = (
//   key: string,
//   value: any
// ): value is UseSelectOptions[string] => key === '$useSelectOptions'

export const isKeyword = (key: string): key is keyof Keywords =>
  !!Object.entries(keywordChecks).find(([_, e]) => e(key, {}))

export const isKeywordValue = (key: string, value: any): value is Seed =>
  isKeyword(key)

export const isPrimitivesArray = (list: any[]): list is Primitives[] =>
  list.length > 0 && typeof list[0] !== 'object'
