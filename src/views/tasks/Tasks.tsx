import TaskList from "./task-components/task-list"

export default function Tasks() {
  return (
    <main className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Tasks</h1>
      <TaskList />
    </main>
  )
}

