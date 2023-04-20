const keywordChecks = {
  isTextArea: (key: string, value: any): value is UseTextArea =>
    key === '$useTextArea',
  isSelectOptions: (key: string, value: any): value is UseSelectOptions =>
    key === '$useSelectOptions',
  isCodeArea: (key: string, value: any): value is UseCodeArea =>
    key === '$useCodeArea',
}

export const { isTextArea, isSelectOptions, isCodeArea } = keywordChecks

export const isKeyword = (key: string): key is keyof Keywords =>
  !!Object.entries(keywordChecks).find(([_, e]) => e(key, {}))

export const isKeywordValue = (
  key: string,
  value: any
): value is Keywords[keyof Keywords] => isKeyword(key)

export const isNotKeywordValue = (key: string, value: any): value is Seed =>
  !isKeyword(key)
