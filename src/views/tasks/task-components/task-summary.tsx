"use client"

import { useMemo } from "react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { TaskFilters } from "./task-filters"
import { List } from "lucide-react"
import type { Task } from "./task-list"

type MonthSummary = {
  month: string
  year: number
  totalTasks: number
  categories: {
    [key: string]: number
  }
}

interface TaskSummaryProps {
  tasks: Task[]
  setFilters: (filters: TaskFilters) => void
  setActiveView: (view: string) => void
}

export default function TaskSummary({ tasks, setFilters, setActiveView }: TaskSummaryProps) {
  // Group tasks by month and category
  const monthlySummary = useMemo(() => {
    const summary: MonthSummary[] = []

    // Sort tasks by date
    const sortedTasks = [...tasks].sort((a, b) => a.date.getTime() - b.date.getTime())

    // Group by month
    sortedTasks.forEach((task) => {
      const month = task.date.toLocaleString("default", { month: "long" })
      const year = task.date.getFullYear()
      const monthYear = `${month} ${year}`

      // Find or create month entry
      let monthEntry = summary.find((m) => m.month === month && m.year === year)

      if (!monthEntry) {
        monthEntry = {
          month,
          year,
          totalTasks: 0,
          categories: {},
        }
        summary.push(monthEntry)
      }

      // Update counts
      monthEntry.totalTasks++

      if (!monthEntry.categories[task.category]) {
        monthEntry.categories[task.category] = 0
      }

      monthEntry.categories[task.category]++
    })

    return summary
  }, [tasks])

  // Handle category click to filter tasks
  const handleCategoryClick = (month: string, year: number, category: string) => {
    // Create date range for the month
    const startDate = new Date(year, getMonthIndex(month), 1)
    const endDate = new Date(year, getMonthIndex(month) + 1, 0)

    // Set filters
    setFilters({
      status: [],
      priority: [],
      category: [category],
      dateFrom: startDate,
      dateTo: endDate,
    })

    // Switch to list view
    setActiveView("list")
  }

  // Handle view all tasks for a month
  const handleViewAllTasks = (month: string, year: number) => {
    // Create date range for the month
    const startDate = new Date(year, getMonthIndex(month), 1)
    const endDate = new Date(year, getMonthIndex(month) + 1, 0)

    // Set filters without category filter
    setFilters({
      status: [],
      priority: [],
      category: [],
      dateFrom: startDate,
      dateTo: endDate,
    })

    // Switch to list view
    setActiveView("list")
  }

  // Helper to get month index from name
  const getMonthIndex = (monthName: string): number => {
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ]
    return months.findIndex((m) => m === monthName)
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

  // Check if month is current month
  const isCurrentMonth = (month: string, year: number) => {
    const now = new Date()
    return now.getFullYear() === year && now.getMonth() === getMonthIndex(month)
  }

  if (monthlySummary.length === 0) {
    return <div className="text-center py-10 text-muted-foreground">No tasks available to summarize</div>
  }

  return (
    <div className="space-y-4">
      <Accordion type="multiple" className="w-full">
        {monthlySummary.map((summary, index) => (
          <AccordionItem key={index} value={`${summary.month}-${summary.year}`}>
            <AccordionTrigger className="hover:bg-accent/50 px-4 rounded-lg">
              <div className="flex justify-between w-full items-center">
                <div className="flex items-center gap-2">
                  <span>
                    {summary.month} {summary.year}
                  </span>
                  {isCurrentMonth(summary.month, summary.year) && (
                    <Badge variant="outline" className="bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100">
                      Current Month
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
                  onClick={() => handleViewAllTasks(summary.month, summary.year)}
                >
                  <List className="mr-2 h-4 w-4" />
                  View All Tasks for {summary.month}
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
                      onClick={() => handleCategoryClick(summary.month, summary.year, category)}
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

