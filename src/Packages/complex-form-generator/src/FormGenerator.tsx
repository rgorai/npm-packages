import React, {
  ReactNode,
  useEffect,
  useState,
  Fragment,
  useCallback,
  useRef,
} from 'react'
import cx from 'classnames'
import { Editor } from '@monaco-editor/react'
import { getValue, setValue } from './utils/objects'
import styles from './formGenerator.module.scss'
import {
  isCodeArea,
  isDateArea,
  isKeyword,
  isKeywordValue,
  isSelectOptions,
  isTextArea,
} from './utils/typeGuards'

type FormFunction<T> = (payload: T) => void

type StyleOptions =
  | {
      suppressStyles: true
    }
  | {
      suppressStyles?: false
      floatingLabels?: true
      groupNestedObjects?: true
    }

type FormGeneratorProps<T = any> = {
  seed: Seed
  formId?: string
  onChange?: FormFunction<T>
  onSubmit?: FormFunction<T>
} & StyleOptions

type HelperProps = {
  seed: Seed | Keywords[keyof Keywords]
  keychain: Keychain
  keyword?: keyof Keywords
}

const FormGenerator = <T extends Record<string, any>>(
  props: FormGeneratorProps<T>
) => {
  const [seedState, setSeedState] = useState<Seed>(props.seed)
  const [payload, setPayload] = useState({} as T)
  const floatingLabels = !props.suppressStyles && props.floatingLabels
  const groupNestedObjects = !props.suppressStyles && props.groupNestedObjects
  const arrayRefs = useRef<Record<string, HTMLHeadingElement[]>>({})

  const parseSeed = useCallback((seed: Seed): T => {
    let temp = {} as T

    const parseSeedHelper = (
      currSeed: Seed | Keywords[keyof Keywords],
      currKeychain: Keychain,
      currKeyword?: string
    ) => {
      for (const [currKey, currVal] of Object.entries(currSeed)) {
        const newKeychain = [...currKeychain, currKey]

        if (currKeyword) {
          if (
            isTextArea(currKeyword, currVal) ||
            isDateArea(currKeyword, currVal)
          ) {
            temp = setValue(temp, newKeychain, currVal)
          } else if (isCodeArea(currKeyword, currVal)) {
            temp = setValue(temp, newKeychain, currVal._value)
          } else if (isSelectOptions(currKeyword, currVal)) {
            const assocPayloads: [number, Seed][] = getAssocPayloads(currVal)
            parseSeedHelper(
              {
                [currKey]: currVal._defaultValue,
                ...assocPayloads.reduce((p, c) => ({ ...p, ...c[1] }), {}),
              },
              currKeychain
            )
          }
        } else if (isKeyword(currKey) && isKeywordValue(currKey, currVal)) {
          parseSeedHelper(currVal, currKeychain, currKey)
        } else if (Array.isArray(currVal)) {
          if (currVal.length > 0 && typeof currVal[0] === 'string')
            temp = setValue(temp, newKeychain, currVal)
          else {
            temp = setValue(temp, newKeychain, [])
            currVal.map((e, i) => parseSeedHelper(e, [...newKeychain, i]))
          }
        } else if (typeof currVal === 'object') {
          parseSeedHelper(currVal, newKeychain)
        } else if (
          typeof currVal === 'string' ||
          typeof currVal === 'number' ||
          typeof currVal === 'boolean'
        ) {
          temp = setValue(temp, newKeychain, currVal)
        } else {
          temp = setValue(temp, newKeychain, {
            ParseError: 'unhandled payload type encountered',
          })
        }
      }
    }

    parseSeedHelper(seed, [])

    setPayload(temp)

    return temp
  }, [])

  // parse seed into payload on seed update,
  // follows same structure as render algorithm
  useEffect(() => {
    parseSeed(seedState)
  }, [parseSeed, seedState])

  // call onChange props is passed
  const { onChange } = props
  useEffect(() => {
    onChange?.(payload)
  }, [onChange, payload])

  const getClassname = (classname: string) =>
    cx({ [classname]: !props.suppressStyles })

  const getFloatingClassname = (classname?: string) =>
    getClassname(cx(classname, { ['form-floating']: floatingLabels }))

  const getAssocPayloads = (
    currVal: UseKeyword<'SelectOptions'>,
    setDefault?: (newOption: string | string[]) => void
  ) => {
    const currDefaultVal = currVal._defaultValue
    const useMultiple = Array.isArray(currDefaultVal)
    const assocPayloads: [number, Seed][] = []

    if (useMultiple)
      for (const [i, e] of currVal._options.entries()) {
        const temp = currVal._options[i]._assocPayload
        if (currDefaultVal.includes(e._value) && temp)
          assocPayloads.push([i, temp])
      }
    else {
      const currOptionIndex = currVal._options.findIndex(
        (e) => e._value === currVal._defaultValue
      )

      if (currOptionIndex === -1) {
        const [defaultOption] = currVal._options
        if (setDefault) setDefault(defaultOption._value)
        if (defaultOption._assocPayload)
          assocPayloads.push([0, defaultOption._assocPayload])
      } else {
        const temp = currVal._options[currOptionIndex]._assocPayload
        if (temp) assocPayloads.push([currOptionIndex, temp])
      }
    }

    return assocPayloads
  }

  const FormGeneratorHelper = (helperProps: HelperProps) => {
    const {
      seed: currSeed,
      keychain: currKeychain,
      keyword: currKeyword,
    } = helperProps
    const formElements: ReactNode[] = []

    // loop through each key in the current seed object
    for (const [currKey, currVal] of Object.entries(currSeed)) {
      const newKeychain = [...currKeychain, currKey]
      const currInputId = newKeychain.join('-').replaceAll(' ', '-')
      const newKeychainStr = newKeychain.join('.')
      const currLabel = (classname?: string, labelOverride?: string) => (
        <label
          className={classname ? getClassname(classname) : ''}
          htmlFor={currInputId}
        >
          {labelOverride ?? currKey}
        </label>
      )

      const addToList = (emptyPayload: any) => {
        setSeedState((prevSeed) =>
          setValue(prevSeed, newKeychain, [
            ...getValue<Seed[]>(prevSeed, newKeychain),
            emptyPayload,
          ])
        )
      }
      const removeFromList = (cardLocation: number) => {
        setSeedState((prevSeed) =>
          setValue(
            prevSeed,
            newKeychain,
            getValue<Seed[]>(prevSeed, newKeychain).filter(
              (_, i) => i !== cardLocation
            )
          )
        )
      }

      const onInputChange = (value: any, keychainOverride?: Keychain) => {
        setSeedState((prev) =>
          setValue(prev, keychainOverride ?? newKeychain, value)
        )
      }
      const onSelectInputChange = (newOption: string | string[]) => {
        setSeedState((prev) =>
          setValue(prev, [...newKeychain, '_defaultValue'], newOption)
        )
      }

      try {
        // first check for keywords that are currently being parsed
        if (currKeyword) {
          if (isTextArea(currKeyword, currVal)) {
            formElements.push(
              <div
                className={getFloatingClassname('mb-3')}
                key={newKeychainStr}
              >
                {!floatingLabels && currLabel()}
                <textarea
                  id={currInputId}
                  className={getClassname('form-control')}
                  value={currVal}
                  onChange={(ev) => onInputChange(ev.target.value)}
                  placeholder={floatingLabels ? 'placeholder' : ''}
                />
                {floatingLabels && currLabel()}
              </div>
            )
          } else if (isDateArea(currKeyword, currVal)) {
            formElements.push(
              <div
                className={getFloatingClassname('mb-3')}
                key={newKeychainStr}
              >
                {!floatingLabels && currLabel()}
                <input
                  id={currInputId}
                  className={getClassname('form-control')}
                  value={currVal}
                  type="date"
                  onChange={(ev) => onInputChange(ev.target.value)}
                  placeholder={floatingLabels ? 'placeholder' : ''}
                />
                {floatingLabels && currLabel()}
              </div>
            )
          } else if (isCodeArea(currKeyword, currVal)) {
            formElements.push(
              <React.Fragment key={newKeychainStr}>
                {currLabel()}
                <div className={getClassname(cx('mb-3', styles.editorWrapper))}>
                  <Editor
                    height="13em"
                    language={currVal._language}
                    theme="vs-dark"
                    value={currVal._value}
                    onChange={(value) =>
                      onInputChange(value, [...newKeychain, '_value'])
                    }
                    options={{
                      minimap: { enabled: false },
                      lineDecorationsWidth: 0,
                      lineNumbersMinChars: 3,
                    }}
                  />
                </div>
              </React.Fragment>
            )
          } else if (isSelectOptions(currKeyword, currVal)) {
            const assocPayloads: [number, Seed][] = getAssocPayloads(
              currVal,
              onSelectInputChange
            )
            const useMultiple = Array.isArray(currVal._defaultValue)

            formElements.push(
              <div
                className={getClassname(
                  cx({
                    [cx('form-control', styles.objectContainer)]:
                      groupNestedObjects &&
                      currVal._options.find((e) => !!e._assocPayload),
                  })
                )}
                key={newKeychainStr}
              >
                <div className={!useMultiple ? getFloatingClassname() : ''}>
                  {(!floatingLabels || useMultiple) && currLabel()}
                  <select
                    id={currInputId}
                    className={getClassname('form-select mb-3')}
                    value={currVal._defaultValue}
                    onChange={(ev) => {
                      let value
                      if (useMultiple) {
                        const temp = []
                        for (
                          let i = 0;
                          i < ev.target.selectedOptions.length;
                          i++
                        )
                          temp.push(ev.target.selectedOptions[i].text)
                        value = temp
                      } else ({ value } = ev.target)

                      onSelectInputChange(value)
                    }}
                    multiple={useMultiple}
                  >
                    {currVal._options.map((e, i) => (
                      <option value={e._value} key={i}>
                        {e._label ?? e._value}
                      </option>
                    ))}
                  </select>
                  {floatingLabels && !useMultiple && currLabel()}
                </div>

                {assocPayloads.map(([i, e]) =>
                  FormGeneratorHelper({
                    seed: e,
                    keychain: [...newKeychain, '_options', i, '_assocPayload'],
                  })
                )}
              </div>
            )
          }
        }

        // check if a keyword has been registered
        else if (isKeyword(currKey) && isKeywordValue(currKey, currVal)) {
          formElements.push(
            <Fragment key={newKeychainStr}>
              {FormGeneratorHelper({
                seed: currVal,
                keychain: newKeychain,
                keyword: currKey,
              })}
            </Fragment>
          )
        }

        // check for object values
        else if (Array.isArray(currVal)) {
          formElements.push(
            <div
              className={getClassname(
                cx('mb-4', styles.objectContainer, {
                  ['form-control']: groupNestedObjects,
                })
              )}
              key={newKeychainStr}
            >
              {currVal.map((_, i) => {
                const currItem = `${currKey}[${i}]`
                arrayRefs.current[newKeychainStr] = []
                return (
                  <React.Fragment key={i}>
                    <div
                      className={cx(styles.headerContainer, {
                        [styles.nestedMargin]: groupNestedObjects,
                      })}
                    >
                      <div
                        className={styles.objectHeading}
                        ref={(element) => {
                          if (element)
                            arrayRefs.current[newKeychainStr].push(element)
                        }}
                      >
                        {currItem}
                      </div>
                      <button
                        className={cx(
                          getClassname('btn btn-danger'),
                          styles.removeButton
                        )}
                        type="button"
                        onClick={() => removeFromList(i)}
                        disabled={currVal.length <= 1}
                        title={`Remove '${currItem}'`}
                      >
                        {props.suppressStyles ? (
                          'Remove'
                        ) : (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            fill="currentColor"
                            className="bi bi-trash3-fill"
                            viewBox="0 0 16 16"
                          >
                            <path d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5Zm-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5ZM4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06Zm6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528ZM8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5Z" />
                          </svg>
                        )}
                      </button>
                    </div>

                    {FormGeneratorHelper({
                      seed: currVal[i],
                      keychain: [...newKeychain, i],
                    })}
                  </React.Fragment>
                )
              })}

              <button
                className={cx('mt-2 mb-3', getClassname('btn btn-secondary'))}
                type="button"
                onClick={() => {
                  addToList(getValue(props.seed, [...newKeychain, 0]))

                  console.log(
                    arrayRefs.current[newKeychainStr][
                      arrayRefs.current[newKeychainStr].length - 1
                    ]
                  )

                  arrayRefs.current[newKeychainStr][
                    arrayRefs.current[newKeychainStr].length - 1
                  ]?.scrollIntoView()
                }}
              >
                {`Add '${currKey}'`}
              </button>
              {!groupNestedObjects && <hr className="mt-3 mb-4" />}
            </div>
          )
        } else if (typeof currVal === 'object') {
          formElements.push(
            <div
              className={getClassname(
                cx('mb-4', styles.objectContainer, {
                  ['form-control']: groupNestedObjects,
                })
              )}
              key={newKeychainStr}
            >
              <div
                className={cx(styles.headerContainer, {
                  [styles.nestedMargin]: groupNestedObjects,
                })}
              >
                <div className={styles.objectHeading}>{currKey}</div>
              </div>
              {FormGeneratorHelper({
                seed: currVal,
                keychain: newKeychain,
              })}
            </div>
          )
        }

        // check for base case values
        else if (typeof currVal === 'string' || typeof currVal === 'number') {
          formElements.push(
            <div className={getFloatingClassname('mb-3')} key={newKeychainStr}>
              {!floatingLabels && currLabel()}
              <input
                id={currInputId}
                className={getClassname('form-control')}
                value={currVal}
                placeholder={floatingLabels ? 'placeholder' : ''}
                {...(typeof currVal === 'number'
                  ? {
                      type: 'number',
                      onChange: (ev) => onInputChange(Number(ev.target.value)),
                    }
                  : {
                      type: 'text',
                      onChange: (ev) => onInputChange(ev.target.value),
                    })}
              />
              {floatingLabels && currLabel()}
            </div>
          )
        } else if (typeof currVal === 'boolean') {
          formElements.push(
            <div
              className={getClassname('mt-4 mb-3 form-check')}
              key={newKeychainStr}
            >
              <input
                id={currInputId}
                className={getClassname('form-check-input')}
                type="checkbox"
                checked={currVal}
                onChange={(ev) => onInputChange(ev.target.checked)}
              />
              {currLabel('form-check-label')}
            </div>
          )
        }

        // throw error for un-supported conditions
        else {
          throw `Unhandled payload type: ${typeof currVal}`
        }
      } catch (err) {
        console.error(String(err))
        formElements.push(
          <div className={styles.generatorError} key={newKeychainStr}>
            Form Generator Error: see console
          </div>
        )
      }
    }

    return <>{formElements}</>
  }

  // call recursive helper to create form
  return (
    <div className={styles.formContainer}>
      <form
        id={props.formId ?? 'form-generator'}
        onSubmit={(ev) => {
          ev.preventDefault()
          props.onSubmit?.(payload)
        }}
      >
        {FormGeneratorHelper({
          seed: seedState,
          keychain: [],
        })}

        {props.onSubmit && (
          <>
            <hr className={getClassname('mt-4')} />
            <button
              className={getClassname('btn btn-primary')}
              form="form-generator"
              type="submit"
            >
              Submit
            </button>
          </>
        )}
      </form>
    </div>
  )
}

export default FormGenerator
