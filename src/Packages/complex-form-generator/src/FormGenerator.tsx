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

type Props<T> = {
  seed: Seed
  formId?: string
  onChange?: FormFunction<T>
  onSubmit?: FormFunction<T>
}

type HelperProps = {
  seed: Seed
  keychain: Keychain
  keyword?: keyof Keywords
}

const FormGenerator = <T extends Record<string, any>>({
  seed: defaultSeed,
  formId,
  onChange,
  onSubmit,
}: Props<T>) => {
  const [seedState, setSeedState] = useState(defaultSeed)
  const [payload, setPayload] = useState({} as T)

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

  useEffect(() => {
    onChange?.(payload)
  }, [onChange, payload])

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
      const currLabel = (
        <label
          // className={cx({ [styles.noKey]: currKey === '$noKey' })}
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
              <React.Fragment key={currKeychainStr}>
                {currLabel}
                <textarea
                  id={currInputId}
                  value={currVal}
                  onChange={(ev) => onInputChange(ev.target.value)}
                />
              </React.Fragment>
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
                <React.Fragment key={currKeychainStr}>
                  {currLabel}

                  <select
                    id={currInputId}
                    value={currVal[currOptionIndex]._option}
                    onChange={(ev) => onSelectInputChange(ev.target.value)}
                  >
                    {currVal.map((e, i) => (
                      <option value={e._option} key={i}>
                        {e._option}
                      </option>
                    ))}
                  </select>

                  {currVal[currOptionIndex]._assocPayload &&
                    FormGeneratorHelper({
                      seed: currVal[currOptionIndex]._assocPayload as Seed,
                      keychain: [
                        ...newKeychain,
                        currOptionIndex,
                        '_assocPayload',
                      ],
                    })}
                </React.Fragment>
              )
            }
          } else if (isCodeArea(currKeyword, currVal)) {
            formElements.push(
              <React.Fragment key={currKeychainStr}>
                {currLabel}
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
            <div className={styles.listItemContainer} key={currKeychainStr}>
              {currVal.map((_, i) => {
                const currItem = `${currKey}[${i}]`
                return (
                  <React.Fragment key={i}>
                    <div className={styles.headerContainer}>
                      <h2>{currItem}</h2>
                      <button
                        className={styles.removeButton}
                        type="button"
                        onClick={() => removeFromList(i)}
                        title={`Remove '${currItem}'`}
                        disabled={currVal.length <= 1}
                      >
                        {/* <img
                        src={process.env.PUBLIC_URL + '/trash-icon.png'}
                        alt="remove card"
                      /> */}
                        Remove
                      </button>
                    </div>

                    {FormGeneratorHelper({
                      seed: currVal[i],
                      keychain: [...newKeychain, i],
                    })}

                    <hr
                      className={cx(styles.reduceWidth90, {
                        [styles.hide]: i === currVal.length - 1,
                      })}
                    />
                  </React.Fragment>
                )
              })}

              <button
                className={styles.addButton}
                type="button"
                onClick={() =>
                  addToList(getValue(defaultSeed, [...newKeychain, 0]))
                }
              >
                {`Add '${currKey}'`}
              </button>
              <hr />
            </div>
          )
        } else if (typeof currVal === 'object') {
          formElements.push(
            <React.Fragment key={currKeychainStr}>
              <h3>{currKey}</h3>
              {FormGeneratorHelper({
                seed: currVal,
                keychain: newKeychain,
              })}
              <hr className={styles.reduceWidth80} />
            </React.Fragment>
          )
        }

        // check for base case values
        else if (typeof currVal === 'string') {
          formElements.push(
            <React.Fragment key={currKeychainStr}>
              {currLabel}
              <input
                id={currInputId}
                type="text"
                value={currVal}
                onChange={(ev) => onInputChange(ev.target.value)}
              />
            </React.Fragment>
          )
        } else if (typeof currVal === 'boolean') {
          formElements.push(
            <React.Fragment key={currKeychainStr}>
              <div className={styles.checkboxContainer}>
                <input
                  id={currInputId}
                  type="checkbox"
                  checked={currVal}
                  onChange={(ev) => onInputChange(ev.target.checked)}
                />
                {currLabel}
              </div>
            </React.Fragment>
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
        id={formId ?? 'form-generator'}
        onSubmit={(ev) => {
          ev.preventDefault()
          onSubmit?.(payload)
          console.log('SUBMITTED')
        }}
      >
        {FormGeneratorHelper({
          seed: seedState,
          keychain: [],
        })}

        {onSubmit && (
          <button form="form-generator" type="submit">
            Submit
          </button>
        )}
      </form>
    </div>
  )
}

export default FormGenerator
