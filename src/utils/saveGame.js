const STORAGE_KEY = 'american-dream-trader'

export class SaveGameManager {
  constructor(storage = window?.localStorage) {
    this.storage = storage
  }

  save(slot = 'auto', payload = {}) {
    if (!this.storage) {
      return { success: false, error: 'Storage unavailable' }
    }

    try {
      const data = {
        version: '0.1.0',
        slot,
        timestamp: Date.now(),
        payload,
      }

      this.storage.setItem(`${STORAGE_KEY}:${slot}`, JSON.stringify(data))
      return { success: true }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  load(slot = 'auto') {
    if (!this.storage) {
      return { success: false, error: 'Storage unavailable' }
    }

    const raw = this.storage.getItem(`${STORAGE_KEY}:${slot}`)
    if (!raw) {
      return { success: false, error: 'Save not found' }
    }

    try {
      const data = JSON.parse(raw)
      return { success: true, data }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  listSaves() {
    if (!this.storage) return []

    const saves = []
    for (let i = 0; i < this.storage.length; i += 1) {
      const key = this.storage.key(i)
      if (!key || !key.startsWith(STORAGE_KEY)) continue

      const raw = this.storage.getItem(key)
      if (!raw) continue

      try {
        const data = JSON.parse(raw)
        saves.push({ slot: data.slot, timestamp: data.timestamp })
      } catch (error) {
        console.warn('Failed to parse save', error)
      }
    }

    return saves.sort((a, b) => b.timestamp - a.timestamp)
  }
}

export const saveGameManager = new SaveGameManager(typeof window !== 'undefined' ? window.localStorage : undefined)
