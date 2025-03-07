// import { z } from "zod"
// import { taskSchema } from "./data/schema"
// import { taskSchema } from "./data/tasks.schema"
import { columns } from "./components/columns"
import { DataTable } from "./components/data-table"
import { UserNav } from "./components/user-nav"
import { useEffect, useState } from "react"

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
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | string | null | unknown>(null);
  // const [tasks, setTasks] = useState<Task[]>([])
  // const [myTasks, setMyTasks] = useState<DocumentData[]>([]);
  const [myTasks, setMyTasks] = useState<myTask[]>([]);
  


  useEffect(() => {
    const fetchData = async () => {
      try {
        
        // const res = await window.api.post(
        //   `${import.meta.env.VITE_BACKEND_BASE_URL}/activity/check-in`,
        //   formData,
        //   {
        //     headers: {
        //       'Content-Type': 'multipart/form-data',
        //       'x-api-key': import.meta.env.VITE_BACKEND_API_KEY,
        //       'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        //     }
        //   }
        // );

        const userDetail = JSON.parse(localStorage.getItem("userDetail") || '{}');
        const fetchResponse = await window.api.get(
          `${import.meta.env.VITE_BACKEND_BASE_URL}/activity/user/${userDetail.id}`,
          {
            headers: {
              'x-api-key': import.meta.env.VITE_BACKEND_API_KEY,
              'Authorization': `Bearer ${localStorage.getItem('access_token')}`
            }
          }
        );

        const fetchedData = fetchResponse.data.data;

        console.log("fetchedData: ", fetchedData);

        // setMyTasks(data.map(item => ({
        //   id: item.id,
        //   description: item.description,
        //   status: item.status,
        //   categories: item.category,
        //   priority: item.priority,
        //   location: item.location,
        //   schedule: item.schedule.seconds.toString(),
        //   imageUrls: item.imageUrls,
        //   userId: item.userId,
        //   timestamp: item.timestamp,
        // } as myTask)));

        setLoading(false);
        

        // const activitiesRef = collection(db, `users-activity/${userId}/activities`);
        // const docSnap = await getDocs(activitiesRef);

        // const data = docSnap.docs.map((doc) => ({
        //   id: doc.id,
        //   ...doc.data(),
        // } as any));

        setMyTasks(fetchedData.map((item: any) => ({
          id: item.id_activity,
          description: item.description,
          status: item.status,
          categories: item.category,
          priority: item.priority,
          location: item.location,
          schedule: item.schedule,
          imageUrls: item.image_urls,
          userId: item.user_id,
          timestamp: item.timestamp,
        } as myTask)));
        // console.log(data)
        setLoading(false)
      } catch (error) {
        console.error('Error fetching tasks:', error)
        setLoading(false)
        setError(error)
      }
    }

    fetchData()
  }, [])


  const updateTaskStatus = async (taskId: string, newStatus: string) => {
    console.log("updateTaskStatus: ", taskId, newStatus);
    try {
      // const userId = JSON.parse(localStorage.getItem("userDetail") || '{}').id;

       await window.api.patch(
        `${import.meta.env.VITE_DIRECTUS_BASE_URL}/items/activity/${taskId}`,
        {
          status: newStatus,
        },
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`
          }
        }
      );
      

      // const fetchedData = fetchResponse.data.data;
      // const taskRef = doc(db, `users-activity/${userId}/activities`, taskId);
      // await updateDoc(taskRef, { status: newStatus });

      // Update local state
      setMyTasks(prevTasks =>
        prevTasks.map(task =>
          task.id === taskId ? { ...task, status: newStatus } : task
        )
      );
    } catch (error) {
      console.error('Error updating task status:', error);
      // Handle error (e.g., show a notification to the user)
    }
  };


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
        <DataTable data={myTasks} columns={columns} updateTaskStatus={updateTaskStatus} />
      </div>
    </>
  )
}


