import React from 'react'
import { CallbackOnChangeLoader } from './CallbackOnChangeLoader'
import { CallbackLoaderInputState } from './types'
import { render, fireEvent, waitFor, screen, findByTestId, getByText, prettyDOM, act, cleanup } from '@testing-library/react'
import { TextField } from '@material-ui/core'
import { isEmptyBindingElement } from 'typescript'
import userEvent from '@testing-library/user-event'
import "@testing-library/jest-dom/extend-expect"

describe("CallbackInputLoader simple input render.", () => {
  beforeEach(() => {
    cleanup
  })
  it("Match snapshot with initial render.", () => {
    const successCallback = () => {
      return new Promise<CallbackLoaderInputState>((res, rej) => {
        res({ error: false, helperText: "" })
      })
    }
    const failureCallback = () => {
      return new Promise((res, rej) => {
        console.log("Should never get here")
      })
    }
    const { container } = render(<CallbackOnChangeLoader callback={successCallback} failureCallback={failureCallback}>
      <TextField id="id-input" />
    </CallbackOnChangeLoader>)
    const rElement = container.firstChild
    expect(rElement).toMatchSnapshot()
  })
  it("With callback called should return no error on input.", async () => {

    const successCallback = () => {
      return new Promise<CallbackLoaderInputState>((res, rej) => {
        res({ error: false, helperText: "" })
      })
    }
    const failureCallback = () => {
      return new Promise((res, rej) => {
        console.log("Should never get here")
      })
    }

     const { container } =  render(<CallbackOnChangeLoader callback={successCallback} failureCallback={failureCallback}>
        <TextField id="id-input" />
      </CallbackOnChangeLoader>)



    const input = container.querySelector('#id-input')


    expect(input).not.toBeNull()

    if (input === null) {
      throw Error("input is null")
    }
    act(() => {
      userEvent.type(input, 'Username')
    })

    await waitFor(()=>{
      const helperText = container.querySelector('#id-input-helper-text')
      expect(helperText).toBeNull()
    })


  })
  it("Helper text appears.", async () => {
    jest.setTimeout(4000)
    const errorText = "This is error text."
    const Input = () => <TextField id="id-input" />
    const successCallback = () => {
      return new Promise<CallbackLoaderInputState>((res, rej) => {
        res({ error: true, helperText: errorText })
      })
    }
    const failureCallback = () => {
      return new Promise((res, rej) => {
        console.log("Should never get here")
      })
    }
    var container: Element | DocumentFragment
    const result = render(<CallbackOnChangeLoader callback={successCallback} failureCallback={failureCallback}>
      <Input />
    </CallbackOnChangeLoader>)
    container = result.container



    const input = container.querySelector('#id-input') as HTMLInputElement

    expect(input).not.toBeNull()

    if (input === null) {
      fail("input is null")
    }

    const typeToInput = "UsernameFailed"

    userEvent.type(input, typeToInput)

    expect(input.value).toEqual(typeToInput)

    function checkValueAfterTime() {
      return new Promise((res) => {
        setTimeout(() => {

          const helperText = container.querySelector('#id-input-text-helper')
          if (helperText === null) {
            fail('helperText is null.')
          }

          expect(helperText).toBeInTheDocument()
          res("")
        }, 1000)
      })
    }
    await checkValueAfterTime()

  })

  it("Succes callback called once .", async () => {
    jest.setTimeout(4000)
    const errorText = "This is error text."
    const Input = () => <TextField id="id-input" />
    const mockSuccessCallback = jest.fn(() => {
      return new Promise<CallbackLoaderInputState>((res, rej) => {
        res({ error: false, helperText: errorText })
      })
    })
    const mockFailureCallback = jest.fn(() => {
      return new Promise((res, rej) => {
        console.log("Should never get here")
      })
    })
    const { container } = render(<CallbackOnChangeLoader callback={mockSuccessCallback} failureCallback={mockFailureCallback}>
      <Input />
    </CallbackOnChangeLoader>)

    const input = container.querySelector('#id-input') as HTMLInputElement

    expect(input).not.toBeNull()

    function checkForCallbacksToBeZero() {
      return new Promise((res) => {
        setTimeout(() => {
          expect(mockSuccessCallback.mock.calls.length).toBe(0)
          console.log(mockSuccessCallback.mock.calls.length)
          expect(mockFailureCallback.mock.calls.length).toBe(0)
          res("")
        }, 500)
      })
    }

    await checkForCallbacksToBeZero()

    act(() => { userEvent.type(input, 'Input-Value') })


    function checkForCallbacksToBeOneZero() {
      return new Promise((res) => {
        setTimeout(() => {
          expect(mockSuccessCallback.mock.calls.length).toBe(1)
          console.log(mockSuccessCallback.mock.calls.length)
          expect(mockFailureCallback.mock.calls.length).toBe(0)
          res("")
        }, 500)
      })
    }

    //await checkForCallbacksToBeOneZero()
    await waitFor(()=>{
      expect(mockSuccessCallback.mock.calls.length).toBe(1)
      console.log(mockSuccessCallback.mock.calls.length)
      expect(mockFailureCallback.mock.calls.length).toBe(0)
    })
  })
})