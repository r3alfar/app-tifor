import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { CalendarIcon } from 'lucide-react'
import { useEffect, useState } from "react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { db } from '@/repository/firebase/config'
import { Timestamp, collection, getDocs, query, where } from "firebase/firestore"
import { useAuthContext } from "../auth/AuthContext"
import { useNavigate } from "react-router-dom"



export const categoryMapping: {
  [key: string]: string
} = {
  "doctor_meeting": "Doctor Meeting",
  "drugstore_visit": "Drugstore Visit",
  "product_sharing": "Product Sharing",
  "training": "Training",
  "event_exhibition": "Event & Exhibition",
}



interface monthAct {
  name: string;
  events: number;
  items: any[];
  start: string;
  end: string;
}



const colors = ['bg-blue-100', 'bg-pink-100', 'bg-green-100']

export default function Component() {
  const [openItem, setOpenItem] = useState<string[]>([]);
  const [tabValue, setTabValue] = useState<string>('month');
  const user = useAuthContext();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | string | null>(null);
  const [filteredMonthsData, setFilteredMonthsData] = useState<monthAct[]>([]);


  // let filteredMonthsData: monthAct[] = [];

  useEffect(() => {

    const fetchDummyData = async () => {
      const monthsStartEndDate: monthAct[] = [
        { name: 'January', start: '2024-01-01', end: '2024-01-31', events: 0, items: [] },
        { name: 'February', start: '2024-02-01', end: '2024-02-29', events: 0, items: [] }, // Handle leap year if needed
        { name: 'March', start: '2024-03-01', end: '2024-03-31', events: 0, items: [] },
        { name: 'April', start: '2024-04-01', end: '2024-04-30', events: 0, items: [] },
        { name: 'May', start: '2024-05-01', end: '2024-05-31', events: 0, items: [] },
        { name: 'June', start: '2024-06-01', end: '2024-06-30', events: 0, items: [] },
        { name: 'July', start: '2024-07-01', end: '2024-07-31', events: 0, items: [] },
        { name: 'August', start: '2024-08-01', end: '2024-08-31', events: 0, items: [] },
        { name: 'September', start: '2024-09-01', end: '2024-09-30', events: 0, items: [] },
        { name: 'October', start: '2024-10-01', end: '2024-10-31', events: 0, items: [] },
        { name: 'November', start: '2024-11-01', end: '2024-11-30', events: 0, items: [] },
        { name: 'December', start: '2024-12-01', end: '2024-12-31', events: 0, items: [] },
      ];
      setFilteredMonthsData([])
      console.log("begin fetch")
      const startMonth = Timestamp.fromDate(new Date('2024-09-01'))
      const endMonth = Timestamp.fromDate(new Date('2024-09-30'))

      console.log("startMonth", startMonth)
      console.log("endMonth", typeof endMonth)

      let userId: string;
      if (user?.user?.uid) {
        userId = user.user?.uid
      } else {
        userId = ""
      }
      console.log("userId", userId)

      //declare collection refrence
      const activitiesRef = collection(db, 'users-activity', userId, 'activities');

      try {
        for (const month of monthsStartEndDate) {
          //manually make indo time 00:00 to utc format
          const startOfMonth = Timestamp.fromMillis(new Date(month.start).getTime() - (7 * 60 * 60 * 1000));
          const endOfMonth = Timestamp.fromMillis(new Date(month.end).getTime() - (7 * 60 * 60 * 1000));
          // console.log(`${month.name}=> start: ${startOfMonth} | end: ${endOfMonth}`)


          const q = query(
            activitiesRef,
            where('schedule', '>=', startOfMonth),
            where('schedule', '<=', endOfMonth)
          );

          const querySnapshot = await getDocs(q);
          if (querySnapshot.empty) {
            console.log("No activities found for this month.");
          } else {
            console.log("activities found for this month.");
            querySnapshot.forEach(doc => {
              const activityData = { id: doc.id, ...doc.data() }
              // console.log(activityData)
              month.items.push(activityData)
              month.events++;
            })
          }
        }
      } catch (error: any) {
        setError(error);
        console.error("Error fetching activities:");
      } finally {
        setFilteredMonthsData(monthsStartEndDate.filter(month => month.events > 0))
        // console.log("filteredMonthsData", filteredMonthsData)
        setLoading(false);
      }


      // console.log("monthsStartEndDate after query", monthsStartEndDate)


    }
    fetchDummyData();
  }, [])

  if (loading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>Error: {error.toString()}</div>;
  }


  const handleOpenThisMonth = () => {
    const currMonth = new Date().toLocaleString('default', { month: 'long' })
    console.log(currMonth)
    setOpenItem([currMonth])
  };

  const handleTabValue = () => {
    tabValue != 'month' ? setTabValue('month') : setTabValue('week');
    tabValue != 'week' ? setTabValue('week') : setTabValue('month');
  };

  // const handleCardDetail = (item: any) => {
  //   console.log(item)
  // };

  async function navigateTasks() {
    navigate('/tasks')
  }



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
          <Button variant="outline" size="default" onClick={() => navigateTasks()}>All Tasks</Button>
        </div>
      </div>
      <Accordion
        type="multiple"
        className="space-y-4"
        value={openItem}
        onValueChange={setOpenItem}
      >

        {
          filteredMonthsData.length == 0 ? (<span>no data</span>)
            :
            filteredMonthsData.map((month) =>
            (
              <AccordionItem value={month.name} key={month.name} className="border rounded-lg overflow-hidden">
                <AccordionTrigger className="px-4 py-2 bg-white hover:no-underline hover:bg-gray-50">
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center">
                      <span className="text-violet-600 bg-violet-100 rounded-full px-2 py-1 text-xs mr-2">
                        {month.events} Events
                      </span>
                      <span className="font-bold">{month.name}</span>
                    </div>
                    {/* <ChevronDownIcon className="h-4 w-4 transition-transform duration-200" /> */}
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="p-4 space-y-4 bg-slate-800">
                    {month.items.map((item, itemIndex) => (
                      <div key={item.category} className={`${colors[itemIndex % 3]} p-4 rounded-lg`} onClick={() => navigateTasks()}>
                        <div className="flex justify-between items-center">
                          <h3 className="text-3xl font-bold">{categoryMapping[item.category]}</h3>
                          <Button size="sm" variant="outline" className="bg-white">
                            Detail
                          </Button>
                        </div>
                        <div className="flex items-center mt-2 text-sm text-gray-600">
                          <CalendarIcon className="h-4 w-4 mr-2" />
                          <span>{item.date}</span>
                          <span className="mx-2">•</span>
                          <span>{month.events} bookings</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))
        }



      </Accordion>
    </div>
  )
}


//dummy data

// const months = [
//   {
//     name: 'May',
//     events: 1,
//     items: [
//       { title: 'Product sharing', date: '05 mins', time: '10:00am', bookings: 10 },
//       { title: 'Drugstore visit', date: '60 mins', time: '11:30am', bookings: 30 },
//       { title: 'Meeting Doctor', date: '60 mins', time: '2:00pm', bookings: 15 },
//     ]
//   },
//   {
//     name: 'June',
//     events: 1,
//     items: [
//       { title: 'Product sharing', date: '05 mins', time: '10:00am', bookings: 10 },
//       { title: 'Drugstore visit', date: '60 mins', time: '11:30am', bookings: 35 },
//       { title: 'Meeting Doctor', date: '60 mins', time: '2:00pm', bookings: 11 },
//     ]
//   },
//   {
//     name: 'July',
//     events: 1,
//     items: [
//       { title: 'Product sharing', date: '05 mins', time: '10:00am', bookings: 10 },
//       { title: 'Drugstore visit', date: '60 mins', time: '11:30am', bookings: 10 },
//       { title: 'Meeting Doctor', date: '60 mins', time: '2:00pm', bookings: 10 },
//     ]
//   },
//   {
//     name: 'August',
//     events: 3,
//     items: [
//       { title: 'Product sharing', date: '05 mins', time: '10:00am', bookings: 10 },
//       { title: 'Drugstore visit', date: '60 mins', time: '11:30am', bookings: 10 },
//       { title: 'Meeting Doctor', date: '60 mins', time: '2:00pm', bookings: 10 },
//     ]
//   },
//   {
//     name: 'September',
//     events: 1,
//     items: [
//       { title: 'Product sharing', date: '05 mins', time: '10:00am', bookings: 10 },
//       { title: 'Drugstore visit', date: '60 mins', time: '11:30am', bookings: 10 },
//       { title: 'Meeting Doctor', date: '60 mins', time: '2:00pm', bookings: 10 },
//     ]
//   },
//   {
//     name: 'October',
//     events: 1,
//     items: [
//       { title: 'Product sharing', date: '05 mins', time: '10:00am', bookings: 10 },
//       { title: 'Drugstore visit', date: '60 mins', time: '11:30am', bookings: 10 },
//       { title: 'Meeting Doctor', date: '60 mins', time: '2:00pm', bookings: 10 },
//     ]
//   },
// ]

// const monthsActivity = [
//   {
//     name: 'January',
//     events: 0,
//     items: []
//   },
//   {
//     name: 'February',
//     events: 0,
//     items: []
//   },
//   {
//     name: 'March',
//     events: 0,
//     items: []
//   },
//   {
//     name: 'April',
//     events: 0,
//     items: []
//   },
//   {
//     name: 'May',
//     events: 0,
//     items: []
//   },
//   {
//     name: 'June',
//     events: 0,
//     items: []
//   },
//   {
//     name: 'July',
//     events: 0,
//     items: []
//   },
//   {
//     name: 'August',
//     events: 0,
//     items: []
//   },
//   {
//     name: 'September',
//     events: 0,
//     items: []
//   },
//   {
//     name: 'October',
//     events: 0,
//     items: []
//   },
//   {
//     name: 'November',
//     events: 0,
//     items: []
//   },
//   {
//     name: 'December',
//     events: 0,
//     items: []
//   },
// ];