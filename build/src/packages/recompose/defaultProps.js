import createFactory from './utils/createFactory'
import setDisplayName from './setDisplayName'
import wrapDisplayName from './wrapDisplayName'

const defaultProps = (props) => (BaseComponent) => {
  const factory = createFactory(BaseComponent)
  function DefaultProps(ownerProps) {
    return factory(ownerProps)
  }
  DefaultProps.defaultProps = props
  if (process.env.NODE_ENV !== 'production') {
    return setDisplayName(wrapDisplayName(BaseComponent, 'defaultProps'))(
      DefaultProps
    )
  }
  return DefaultProps
}

export default defaultProps
