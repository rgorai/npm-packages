// import FormGenerator from 'complex-form-generator'
import { useState } from 'react'
import JSONPretty from 'react-json-pretty'
import jsonPrettyStyle from 'react-json-pretty/dist/1337'
import FormGenerator from './complex-form-generator/src/FormGenerator'

const TEST_SEED: Seed = {
  title: '',
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
            _defaultOption: true,
            _assocPayload: {
              disableForm: false,
              url: '',
              $useCodeArea: {
                lol: {
                  _value: '',
                  _language: 'java',
                },
              },
              listOfSelect: [
                {
                  $useSelectOptions: {
                    target: [
                      { _option: '_blank' },
                      { _option: '_self' },
                      { _option: '_parent' },
                    ],
                    testing: [
                      {
                        _option: 'hello',
                        // _assocPayload: { hello: '', hi: 'hi' },
                      },
                      {
                        _option: 'hahaha',
                        _assocPayload: { haha: '', lol: 'hahahaha' },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
        anotherOne: [{ _option: 'hello' }, { _option: 'hello again' }],
      },
    },
  ],
  moreStuffAfter: '',
}

const App = () => {
  const [payload, setPayload] = useState({})

  return (
    <div className="App">
      <div className="component-wrapper">
        <div style={{ width: '20em' }}>
          <FormGenerator
            seed={TEST_SEED}
            // onChange={(payload) => setPayload(payload)}
            onSubmit={(payload) => setPayload(payload)}
          />
        </div>

        <div style={{ position: 'sticky', top: '3em' }}>
          <JSONPretty data={payload} theme={jsonPrettyStyle} />
        </div>
      </div>
    </div>
  )
}

export default App
