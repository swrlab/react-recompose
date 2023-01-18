import { createElement } from 'react'
import omit from './utils/omit'

const componentFromProp = (propName) => {
  function Component(props) {
    return createElement(props[propName], omit(props, [propName]))
  }
  Component.displayName = `componentFromProp(${propName})`
  return Component
}

export default componentFromProp
