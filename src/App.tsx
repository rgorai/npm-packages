// import FormGenerator from 'complex-form-generator'
import { useRef, useState } from 'react'
import JSONPretty from 'react-json-pretty'
import FormGenerator from './complex-form-generator/src/FormGenerator'

// const TEST_SEED1: Seed = {
//   title: '',
//   subtitle: '',
//   disableOnSubmit: false,
//   class: '',
//   actions: [
//     {
//       label: '',
//       params: '',
//       disableOnSubmit: false,
//       type: {
//         $useSelectOptions: [
//           {
//             _option: 'button',
//           },
//           {
//             _option: 'link',
//             _assocPayload: {
//               disableForm: false,
//               url: '',
//               target: {
//                 $useSelectOptions: [
//                   { _option: '_blank' },
//                   { _option: '_self' },
//                   { _option: '_parent' },
//                 ],
//               },
//             },
//           },
//         ],
//       },
//     },
//   ],
//   inputs: [
//     {
//       icon: { sfIcon: '', src: '', alt: '' },
//       label: '',
//       placeholder: '',
//       value: '',
//       fApi: '',
//       validateOn: {
//         $useSelectOptions: [{ _option: 'blur' }, { _option: 'input' }],
//       },
//       isRequired: false,
//       minLength: '',
//       maxLength: '',
//     },
//   ],
//   submission: { server: '*', browser: '*' },
// }

const TEST_SEED: Seed = {
  title: '',
  // subtitle: '',
  // disableOnSubmit: false,
  // class: '',
  $useTextArea: { hello: '', again: '' },
  $noKey: 'A TEST',
  actions: [
    // { $noKey: 'testing' },
    {
      label: '',
      params: '',
      disableOnSubmit: false,
      $useSelectOptions: {
        type: [
          {
            _option: 'button',
          },
          {
            _option: 'link',
            _assocPayload: {
              disableForm: false,
              url: '',
              $useSelectOptions: {
                target: [
                  { _option: '_blank' },
                  { _option: '_self' },
                  { _option: '_parent' },
                ],
                testing: [
                  {
                    _option: 'hello',
                    _assocPayload: { hello: '', hi: 'hi' },
                  },
                  {
                    _option: 'hahaha',
                    _assocPayload: { haha: '', lol: 'hahahaha' },
                  },
                ],
              },
            },
          },
        ],
      },
    },
  ],
}

const App = () => {
  const [payload, setPayload] = useState({})

  return (
    <div className="App">
      <div className="component-wrapper">
        <div style={{ width: '20em' }}>
          <FormGenerator seed={TEST_SEED} setPayload={setPayload} />
        </div>

        <JSONPretty data={payload} />
      </div>
    </div>
  )
}

export default App
