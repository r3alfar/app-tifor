import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { CalendarIcon } from 'lucide-react'
import { useState } from "react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

const months = [
  {
    name: 'May',
    events: 1,
    items: [
      { title: 'Product sharing', date: '05 mins', time: '10:00am', bookings: 10 },
      { title: 'Drugstore visit', date: '60 mins', time: '11:30am', bookings: 30 },
      { title: 'Meeting Doctor', date: '60 mins', time: '2:00pm', bookings: 15 },
    ]
  },
  {
    name: 'June',
    events: 1,
    items: [
      { title: 'Product sharing', date: '05 mins', time: '10:00am', bookings: 10 },
      { title: 'Drugstore visit', date: '60 mins', time: '11:30am', bookings: 35 },
      { title: 'Meeting Doctor', date: '60 mins', time: '2:00pm', bookings: 11 },
    ]
  },
  {
    name: 'July',
    events: 1,
    items: [
      { title: 'Product sharing', date: '05 mins', time: '10:00am', bookings: 10 },
      { title: 'Drugstore visit', date: '60 mins', time: '11:30am', bookings: 10 },
      { title: 'Meeting Doctor', date: '60 mins', time: '2:00pm', bookings: 10 },
    ]
  },
  {
    name: 'August',
    events: 3,
    items: [
      { title: 'Product sharing', date: '05 mins', time: '10:00am', bookings: 10 },
      { title: 'Drugstore visit', date: '60 mins', time: '11:30am', bookings: 10 },
      { title: 'Meeting Doctor', date: '60 mins', time: '2:00pm', bookings: 10 },
    ]
  },
  {
    name: 'September',
    events: 1,
    items: [
      { title: 'Product sharing', date: '05 mins', time: '10:00am', bookings: 10 },
      { title: 'Drugstore visit', date: '60 mins', time: '11:30am', bookings: 10 },
      { title: 'Meeting Doctor', date: '60 mins', time: '2:00pm', bookings: 10 },
    ]
  },
  {
    name: 'October',
    events: 1,
    items: [
      { title: 'Product sharing', date: '05 mins', time: '10:00am', bookings: 10 },
      { title: 'Drugstore visit', date: '60 mins', time: '11:30am', bookings: 10 },
      { title: 'Meeting Doctor', date: '60 mins', time: '2:00pm', bookings: 10 },
    ]
  },
]

const colors = ['bg-blue-100', 'bg-pink-100', 'bg-green-100']

export default function Component() {
  const [openItem, setOpenItem] = useState<string[]>([]);
  const [tabValue, setTabValue] = useState<string>('month');

  const handleOpenThisMonth = () => {
    const currMonth = new Date().toLocaleString('default', { month: 'long' })
    console.log(currMonth)
    setOpenItem([currMonth])
  };

  const handleTabValue = () => {
    tabValue != 'month' ? setTabValue('month') : setTabValue('week');
    tabValue != 'week' ? setTabValue('week') : setTabValue('month');
  };

  const handleCardDetail = (item: any) => {
    console.log(item)
  };



  return (
    <div className="bg-yellow-200 p-4 rounded-lg">
      <div className="flex justify-between mb-4">
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            <CalendarIcon className="mr-2 h-4 w-4" /> 2023
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleOpenThisMonth()}>This Month</Button>
        </div>
        <div className="flex space-x-2">
          <div className="flex items-center justify-center">
            <Tabs
              value={tabValue}
              onValueChange={handleTabValue}
              className=""
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger
                  value="week"
                  className={`rounded-full text-sm font-medium transition-all data-[state=active]:bg-purple-600 data-[state=active]:text-white data-[state=inactive]:bg-transparent data-[state=inactive]:text-gray-800`}
                >
                  Week
                </TabsTrigger>
                <TabsTrigger
                  value="month"
                  className={`rounded-full text-sm font-medium transition-all data-[state=active]:bg-purple-600 data-[state=active]:text-white data-[state=inactive]:bg-transparent data-[state=inactive]:text-gray-800`}
                >
                  Month
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          <Button variant="outline" size="sm">Filter</Button>
        </div>
      </div>
      <Accordion
        type="multiple"
        className="space-y-4"
        value={openItem}
        onValueChange={setOpenItem}
      >
        {months.map((month) => (
          <AccordionItem value={month.name} key={month.name} className="border rounded-lg overflow-hidden">
            <AccordionTrigger className="px-4 py-2 bg-white hover:no-underline hover:bg-gray-50">
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center">
                  <span className="text-violet-600 bg-violet-100 rounded-full px-2 py-1 text-xs mr-2">
                    {month.items.length} Events
                  </span>
                  <span className="font-bold">{month.name}</span>
                </div>
                {/* <ChevronDownIcon className="h-4 w-4 transition-transform duration-200" /> */}
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="p-4 space-y-4 bg-slate-800">
                {month.items.map((item, itemIndex) => (
                  <div key={item.title} className={`${colors[itemIndex % 3]} p-4 rounded-lg`} onClick={() => handleCardDetail(item)}>
                    <div className="flex justify-between items-center">
                      <h3 className="text-3xl font-bold">{item.title}</h3>
                      <Button size="sm" variant="outline" className="bg-white">
                        Detail
                      </Button>
                    </div>
                    <div className="flex items-center mt-2 text-sm text-gray-600">
                      <CalendarIcon className="h-4 w-4 mr-2" />
                      <span>{item.date}</span>
                      <span className="mx-2">•</span>
                      <span>{item.bookings} bookings</span>
                    </div>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  )
}