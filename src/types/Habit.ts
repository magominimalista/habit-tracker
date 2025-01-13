import { z } from 'zod'

export const HabitSchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'Nome é obrigatório'),
  description: z.string().optional(),
  color: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/),
  createdAt: z.date(),
  totalCompletions: z.number().default(0),
})

export type Habit = z.infer<typeof HabitSchema>

export const HabitEntrySchema = z.object({
  id: z.string(),
  habitId: z.string(),
  date: z.date(),
  completed: z.boolean(),
})

export type HabitEntry = z.infer<typeof HabitEntrySchema>

export interface HabitCompletion {
  habitId: string
  date: string // ISO string
} 