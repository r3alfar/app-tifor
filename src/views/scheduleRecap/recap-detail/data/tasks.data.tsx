import {
  ArrowDownIcon,
  ArrowRightIcon,
  ArrowUpIcon,
  CheckCircledIcon,
  CircleIcon,
  CrossCircledIcon,
  // QuestionMarkCircledIcon,
  // StopwatchIcon,
} from "@radix-ui/react-icons"

export const categories = [
  {
    value: "product_sharing",
    label: "Product Sharing",
  },
  {
    value: "doctor_meeting",
    label: "Doctor Meeting",
  },
  {
    value: "drugstore_visit",
    label: "Drugstore Visit",

  },
  {
    value: "training",
    label: "Training",
  },
  {
    value: "event_exhibition",
    label: "Event & Exhibition",
  }
]



export const statuses = [
  {
    value: "todo",
    label: "Todo",
    icon: CircleIcon,
  },
  {
    value: "done",
    label: "Done",
    icon: CheckCircledIcon,
  },
  {
    value: "cancelled",
    label: "Cancelled",
    icon: CrossCircledIcon,
  },
]

export const priorities = [
  {
    label: "Low",
    value: "low",
    icon: ArrowDownIcon,
  },
  {
    label: "Medium",
    value: "medium",
    icon: ArrowRightIcon,
  },
  {
    label: "High",
    value: "high",
    icon: ArrowUpIcon,
  },
]