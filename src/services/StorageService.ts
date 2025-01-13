import { Habit, HabitEntry, HabitCompletion } from '../types/Habit'
import { startOfDay } from 'date-fns'

interface Location {
  latitude: number
  longitude: number
}

const STORAGE_KEYS = {
  NICKNAME: 'habit-tracker-nickname',
  HABITS: 'habit-tracker-habits',
  ENTRIES: 'habit-tracker-entries',
  COMPLETIONS: 'habit-tracker-completions',
  LOCATION: 'habit-tracker-location',
}

export class StorageService {
  static setNickname(nickname: string): void {
    localStorage.setItem(STORAGE_KEYS.NICKNAME, nickname)
  }

  static getNickname(): string | null {
    return localStorage.getItem(STORAGE_KEYS.NICKNAME)
  }

  static saveHabits(habits: Habit[]): void {
    localStorage.setItem(STORAGE_KEYS.HABITS, JSON.stringify(habits))
  }

  static getHabits(): Habit[] {
    const habits = localStorage.getItem(STORAGE_KEYS.HABITS)
    return habits ? JSON.parse(habits) : []
  }

  static saveEntries(entries: HabitEntry[]): void {
    localStorage.setItem(STORAGE_KEYS.ENTRIES, JSON.stringify(entries))
  }

  static getEntries(): HabitEntry[] {
    const entries = localStorage.getItem(STORAGE_KEYS.ENTRIES)
    return entries ? JSON.parse(entries) : []
  }

  static exportData(): string {
    const data = {
      habits: this.getHabits(),
      entries: this.getEntries(),
    }
    return JSON.stringify(data)
  }

  static importData(jsonData: string): void {
    const data = JSON.parse(jsonData)
    this.saveHabits(data.habits)
    this.saveEntries(data.entries)
  }

  static clearAll(): void {
    localStorage.clear()
  }

  static saveCompletions(completions: HabitCompletion[]): void {
    localStorage.setItem(STORAGE_KEYS.COMPLETIONS, JSON.stringify(completions))
  }

  static getCompletions(): HabitCompletion[] {
    const completions = localStorage.getItem(STORAGE_KEYS.COMPLETIONS)
    return completions ? JSON.parse(completions) : []
  }

  static getTodayCompletions(): Set<string> {
    const today = startOfDay(new Date()).toISOString()
    const completions = this.getCompletions()
    const todayCompletions = completions.filter(c => 
      startOfDay(new Date(c.date)).toISOString() === today
    )
    return new Set(todayCompletions.map(c => c.habitId))
  }

  static saveLocation(location: Location): void {
    localStorage.setItem(STORAGE_KEYS.LOCATION, JSON.stringify(location))
  }

  static getLocation(): Location | null {
    const location = localStorage.getItem(STORAGE_KEYS.LOCATION)
    return location ? JSON.parse(location) : null
  }
} 