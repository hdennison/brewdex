
import { describe, it, expect, beforeEach, vi } from 'vitest'
import type { AppNotification } from '@/modules/notification/types'
import { NotificationSubscription } from '@/modules/notification/notification'
import styles from '../../home.module.css'
import { Notifications, NotificationsClass } from './notifications'

let subscriptionHandlers: {
  onMessage: (msg: AppNotification) => void
  onClose: (e: { code: number }) => void
  onError: (err: any) => void
}

// mock out the real WS subscription
vi.mock('@/modules/notification/notification', () => ({
  NotificationSubscription: vi
    .fn()
    .mockImplementation((handlers: typeof subscriptionHandlers) => {
      subscriptionHandlers = handlers
    }),
}))

describe('Notifications (integration)', () => {
  let host: HTMLElement

  beforeEach(() => {
    vi.clearAllMocks()
    host = document.createElement('div')
    host.appendChild(Notifications())
  })

  it('starts hidden (no .notificationsContentVisible) and badge=0', () => {
    const content = host.querySelector(`.${styles.notificationsContent}`)!
    expect(content.classList.contains(styles.notificationsContentVisible)).toBe(false)

    const badge = host.querySelector('#notifications-count')!
    expect(badge.textContent).toBe('0')
  })

  it('registers exactly one NotificationSubscription', () => {
    expect(NotificationSubscription).toHaveBeenCalledTimes(1)
    expect(typeof subscriptionHandlers.onMessage).toBe('function')
    expect(typeof subscriptionHandlers.onClose).toBe('function')
    expect(typeof subscriptionHandlers.onError).toBe('function')
  })

  it('onMessage increments the badge and shows the content', () => {
    const content = host.querySelector(`.${styles.notificationsContent}`)!
    const badge = host.querySelector('#notifications-count')!

    subscriptionHandlers.onMessage({} as AppNotification)
    expect(badge.textContent).toBe('1')
    expect(content.classList.contains(styles.notificationsContentVisible)).toBe(true)

    subscriptionHandlers.onMessage({} as AppNotification)
    expect(badge.textContent).toBe('2')
  })

  it('onClose handler logs to console', () => {
    const logSpy = vi.spyOn(console, 'log')
    subscriptionHandlers.onClose({ code: 1234 })
    expect(logSpy).toHaveBeenCalledWith('Notifications WS closed:', 1234)
    logSpy.mockRestore()
  })

  it('onError handler logs to console.error', () => {
    const errorSpy = vi.spyOn(console, 'error')
    const err = new Error('test failure')
    subscriptionHandlers.onError(err)
    expect(errorSpy).toHaveBeenCalledWith('Notifications WS error:', err)
    errorSpy.mockRestore()
  })
})

describe('NotificationsClass (unit)', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('render() returns this.root', () => {
    const inst = new NotificationsClass()
    expect(inst.render()).toBe((inst as any).root)
  })

  it('update() is a no-op (does not throw)', () => {
    const inst = new NotificationsClass()
    expect(() => inst.update()).not.toThrow()
  })
})
