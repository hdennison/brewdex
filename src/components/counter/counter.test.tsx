import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import '@testing-library/jest-dom'
import { getByText, queryByText } from '@testing-library/dom'
import { CounterDisplay } from './counter'
import { Store } from '@/lib/store/store'

describe('CounterDisplay (using Testing Library DOM)', () => {
  let store: Store<number>
  let container: HTMLElement

  beforeEach(() => {
    store = new Store<number>([0])
    container = document.createElement('div')
    document.body.appendChild(container)
  })

  afterEach(() => {
    container.remove()
  })

  it('renders the initial count', () => {
    const comp = new CounterDisplay({ store })
    comp.mount(container)

    const el = getByText(container, 'Count: 0')
    expect(el).toBeInTheDocument()
    expect(el).toHaveTextContent('Count: 0')
  })

  it('updates when the store changes', () => {
    const comp = new CounterDisplay({ store })
    comp.mount(container)

    // initial
    expect(getByText(container, 'Count: 0')).toBeInTheDocument()

    // update to 5
    store.set([5])
    expect(getByText(container, 'Count: 5')).toBeInTheDocument()

    // update to 42
    store.set([42])
    expect(getByText(container, 'Count: 42')).toBeInTheDocument()
  })

  it('replaces the old count rather than appending', () => {
    const comp = new CounterDisplay({ store })
    comp.mount(container)

    // initial is "Count: 0"
    expect(queryByText(container, 'Count: 0')).toBeInTheDocument()

    // update to 1
    store.set([1])
    expect(queryByText(container, 'Count: 0')).not.toBeInTheDocument()
    expect(queryByText(container, 'Count: 1')).toBeInTheDocument()
  })

  it('supports multiple successive updates', () => {
    const comp = new CounterDisplay({ store })
    comp.mount(container)

    for (const n of [7, 8, 9]) {
      store.set([n])
      const node = getByText(container, `Count: ${n}`)
      expect(node).toBeInTheDocument()
      expect(node).toHaveTextContent(`Count: ${n}`)
    }
  })
})
