import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { CalendarIcon, Filter, X } from "lucide-react"
import { format } from "date-fns"

export type TaskFilters = {
  status: string[]
  priority: string[]
  category: string[]
  dateFrom: Date | undefined
  dateTo: Date | undefined
}

interface TaskFiltersProps {
  filters: TaskFilters
  setFilters: (filters: TaskFilters) => void
  clearFilters: () => void
}

export default function TaskFilters({ filters, setFilters, clearFilters }: TaskFiltersProps) {
  const [dateOpen, setDateOpen] = useState(false)

  // Toggle a filter value
  const toggleFilter = (type: "status" | "priority" | "category", value: string) => {
    const currentValues = filters[type]
    const newValues = currentValues.includes(value)
      ? currentValues.filter((v) => v !== value)
      : [...currentValues, value]

    setFilters({ ...filters, [type]: newValues })
  }

  // Check if a filter is active
  const isFilterActive = (type: "status" | "priority" | "category", value: string) => {
    return filters[type].includes(value)
  }

  // Count active filters
  const countActiveFilters = () => {
    let count = 0
    count += filters.status.length
    count += filters.priority.length
    count += filters.category.length
    if (filters.dateFrom || filters.dateTo) count += 1
    return count
  }

  // Get status color
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

  // Get priority color
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

  return (
    <div className="flex flex-wrap items-center gap-2 mb-4">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="h-8 gap-1">
            <Filter className="h-3.5 w-3.5" />
            Status
            {filters.status.length > 0 && (
              <Badge variant="secondary" className="ml-1 h-5 px-1 rounded-full">
                {filters.status.length}
              </Badge>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-48">
          <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuCheckboxItem
            checked={isFilterActive("status", "pending")}
            onCheckedChange={() => toggleFilter("status", "pending")}
          >
            <Badge className={`${getStatusColor("pending")} mr-2`}>pending</Badge>
            Pending
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            checked={isFilterActive("status", "in-progress")}
            onCheckedChange={() => toggleFilter("status", "in-progress")}
          >
            <Badge className={`${getStatusColor("in-progress")} mr-2`}>in-progress</Badge>
            In Progress
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            checked={isFilterActive("status", "completed")}
            onCheckedChange={() => toggleFilter("status", "completed")}
          >
            <Badge className={`${getStatusColor("completed")} mr-2`}>completed</Badge>
            Completed
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            checked={isFilterActive("status", "cancelled")}
            onCheckedChange={() => toggleFilter("status", "cancelled")}
          >
            <Badge className={`${getStatusColor("cancelled")} mr-2`}>cancelled</Badge>
            Cancelled
          </DropdownMenuCheckboxItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="h-8 gap-1">
            <Filter className="h-3.5 w-3.5" />
            Priority
            {filters.priority.length > 0 && (
              <Badge variant="secondary" className="ml-1 h-5 px-1 rounded-full">
                {filters.priority.length}
              </Badge>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-48">
          <DropdownMenuLabel>Filter by Priority</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuCheckboxItem
            checked={isFilterActive("priority", "low")}
            onCheckedChange={() => toggleFilter("priority", "low")}
          >
            <Badge className={`${getPriorityColor("low")} mr-2`}>low</Badge>
            Low
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            checked={isFilterActive("priority", "medium")}
            onCheckedChange={() => toggleFilter("priority", "medium")}
          >
            <Badge className={`${getPriorityColor("medium")} mr-2`}>medium</Badge>
            Medium
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            checked={isFilterActive("priority", "high")}
            onCheckedChange={() => toggleFilter("priority", "high")}
          >
            <Badge className={`${getPriorityColor("high")} mr-2`}>high</Badge>
            High
          </DropdownMenuCheckboxItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="h-8 gap-1">
            <Filter className="h-3.5 w-3.5" />
            Category
            {filters.category.length > 0 && (
              <Badge variant="secondary" className="ml-1 h-5 px-1 rounded-full">
                {filters.category.length}
              </Badge>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-48">
          <DropdownMenuLabel>Filter by Category</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuCheckboxItem
            checked={isFilterActive("category", "work")}
            onCheckedChange={() => toggleFilter("category", "work")}
          >
            <Badge variant="outline" className={`${getCategoryColor("work")} mr-2`}>
              work
            </Badge>
            Work
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            checked={isFilterActive("category", "personal")}
            onCheckedChange={() => toggleFilter("category", "personal")}
          >
            <Badge variant="outline" className={`${getCategoryColor("personal")} mr-2`}>
              personal
            </Badge>
            Personal
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            checked={isFilterActive("category", "shopping")}
            onCheckedChange={() => toggleFilter("category", "shopping")}
          >
            <Badge variant="outline" className={`${getCategoryColor("shopping")} mr-2`}>
              shopping
            </Badge>
            Shopping
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            checked={isFilterActive("category", "health")}
            onCheckedChange={() => toggleFilter("category", "health")}
          >
            <Badge variant="outline" className={`${getCategoryColor("health")} mr-2`}>
              health
            </Badge>
            Health
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            checked={isFilterActive("category", "finance")}
            onCheckedChange={() => toggleFilter("category", "finance")}
          >
            <Badge variant="outline" className={`${getCategoryColor("finance")} mr-2`}>
              finance
            </Badge>
            Finance
          </DropdownMenuCheckboxItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Popover open={dateOpen} onOpenChange={setDateOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="h-8 gap-1">
            <CalendarIcon className="h-3.5 w-3.5" />
            Date Range
            {(filters.dateFrom || filters.dateTo) && (
              <Badge variant="secondary" className="ml-1 h-5 px-1 rounded-full">
                1
              </Badge>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <div className="p-3">
            <div className="space-y-2">
              <h4 className="font-medium text-sm">Date Range</h4>
              <div className="flex gap-2 items-center">
                <div className="grid gap-1">
                  <div className="text-xs">From</div>
                  <Button
                    variant="outline"
                    size="sm"
                    className={`justify-start text-left font-normal ${!filters.dateFrom ? "text-muted-foreground" : ""}`}
                    onClick={() => setFilters({ ...filters, dateFrom: undefined })}
                  >
                    {filters.dateFrom ? format(filters.dateFrom, "PPP") : "No start date"}
                    {filters.dateFrom && (
                      <X
                        className="ml-1 h-3 w-3"
                        onClick={(e) => {
                          e.stopPropagation()
                          setFilters({ ...filters, dateFrom: undefined })
                        }}
                      />
                    )}
                  </Button>
                </div>
                <div className="grid gap-1">
                  <div className="text-xs">To</div>
                  <Button
                    variant="outline"
                    size="sm"
                    className={`justify-start text-left font-normal ${!filters.dateTo ? "text-muted-foreground" : ""}`}
                    onClick={() => setFilters({ ...filters, dateTo: undefined })}
                  >
                    {filters.dateTo ? format(filters.dateTo, "PPP") : "No end date"}
                    {filters.dateTo && (
                      <X
                        className="ml-1 h-3 w-3"
                        onClick={(e) => {
                          e.stopPropagation()
                          setFilters({ ...filters, dateTo: undefined })
                        }}
                      />
                    )}
                  </Button>
                </div>
              </div>
            </div>
            <div className="p-3 border-t mt-3">
              <Calendar
                mode="range"
                selected={{
                  from: filters.dateFrom,
                  to: filters.dateTo,
                }}
                onSelect={(range) => {
                  setFilters({
                    ...filters,
                    dateFrom: range?.from,
                    dateTo: range?.to,
                  })
                }}
                numberOfMonths={1}
                initialFocus
              />
            </div>
            <div className="p-3 border-t flex justify-end">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  setFilters({ ...filters, dateFrom: undefined, dateTo: undefined })
                  setDateOpen(false)
                }}
              >
                Clear Dates
              </Button>
              <Button size="sm" onClick={() => setDateOpen(false)}>
                Apply
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>

      {countActiveFilters() > 0 && (
        <Button variant="ghost" size="sm" className="h-8" onClick={clearFilters}>
          <X className="h-3.5 w-3.5 mr-1" />
          Clear Filters
        </Button>
      )}
    </div>
  )
}

