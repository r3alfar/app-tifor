import fs from "fs"
import path from "path"
import { faker } from "@faker-js/faker"

import { categories, priorities, statuses } from "./tasks.data"

const tasks = Array.from({ length: 100 }, () => ({
  id: `TASK-${faker.number.int({ min: 1000, max: 9999 })}`,
  description: faker.hacker.phrase().replace(/^./, (letter) => letter.toUpperCase()),
  status: faker.helpers.arrayElement(statuses).value,
  categories: faker.helpers.arrayElement(categories).value,
  priority: faker.helpers.arrayElement(priorities).value,
  location: faker.location.city(),
  schedule: faker.date.soon().toISOString(),
  // employee_id: faker.string.uuid(),
}))

fs.writeFileSync(
  path.join(__dirname, "myTasks.json"),
  JSON.stringify(tasks, null, 2)
)

console.log("✅ Tasks data generated.")
