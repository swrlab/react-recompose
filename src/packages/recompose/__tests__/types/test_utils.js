/* eslint-disable no-unused-vars, no-unused-expressions, arrow-body-style */
/* @flow */

import React from 'react'
import { compose, withProps, hoistStatics } from '../..'

import type { HOC } from '../..'

type EnhancedCompProps = { a: number }

// $FlowFixMe[missing-local-annot] - Missing type on destructuring
const A = ({ a, b }) => (
  <div>
    {a}
    {(b: string)}
    {
      // $FlowExpectedError (...)
      (a: string)
    }
    {
      // $FlowExpectedError (...)
      (b: number)
    }
  </div>
)

A.displayName = 'HELLO WORLD'

const enhacer: HOC<*, EnhancedCompProps> = compose(
  withProps(({ a }) => ({
    hello: a,
    b: `${a}`,
  }))
)

hoistStatics(enhacer)(A)

// I see no reason to test other utils, please add if you think otherwise
