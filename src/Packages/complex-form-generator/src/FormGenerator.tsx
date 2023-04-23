import React, {
  ReactNode,
  useEffect,
  useState,
  Fragment,
  useCallback,
} from 'react'
import cx from 'classnames'
import { getValue, setValue } from './utils/objects'
import styles from './formGenerator.module.scss'
import {
  isCodeArea,
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
      groupNestedChildren?: true
    }

type Props<T> = {
  seed: Seed
  formId?: string
  onChange?: FormFunction<T>
  onSubmit?: FormFunction<T>
} & StyleOptions

type HelperProps = {
  seed: Seed
  keychain: Keychain
  keyword?: keyof Keywords
}

const FormGenerator = <T extends Record<string, any>>(props: Props<T>) => {
  const [seedState, setSeedState] = useState(props.seed)
  const [payload, setPayload] = useState({} as T)
  const floatingLabels = !props.suppressStyles && props.floatingLabels
  const groupNestedChildren = !props.suppressStyles && props.groupNestedChildren

  const parseSeed = useCallback((seed: Seed): T => {
    let temp = {} as T

    const parseSeedHelper = (
      currSeed: Seed,
      currKeychain: Keychain,
      currKeyword?: string
    ) => {
      for (const [currKey, currVal] of Object.entries(currSeed)) {
        const newKeychain = [...currKeychain, currKey]

        if (currKeyword) {
          if (isTextArea(currKeyword, currVal)) {
            temp = setValue(temp, newKeychain, currVal)
          } else if (isSelectOptions(currKeyword, currVal)) {
            const currOptionIndex = currVal.findIndex((e) => e._defaultOption)

            if (currOptionIndex !== -1) {
              parseSeedHelper(
                {
                  [currKey]: currVal[currOptionIndex]._option,
                  ...currVal[currOptionIndex]._assocPayload,
                },
                currKeychain
              )
            }
          }
        } else if (isKeyword(currKey) && isKeywordValue(currKey, currVal)) {
          parseSeedHelper(currVal, currKeychain, currKey)
        } else if (Array.isArray(currVal)) {
          temp = setValue(temp, newKeychain, [])
          currVal.map((e, i) => parseSeedHelper(e, [...newKeychain, i]))
        } else if (typeof currVal === 'object') {
          temp = setValue(temp, newKeychain, {})
          parseSeedHelper(currVal, newKeychain)
        } else if (
          typeof currVal === 'string' ||
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
    // onChange?.(payload)
  }, [parseSeed, seedState])

  const { onChange } = props
  useEffect(() => {
    onChange?.(payload)
  }, [onChange, payload])

  const getClassname = (classname: string) =>
    cx({ [classname]: !props.suppressStyles })

  const getFloatingClassname = (classname?: string) =>
    getClassname(`${floatingLabels ? 'form-floating' : ''} ${classname}`)

  const FormGeneratorHelper = (helperProps: HelperProps) => {
    const {
      seed: currSeed,
      keychain: currKeychain,
      keyword: currKeyword,
    } = helperProps
    const formElements: ReactNode[] = []

    // loop through each key in the current seed object
    let currIndex = 0
    for (const [currKey, currVal] of Object.entries(currSeed)) {
      const newKeychain = [...currKeychain, currKey]
      const currInputId = `${currKey}-${currIndex + 1}--${newKeychain.join(
        '-'
      )}`
      const currKeychainStr = newKeychain.join('.')
      const currLabel = (classname?: string) => (
        <label
          className={classname ? getClassname(classname) : ''}
          htmlFor={currInputId}
        >
          {currKey}
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

      const onInputChange = (value: any) => {
        setSeedState((prev) => setValue(prev, newKeychain, value))
      }
      const onSelectInputChange = (newOption: string) => {
        setSeedState((prev) =>
          setValue(
            prev,
            newKeychain,
            getValue<UseSelectOptions>(prev, newKeychain).map((e) => ({
              ...e,
              _defaultOption: e._option === newOption,
            }))
          )
        )
      }

      try {
        // first check for keywords that are currently being parsed
        if (currKeyword) {
          if (isTextArea(currKeyword, currVal)) {
            formElements.push(
              <div
                className={getFloatingClassname('mb-3')}
                key={currKeychainStr}
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
          } else if (isSelectOptions(currKeyword, currVal)) {
            if (currVal.length === 0)
              throw `No data provided for $useSelectOptions key: ${currKey}`

            const currOptionIndex = currVal.findIndex((e) => e._defaultOption)

            if (currOptionIndex === -1) {
              // choose first element as default select option
              const [defaultOption] = currVal
              onSelectInputChange(defaultOption._option)
            } else {
              formElements.push(
                <div key={currKeychainStr}>
                  <div className={getFloatingClassname()}>
                    {!floatingLabels && currLabel()}
                    <select
                      id={currInputId}
                      className={getClassname('form-select mb-3')}
                      value={currVal[currOptionIndex]._option}
                      onChange={(ev) => onSelectInputChange(ev.target.value)}
                    >
                      {currVal.map((e, i) => (
                        <option value={e._option} key={i}>
                          {e._option}
                        </option>
                      ))}
                    </select>
                    {floatingLabels && currLabel()}
                  </div>

                  {currVal[currOptionIndex]._assocPayload &&
                    FormGeneratorHelper({
                      seed: currVal[currOptionIndex]._assocPayload as Seed,
                      keychain: [
                        ...newKeychain,
                        currOptionIndex,
                        '_assocPayload',
                      ],
                    })}
                </div>
              )
            }
          } else if (isCodeArea(currKeyword, currVal)) {
            formElements.push(
              <React.Fragment key={currKeychainStr}>
                {currLabel()}
                {/* <AceEditor value={currVal._value} mode={currVal._language} /> */}
              </React.Fragment>
            )
          }
        }

        // check if a keyword has been registered
        else if (isKeyword(currKey) && isKeywordValue(currKey, currVal)) {
          formElements.push(
            <Fragment key={currKeychainStr}>
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
                `mb-4 ${groupNestedChildren ? 'form-control' : ''}`
              )}
              key={currKeychainStr}
            >
              {currVal.map((_, i) => {
                const currItem = `${currKey}[${i}]`
                return (
                  <React.Fragment key={i}>
                    <div className={styles.headerContainer}>
                      <h1>{currItem}</h1>
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
                onClick={() =>
                  addToList(getValue(props.seed, [...newKeychain, 0]))
                }
              >
                {`Add '${currKey}'`}
              </button>
              {!groupNestedChildren && <hr className="mt-3 mb-4" />}
            </div>
          )
        } else if (typeof currVal === 'object') {
          formElements.push(
            <React.Fragment key={currKeychainStr}>
              <div className={styles.headerContainer}>
                <h1>{currKey}</h1>
              </div>
              {FormGeneratorHelper({
                seed: currVal,
                keychain: newKeychain,
              })}
            </React.Fragment>
          )
        }

        // check for base case values
        else if (typeof currVal === 'string') {
          formElements.push(
            <div className={getFloatingClassname('mb-3')} key={currKeychainStr}>
              {!floatingLabels && currLabel()}
              <input
                id={currInputId}
                className={getClassname('form-control')}
                type="text"
                value={currVal}
                onChange={(ev) => onInputChange(ev.target.value)}
                placeholder={floatingLabels ? 'placeholder' : ''}
              />
              {floatingLabels && currLabel()}
            </div>
          )
        } else if (typeof currVal === 'boolean') {
          formElements.push(
            <div
              className={getClassname('mt-4 mb-3 form-check')}
              key={currKeychainStr}
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
          <div className={styles.generatorError} key={currKeychainStr}>
            Form Generator Error: see console
          </div>
        )
      }

      currIndex++
    }

    return <>{formElements}</>
  }

  // call helper to create form
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
            <hr />
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
