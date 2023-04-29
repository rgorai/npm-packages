const keywordChecks = {
  isTextArea: (key: string, value: any): value is UseKeyword<'TextArea'> =>
    key === '$useTextArea',
  isDateArea: (key: string, value: any): value is UseKeyword<'DateArea'> =>
    key === '$useDateArea',
  isCodeArea: (key: string, value: any): value is UseKeyword<'CodeArea'> =>
    key === '$useCodeArea',
  isSelectOptions: (
    key: string,
    value: any
  ): value is UseKeyword<'SelectOptions'> => key === '$useSelectOptions',
}

export const { isTextArea, isDateArea, isSelectOptions, isCodeArea } =
  keywordChecks

export const isKeyword = (key: string): key is keyof Keywords =>
  !!Object.entries(keywordChecks).find(([_, e]) => e(key, {}))

export const isKeywordValue = (
  key: string,
  value: any
): value is Keywords[keyof Keywords] => isKeyword(key)

export const isNotKeywordValue = (key: string, value: any): value is Seed =>
  !isKeyword(key)
