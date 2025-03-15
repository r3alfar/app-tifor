import { useMemo } from "react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { TaskFilters } from "./task-filters"
import { format, startOfWeek, endOfWeek, getWeek, getYear } from "date-fns"
import { List } from "lucide-react"
import type { Task } from "./task-list"

type WeekSummary = {
  weekStart: Date
  weekEnd: Date
  weekNumber: number
  year: number
  totalTasks: number
  categories: {
    [key: string]: number
  }
}

interface TaskWeeklySummaryProps {
  tasks: Task[]
  setFilters: (filters: TaskFilters) => void
  setActiveView: (view: string) => void
}

export default function TaskWeeklySummary({ tasks, setFilters, setActiveView }: TaskWeeklySummaryProps) {
  // Group tasks by week and category
  const weeklySummary = useMemo(() => {
    const summary: WeekSummary[] = []

    // Sort tasks by date
    const sortedTasks = [...tasks].sort((a, b) => a.date.getTime() - b.date.getTime())

    // Group by week
    sortedTasks.forEach((task) => {
      const taskDate = new Date(task.date)
      const weekStart = startOfWeek(taskDate, { weekStartsOn: 1 }) // Week starts on Monday
      const weekEnd = endOfWeek(taskDate, { weekStartsOn: 1 }) // Week ends on Sunday
      const weekNumber = getWeek(taskDate, { weekStartsOn: 1 })
      const year = getYear(taskDate)

      // Find or create week entry
      let weekEntry = summary.find((w) => w.weekNumber === weekNumber && w.year === year)

      if (!weekEntry) {
        weekEntry = {
          weekStart,
          weekEnd,
          weekNumber,
          year,
          totalTasks: 0,
          categories: {},
        }
        summary.push(weekEntry)
      }

      // Update counts
      weekEntry.totalTasks++

      if (!weekEntry.categories[task.category]) {
        weekEntry.categories[task.category] = 0
      }

      weekEntry.categories[task.category]++
    })

    // Sort by date (most recent first)
    return summary.sort((a, b) => b.weekStart.getTime() - a.weekStart.getTime())
  }, [tasks])

  // Handle category click to filter tasks
  const handleCategoryClick = (weekStart: Date, weekEnd: Date, category: string) => {
    // Set filters
    setFilters({
      status: [],
      priority: [],
      category: [category],
      dateFrom: weekStart,
      dateTo: weekEnd,
    })

    // Switch to list view
    setActiveView("list")
  }

  // Handle view all tasks for a week
  const handleViewAllTasks = (weekStart: Date, weekEnd: Date) => {
    // Set filters for the week without category filter
    setFilters({
      status: [],
      priority: [],
      category: [],
      dateFrom: weekStart,
      dateTo: weekEnd,
    })

    // Switch to list view
    setActiveView("list")
  }

  // Get category color
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

  // Format week range
  const formatWeekRange = (start: Date, end: Date) => {
    // If same month
    if (start.getMonth() === end.getMonth()) {
      return `${format(start, "MMM d")} - ${format(end, "d, yyyy")}`
    }
    // If same year but different month
    else if (start.getFullYear() === end.getFullYear()) {
      return `${format(start, "MMM d")} - ${format(end, "MMM d, yyyy")}`
    }
    // Different years
    else {
      return `${format(start, "MMM d, yyyy")} - ${format(end, "MMM d, yyyy")}`
    }
  }

  // Get current week indicator
  const isCurrentWeek = (weekStart: Date, weekEnd: Date) => {
    const now = new Date()
    return now >= weekStart && now <= weekEnd
  }

  if (weeklySummary.length === 0) {
    return <div className="text-center py-10 text-muted-foreground">No tasks available to summarize</div>
  }

  return (
    <div className="space-y-4">
      <Accordion type="multiple" className="w-full">
        {weeklySummary.map((summary, index) => (
          <AccordionItem key={index} value={`week-${summary.year}-${summary.weekNumber}`}>
            <AccordionTrigger className="hover:bg-accent/50 px-4 rounded-lg">
              <div className="flex justify-between w-full items-center">
                <div className="flex items-center gap-2">
                  <span>{formatWeekRange(summary.weekStart, summary.weekEnd)}</span>
                  {isCurrentWeek(summary.weekStart, summary.weekEnd) && (
                    <Badge variant="outline" className="bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100">
                      Current Week
                    </Badge>
                  )}
                </div>
                <Badge variant="secondary" className="mr-2">
                  {summary.totalTasks} tasks
                </Badge>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4">
              <div className="mb-4">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-center"
                  onClick={() => handleViewAllTasks(summary.weekStart, summary.weekEnd)}
                >
                  <List className="mr-2 h-4 w-4" />
                  View All Tasks for This Week
                </Button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 py-2">
                {Object.entries(summary.categories)
                  .sort(([, countA], [, countB]) => countB - countA)
                  .map(([category, count]) => (
                    <Button
                      key={category}
                      variant="outline"
                      className="justify-between h-auto py-2"
                      onClick={() => handleCategoryClick(summary.weekStart, summary.weekEnd, category)}
                    >
                      <Badge variant="outline" className={`${getCategoryColor(category)} mr-2`}>
                        {category}
                      </Badge>
                      <span>{count} tasks</span>
                    </Button>
                  ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  )
}

