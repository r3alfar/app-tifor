
import type React from "react"

import { useState, useEffect, useRef } from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { CalendarDateIcon } from "./calendar-icon"
import { Button } from "@/components/ui/button"
import { Edit, ChevronDown, List, BarChart, Calendar, Paperclip } from "lucide-react"

import { useNavigate } from "react-router-dom"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { toast } from "@/hooks/use-toast"
import TaskFilters, { type TaskFilters as TaskFiltersType } from "./task-filters"
import TaskSummary from "./task-summary"
import TaskWeeklySummary from "./task-weekly-summary"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Attachment type
export type Attachment = {
  id: string
  name: string
  type: string
  url: string
  size: number
  createdAt: Date
}

// Update the Task type definition to include attachments
export type Task = {
  id: number
  title: string
  description: string
  status: "pending" | "in-progress" | "completed" | "cancelled"
  priority: "low" | "medium" | "high"
  category: "work" | "personal" | "shopping" | "health" | "finance"
  date: Date
  attachments: Attachment[]
}

// Helper function to get month abbreviation
const getMonthAbbreviation = (date: Date): string => {
  return date.toLocaleString("default", { month: "short" })
}

// Helper function to generate a random attachment
const generateRandomAttachment = (): Attachment => {
  const fileTypes = ["pdf", "docx", "jpg", "png", "xlsx"]
  const fileNames = [
    "Project_Brief",
    "Meeting_Notes",
    "Screenshot",
    "Invoice",
    "Report",
    "Presentation",
    "Contract",
    "Receipt",
    "Proposal",
    "Diagram",
  ]

  const type = fileTypes[Math.floor(Math.random() * fileTypes.length)]
  const name = `${fileNames[Math.floor(Math.random() * fileNames.length)]}.${type}`
  const id = Math.random().toString(36).substring(2, 15)

  return {
    id,
    name,
    type,
    url: `/placeholder-file/${id}/${name}`,
    size: Math.floor(Math.random() * 5000000) + 10000, // Random size between 10KB and 5MB
    createdAt: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000),
  }
}

// Update the mock function to fetch tasks with attachments
const fetchTasks = (page: number, limit: number): Promise<Task[]> => {
  return new Promise((resolve) => {
    // Simulate API delay
    setTimeout(() => {
      const statuses = ["pending", "in-progress", "completed", "cancelled"]
      const priorities = ["low", "medium", "high"]
      const categories = ["work", "personal", "shopping", "health", "finance"]

      const newTasks: Task[] = Array.from({ length: limit }).map((_, index) => {
        // Generate a random date within the next 6 months (including past months)
        const randomDaysToAdd = Math.floor(Math.random() * 180) - 90
        const taskDate = new Date()
        taskDate.setDate(taskDate.getDate() + randomDaysToAdd)

        // Randomly decide if this task has attachments (30% chance)
        const hasAttachments = Math.random() < 0.3
        const attachmentsCount = hasAttachments ? Math.floor(Math.random() * 3) + 1 : 0
        const attachments = Array.from({ length: attachmentsCount }).map(() => generateRandomAttachment())

        return {
          id: page * limit + index,
          title: `Task ${page * limit + index + 1}`,
          description: `This is the description for task ${page * limit + index + 1}. It contains details about what needs to be done.`,
          status: statuses[Math.floor(Math.random() * statuses.length)] as
            | "pending"
            | "in-progress"
            | "completed"
            | "cancelled",
          priority: priorities[Math.floor(Math.random() * priorities.length)] as "low" | "medium" | "high",
          category: categories[Math.floor(Math.random() * categories.length)] as
            | "work"
            | "personal"
            | "shopping"
            | "health"
            | "finance",
          date: taskDate,
          attachments,
        }
      })
      resolve(newTasks)
    }, 800)
  })
}

// Add a function to update task status
const updateTaskStatus = (taskId: number, newStatus: string): Promise<void> => {
  return new Promise((resolve) => {
    // Simulate API delay
    setTimeout(() => {
      resolve()
    }, 300)
  })
}

// Add a function to handle status change
const handleStatusChange = async (
  taskId: number,
  newStatus: string,
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>,
) => {
  try {
    await updateTaskStatus(taskId, newStatus)

    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId
          ? { ...task, status: newStatus as "pending" | "in-progress" | "completed" | "cancelled" }
          : task,
      ),
    )

    toast({
      title: "Status Updated",
      description: `Task status changed to ${newStatus}`,
    })
  } catch (error) {
    console.error("Error updating task status:", error)
    toast({
      title: "Error",
      description: "Failed to update task status",
      variant: "destructive",
    })
  }
}

export default function TaskList() {
    // const {toast} = useToast()
  const navigate = useNavigate()
  const [tasks, setTasks] = useState<Task[]>([])
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([])
  const [page, setPage] = useState(0)
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const loaderRef = useRef<HTMLDivElement>(null)
  const limit = 10
  const [activeView, setActiveView] = useState<string>("list")

  // Add filter state
  const [filters, setFilters] = useState<TaskFiltersType>({
    status: [],
    priority: [],
    category: [],
    dateFrom: undefined,
    dateTo: undefined,
  })

  // Load initial tasks
  useEffect(() => {
    loadMoreTasks()
  }, [])

  // Apply filters whenever tasks or filters change
  useEffect(() => {
    applyFilters()
  }, [tasks, filters])

  // Set up intersection observer for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0]
        if (target.isIntersecting && hasMore && !loading && activeView === "list") {
          loadMoreTasks()
        }
      },
      { threshold: 0.1 },
    )

    if (loaderRef.current) {
      observer.observe(loaderRef.current)
    }

    return () => {
      if (loaderRef.current) {
        observer.unobserve(loaderRef.current)
      }
    }
  }, [hasMore, loading, activeView])

  // Function to load more tasks
  const loadMoreTasks = async () => {
    if (loading || !hasMore) return

    setLoading(true)
    try {
      const newTasks = await fetchTasks(page, limit)

      // If we get fewer tasks than the limit, we've reached the end
      if (newTasks.length < limit) {
        setHasMore(false)
      }

      setTasks((prevTasks) => [...prevTasks, ...newTasks])
      setPage((prevPage) => prevPage + 1)
    } catch (error) {
      console.error("Error loading tasks:", error)
    } finally {
      setLoading(false)
    }
  }

  // Function to apply filters
  const applyFilters = () => {
    let result = [...tasks]

    // Filter by status
    if (filters.status.length > 0) {
      result = result.filter((task) => filters.status.includes(task.status))
    }

    // Filter by priority
    if (filters.priority.length > 0) {
      result = result.filter((task) => filters.priority.includes(task.priority))
    }

    // Filter by category
    if (filters.category.length > 0) {
      result = result.filter((task) => filters.category.includes(task.category))
    }

    // Filter by date range
    if (filters.dateFrom || filters.dateTo) {
      result = result.filter((task) => {
        const taskDate = new Date(task.date)
        taskDate.setHours(0, 0, 0, 0)

        if (filters.dateFrom && filters.dateTo) {
          const from = new Date(filters.dateFrom)
          from.setHours(0, 0, 0, 0)
          const to = new Date(filters.dateTo)
          to.setHours(23, 59, 59, 999)
          return taskDate >= from && taskDate <= to
        } else if (filters.dateFrom) {
          const from = new Date(filters.dateFrom)
          from.setHours(0, 0, 0, 0)
          return taskDate >= from
        } else if (filters.dateTo) {
          const to = new Date(filters.dateTo)
          to.setHours(23, 59, 59, 999)
          return taskDate <= to
        }

        return true
      })
    }

    setFilteredTasks(result)
  }

  // Function to clear all filters
  const clearFilters = () => {
    setFilters({
      status: [],
      priority: [],
      category: [],
      dateFrom: undefined,
      dateTo: undefined,
    })
  }

  // Function to navigate to edit page
  const handleEditTask = (taskId: number) => {
    // router.push(`/edit-task/${taskId}`)
    navigate(`/edit-task/${taskId}`)
  }

  // Function to get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-500 text-white"
      case "in-progress":
        return "bg-blue-500 text-white"
      case "pending":
        return "bg-yellow-500 text-white"
      case "cancelled":
        return "bg-red-500 text-white"
      default:
        return "bg-slate-500 text-white"
    }
  }

  // Function to get category color
  const getCategoryColor = (category: string) => {
    switch (category) {
      case "work":
        return "bg-indigo-100 text-indigo-800 dark:bg-indigo-800 dark:text-indigo-100"
      case "personal":
        return "bg-purple-100 text-purple-800 dark:bg-purple-800 dark:text-purple-100"
      case "shopping":
        return "bg-pink-100 text-pink-800 dark:bg-pink-800 dark:text-pink-100"
      case "health":
        return "bg-teal-100 text-teal-800 dark:bg-teal-800 dark:text-teal-100"
      case "finance":
        return "bg-emerald-100 text-emerald-800 dark:bg-emerald-800 dark:text-emerald-100"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100"
    }
  }

  // Get priority badge color
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-500 hover:bg-red-600"
      case "medium":
        return "bg-yellow-500 hover:bg-yellow-600"
      case "low":
        return "bg-green-500 hover:bg-green-600"
      default:
        return "bg-slate-500 hover:bg-slate-600"
    }
  }

  return (
    <div>
      {/* Task Filters */}
      <TaskFilters filters={filters} setFilters={setFilters} clearFilters={clearFilters} />

      {/* View Toggle */}
      <div className="mb-4">
        <Tabs defaultValue="list" value={activeView} onValueChange={setActiveView}>
        <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="list" className="flex items-center gap-2 text-primary">
                <List className="h-4 w-4" />
                List View
            </TabsTrigger>
            <TabsTrigger value="weekly" className="flex items-center gap-2 text-primary">
                <Calendar className="h-4 w-4" />
                Weekly
            </TabsTrigger>
            <TabsTrigger value="monthly" className="flex items-center gap-2 text-primary">
                <BarChart className="h-4 w-4" />
                Monthly
            </TabsTrigger>
        </TabsList>

          <TabsContent value="list" className="mt-4">
            {/* Task List */}
            <div className="border rounded-lg shadow-sm">
              <ScrollArea className="h-[600px] w-full rounded-md p-4">
                <div className="space-y-4">
                  {filteredTasks.length === 0 && !loading && (
                    <div className="flex flex-col items-center justify-center py-10 text-center">
                      <p className="text-muted-foreground mb-2">No tasks match your filters</p>
                      {Object.values(filters).some((f) => (Array.isArray(f) ? f.length > 0 : f !== undefined)) && (
                        <Button variant="outline" size="sm" onClick={clearFilters}>
                          Clear Filters
                        </Button>
                      )}
                    </div>
                  )}

                  {filteredTasks.map((task) => (
                    <div key={task.id} className="p-4 border rounded-lg transition-colors bg-card hover:bg-accent/10">
                      <div className="flex gap-4">
                        {/* Calendar icon with date */}
                        <div className="flex-shrink-0 flex items-center justify-center">
                          <CalendarDateIcon day={task.date.getDate()} month={getMonthAbbreviation(task.date)} />
                        </div>

                        {/* Task content */}
                        <div className="flex-1 space-y-3">
                          {/* Header with title and category */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <h3 className="font-medium text-lg">{task.title}</h3>
                              {task.attachments.length > 0 && (
                                <Badge
                                  variant="outline"
                                  className="bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100 flex items-center gap-1"
                                >
                                  <Paperclip className="h-3 w-3" />
                                  {task.attachments.length}
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className={getCategoryColor(task.category)}>
                                {task.category}
                              </Badge>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleEditTask(task.id)}
                                className="h-8 w-8"
                              >
                                <Edit className="h-4 w-4" />
                                <span className="sr-only">Edit task</span>
                              </Button>
                            </div>
                          </div>

                          {/* Description */}
                          <p className="text-sm text-muted-foreground">{task.description}</p>

                          {/* Footer with status and priority */}
                          <div className="flex items-center justify-between pt-2">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Badge
                                  className={`${getStatusColor(task.status)} cursor-pointer flex items-center gap-1`}
                                >
                                  {task.status}
                                  <ChevronDown className="h-3 w-3" />
                                </Badge>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="start">
                                <DropdownMenuItem
                                  className={task.status === "pending" ? "bg-muted" : ""}
                                  onClick={() => handleStatusChange(task.id, "pending", setTasks)}
                                >
                                  Pending
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  className={task.status === "in-progress" ? "bg-muted" : ""}
                                  onClick={() => handleStatusChange(task.id, "in-progress", setTasks)}
                                >
                                  In Progress
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  className={task.status === "completed" ? "bg-muted" : ""}
                                  onClick={() => handleStatusChange(task.id, "completed", setTasks)}
                                >
                                  Completed
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  className={task.status === "cancelled" ? "bg-muted" : ""}
                                  onClick={() => handleStatusChange(task.id, "cancelled", setTasks)}
                                >
                                  Cancelled
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                            <Badge variant="outline" className={getPriorityColor(task.priority)}>
                              {task.priority} priority
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Loading indicator */}
                  {loading && (
                    <div className="space-y-3">
                      {[...Array(3)].map((_, index) => (
                        <div key={index} className="p-4 border rounded-lg">
                          <div className="flex gap-4">
                            <div className="flex-shrink-0">
                              <Skeleton className="h-12 w-12 rounded" />
                            </div>
                            <div className="flex-1 space-y-3">
                              <div className="flex items-center justify-between">
                                <Skeleton className="h-5 w-1/3" />
                                <Skeleton className="h-4 w-20" />
                              </div>
                              <Skeleton className="h-4 w-full" />
                              <div className="flex items-center justify-between pt-2">
                                <Skeleton className="h-4 w-16" />
                                <Skeleton className="h-4 w-24" />
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Intersection observer target */}
                  <div ref={loaderRef} className="h-4" />

                  {/* End of list message */}
                  {!hasMore && filteredTasks.length > 0 && (
                    <p className="text-center text-muted-foreground py-4">You've reached the end of the list</p>
                  )}
                </div>
              </ScrollArea>
            </div>
          </TabsContent>

          <TabsContent value="weekly" className="mt-4">
            <div className="border rounded-lg shadow-sm p-4">
              <TaskWeeklySummary tasks={tasks} setFilters={setFilters} setActiveView={setActiveView} />
            </div>
          </TabsContent>

          <TabsContent value="monthly" className="mt-4">
            <div className="border rounded-lg shadow-sm p-4">
              <TaskSummary tasks={tasks} setFilters={setFilters} setActiveView={setActiveView} />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

