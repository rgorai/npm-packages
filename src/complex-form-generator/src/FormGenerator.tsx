import React, {
  ReactNode,
  useEffect,
  MutableRefObject,
  Dispatch,
  SetStateAction,
  useState,
} from 'react'
import cx from 'classnames'
// import CodeEditor from '@uiw/react-textarea-code-editor'
// import type { UseSelectOptions } from '../misc/seeds'
import { getValue, setValue } from './utils'
import styles from './forms.module.scss'

type AnyObject = { [key: string]: any }

type SelectCurrState = {
  _option: string
  _assocPayload?: AnyObject | string
}

type Props = {
  originalSeed: MutableRefObject<AnyObject>
  usePrimarySeed: [AnyObject, Dispatch<SetStateAction<AnyObject>>]
  setPayload: Dispatch<SetStateAction<AnyObject>>
}

type HelperProps = {
  seed: AnyObject
  keychain: Array<string | number>
}

// const getCodeEditor = (value: string, onChange: (ev: any) => void) => (
//   <CodeEditor
//     value={value}
//     language="HTML"
//     onChange={onChange}
//     padding={20}
//     style={{
//       fontSize: 15,
//       backgroundColor: 'white',
//       fontFamily:
//         'ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace',
//       borderRadius: '0.75rem',
//       width: '100%',
//       height: 'max-content',
//       minHeight: 'max-content',
//       resize: 'vertical',
//     }}
//   />
// )

const FormGenerator = (props: Props) => {
  const {
    usePrimarySeed: [primarySeed, setPrimarySeed],
    originalSeed,
    setPayload,
  } = props
  // const [primarySeed, setPrimarySeed] = useState({})

  // parse seed into payload on seed update,
  // follows same structure as render algorithm
  useEffect(() => {
    let temp = {}
    const parseSeed = (
      currSeed: typeof primarySeed,
      keychain: Array<string | number>
    ) => {
      for (const currKey in currSeed) {
        const newKeychain = [...keychain, currKey]
        const currVal = currSeed[currKey]

        if (currKey === '$useComplexCarousel') {
          const carouselInfo = getValue(primarySeed, keychain)
          temp = setValue(temp, keychain, carouselInfo._currState._assocPayload)
          break
        } else if (Array.isArray(currVal)) {
          temp = setValue(temp, newKeychain, [])
          currVal.map((e, i) => parseSeed(e, [...newKeychain, i]))
        } else if (typeof currVal === 'object') {
          // check for keywords
          if (currKey === '$noKey') {
            parseSeed(currVal, keychain)
          } else if (currVal.$useSelectOptions !== undefined) {
            temp = setValue(temp, keychain, {})
            parseSeed(
              {
                ...currSeed,
                [currKey]: currVal._currState._option,
                ...currVal._currState._assocPayload,
              },
              keychain
            )
          } else if (currVal.$useTextArea !== undefined) {
            temp = setValue(temp, newKeychain, currVal.$useTextArea)
          } else if (currVal.$useCodeArea !== undefined) {
            temp = setValue(temp, newKeychain, currVal.$useCodeArea)
          } else {
            temp = setValue(temp, newKeychain, {})
            parseSeed(currVal, newKeychain)
          }
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
    parseSeed(primarySeed, [])
    setPayload(temp)
  }, [primarySeed, setPayload])

  const FormGeneratorHelper = (helperProps: HelperProps) => {
    const { seed: currSeed, keychain } = helperProps
    const formElements: Array<ReactNode> = []

    // loop through each key in the current seed object
    let currIndex = 0
    for (const currKey in currSeed) {
      const newKeychain = [...keychain, currKey]
      const currVal = getValue(primarySeed, newKeychain)
      const currInputId = `${currKey}-${currIndex + 1}--${newKeychain.join(
        '-'
      )}`
      const currReactKey = newKeychain.toString()
      const currLabel =
        currKey !== '$noKey' ? (
          <label htmlFor={currInputId}>{currKey}</label>
        ) : (
          <></>
        )

      const addToList = (emptyPayload: any) => {
        setPrimarySeed((prevSeed: any) =>
          setValue(prevSeed, newKeychain, [
            ...getValue(prevSeed, newKeychain),
            emptyPayload,
          ])
        )
      }
      const removeFromList = (cardLocation: number) => {
        setPrimarySeed((prevSeed: any) =>
          setValue(
            prevSeed,
            newKeychain,
            (getValue(prevSeed, newKeychain) as []).filter(
              (_, i) => i !== cardLocation
            )
          )
        )
      }

      const onInputChange = (
        value: any,
        keychainOverride?: typeof keychain
      ) => {
        setPrimarySeed((prevSeed: any) =>
          setValue(prevSeed, keychainOverride ?? newKeychain, value)
        )
      }
      const onSelectInputChange = (
        value: string,
        assocPayload: any,
        keychainOverride?: typeof keychain
      ) => {
        setPrimarySeed((prevSeed: any) =>
          setValue(prevSeed, keychainOverride ?? newKeychain, {
            ...getValue(prevSeed, keychainOverride ?? newKeychain),
            _currState: {
              _option: value,
              _assocPayload: assocPayload,
            },
          })
        )
      }

      // CHECK FOR USE COMPLEX CAROUSEL FIRST
      // if (currKey === '$useComplexCarousel') {
      //   const selectInfo = getValue(primarySeed, keychain) as {
      //     $useComplexCarousel: Array<SelectCurrState>
      //     _currState: SelectCurrState
      //   }

      //   if (!selectInfo._currState) {
      //     // choose first element as default select option
      //     const [defaultOption] = selectInfo.$useComplexCarousel
      //     selectInfo._currState = {
      //       _option: defaultOption._option,
      //       _assocPayload: defaultOption._assocPayload,
      //     }
      //   }
      //   const { _option: currOption, _assocPayload: currAssocPayload } =
      //     selectInfo._currState

      //   formElements.push(
      //     <React.Fragment key={currReactKey}>
      //       <select
      //         id={currInputId}
      //         value={currOption}
      //         onChange={(ev) =>
      //           onSelectInputChange(
      //             ev.target.value,
      //             selectInfo.$useComplexCarousel.find(
      //               (e) => e._option === ev.target.value
      //             )?._assocPayload,
      //             keychain
      //           )
      //         }
      //       >
      //         {selectInfo.$useComplexCarousel.map((e, i) => (
      //           <option value={e._option} key={i}>
      //             {e._option}
      //           </option>
      //         ))}
      //       </select>

      //       {getCodeEditor(currAssocPayload as string, (ev) =>
      //         onInputChange(
      //           { _option: currOption, _assocPayload: ev.target.value },
      //           [...keychain, '_currState']
      //         )
      //       )}
      //     </React.Fragment>
      //   )
      //   break
      // } else

      // HANDLE COMPLEX CASES
      if (Array.isArray(currVal)) {
        formElements.push(
          <div className={styles.listItemContainer} key={currReactKey}>
            {currVal.map((_, i) => {
              const currItem = `${currKey}[${i}]`
              return (
                <React.Fragment key={i}>
                  <div className={styles.headerContainer}>
                    <h2>{currItem}</h2>
                    <button
                      className={styles.removeButton}
                      onClick={() => removeFromList(i)}
                      title={`Remove '${currItem}'`}
                      disabled={currVal.length <= 1}
                    >
                      <img
                        src={process.env.PUBLIC_URL + '/trash-icon.png'}
                        alt="remove card"
                      />
                    </button>
                  </div>

                  {FormGeneratorHelper({
                    seed: currVal[0],
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
              onClick={() =>
                addToList(getValue(originalSeed.current, [...newKeychain, 0]))
              }
            >
              {`Add '${currKey}'`}
            </button>
            <hr />
          </div>
        )
      } else if (typeof currVal === 'object') {
        // SELECT OPTIONS
        if (currVal.$useSelectOptions !== undefined) {
          const selectInfo = currVal as UseSelectOptions & {
            _currState: SelectCurrState
          }

          if (!selectInfo._currState) {
            // choose first element as default select option
            const [defaultOption] = selectInfo.$useSelectOptions
            selectInfo._currState = {
              _option: defaultOption._option,
              _assocPayload: defaultOption._assocPayload,
            }
          }
          const { _option: currOption, _assocPayload: currAssocPayload } =
            selectInfo._currState
          formElements.push(
            <React.Fragment key={currReactKey}>
              {currLabel}

              <select
                id={currInputId}
                value={currOption}
                onChange={(ev) =>
                  onSelectInputChange(
                    ev.target.value,
                    selectInfo.$useSelectOptions.find(
                      (e) => e._option === ev.target.value
                    )?._assocPayload
                  )
                }
              >
                {selectInfo.$useSelectOptions.map((e, i) => (
                  <option value={e._option} key={i}>
                    {e._option}
                  </option>
                ))}
              </select>

              {currAssocPayload &&
                FormGeneratorHelper({
                  seed: currAssocPayload as AnyObject,
                  keychain: [...newKeychain, '_currState', '_assocPayload'],
                })}
            </React.Fragment>
          )
        }

        // USE TEXT AREA
        else if (currVal.$useTextArea !== undefined) {
          formElements.push(
            <React.Fragment key={currReactKey}>
              {currLabel}
              <textarea
                id={currInputId}
                value={currVal.$useTextArea}
                onChange={(ev) =>
                  onInputChange(ev.target.value, [
                    ...newKeychain,
                    '$useTextArea',
                  ])
                }
              />
            </React.Fragment>
          )
        }

        // USE CODE AREA
        // else if (currVal.$useCodeArea !== undefined) {
        //   formElements.push(
        //     <React.Fragment key={currReactKey}>
        //       {currLabel}
        //       {getCodeEditor(currVal.$useCodeArea, (ev) =>
        //         onInputChange(ev.target.value, [...newKeychain, '$useCodeArea'])
        //       )}
        //     </React.Fragment>
        //   )
        // }

        // NORMAL OBJECT
        else {
          formElements.push(
            <React.Fragment key={currReactKey}>
              <h3>{currKey}</h3>
              {FormGeneratorHelper({
                seed: currVal,
                keychain: newKeychain,
              })}
              <hr className={styles.reduceWidth80} />
            </React.Fragment>
          )
        }
      }

      // HANDLE BASE CASES
      else if (typeof currVal === 'string') {
        formElements.push(
          <React.Fragment key={currReactKey}>
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
          <React.Fragment key={currReactKey}>
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
      } else {
        console.error('Unhandled payload type:', typeof currVal)
        console.error('Affected payload:', currVal)
        formElements.push(
          <div className={styles.generatorError} key={currReactKey}>
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
      {FormGeneratorHelper({
        ...props,
        seed: primarySeed,
        keychain: [],
      })}
    </div>
  )
}

export default FormGenerator
