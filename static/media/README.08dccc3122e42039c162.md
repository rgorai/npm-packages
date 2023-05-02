# Complex Form Generator

This package allows you to generate a form with a special seed object in React based on a complex JS object that you need user input for. Object keys of the seed are used as input labels, and each key's value is used to infer the type of input. This means strings, numbers, booleans, nested objects, and certain configurations of nested Arrays are fair game as object value types. Apart from these, there is a seed API to support a handful of custom input types. It also ships with Bootstrap 5 styling.

## Prequisites
This is a React component, so you will need `"react": ">=18"`. If you want to use the shipped styles, you will need `"bootstrap": ">=5"`. If you would like to use code editor inputs, you will need `"@monaco-editor/react": "^4.5.0"`.

## Demo
Please visit <a href="@@@DEMO_SITE">my NPM platform</a> to view a demo of this package.

## Installation

With NPM:
```
npm install complex-form-generator
```

With Yarn:
```
yarn add complex-form-generator
```

## Usage

### Creating a seed object
To create a seed object, simply start with the default state of the payload you need. Consider the rather simple payload named <code>SEED</code> provided in the example below. This payload as-is will generate a form with input tag types inferred from each key's value type, and labels generated from the keynames. For more complex input types, you can use special <a href="#keywords">keywords</a> outlined below.

### Instantiating the component
Once your seed is written, simply supply it to the FormGenerator component, and use the onChange/onSubmit methods to read the parsed payload from the form. Information on additional <a href="#component-api">props</a> can be found below.

### Ex:
```javascript
import FormGenerator from 'complex-form-generator'

// optional type specification
type MyPayloadType = {
  name: string
  age: number
  address: {
    city: string
    state: string
  }
  hobbies: {
    name: string
    years: number
  }[]
}

const SEED: Seed = {
  name: 'John',
  age: 30,
  address: { city: 'Anytown', state: 'NY' },
  hobbies: [{ name: 'Music', years: 14 }],
}

const App = () => {
  return (
    <FormGenerator<MyPayloadType>
      seed={SEED}
      onChange={(payload) => console.log('onChange', payload)}
      onSubmit={(payload) => console.log('onSubmit', payload)}
    />
  )
}
```


## Seed API

### Primitive values
The primitive values supported are strings, numbers, and booleans. They each respectively render text inputs, number inputs, and checkboxes.
#### Ex:
```javascript
{
  stringInput: 'a string',
  numberInput: 50,
  booleanInput: true,
}
```
<br>

### Object values
The object values supported are standard JS objects, and arrays. Object values can be any Seed object. Object values render the keyname as a heading and its contents as its own seed. For arrays, additional buttons are rendered to add and remove items to the list - only the first document of the array is used as the template for added items. It is recommended to just supply a single element for arrays, unless you need additional, one-off elements with different inputs. Currently, primitive values in arrays are not supported.
#### Ex:
```javascript
{
  objectValue: {
    first: '',
    second: 96,
    third: {
      nested: true,
      thanks: "you're welcome",
    },
  },
  arrayValue: [
    {
      key1: 'a default value',
      key2: 24,
      key3: false,
      key4: { an: 'object' }
    },
  ],
}
```
<br>

### Keywords
For form input types that are more complex than the simple string, number, and boolean inputs, you can use a supported keyword, prefixed with '$', to render a specific input type. To use a keyword, simply specify the keyword in place of the keyname(s) you want to customize. 
#### Ex:
```javascript
{ keyName: value } -> { $keyWord: { keyName: _keywordValue, ...otherKeyNames } }
```

Currently, the following keywords are available to provide support for more specific or complex input types. They each have a unique value type to specify all the data required to configure the input. 

<br>

#### `$useTextArea`
Render a textarea input.
##### Spec type:
```javascript
string
```
##### Ex:
```javascript
{ 
  $useTextArea: { keyName: '' },
}
```
<br>

#### `$useDateArea`
Render a date input. Default values must be in ISO 8601 - any other string will not be rendered in the input and will be overwritten in ISO 8601 on change.
##### Spec type:
```javascript
string
```
##### Ex:
```javascript
{ 
  $useDateArea: { keyName: '' },
}
```
<br>

#### `$useCodeArea`
Render a code editor. It uses Monaco Editor React, you can read their docs <a href="https://www.npmjs.com/package/@monaco-editor/react" target="_blank" referrerPolicy="no-referrer">here</a>. You will need to import it yourself if supply it to the `_instance` field.
##### Spec type:
```javascript
{ 
  $useCodeArea: {
    _value: string,
    _language: MonacoLanguages
    _instance: MemoExoticComponent<(props: EditorProps) => JSX.Element>
  }
}
```
##### Ex:
```javascript
import Editor from '@monaco-editor/react'

{ 
  $useCodeArea: {
    codeArea: {
      _value: `list = [1, 2, 3]
for e in list:
    print(e)`,
      _language: 'python',
      _instance: Editor
    },
  },
}
```
<br>

#### `$useSelectOptions`
Render a select tag with options. Each option has optional parameters to specify a different label and provide any additional payload items when that option is selected. Default values can be a string, which renders a standard single-option select and associated payloads one-at-a-time, or an array of strings, which renders a multi-option select and associated payloads stacked in order. If an empty default value is supplied or does not match any of the option values supplied, it will be replaced by the first option value.
##### Spec type:
```javascript
{
  _defaultValue: string | string[]
  _options: {
    _value: string
    _label?: string
    _assocPayload?: Seed
  }[]
}
```
##### Ex:
```javascript
{
  selectOptions: {
    _defaultValue: 'option2',
    _options: [
      { _value: 'option1', _label: 'A custom option label' },
      { _value: 'option2' },
      {
        _value: 'option3',
        _assocPayload: {
          keep: 'nesting',
          excitement: 100,
          $useDateArea: { today: '' },
        },
      },
    ],
  },
}
```

## Component API
To use the FormGenerator component, simply provide the required seed obejct prop. To use the payload that is parsed from the form input, use the 

### Props
<table>
  <thead>
    <tr>
      <th>Name</th>
      <th>Type</th>
      <th>Default Value</th>
      <th>Description</th>
    </tr>
  </thead>

  <tbody>
    <tr>
      <td>&lt;T&gt;</td>
      <td><code>T extends Record&lt;string, any&gt;</code></td>
      <td>any</td>
      <td>A an optional type definition provided by you to compile a specific type for your payload.</td>
    </tr>
    <tr>
      <td>seed</td>
      <td><code>Seed</code></td>
      <td></td>
      <td>The <a href="#creating-a-seed-object">Seed object</a> of the form to be generated.</td>
    </tr>
    <tr>
      <td>formId</td>
      <td><code>string</code></td>
      <td></td>
      <td>An optional <code>id</code> attribute for the generated form.</td>
    </tr>
    <tr>
      <td>onChange</td>
      <td><code>(payload: T) => void</code></td>
      <td></td>
      <td>A callback that is supplied with the latest state of the payload and is fired every time any value in the form changes.</td>
    </tr>
    <tr>
      <td>onSubmit</td>
      <td><code>(payload: T) => void</code></td>
      <td></td>
      <td>A callback that is supplied with the latest state of the payload and is fired when the form is submitted. Using this prop also renders an additional submit button at the bottom of the form.</td>
    </tr>
    <tr>
      <td>suppressStyles</td>
      <td><code>boolean</code></td>
      <td>false</td>
      <td>Suppresses all styles applied to the form. Disables following props as they will have no effect.</td>
    </tr>
    <tr>
      <td>floatingLabels</td>
      <td><code>boolean</code></td>
      <td>false</td>
      <td>Enables Bootstrap's floating labels for each input instead of a standard label/input setup.</td>
    </tr>
    <tr>
      <td>groupNestedChildren</td>
      <td><code>boolean</code></td>
      <td>false</td>
      <td>Visually groups all nested objects with a card outline. This applies to JS object values, array values, and select values if any option has an associated payload.</td>
    </tr>
  </tbody>
</table>

## Contribution
Feedback and contribution of any kind is greatly appreciated! If you would like to contribute, please follow these steps:
1. Fork it!
2. Create your feature branch: <code>git checkout -b my-new-feature</code>
3. Add your changes: <code>git add .</code>
4. Commit your changes: git <code>commit -m 'Add some feature'</code>
5. Push the branch: <code>git push origin my-new-feature</code>
6. Submit a pull request

## Authors
- Ron Gorai - <a href="https://github.com/rgorai" target="_blank" referrerPolicy="no-referrer">rgorai</a>: Initial version

## Future releases

- Input validation
- Primitive value array support
- CSS classname API for custom styles
