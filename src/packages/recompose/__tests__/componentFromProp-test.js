import React from 'react'
import { mount } from 'enzyme'
import { componentFromProp } from '../'

test('componentFromProp creates a component that takes a component as a prop and renders it with the rest of the props', () => {
  const Container = componentFromProp('component')
  expect(Container.displayName).toBe('componentFromProp(component)')

  function Component({ pass }) {
    return <div>Pass: {pass}</div>
  }

  // eslint-disable-next-line react/jsx-no-bind
  const wrapper = mount(<Container component={Component} pass="through" />)
  const div = wrapper.find('div')
  expect(div.text()).toBe('Pass: through')
})
