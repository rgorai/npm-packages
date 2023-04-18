import React, {
  ReactNode,
  useEffect,
  MutableRefObject,
  Dispatch,
  SetStateAction,
  useState,
  Fragment,
} from 'react'
import cx from 'classnames'
// import CodeEditor from '@uiw/react-textarea-code-editor'
// import type { UseSelectOptions } from '../misc/seeds'
import { getValue, setValue } from './utils/objects'
import styles from './forms.module.scss'
import {
  isKeyword,
  isKeywordValue,
  isNoKey,
  isSelectOptions,
  isTextArea,
} from './utils/typeGuards'

type AnyObject = { [key: string]: any }

type SelectCurrState = {
  _option: string
  _assocPayload?: Seed
}

type Props = {
  seed: Seed
  setPayload: Dispatch<SetStateAction<AnyObject>>
}

type HelperProps = {
  seed: Seed
  keychain: Keychain
  keyword?: keyof Keywords
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

const FormGenerator = ({ seed: defaultSeed, setPayload }: Props) => {
  const [seedState, setSeedState] = useState(defaultSeed)
  const [selectOptionsBuffer, setSelectOptionsBuffer] = useState<{
    [key: string]: SelectCurrState
  }>({})

  useEffect(() => {
    console.log('BUFFER', selectOptionsBuffer)
  }, [selectOptionsBuffer])

  // parse seed into payload on seed update,
  // follows same structure as render algorithm
  // useEffect(() => {
  //   let temp = {}
  //   const parseSeed = (
  //     currSeed: Seed,
  //     keychain: Array<string | number>
  //   ) => {
  //     for (const currKey in currSeed) {
  //       const newKeychain = [...keychain, currKey]
  //       const currVal = currSeed[currKey]

  //       // if (currKey === '$useComplexCarousel') {
  //       //   const carouselInfo = getValue(seedState, keychain)
  //       //   temp = setValue(temp, keychain, carouselInfo._currState._assocPayload)
  //       //   break
  //       // } else
  //       if (Array.isArray(currVal)) {
  //         temp = setValue(temp, newKeychain, [])
  //         currVal.map((e, i) => parseSeed(e, [...newKeychain, i]))
  //       } else if (typeof currVal === 'object') {
  //         // check for keywords
  //         if (currKey === '$noKey') {
  //           parseSeed(currVal, keychain)
  //         } else if (currVal.$useSelectOptions !== undefined) {
  //           temp = setValue(temp, keychain, {})
  //           parseSeed(
  //             {
  //               ...currSeed,
  //               [currKey]: currVal._currState._option,
  //               ...currVal._currState._assocPayload,
  //             },
  //             keychain
  //           )
  //         } else if (currVal.$useTextArea !== undefined) {
  //           temp = setValue(temp, newKeychain, currVal.$useTextArea)
  //         } else if (currVal.$useCodeArea !== undefined) {
  //           temp = setValue(temp, newKeychain, currVal.$useCodeArea)
  //         } else {
  //           temp = setValue(temp, newKeychain, {})
  //           parseSeed(currVal, newKeychain)
  //         }
  //       } else if (
  //         typeof currVal === 'string' ||
  //         typeof currVal === 'boolean'
  //       ) {
  //         temp = setValue(temp, newKeychain, currVal)
  //       } else {
  //         temp = setValue(temp, newKeychain, {
  //           ParseError: 'unhandled payload type encountered',
  //         })
  //       }
  //     }
  //   }
  //   parseSeed(seedState, [])
  //   setPayload(temp)
  // }, [seedState, setPayload])

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
          className={cx({ [styles.noKey]: currKey === '$noKey' })}
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
        setSeedState((prevSeed) => {
          console.log(
            'THIS',
            '_assocPayload' in getValue<Seed[]>(prevSeed, newKeychain)
          )

          return setValue(
            prevSeed,
            newKeychain,
            getValue<Seed[]>(prevSeed, newKeychain).filter(
              (_, i) => i !== cardLocation
            )
          )
        })
      }

      const onInputChange = (value: any) => {
        ;(newKeychain.includes('_assocPayload')
          ? setSelectOptionsBuffer
          : setSeedState)((prev: any) => setValue(prev, newKeychain, value))
      }
      const onSelectInputChange = (
        keychainStr: string,
        newOption: string,
        newAssocPayload: Seed | undefined
      ) => {
        setSelectOptionsBuffer((prevSeed) => ({
          ...prevSeed,
          [keychainStr]: {
            _option: newOption,
            _assocPayload: newAssocPayload,
          },
        }))
      }

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
          if (!selectOptionsBuffer[currKeychainStr]) {
            // choose first element as default select option
            const [defaultOption] = currVal
            onSelectInputChange(
              currKeychainStr,
              defaultOption._option,
              defaultOption._assocPayload
            )
          } else {
            const { _option: currOption, _assocPayload: currAssocPayload } =
              selectOptionsBuffer[currKeychainStr]

            formElements.push(
              <React.Fragment key={currKeychainStr}>
                {currLabel}

                <select
                  id={currInputId}
                  value={currOption}
                  onChange={(ev) =>
                    onSelectInputChange(
                      currKeychainStr,
                      ev.target.value,
                      currVal.find((e) => e._option === ev.target.value)
                        ?._assocPayload
                    )
                  }
                >
                  {currVal.map((e, i) => (
                    <option value={e._option} key={i}>
                      {e._option}
                    </option>
                  ))}
                </select>

                {currAssocPayload &&
                  FormGeneratorHelper({
                    seed: currAssocPayload,
                    keychain: [currKeychainStr, '_assocPayload'],
                  })}
              </React.Fragment>
            )
          }
        }
      }

      // check if a keyword has been registered
      else if (
        isKeyword(currKey) &&
        isKeywordValue(currKey, currVal) &&
        !isNoKey(currKey, currVal)
      ) {
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
        // USE CODE AREA
        // else if (currVal.$useCodeArea !== undefined) {
        //   formElements.push(
        //     <React.Fragment key={currKeychainStr}>
        //       {currLabel}
        //       {getCodeEditor(currVal.$useCodeArea, (ev) =>
        //         onInputChange(ev.target.value, [...newKeychain, '$useCodeArea'])
        //       )}
        //     </React.Fragment>
        //   )
        // }

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
        console.error('Unhandled payload type:', typeof currVal)
        console.error('Affected payload:', currVal)
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
      {FormGeneratorHelper({
        seed: seedState,
        keychain: [],
      })}
    </div>
  )
}

export default FormGenerator
