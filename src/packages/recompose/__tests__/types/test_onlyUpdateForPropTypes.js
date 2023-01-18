/* eslint-disable no-unused-vars, no-unused-expressions */
/* @flow */
import React from 'react'
import { compose, withProps, onlyUpdateForPropTypes } from '../..'

import type { HOC } from '../..'

type EnhancedCompProps = { eA: 1 }

// $FlowFixMe[missing-local-annot] - Missing type on destructuring
const Comp = ({ eA }) => (
  <div>
    {(eA: number)}
    {
      // $FlowExpectedError (...) - eA nor any nor string
      (eA: string)
    }
  </div>
)

const enhacer: HOC<*, EnhancedCompProps> = compose(
  onlyUpdateForPropTypes,
  withProps((props) => ({
    eA: (props.eA: number),
    // $FlowExpectedError (...) - eA nor any nor string
    eAErr: (props.eA: string),
  })),
  withProps((props) => ({
    // $FlowExpectedError (...) - property not found
    err: props.iMNotExists,
  }))
)

const EnhancedComponent = enhacer(Comp)
