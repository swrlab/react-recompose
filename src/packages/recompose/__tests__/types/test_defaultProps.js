/* eslint-disable no-unused-vars, no-unused-expressions */
/* @flow */
import React from 'react'
import { compose, withProps, defaultProps } from '../..'

import type { HOC } from '../..'

type EnhancedCompProps = { eA: 1 }

// $FlowFixMe[missing-local-annot] - Missing type on destructuring
const Comp = ({ hello, eA }) => (
  <div>
    {(hello: string)}
    {(eA: number)}
    {
      // $FlowExpectedError (...) - eA nor any nor string
      (eA: string)
    }
    {
      // $FlowExpectedError (...) - hello nor any nor number
      (hello: number)
    }
  </div>
)

const enhacer: HOC<*, EnhancedCompProps> = compose(
  defaultProps({
    hello: 'world',
  }),
  withProps((props) => ({
    hello: (props.hello: string),
    eA: (props.eA: number),
    // $FlowExpectedError (...) - hello nor any nor number
    helloErr: (props.hello: number),
    // $FlowExpectedError (...) - eA nor any nor string
    eAErr: (props.eA: string),
  })),
  withProps((props) => ({
    // $FlowExpectedError (...) - property not found
    err: props.iMNotExists,
  }))
)

const EnhancedComponent = enhacer(Comp)
