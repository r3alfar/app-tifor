import { z } from "zod"

export const taskSchema = z.object({
  id: z.string(),
  categories: z.string(),
  description: z.string(),
  status: z.string(),
  priority: z.string(),
  schedule: z.string(),
  location: z.string(),
  // timetsamp: z.string(),
  // attachment_url: z.string(),
  // employee_id: z.string(),
})

export type Task = z.infer<typeof taskSchema>
