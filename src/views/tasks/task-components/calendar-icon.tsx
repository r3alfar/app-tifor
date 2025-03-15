import { CalendarIcon } from "lucide-react"

interface CalendarDateIconProps {
  day: number
  month: string
}

export function CalendarDateIcon({ day, month }: CalendarDateIconProps) {
  return (
    <div className="relative flex flex-col items-center">
      <CalendarIcon className="h-12 w-12 text-muted-foreground" strokeWidth={1} />
      <div className="absolute top-1/2 transform -translate-y-1/4 flex flex-col items-center">
        <span className="text-[10px] font-medium leading-none">{month}</span>
        <span className="text-sm font-bold leading-none">{day}</span>
      </div>
    </div>
  )
}

