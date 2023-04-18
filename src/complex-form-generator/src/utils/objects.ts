const getValue = <T>(source: any, keychain: Keychain): T =>
  keychain.length === 0
    ? source
    : getValue(source[keychain[0]], keychain.slice(1))

// returns new object with set value
const setValue = (source: any, keychain: Keychain, value: any): any => {
  const retVal =
    keychain.length === 1
      ? value
      : setValue(source[keychain[0]], keychain.slice(1), value)

  if (Array.isArray(source)) {
    const temp = [...source]
    temp.splice(keychain[0] as number, 1, retVal)
    return temp
  } else {
    return { ...source, [keychain[0]]: retVal }
  }
}

export { getValue, setValue }
