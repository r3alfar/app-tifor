// import { z } from "zod"
// import { taskSchema } from "./data/schema"
// import { taskSchema } from "./data/tasks.schema"
import { columns } from "./components/columns"
import { DataTable } from "./components/data-table"
import { UserNav } from "./components/user-nav"
import { useEffect, useState } from "react"
import { collection, getDocs } from "firebase/firestore"
import { db } from "@/repository/firebase/config"
import { useAuthContext } from "@/views/auth/AuthContext"

// interface Task {
//   id: string
//   title: string
//   status: string
//   label: string
//   priority: string
// }

interface myTask {
  id?: string;
  description: string;
  status: string;
  categories: string;
  priority: string;
  location: string;
  schedule: string;
  timestamp: string;
  userId: string;
  imageUrls?: string[];
}




export default function TasksPage() {
  // const tasks = getTasks()
  const user = useAuthContext();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | string | null | unknown>(null);
  // const [tasks, setTasks] = useState<Task[]>([])
  // const [myTasks, setMyTasks] = useState<DocumentData[]>([]);
  const [myTasks, setMyTasks] = useState<myTask[]>([]);
  const userId = user.user?.uid;


  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!userId) {
          throw new Error('User ID is undefined');
        }

        const activitiesRef = collection(db, `users-activity/${userId}/activities`);
        const docSnap = await getDocs(activitiesRef);

        const data = docSnap.docs.map((doc) => doc.data());
        setMyTasks(data.map(item => ({
          description: item.description,
          status: item.status,
          categories: item.category,
          priority: item.priority,
          location: item.location,
          schedule: item.schedule.seconds.toString(),
          imageUrls: item.imageUrls,
          userId: item.userId,
          timestamp: item.timestamp,
        } as myTask)));
        console.log(data)
        setLoading(false)
      } catch (error) {
        console.error('Error fetching tasks:', error)
        setLoading(false)
        setError(error)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>Error: {error.toString()}</div>
  }

  return (
    <>
      <div className="md:hidden">
        <p>image</p>
        {/* <Image
          src="/examples/tasks-light.png"
          width={1280}
          height={998}
          alt="Playground"
          className="block dark:hidden"
        />
        <Image
          src="/examples/tasks-dark.png"
          width={1280}
          height={998}
          alt="Playground"
          className="hidden dark:block"
        /> */}
      </div>
      <div className="hidden h-full flex-1 flex-col space-y-8 p-8 md:flex">
        <div className="flex items-center justify-between space-y-2">
          {/* <div>
            <h2 className="text-2xl font-bold tracking-tight">Welcome back!</h2>
            <p className="text-muted-foreground">
              Here&apos;s a list of your tasks for this month!
            </p>
          </div> */}
          <div className="flex items-center space-x-2">
            <UserNav />
          </div>
        </div>
        {/* <DataTable data={tasks} columns={columns} /> */}
        <DataTable data={myTasks} columns={columns} />
      </div>
    </>
  )
}


// dummy data
// const tasksArr = [
//   {
//     "id": "TASK-7165",
//     "description": "Transmitting the card won't do anything, we need to compress the optical TCP protocol!",
//     "status": "done",
//     "categories": "training",
//     "priority": "medium",
//     "location": "San Bruno",
//     "schedule": "2024-09-15T14:10:32.928Z"
//   },
//   {
//     "id": "TASK-1371",
//     "description": "Use the neural DNS sensor, then you can back up the neural port!",
//     "status": "done",
//     "categories": "event_exhibition",
//     "priority": "low",
//     "location": "West Nathan",
//     "schedule": "2024-09-15T09:26:15.211Z"
//   },
//   {
//     "id": "TASK-3281",
//     "description": "If we transmit the monitor, we can get to the PNG circuit through the neural ASCII matrix!",
//     "status": "done",
//     "categories": "training",
//     "priority": "high",
//     "location": "Eldredstead",
//     "schedule": "2024-09-16T02:51:37.389Z"
//   },
//   {
//     "id": "TASK-5995",
//     "description": "Try to transmit the RSS feed, maybe it will hack the redundant monitor!",
//     "status": "in progress",
//     "categories": "event_exhibition",
//     "priority": "low",
//     "location": "North Vivienton",
//     "schedule": "2024-09-15T16:54:24.844Z"
//   },
//   {
//     "id": "TASK-1202",
//     "description": "The OCR transmitter is down, reboot the neural driver so we can calculate the HDD program!",
//     "status": "in progress",
//     "categories": "drugstore_visit",
//     "priority": "high",
//     "location": "New Curt",
//     "schedule": "2024-09-15T07:14:31.973Z"
//   },
//   {
//     "id": "TASK-3922",
//     "description": "Use the solid state CLI bandwidth, then you can bypass the wireless port!",
//     "status": "backlog",
//     "categories": "event_exhibition",
//     "priority": "medium",
//     "location": "National City",
//     "schedule": "2024-09-15T18:51:38.046Z"
//   },
//   {
//     "id": "TASK-6582",
//     "description": "Quantifying the hard drive won't do anything, we need to index the open-source PCI program!",
//     "status": "backlog",
//     "categories": "event_exhibition",
//     "priority": "high",
//     "location": "Lake Royville",
//     "schedule": "2024-09-15T22:53:47.375Z"
//   },
//   {
//     "id": "TASK-5652",
//     "description": "I'll compress the back-end SAS bus, that should card the PNG application!",
//     "status": "backlog",
//     "categories": "product_sharing",
//     "priority": "high",
//     "location": "South Howard",
//     "schedule": "2024-09-16T01:22:49.224Z"
//   },
//   {
//     "id": "TASK-5410",
//     "description": "The JSON microchip is down, bypass the online application so we can bypass the HTTP program!",
//     "status": "in progress",
//     "categories": "training",
//     "priority": "low",
//     "location": "West Magalihaven",
//     "schedule": "2024-09-16T05:49:44.413Z"
//   },
//   {
//     "id": "TASK-6461",
//     "description": "Try to synthesize the SSD driver, maybe it will generate the neural driver!",
//     "status": "done",
//     "categories": "training",
//     "priority": "high",
//     "location": "Merced",
//     "schedule": "2024-09-15T12:41:55.304Z"
//   },
//   {
//     "id": "TASK-1162",
//     "description": "Try to copy the AI alarm, maybe it will synthesize the open-source firewall!",
//     "status": "backlog",
//     "categories": "drugstore_visit",
//     "priority": "low",
//     "location": "Larsonbury",
//     "schedule": "2024-09-15T11:33:00.095Z"
//   },
//   {
//     "id": "TASK-2235",
//     "description": "If we input the feed, we can get to the DRAM transmitter through the digital HTTP application!",
//     "status": "in progress",
//     "categories": "training",
//     "priority": "medium",
//     "location": "East Zoilachester",
//     "schedule": "2024-09-15T15:41:02.449Z"
//   },
//   {
//     "id": "TASK-9996",
//     "description": "You can't connect the bus without bypassing the mobile DRAM hard drive!",
//     "status": "canceled",
//     "categories": "product_sharing",
//     "priority": "high",
//     "location": "Elijahboro",
//     "schedule": "2024-09-15T07:33:44.355Z"
//   },
//   {
//     "id": "TASK-5413",
//     "description": "I'll parse the neural RAM panel, that should card the API port!",
//     "status": "in progress",
//     "categories": "product_sharing",
//     "priority": "medium",
//     "location": "Lake Melodyborough",
//     "schedule": "2024-09-16T01:19:33.490Z"
//   },
//   {
//     "id": "TASK-5398",
//     "description": "I'll copy the back-end DRAM capacitor, that should circuit the SAS matrix!",
//     "status": "backlog",
//     "categories": "event_exhibition",
//     "priority": "high",
//     "location": "Fort Travisstad",
//     "schedule": "2024-09-16T02:54:35.048Z"
//   },
//   {
//     "id": "TASK-3342",
//     "description": "Try to compress the SCSI protocol, maybe it will transmit the optical circuit!",
//     "status": "todo",
//     "categories": "event_exhibition",
//     "priority": "high",
//     "location": "Metairie",
//     "schedule": "2024-09-15T21:50:09.724Z"
//   },
//   {
//     "id": "TASK-2375",
//     "description": "Use the redundant TCP monitor, then you can quantify the neural system!",
//     "status": "todo",
//     "categories": "event_exhibition",
//     "priority": "medium",
//     "location": "Lake Earnestineburgh",
//     "schedule": "2024-09-15T14:53:43.586Z"
//   },
//   {
//     "id": "TASK-1399",
//     "description": "You can't bypass the protocol without overriding the haptic JSON card!",
//     "status": "todo",
//     "categories": "product_sharing",
//     "priority": "medium",
//     "location": "Juliofurt",
//     "schedule": "2024-09-16T05:13:55.160Z"
//   },
//   {
//     "id": "TASK-7541",
//     "description": "Try to reboot the AI circuit, maybe it will parse the bluetooth matrix!",
//     "status": "canceled",
//     "categories": "drugstore_visit",
//     "priority": "high",
//     "location": "Clarkland",
//     "schedule": "2024-09-15T07:38:24.152Z"
//   },
//   {
//     "id": "TASK-2766",
//     "description": "Use the virtual SSL port, then you can transmit the back-end application!",
//     "status": "todo",
//     "categories": "product_sharing",
//     "priority": "medium",
//     "location": "Konopelskihaven",
//     "schedule": "2024-09-16T03:05:37.704Z"
//   },
//   {
//     "id": "TASK-4807",
//     "description": "If we program the application, we can get to the PNG feed through the multi-byte THX feed!",
//     "status": "canceled",
//     "categories": "product_sharing",
//     "priority": "medium",
//     "location": "Hicksville",
//     "schedule": "2024-09-16T04:33:22.212Z"
//   },
//   {
//     "id": "TASK-5008",
//     "description": "I'll compress the online SCSI panel, that should transmitter the SQL capacitor!",
//     "status": "done",
//     "categories": "product_sharing",
//     "priority": "medium",
//     "location": "Adolfburgh",
//     "schedule": "2024-09-16T02:07:11.497Z"
//   },
//   {
//     "id": "TASK-6669",
//     "description": "Try to override the THX interface, maybe it will back up the 1080p array!",
//     "status": "canceled",
//     "categories": "product_sharing",
//     "priority": "high",
//     "location": "Lake Kennethberg",
//     "schedule": "2024-09-15T12:20:54.860Z"
//   },
//   {
//     "id": "TASK-9876",
//     "description": "The SCSI transmitter is down, quantify the optical alarm so we can synthesize the DNS feed!",
//     "status": "in progress",
//     "categories": "product_sharing",
//     "priority": "low",
//     "location": "Port Kennethtown",
//     "schedule": "2024-09-15T13:49:38.034Z"
//   },
//   {
//     "id": "TASK-1277",
//     "description": "I'll calculate the auxiliary ADP port, that should matrix the CLI alarm!",
//     "status": "backlog",
//     "categories": "product_sharing",
//     "priority": "high",
//     "location": "Dejuanville",
//     "schedule": "2024-09-15T09:10:35.947Z"
//   },
//   {
//     "id": "TASK-6723",
//     "description": "Use the auxiliary PNG panel, then you can back up the back-end pixel!",
//     "status": "in progress",
//     "categories": "drugstore_visit",
//     "priority": "low",
//     "location": "Fort Carlosside",
//     "schedule": "2024-09-15T19:44:57.343Z"
//   },
//   {
//     "id": "TASK-9645",
//     "description": "We need to connect the multi-byte ADP monitor!",
//     "status": "canceled",
//     "categories": "drugstore_visit",
//     "priority": "high",
//     "location": "Trantowfield",
//     "schedule": "2024-09-15T10:08:00.344Z"
//   },
//   {
//     "id": "TASK-1749",
//     "description": "The SAS feed is down, navigate the solid state pixel so we can back up the SSL program!",
//     "status": "todo",
//     "categories": "product_sharing",
//     "priority": "low",
//     "location": "West Teagan",
//     "schedule": "2024-09-15T23:29:48.010Z"
//   },
//   {
//     "id": "TASK-5553",
//     "description": "I'll quantify the mobile IB panel, that should bus the TLS alarm!",
//     "status": "todo",
//     "categories": "event_exhibition",
//     "priority": "high",
//     "location": "Wolffville",
//     "schedule": "2024-09-15T18:34:31.375Z"
//   },
//   {
//     "id": "TASK-1012",
//     "description": "Use the primary CLI hard drive, then you can reboot the primary bus!",
//     "status": "done",
//     "categories": "drugstore_visit",
//     "priority": "low",
//     "location": "North Lauretta",
//     "schedule": "2024-09-16T06:31:01.163Z"
//   },
//   {
//     "id": "TASK-4185",
//     "description": "If we index the monitor, we can get to the ASCII matrix through the optical DNS matrix!",
//     "status": "done",
//     "categories": "doctor_meeting",
//     "priority": "medium",
//     "location": "Lake Caleigh",
//     "schedule": "2024-09-15T17:23:57.817Z"
//   },
//   {
//     "id": "TASK-3846",
//     "description": "I'll transmit the virtual JBOD microchip, that should program the HDD transmitter!",
//     "status": "todo",
//     "categories": "event_exhibition",
//     "priority": "low",
//     "location": "Andersontown",
//     "schedule": "2024-09-15T23:15:12.214Z"
//   },
//   {
//     "id": "TASK-5338",
//     "description": "Try to back up the SSD hard drive, maybe it will hack the back-end capacitor!",
//     "status": "todo",
//     "categories": "doctor_meeting",
//     "priority": "low",
//     "location": "North Rutheland",
//     "schedule": "2024-09-15T23:25:23.358Z"
//   },
//   {
//     "id": "TASK-3547",
//     "description": "Bypassing the firewall won't do anything, we need to navigate the mobile IP port!",
//     "status": "in progress",
//     "categories": "product_sharing",
//     "priority": "low",
//     "location": "Westland",
//     "schedule": "2024-09-15T18:28:54.476Z"
//   },
//   {
//     "id": "TASK-7215",
//     "description": "I'll synthesize the online IB driver, that should sensor the OCR bandwidth!",
//     "status": "done",
//     "categories": "drugstore_visit",
//     "priority": "low",
//     "location": "Port Bellview",
//     "schedule": "2024-09-16T03:28:43.374Z"
//   },
//   {
//     "id": "TASK-8749",
//     "description": "I'll program the digital TCP feed, that should port the AI alarm!",
//     "status": "backlog",
//     "categories": "product_sharing",
//     "priority": "low",
//     "location": "Erdmanport",
//     "schedule": "2024-09-16T02:08:23.901Z"
//   },
//   {
//     "id": "TASK-7295",
//     "description": "We need to index the back-end THX monitor!",
//     "status": "backlog",
//     "categories": "doctor_meeting",
//     "priority": "high",
//     "location": "New Karenchester",
//     "schedule": "2024-09-16T00:39:47.048Z"
//   },
//   {
//     "id": "TASK-7242",
//     "description": "If we back up the card, we can get to the CSS port through the mobile SDD sensor!",
//     "status": "in progress",
//     "categories": "product_sharing",
//     "priority": "low",
//     "location": "Shannonstead",
//     "schedule": "2024-09-15T22:09:42.269Z"
//   },
//   {
//     "id": "TASK-8131",
//     "description": "Use the solid state UTF8 alarm, then you can compress the back-end program!",
//     "status": "canceled",
//     "categories": "training",
//     "priority": "low",
//     "location": "Port Faechester",
//     "schedule": "2024-09-15T09:06:26.364Z"
//   },
//   {
//     "id": "TASK-7976",
//     "description": "If we compress the hard drive, we can get to the UDP protocol through the redundant UTF8 application!",
//     "status": "todo",
//     "categories": "product_sharing",
//     "priority": "medium",
//     "location": "New Ward",
//     "schedule": "2024-09-16T04:53:39.599Z"
//   },
//   {
//     "id": "TASK-1901",
//     "description": "The TLS protocol is down, override the optical card so we can input the UDP interface!",
//     "status": "backlog",
//     "categories": "event_exhibition",
//     "priority": "medium",
//     "location": "East Harold",
//     "schedule": "2024-09-16T03:07:10.602Z"
//   },
//   {
//     "id": "TASK-4477",
//     "description": "Use the primary OCR pixel, then you can connect the 1080p matrix!",
//     "status": "done",
//     "categories": "training",
//     "priority": "medium",
//     "location": "Deanland",
//     "schedule": "2024-09-15T18:09:29.429Z"
//   },
//   {
//     "id": "TASK-5565",
//     "description": "Try to calculate the TCP firewall, maybe it will connect the redundant transmitter!",
//     "status": "in progress",
//     "categories": "training",
//     "priority": "medium",
//     "location": "St. Charles",
//     "schedule": "2024-09-15T17:20:31.598Z"
//   },
//   {
//     "id": "TASK-6347",
//     "description": "You can't reboot the bus without transmitting the online AI protocol!",
//     "status": "done",
//     "categories": "training",
//     "priority": "medium",
//     "location": "Port Pamela",
//     "schedule": "2024-09-15T15:31:33.203Z"
//   },
//   {
//     "id": "TASK-5985",
//     "description": "Use the multi-byte EXE driver, then you can reboot the online protocol!",
//     "status": "backlog",
//     "categories": "event_exhibition",
//     "priority": "low",
//     "location": "Fort Thora",
//     "schedule": "2024-09-16T06:16:22.642Z"
//   },
//   {
//     "id": "TASK-8029",
//     "description": "You can't connect the capacitor without generating the redundant IB pixel!",
//     "status": "todo",
//     "categories": "training",
//     "priority": "medium",
//     "location": "West Allis",
//     "schedule": "2024-09-15T07:37:33.700Z"
//   },
//   {
//     "id": "TASK-8548",
//     "description": "You can't program the microchip without overriding the online SSD circuit!",
//     "status": "canceled",
//     "categories": "doctor_meeting",
//     "priority": "low",
//     "location": "New Earline",
//     "schedule": "2024-09-16T04:25:02.324Z"
//   },
//   {
//     "id": "TASK-8253",
//     "description": "Use the multi-byte JBOD driver, then you can program the haptic capacitor!",
//     "status": "in progress",
//     "categories": "doctor_meeting",
//     "priority": "medium",
//     "location": "Dooleyberg",
//     "schedule": "2024-09-16T06:51:40.770Z"
//   },
//   {
//     "id": "TASK-9206",
//     "description": "If we generate the matrix, we can get to the SSL protocol through the solid state CLI transmitter!",
//     "status": "canceled",
//     "categories": "event_exhibition",
//     "priority": "low",
//     "location": "Fort Coty",
//     "schedule": "2024-09-15T19:49:10.349Z"
//   },
//   {
//     "id": "TASK-4337",
//     "description": "Try to transmit the SDD transmitter, maybe it will hack the haptic firewall!",
//     "status": "done",
//     "categories": "event_exhibition",
//     "priority": "low",
//     "location": "Gorczanycester",
//     "schedule": "2024-09-15T14:19:36.045Z"
//   },
//   {
//     "id": "TASK-3776",
//     "description": "Bypassing the circuit won't do anything, we need to override the back-end SQL port!",
//     "status": "in progress",
//     "categories": "doctor_meeting",
//     "priority": "high",
//     "location": "Fort Shaynaside",
//     "schedule": "2024-09-15T22:58:23.054Z"
//   },
//   {
//     "id": "TASK-9730",
//     "description": "I'll compress the open-source UTF8 interface, that should application the SSL feed!",
//     "status": "done",
//     "categories": "training",
//     "priority": "low",
//     "location": "Berniertown",
//     "schedule": "2024-09-15T09:01:16.969Z"
//   },
//   {
//     "id": "TASK-5509",
//     "description": "We need to parse the primary HTTP matrix!",
//     "status": "canceled",
//     "categories": "doctor_meeting",
//     "priority": "low",
//     "location": "Wilson",
//     "schedule": "2024-09-16T04:47:25.517Z"
//   },
//   {
//     "id": "TASK-4995",
//     "description": "I'll reboot the digital PCI pixel, that should sensor the CLI driver!",
//     "status": "canceled",
//     "categories": "event_exhibition",
//     "priority": "high",
//     "location": "Kohlershire",
//     "schedule": "2024-09-16T04:52:30.708Z"
//   },
//   {
//     "id": "TASK-5327",
//     "description": "Use the 1080p PNG sensor, then you can transmit the bluetooth bus!",
//     "status": "done",
//     "categories": "doctor_meeting",
//     "priority": "high",
//     "location": "South Elenorashire",
//     "schedule": "2024-09-15T18:11:40.276Z"
//   },
//   {
//     "id": "TASK-5211",
//     "description": "The THX matrix is down, compress the wireless alarm so we can compress the JSON pixel!",
//     "status": "todo",
//     "categories": "doctor_meeting",
//     "priority": "low",
//     "location": "Nienowmouth",
//     "schedule": "2024-09-16T02:36:01.912Z"
//   },
//   {
//     "id": "TASK-1078",
//     "description": "Use the digital ADP microchip, then you can connect the optical program!",
//     "status": "done",
//     "categories": "training",
//     "priority": "high",
//     "location": "Cronafurt",
//     "schedule": "2024-09-15T11:31:36.546Z"
//   },
//   {
//     "id": "TASK-4631",
//     "description": "The OCR interface is down, connect the bluetooth firewall so we can input the UTF8 driver!",
//     "status": "done",
//     "categories": "doctor_meeting",
//     "priority": "high",
//     "location": "Felicityview",
//     "schedule": "2024-09-15T16:56:27.788Z"
//   },
//   {
//     "id": "TASK-1478",
//     "description": "If we program the sensor, we can get to the XML interface through the open-source JSON firewall!",
//     "status": "canceled",
//     "categories": "event_exhibition",
//     "priority": "low",
//     "location": "East Destinee",
//     "schedule": "2024-09-16T02:38:27.184Z"
//   },
//   {
//     "id": "TASK-3498",
//     "description": "Try to calculate the SMS panel, maybe it will back up the optical hard drive!",
//     "status": "in progress",
//     "categories": "doctor_meeting",
//     "priority": "high",
//     "location": "Port Bessie",
//     "schedule": "2024-09-15T10:31:57.273Z"
//   },
//   {
//     "id": "TASK-3914",
//     "description": "I'll connect the bluetooth CSS sensor, that should alarm the RAM bandwidth!",
//     "status": "backlog",
//     "categories": "training",
//     "priority": "medium",
//     "location": "South Gabrielchester",
//     "schedule": "2024-09-16T01:41:29.859Z"
//   },
//   {
//     "id": "TASK-1418",
//     "description": "The HTTP monitor is down, program the digital bus so we can generate the DNS program!",
//     "status": "in progress",
//     "categories": "drugstore_visit",
//     "priority": "low",
//     "location": "Santa Maria",
//     "schedule": "2024-09-15T10:55:48.023Z"
//   },
//   {
//     "id": "TASK-5145",
//     "description": "Overriding the card won't do anything, we need to navigate the auxiliary RAM hard drive!",
//     "status": "backlog",
//     "categories": "event_exhibition",
//     "priority": "low",
//     "location": "Jolieton",
//     "schedule": "2024-09-15T20:04:56.613Z"
//   },
//   {
//     "id": "TASK-1749",
//     "description": "Parsing the program won't do anything, we need to transmit the multi-byte RSS feed!",
//     "status": "done",
//     "categories": "product_sharing",
//     "priority": "high",
//     "location": "North Sandyworth",
//     "schedule": "2024-09-15T18:25:38.803Z"
//   },
//   {
//     "id": "TASK-9949",
//     "description": "Use the primary HEX protocol, then you can transmit the solid state firewall!",
//     "status": "in progress",
//     "categories": "training",
//     "priority": "medium",
//     "location": "Buena Park",
//     "schedule": "2024-09-15T07:33:29.274Z"
//   },
//   {
//     "id": "TASK-8184",
//     "description": "If we generate the transmitter, we can get to the UTF8 monitor through the 1080p EXE firewall!",
//     "status": "done",
//     "categories": "event_exhibition",
//     "priority": "low",
//     "location": "Ernestoview",
//     "schedule": "2024-09-15T22:28:31.736Z"
//   },
//   {
//     "id": "TASK-8016",
//     "description": "You can't hack the circuit without quantifying the neural OCR monitor!",
//     "status": "in progress",
//     "categories": "event_exhibition",
//     "priority": "low",
//     "location": "South Webster",
//     "schedule": "2024-09-15T08:16:33.095Z"
//   },
//   {
//     "id": "TASK-8212",
//     "description": "We need to navigate the wireless XML matrix!",
//     "status": "backlog",
//     "categories": "event_exhibition",
//     "priority": "medium",
//     "location": "Roseville",
//     "schedule": "2024-09-16T01:52:05.042Z"
//   },
//   {
//     "id": "TASK-4945",
//     "description": "We need to quantify the solid state XSS driver!",
//     "status": "in progress",
//     "categories": "event_exhibition",
//     "priority": "high",
//     "location": "North Kelvin",
//     "schedule": "2024-09-16T03:10:54.050Z"
//   },
//   {
//     "id": "TASK-8161",
//     "description": "The IB interface is down, connect the digital application so we can navigate the UTF8 feed!",
//     "status": "backlog",
//     "categories": "training",
//     "priority": "medium",
//     "location": "West Flavie",
//     "schedule": "2024-09-15T18:15:27.284Z"
//   },
//   {
//     "id": "TASK-6100",
//     "description": "Try to copy the SSD bandwidth, maybe it will copy the optical pixel!",
//     "status": "in progress",
//     "categories": "doctor_meeting",
//     "priority": "low",
//     "location": "Johannafield",
//     "schedule": "2024-09-15T10:05:26.947Z"
//   },
//   {
//     "id": "TASK-9898",
//     "description": "We need to synthesize the neural SAS sensor!",
//     "status": "in progress",
//     "categories": "drugstore_visit",
//     "priority": "high",
//     "location": "Taylor",
//     "schedule": "2024-09-15T23:39:38.925Z"
//   },
//   {
//     "id": "TASK-7309",
//     "description": "I'll copy the virtual EXE protocol, that should protocol the UTF8 monitor!",
//     "status": "todo",
//     "categories": "event_exhibition",
//     "priority": "high",
//     "location": "Bellefurt",
//     "schedule": "2024-09-16T01:40:28.231Z"
//   },
//   {
//     "id": "TASK-6417",
//     "description": "You can't transmit the interface without navigating the multi-byte SAS bandwidth!",
//     "status": "backlog",
//     "categories": "drugstore_visit",
//     "priority": "low",
//     "location": "North Jude",
//     "schedule": "2024-09-15T12:30:08.431Z"
//   },
//   {
//     "id": "TASK-5145",
//     "description": "If we override the program, we can get to the UTF8 firewall through the mobile CLI sensor!",
//     "status": "canceled",
//     "categories": "drugstore_visit",
//     "priority": "high",
//     "location": "Creminside",
//     "schedule": "2024-09-15T23:34:02.251Z"
//   },
//   {
//     "id": "TASK-4603",
//     "description": "Try to bypass the AI sensor, maybe it will back up the bluetooth panel!",
//     "status": "todo",
//     "categories": "doctor_meeting",
//     "priority": "low",
//     "location": "North Karatown",
//     "schedule": "2024-09-16T03:10:30.951Z"
//   },
//   {
//     "id": "TASK-3292",
//     "description": "We need to connect the bluetooth SQL feed!",
//     "status": "backlog",
//     "categories": "event_exhibition",
//     "priority": "high",
//     "location": "East Nathen",
//     "schedule": "2024-09-15T10:38:15.844Z"
//   },
//   {
//     "id": "TASK-4067",
//     "description": "I'll transmit the multi-byte SSL bandwidth, that should interface the GB capacitor!",
//     "status": "in progress",
//     "categories": "drugstore_visit",
//     "priority": "low",
//     "location": "Gerardocester",
//     "schedule": "2024-09-15T20:31:47.646Z"
//   },
//   {
//     "id": "TASK-8363",
//     "description": "You can't input the protocol without bypassing the auxiliary SAS array!",
//     "status": "backlog",
//     "categories": "drugstore_visit",
//     "priority": "high",
//     "location": "New Stuartland",
//     "schedule": "2024-09-15T18:45:06.409Z"
//   },
//   {
//     "id": "TASK-1704",
//     "description": "I'll quantify the digital UDP pixel, that should pixel the SQL interface!",
//     "status": "todo",
//     "categories": "drugstore_visit",
//     "priority": "high",
//     "location": "Lake Mia",
//     "schedule": "2024-09-15T17:02:06.873Z"
//   },
//   {
//     "id": "TASK-9957",
//     "description": "Use the digital SQL system, then you can override the haptic array!",
//     "status": "backlog",
//     "categories": "event_exhibition",
//     "priority": "medium",
//     "location": "Pharr",
//     "schedule": "2024-09-15T21:07:41.209Z"
//   },
//   {
//     "id": "TASK-7136",
//     "description": "Use the mobile UDP sensor, then you can generate the online system!",
//     "status": "done",
//     "categories": "training",
//     "priority": "high",
//     "location": "Vineland",
//     "schedule": "2024-09-15T22:33:43.381Z"
//   },
//   {
//     "id": "TASK-7212",
//     "description": "The HDD circuit is down, navigate the cross-platform interface so we can reboot the SSL pixel!",
//     "status": "canceled",
//     "categories": "doctor_meeting",
//     "priority": "medium",
//     "location": "Arvada",
//     "schedule": "2024-09-15T15:11:53.769Z"
//   },
//   {
//     "id": "TASK-7170",
//     "description": "If we synthesize the panel, we can get to the TCP monitor through the 1080p ADP program!",
//     "status": "canceled",
//     "categories": "training",
//     "priority": "medium",
//     "location": "Port Imaniville",
//     "schedule": "2024-09-16T02:54:40.619Z"
//   },
//   {
//     "id": "TASK-9210",
//     "description": "You can't bypass the hard drive without programming the back-end IB port!",
//     "status": "backlog",
//     "categories": "training",
//     "priority": "low",
//     "location": "East Alfredo",
//     "schedule": "2024-09-15T17:27:20.182Z"
//   },
//   {
//     "id": "TASK-4678",
//     "description": "If we copy the card, we can get to the JBOD driver through the open-source CSS transmitter!",
//     "status": "in progress",
//     "categories": "drugstore_visit",
//     "priority": "high",
//     "location": "Harristown",
//     "schedule": "2024-09-15T20:14:40.281Z"
//   },
//   {
//     "id": "TASK-4081",
//     "description": "If we back up the capacitor, we can get to the JSON monitor through the redundant ASCII protocol!",
//     "status": "done",
//     "categories": "product_sharing",
//     "priority": "high",
//     "location": "Norman",
//     "schedule": "2024-09-16T04:00:23.574Z"
//   },
//   {
//     "id": "TASK-7268",
//     "description": "Hacking the feed won't do anything, we need to back up the online RAM hard drive!",
//     "status": "done",
//     "categories": "doctor_meeting",
//     "priority": "medium",
//     "location": "Alafaya",
//     "schedule": "2024-09-15T09:38:20.355Z"
//   },
//   {
//     "id": "TASK-6116",
//     "description": "You can't quantify the matrix without calculating the neural ADP firewall!",
//     "status": "in progress",
//     "categories": "doctor_meeting",
//     "priority": "low",
//     "location": "Port Mohammadboro",
//     "schedule": "2024-09-16T01:30:53.681Z"
//   },
//   {
//     "id": "TASK-9101",
//     "description": "Programming the capacitor won't do anything, we need to back up the open-source DNS feed!",
//     "status": "canceled",
//     "categories": "event_exhibition",
//     "priority": "low",
//     "location": "South Maximus",
//     "schedule": "2024-09-16T00:08:42.978Z"
//   },
//   {
//     "id": "TASK-4347",
//     "description": "If we parse the program, we can get to the TLS circuit through the optical THX protocol!",
//     "status": "in progress",
//     "categories": "training",
//     "priority": "medium",
//     "location": "Tyrabury",
//     "schedule": "2024-09-16T03:55:07.558Z"
//   },
//   {
//     "id": "TASK-5325",
//     "description": "Try to input the HEX circuit, maybe it will compress the solid state port!",
//     "status": "done",
//     "categories": "drugstore_visit",
//     "priority": "high",
//     "location": "East Shanelberg",
//     "schedule": "2024-09-15T15:54:24.596Z"
//   },
//   {
//     "id": "TASK-6779",
//     "description": "The SSL matrix is down, reboot the digital bandwidth so we can calculate the HTTP microchip!",
//     "status": "todo",
//     "categories": "training",
//     "priority": "low",
//     "location": "Osinskifurt",
//     "schedule": "2024-09-16T04:59:14.305Z"
//   },
//   {
//     "id": "TASK-5576",
//     "description": "Hacking the port won't do anything, we need to generate the online UDP capacitor!",
//     "status": "canceled",
//     "categories": "training",
//     "priority": "medium",
//     "location": "Silver Spring",
//     "schedule": "2024-09-16T02:28:55.279Z"
//   },
//   {
//     "id": "TASK-3017",
//     "description": "We need to navigate the auxiliary RAM port!",
//     "status": "in progress",
//     "categories": "drugstore_visit",
//     "priority": "low",
//     "location": "Kristofferboro",
//     "schedule": "2024-09-15T22:06:12.448Z"
//   },
//   {
//     "id": "TASK-6808",
//     "description": "I'll connect the digital GB feed, that should bus the API microchip!",
//     "status": "done",
//     "categories": "event_exhibition",
//     "priority": "medium",
//     "location": "North Giovanistad",
//     "schedule": "2024-09-15T17:26:26.267Z"
//   },
//   {
//     "id": "TASK-3732",
//     "description": "If we input the interface, we can get to the OCR port through the back-end UDP microchip!",
//     "status": "done",
//     "categories": "training",
//     "priority": "low",
//     "location": "Isobelmouth",
//     "schedule": "2024-09-15T14:33:37.521Z"
//   },
//   {
//     "id": "TASK-7680",
//     "description": "I'll calculate the redundant TLS firewall, that should monitor the GB firewall!",
//     "status": "backlog",
//     "categories": "doctor_meeting",
//     "priority": "high",
//     "location": "Lake Luz",
//     "schedule": "2024-09-16T05:03:33.039Z"
//   },
//   {
//     "id": "TASK-5902",
//     "description": "Transmitting the port won't do anything, we need to transmit the digital HTTP firewall!",
//     "status": "done",
//     "categories": "product_sharing",
//     "priority": "low",
//     "location": "West Justine",
//     "schedule": "2024-09-15T11:43:21.963Z"
//   },
//   {
//     "id": "TASK-6558",
//     "description": "We need to input the wireless API array!",
//     "status": "todo",
//     "categories": "doctor_meeting",
//     "priority": "low",
//     "location": "Parkertown",
//     "schedule": "2024-09-15T08:58:09.362Z"
//   }
// ]
// const tasks = JSON.parse(JSON.stringify(tasksArr))
// console.log(tasks)

// // Simulate a database read for tasks.
// function getTasks() {
//   return z.array(taskSchema).parse(tasks)
// }
