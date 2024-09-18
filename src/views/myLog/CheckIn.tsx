import { ComponentProps } from 'react'
// import { useNavigate } from 'react-router-dom'
import './CheckIn.css'
// ui
import {
  FileInput,
  FileUploader,
  FileUploaderContent,
  FileUploaderItem,
} from "@/components/extension/file-upload"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardFooter
} from "@/components/ui/card"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { cn } from "@/lib/utils"
import { zodResolver } from "@hookform/resolvers/zod"
import { CalendarIcon, Paperclip } from "lucide-react"
import { useState } from "react"
import { DropzoneOptions } from "react-dropzone"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useNavigate } from 'react-router-dom'
import { useToast } from '@/hooks/use-toast'
import { ToastAction } from '@/components/ui/toast'

import { categories, statuses, priorities } from '../scheduleRecap/recap-detail/data/tasks.data'
import { db, storage } from '@/repository/firebase/config'
// import { db } from '@/repository/firebase/config'
import { doc, setDoc } from 'firebase/firestore'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import { useAuthContext } from '../auth/AuthContext'
import { Popover, PopoverTrigger } from '@/components/ui/popover'
import { format } from 'date-fns'
import { PopoverContent } from '@radix-ui/react-popover'
import { Calendar } from '@/components/ui/calendar'
import { v4 as uuidv4 } from 'uuid'

interface ActivityLogModel {
  id: string;
  location: string;
  schedule: string;
  priority: string;
  status: string;
  description: string;
  category: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
  imageUrls: string[];
  timestamp: string;
}

type CardProps = ComponentProps<typeof Card>

const formSchema = z
  .object({
    location: z.string().min(3),
    // schedule: z.string().min(3),
    priority: z.string().min(3),
    status: z.string().min(3),
    description: z.string().min(3),
    category: z.string().min(3),
    schedule: z.date(),
  });

const FileSvgDraw = () => {
  return (
    <>
      <svg
        className="w-8 h-8 mb-3 text-gray-500 dark:text-gray-400"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 20 16"
      >
        <path
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
        />
      </svg>
      <p className="mb-1 text-sm text-gray-500 dark:text-gray-400">
        <span className="font-semibold text-sm">Click to upload</span>
        &nbsp; or drag and drop
      </p>
      <p className="text-xs text-gray-500 dark:text-gray-400">
        SVG, PNG, JPG or GIF
      </p>
    </>
  );
};

// Helper function to get week number (ISO week)
// function getWeekNumber(d: Date) {
//   const oneJan = new Date(d.getFullYear(), 0, 1);
//   const numberOfDays = Math.floor((d - oneJan) / (24 * 60 * 60 * 1000));
//   return Math.ceil((d.getDay() + 1 + numberOfDays) / 7);
// }



export default function CheckIn({ className, ...props }: CardProps) {
  // const navigate = useNavigate()
  // const { user } = useContext(AuthContext);
  const { toast } = useToast();
  const navigate = useNavigate();
  const [error] = useState('');
  const user = useAuthContext();

  //setup files to uplaod
  const [files, setFiles] = useState<File[] | null>([]);
  const dropzone = {
    accept: {
      "image/*": [".jpg", ".jpeg", ".png"],
    },
    multiple: true,
    maxFiles: 4,
    maxSize: 1 * 1024 * 1024,
  } satisfies DropzoneOptions;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      location: "",
      // schedule: "",
      priority: "",
      status: "",
      description: "",
      category: "",
      schedule: undefined,
    },
  })

  async function backToHome() {
    navigate('/home')
  }

  async function resetForm() {
    form.reset();
    setFiles([]);
    // form.setValue('category', "")
  }

  async function onSubmit(values: z.infer<typeof formSchema>, files: File[] | null) {
    console.log("currentUser: ", user)
    console.log(values);
    console.log("stringify obj", JSON.stringify(values));
    console.log(files);
    let activityLogModel = {} as ActivityLogModel;
    const v = values;
    v.schedule.toString();
    Object.assign(activityLogModel, v)
    console.log("assigning values to interface: ", activityLogModel)


    // test uplaod image
    let uploadedImageUrls: string[] = [];
    try {
      // const storageRef = ref(storage, `attachments/${Date.now()}`);
      if (files?.length) {
        // uploadBytes(storageRef, files[0]).then(async (snapshot) => {
        //   const url = await getDownloadURL(snapshot.ref);
        //   console.log("url: ", url)
        //   console.log('Uploaded a blob or file! with url: ', snapshot);
        // });

        for (const file of files) {
          const storageRef = ref(storage, `attachments/${Date.now()}`);
          await uploadBytes(storageRef, file).then(async (snapshot) => {
            await getDownloadURL(snapshot.ref).then(url => {
              uploadedImageUrls.push(url);
            });

            console.log('Uploaded a blob or file!');
          });
        }


      }
    } catch (error) {
      console.log("error adding image", error);
    }

    console.log("uploadedImageUrls: ", uploadedImageUrls)
    if (uploadedImageUrls.length) {
      console.log("imageUrl is present")
      activityLogModel.imageUrls = uploadedImageUrls;
    } else {
      console.log("imageUrl is somehow not present")
      activityLogModel.imageUrls = uploadedImageUrls;
    }

    // uplaod activity with image
    try {
      // const docRef = await addDoc(collection(db, "activity"), values);
      // const myId = `123!!-${Date.now()}`

      // const docIdByUid = `${user?.user?.uid}-${Date.now()}


      // activityLogModel.userId = userId





      const currentYear = new Date(activityLogModel.schedule).getFullYear();
      const currentMonth = new Date(activityLogModel.schedule).getMonth() + 1;
      // const date = new Date(parseInt(activityLogModel.timestamp))

      console.log("currentYear: ", currentYear)
      console.log("currentMonth: ", currentMonth)

      //write to main activity
      if (user?.user?.uid) {
        console.log("user?.user?.uid: ", user?.user?.uid);
        activityLogModel.userId = user?.user?.uid;
        activityLogModel.timestamp = Date.now().toString()
      }
      let activityId = uuidv4();
      const docRef = doc(db, `users-activity/${activityLogModel.userId}/activities`, activityId);

      console.log("activityId: ", activityId)

      await setDoc(docRef, activityLogModel).then(() => {
        console.log("success")
        activityId = "";
        form.reset();
      })

      // await updateDoc(docRef, {
      //   [`${activityId}`]: activityLogModel
      // });

      // write to activities by month
      // const monthRef = doc(db, `activities_by_month`, `${currentYear}-${currentMonth}`)
      // await setDoc(monthRef, {
      //   [docRef.id]: {
      //     ...activityLogModel,
      //   }
      // }, {
      //   merge: true,
      // })

      // write to activities by week
      // const currentWeek = getWeekNumber(date);
      // const weekRef = doc(db, `activities_by_week`, `${currentYear}-${currentMonth}-${currentWeek}`)
    } catch (error) {
      console.log("error adding document", error);
    }



    toast({
      title: "Data Value",
      // description: "There was a problem with your request.",
      description: (
        <pre style={{ whiteSpace: "pre-wrap", wordWrap: "break-word" }}>
          {JSON.stringify(values, null, 2)}
        </pre>
      ),
      action: <ToastAction altText="Try again" onClick={() => resetForm()}>Reset Form</ToastAction>,

    })
  }


  return (
    <main className='flex items-center justify-center min-h-[calc(100vh-64px)]'>
      <Card className={cn(className)} {...props}>
        <CardContent>
          <p>Acitivity - Check In</p>
          <Form {...form}>
            {error && <p>{error}</p>}
            <form onSubmit={form.handleSubmit((values) => onSubmit(values, files))}>
              <div className='mt-4 space-y-3'>
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem className='space-y-0'>
                      <div className='grid grid-cols-4 items-center'>
                        <FormLabel className='col-span-1'>Location</FormLabel>
                        <FormControl className='col-span-3'>
                          <Input placeholder="Add Location" {...field} />
                        </FormControl>
                      </div>

                      <FormMessage />
                    </FormItem>
                  )}
                />



                {/* PRIORITY */}
                <FormField
                  control={form.control}
                  name="priority"
                  render={({ field }) => (
                    <FormItem className='space-y-0'>
                      <div className='grid grid-cols-4 items-center'>
                        <FormLabel className='col-span-1'>Priority</FormLabel>
                        {/* <FormControl className='col-span-3'>
                          <Input placeholder="Add Priority" {...field} />
                        </FormControl> */}

                        <div className='col-span-3'>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Choose Priority" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {
                                priorities.map((priority) => (
                                  <SelectItem key={priority.value} value={priority.value}>
                                    <div className="flex w-[100px] items-center">
                                      {
                                        priority.icon && (
                                          <priority.icon
                                            className='mr-2 h-4 w-4 text-muted-foreground'
                                          />
                                        )
                                      }
                                      <span>{priority.label}</span>
                                    </div>

                                  </SelectItem>
                                ))
                              }
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* STATUs */}
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem className='space-y-0'>
                      <div className='grid grid-cols-4 items-center'>
                        <FormLabel className='col-span-1'>Status</FormLabel>
                        {/* <FormControl className='col-span-3'>
                          <Input placeholder="Add status" {...field} />
                        </FormControl> */}
                        <div className='col-span-3'>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Choose status" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {
                                statuses.map((status) => (
                                  <SelectItem key={status.value} value={status.value}>
                                    <div className="flex w-[100px] items-center">
                                      {
                                        status.icon && (
                                          <status.icon
                                            className='mr-2 h-4 w-4 text-muted-foreground'
                                          />
                                        )
                                      }
                                      <span>{status.label}</span>
                                    </div>

                                  </SelectItem>
                                ))
                              }
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* CATEGORY */}
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem className='space-y-0'>
                      <div className='grid grid-cols-4 items-center'>
                        <FormLabel className='col-span-1'>Category</FormLabel>

                        {/* <Input placeholder="Choose Category" {...field} /> */}
                        <div className='col-span-3'>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Choose a category" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {
                                categories.map((category) => (
                                  <SelectItem key={category.value} value={category.value}>
                                    {category.label}
                                  </SelectItem>
                                ))
                              }
                            </SelectContent>
                          </Select>
                        </div>


                      </div>

                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* SCHEDULE */}
                <FormField
                  control={form.control}
                  name="schedule"
                  render={({ field }) => (
                    <FormItem className='space-y-0'>
                      <div className='grid grid-cols-4 items-center'>
                        <FormLabel
                          className='col-span-1'
                        >Schedule</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-[265px] pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {
                                  field.value ? (
                                    format(field.value, "dd MMMM yyyy")
                                  ) :
                                    (
                                      <span>Pick a date</span>
                                    )
                                }
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0 z-40" align='start' avoidCollisions={true}>
                            <Calendar
                              className='bg-slate-50'
                              mode='single'
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) =>
                                date < new Date()

                              }
                            />
                          </PopoverContent>
                        </Popover>
                        {/* <FormControl
                          className='col-span-3'
                        >
                          <Input placeholder="Add Schedule" {...field} />
                        </FormControl> */}
                      </div>

                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* DESCRIPTION */}
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem className='space-y-0'>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder='Add more detailed description'
                          className='resize-none'
                          {...field}
                        />

                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* ATTACHMENT */}
                <div className='flex flex-col'>
                  <p>Attachment</p>
                  <FileUploader
                    value={files}
                    onValueChange={setFiles}
                    dropzoneOptions={dropzone}
                    className='relative bg-background rounded-lg p-2'
                  >
                    <FileInput className="outline-dashed outline-1 outline-white">
                      <div className="flex items-center justify-center flex-col pt-3 pb-4 w-full ">
                        <FileSvgDraw />
                      </div>
                    </FileInput>
                    <FileUploaderContent>
                      {files &&
                        files.length > 0 &&
                        files.map((file, i) => (
                          <FileUploaderItem key={i} index={i}>
                            <Paperclip className="h-4 w-4 stroke-current" />
                            <span>{file.name}</span>
                          </FileUploaderItem>
                        ))}
                    </FileUploaderContent>
                  </FileUploader>
                </div>



              </div>

              <div className='mt-4 flex flex-col justify-center '>
                <Button type="submit">Submit</Button>
              </div>

            </form>
          </Form>
        </CardContent>
        <CardFooter>
          <Button
            className="mt-6"
            type="submit"
            onClick={() => backToHome()}
          >Back To Home</Button>
        </CardFooter>
      </Card>
    </main>

  )
}