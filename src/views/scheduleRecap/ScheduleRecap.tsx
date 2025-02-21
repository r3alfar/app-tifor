import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { CalendarIcon } from 'lucide-react'
import { useEffect, useState } from "react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
  countPerCategory: any[];
}

const colors = ['bg-blue-100', 'bg-pink-100', 'bg-green-100']

export default function Component() {
  const [openItem, setOpenItem] = useState<string[]>([]);
  const [tabValue, setTabValue] = useState<string>('month');
  
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | string | null>(null);
  const [filteredMonthsData, setFilteredMonthsData] = useState<monthAct[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const monthsStartEndDate: monthAct[] = [
        { name: 'January', events: 0, items: [], countPerCategory: [] },
        { name: 'February', events: 0, items: [], countPerCategory: [] },
        { name: 'March', events: 0, items: [], countPerCategory: [] },
        { name: 'April', events: 0, items: [], countPerCategory: [] },
        { name: 'May', events: 0, items: [], countPerCategory: [] },
        { name: 'June', events: 0, items: [], countPerCategory: [] },
        { name: 'July', events: 0, items: [], countPerCategory: [] },
        { name: 'August', events: 0, items: [], countPerCategory: [] },
        { name: 'September', events: 0, items: [], countPerCategory: [] },
        { name: 'October', events: 0, items: [], countPerCategory: [] },
        { name: 'November', events: 0, items: [], countPerCategory: [] },
        { name: 'December', events: 0, items: [], countPerCategory: [] },
      ];

      try {
        const storedUserDetail = JSON.parse(localStorage.getItem("userDetail") || '{}');
        const user_id = storedUserDetail.id;
        const token = localStorage.getItem('access_token');

        const currentYear = new Date().getFullYear();
        const qParams = {
          filter: {
            user_created: {
              _eq: user_id
            },
            schedule: {
              _between: [`${currentYear}-01-01T00:00:00Z`, `${currentYear}-12-31T23:59:59Z`]
            }
          },
          sort: ['timestamp']
        };

        const queryString = new URLSearchParams({
          filter: JSON.stringify(qParams.filter)
        }).toString();
        
        const url = `${import.meta.env.VITE_DIRECTUS_BASE_URL}/items/activity?${queryString}`;
        
        const response = await window.api.get(url, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });

        const yearlyData = response.data.data;

        // Process yearly data into months
        yearlyData.forEach((activity: any) => {
          const activityDate = new Date(activity.schedule);
          const monthIndex = activityDate.getMonth();
          const monthData = monthsStartEndDate[monthIndex];
        
          // Check for unique activities for events counter
          if (!monthData.items.some(item => item.id === activity.id)) {
            monthData.events++;
            monthData.items.push(activity);
          }
        
          // Count all bookings per category
          if (activity.category) {
            const category = activity.category;
            const existingCategory = monthData.countPerCategory.find((item: any) => item.name === category);
        
            if (existingCategory) {
              existingCategory.count++;
            } else {
              monthData.countPerCategory.push({ name: category, count: 0 });
            }
          }
        });
        

        setFilteredMonthsData(monthsStartEndDate.filter(month => month.events > 0));
      } catch (error: any) {
        setError(error);
        console.error("Error fetching activities:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>Error: {error.toString()}</div>;
  }

  const handleOpenThisMonth = () => {
    const currMonth = new Date().toLocaleString('default', { month: 'long' })
    setOpenItem([currMonth])
  };

  const handleTabValue = () => {
    tabValue != 'month' ? setTabValue('month') : setTabValue('week');
    tabValue != 'week' ? setTabValue('week') : setTabValue('month');
  };

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
            filteredMonthsData.map((month) => {
              const renderedCategories = new Set();
              const countPerCategory = month.countPerCategory;
              return (
                <AccordionItem value={month.name} key={month.name} className="border rounded-lg overflow-hidden">
                  <AccordionTrigger className="px-4 py-2 bg-white hover:no-underline hover:bg-gray-50">
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center">
                        <span className="text-violet-600 bg-violet-100 rounded-full px-2 py-1 text-xs mr-2">
                          {month.events} Events
                        </span>
                        <span className="font-bold">{month.name}</span>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="p-4 space-y-4 bg-slate-800">
                      {
                        month.items.map((item, itemIndex) => {
                          const itemCount = countPerCategory.find((cpc: any) => cpc.name === item.category);
                          if (renderedCategories.has(item.category)) {
                            return null;
                          }
                          renderedCategories.add(item.category);

                          return (
                            <div key={item.category} className={`${colors[itemIndex % 3]} p-4 rounded-lg`} onClick={() => navigateTasks()}>
                              <div className="flex justify-between items-center">
                                <h3 className="text-3xl font-bold">{categoryMapping[item.category]}</h3>
                                <Button size="sm" variant="outline" className="bg-white">
                                  Detail
                                </Button>
                              </div>
                              <div className="flex items-center mt-2 text-sm text-gray-600">
                                <CalendarIcon className="h-4 w-4 mr-2" />
                                <span>{item.schedule}</span>
                                <span className="mx-2">•</span>
                                <span>{itemCount ? itemCount.count : 0} bookings</span>
                              </div>
                            </div>
                          )
                        })
                      }
                    </div>
                  </AccordionContent>
                </AccordionItem>
              )
            })
        }
      </Accordion>
    </div>
  )
}