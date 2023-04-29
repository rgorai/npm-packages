# Complex Form Generator

This package allows you to generate a form with a special seed object in React based on a complex JS object that you need user input for. Object keys of the seed are used as input labels, and each key's value is used to infer the type of input. This means strings, numbers, booleans, nested objects, and certain configurations of nested Arrays are fair game as object value types. Apart from these, there is a seed API to support a handful of custom input types. It also ships with Bootstrap 5, and a CSS API to provide your own styles.

--table of contents?--

## Prequisites
Since this is a React component, you will need `"react": ">=18"`. If you want to use the shipped styles, you will need `"bootstrap": ">=5"`.

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
To create a seed object, simply start with the default state of the payload you need. Take this rather simple payload for example:
```
{
  name: "John",
  age: 30,
  hobbies: ["reading", "cooking", "hiking"],
  address: {
    street: "123 Main St",
    city: "Anytown",
    state: "CA",
    zip: "12345"
  },
  friends: [
    {
      name: "Mary",
      age: 28,
      hobbies: ["running", "yoga"],
      address: {
        street: "456 Elm St",
        city: "Othertown",
        state: "NY",
        zip: "67890"
      }
    }
  ]
}
```
