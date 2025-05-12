import { NotificationStore } from '@/modules/notification/notification.store'
import { describe, it, expect, beforeEach } from 'vitest'
import { Counter } from './counter'

describe('Counter', () => {
  let store: NotificationStore
  let container: HTMLElement

  beforeEach(() => {
    // start each test with a fresh store and container
    store = new NotificationStore([])
    container = document.createElement('div')
  })

  it('mounts into a <span> and shows the initial count', () => {
    const counter = new Counter(store)
    counter.mount(container)

    const span = container.querySelector('span')
    expect(span).toBeTruthy()
    // initial store is empty → “0”
    expect(span!.textContent).toBe('0')
  })

  it('updates its displayed value when the store changes', () => {
    const counter = new Counter(store)
    counter.mount(container)

    // no notifications yet
    expect(container.textContent).toBe('0')

    // push one notification → count should become “1”
    store.push({} as any)
    expect(container.textContent).toBe('1')

    // push another → “2”
    store.push({} as any)
    expect(container.textContent).toBe('2')
  })
})
