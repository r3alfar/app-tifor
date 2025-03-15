"use client"

import type React from "react"

import { useEffect, useState, useRef } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { CalendarIcon, ChevronLeft, Save, Paperclip, X, Download, File, Image } from "lucide-react"
import { format } from "date-fns"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { useToast } from "@/hooks/use-toast"
import type { Attachment, Task } from "./task-components/task-list"
import { ScrollArea } from "@/components/ui/scroll-area"


// Mock function to fetch a single task
const fetchTask = (id: number): Promise<Task> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Generate a random date within the next 30 days
      const randomDaysToAdd = Math.floor(Math.random() * 30)
      const taskDate = new Date()
      taskDate.setDate(taskDate.getDate() + randomDaysToAdd)

      // Generate random attachments (0-3)
      const attachmentsCount = Math.floor(Math.random() * 4)
      const attachments: Attachment[] = []

      for (let i = 0; i < attachmentsCount; i++) {
        const fileTypes = ["pdf", "docx", "jpg", "png", "xlsx"]
        const fileNames = [
          "Project_Brief",
          "Meeting_Notes",
          "Screenshot",
          "Invoice",
          "Report",
          "Presentation",
          "Contract",
          "Receipt",
          "Proposal",
          "Diagram",
        ]

        const type = fileTypes[Math.floor(Math.random() * fileTypes.length)]
        const name = `${fileNames[Math.floor(Math.random() * fileNames.length)]}.${type}`
        const fileId = Math.random().toString(36).substring(2, 15)

        attachments.push({
          id: fileId,
          name,
          type,
          url: `/placeholder-file/${fileId}/${name}`,
          size: Math.floor(Math.random() * 5000000) + 10000, // Random size between 10KB and 5MB
          createdAt: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000),
        })
      }

      resolve({
        id,
        title: `Task ${id}`,
        description: `This is the description for task ${id}. It contains details about what needs to be done.`,
        status: ["pending", "in-progress", "completed", "cancelled"][Math.floor(Math.random() * 4)] as any,
        priority: ["low", "medium", "high"][Math.floor(Math.random() * 3)] as any,
        category: ["work", "personal", "shopping", "health", "finance"][Math.floor(Math.random() * 5)] as any,
        date: taskDate,
        attachments,
      })
    }, 500)
  })
}

// Mock function to update a task
const updateTask = (task: Task): Promise<Task> => {
  return new Promise((resolve) => {
    // Simulate API delay
    setTimeout(() => {
      resolve(task)
    }, 500)
  })
}

// Mock function to upload an attachment
const uploadAttachment = (file: File, taskId: number): Promise<Attachment> => {
  return new Promise((resolve) => {
    // Simulate API delay
    setTimeout(() => {
      const fileId = Math.random().toString(36).substring(2, 15)
      resolve({
        id: fileId,
        name: file.name,
        type: file.name.split(".").pop() || "",
        url: `/placeholder-file/${fileId}/${file.name}`,
        size: file.size,
        createdAt: new Date(),
      })
    }, 1000)
  })
}

// Mock function to delete an attachment
const deleteAttachment = (attachmentId: string): Promise<void> => {
  return new Promise((resolve) => {
    // Simulate API delay
    setTimeout(() => {
      resolve()
    }, 500)
  })
}

// Helper function to format file size
const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return bytes + " bytes"
  else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB"
  else return (bytes / 1048576).toFixed(1) + " MB"
}

// Helper function to get file icon
const getFileIcon = (fileType: string) => {
  const imageTypes = ["jpg", "jpeg", "png", "gif", "svg", "webp"]
  if (imageTypes.includes(fileType.toLowerCase())) {
    return <Image className="h-5 w-5" />
  }
  return <File className="h-5 w-5" />
}

// export default function EditTaskPage({ params }: { params: { id: string } }) {
export default function EditTaskPage() {
    const {id} = useParams();
    const {toast} = useToast()
  const navigate = useNavigate()
  const [task, setTask] = useState<Task | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [date, setDate] = useState<Date | undefined>(undefined)
  const [uploadingFile, setUploadingFile] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const loadTask = async () => {
      try {
        if (!id) return
        const taskId = Number.parseInt(id)
        const loadedTask = await fetchTask(taskId)
        setTask(loadedTask)
        setDate(loadedTask.date)
      } catch (error) {
        console.error("Error loading task:", error)
        toast({
          title: "Error",
          description: "Failed to load task details",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }
    loadTask()
  }, [id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!task) return

    setSaving(true)
    try {
      const updatedTask = { ...task, date: date || new Date() }
      await updateTask(updatedTask)
      toast({
        title: "Success",
        description: "Task updated successfully",
      })
      navigate("/")
    } catch (error) {
      console.error("Error updating task:", error)
      toast({
        title: "Error",
        description: "Failed to update task",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0 || !task) return

    setUploadingFile(true)
    try {
      const file = files[0]
      const newAttachment = await uploadAttachment(file, task.id)

      setTask({
        ...task,
        attachments: [...task.attachments, newAttachment],
      })

      toast({
        title: "File Uploaded",
        description: `${file.name} has been uploaded successfully`,
      })
    } catch (error) {
      console.error("Error uploading file:", error)
      toast({
        title: "Error",
        description: "Failed to upload file",
        variant: "destructive",
      })
    } finally {
      setUploadingFile(false)
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  const handleDeleteAttachment = async (attachmentId: string) => {
    if (!task) return

    try {
      await deleteAttachment(attachmentId)

      setTask({
        ...task,
        attachments: task.attachments.filter((a) => a.id !== attachmentId),
      })

      toast({
        title: "Attachment Deleted",
        description: "The attachment has been removed",
      })
    } catch (error) {
      console.error("Error deleting attachment:", error)
      toast({
        title: "Error",
        description: "Failed to delete attachment",
        variant: "destructive",
      })
    }
  }

  const handleDownloadAttachment = (attachment: Attachment) => {
    // In a real app, this would trigger a download
    // For this mock, we'll just show a toast
    toast({
      title: "Download Started",
      description: `Downloading ${attachment.name}`,
    })
  }

  if (loading) {
    return (
      <div className="container mx-auto py-10">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="animate-pulse bg-muted h-8 w-1/3 rounded"></CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="animate-pulse bg-muted h-4 w-1/4 rounded"></div>
                <div className="animate-pulse bg-muted h-10 w-full rounded"></div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!task) {
    return (
      <div className="container mx-auto py-10">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Task Not Found</CardTitle>
          </CardHeader>
          <CardContent>
            <p>The requested task could not be found.</p>
          </CardContent>
          <CardFooter>
            <Button onClick={() => navigate("/")}>
              <ChevronLeft className="mr-2 h-4 w-4" />
              Back to Tasks
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-10">
      <Card className="max-w-2xl mx-auto">
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>Edit Task</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={task.title}
                onChange={(e) => setTask({ ...task, title: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={task.description}
                onChange={(e) => setTask({ ...task, description: e.target.value })}
                rows={4}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select value={task.category} onValueChange={(value: any) => setTask({ ...task, category: value })}>
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="work">Work</SelectItem>
                    <SelectItem value="personal">Personal</SelectItem>
                    <SelectItem value="shopping">Shopping</SelectItem>
                    <SelectItem value="health">Health</SelectItem>
                    <SelectItem value="finance">Finance</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={task.status} onValueChange={(value: any) => setTask({ ...task, status: value })}>
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="priority">Priority</Label>
                <Select value={task.priority} onValueChange={(value: any) => setTask({ ...task, priority: value })}>
                  <SelectTrigger id="priority">
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="date">Due Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal" id="date">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            {/* Attachments Section */}
            <div className="space-y-2 pt-4 border-t">
              <div className="flex items-center justify-between">
                <Label>Attachments</Label>
                <div>
                  <input type="file" className="hidden" ref={fileInputRef} onChange={handleFileUpload} />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploadingFile}
                  >
                    {uploadingFile ? (
                      <span className="flex items-center">
                        <svg
                          className="animate-spin -ml-1 mr-2 h-4 w-4 text-primary"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Uploading...
                      </span>
                    ) : (
                      <span className="flex items-center">
                        <Paperclip className="mr-2 h-4 w-4" />
                        Add Attachment
                      </span>
                    )}
                  </Button>
                </div>
              </div>

              {task.attachments.length === 0 ? (
                <div className="text-center py-4 text-muted-foreground text-sm border rounded-md">
                  No attachments yet. Add files to this task.
                </div>
              ) : (
                <ScrollArea className="h-[200px] w-full rounded-md border p-2">
                  <div className="space-y-2">
                    {task.attachments.map((attachment) => (
                      <div
                        key={attachment.id}
                        className="flex items-center justify-between p-2 border rounded-md hover:bg-accent/50"
                      >
                        <div className="flex items-center gap-2 overflow-hidden">
                          {getFileIcon(attachment.type)}
                          <div className="overflow-hidden">
                            <p className="font-medium truncate">{attachment.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {formatFileSize(attachment.size)} •{" "}
                              {format(new Date(attachment.createdAt), "MMM d, yyyy")}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-1">
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleDownloadAttachment(attachment)}
                          >
                            <Download className="h-4 w-4" />
                            <span className="sr-only">Download</span>
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive hover:text-destructive"
                            onClick={() => handleDeleteAttachment(attachment.id)}
                          >
                            <X className="h-4 w-4" />
                            <span className="sr-only">Delete</span>
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button type="button" variant="outline" onClick={() => navigate("/")}>
              <ChevronLeft className="mr-2 h-4 w-4" />
              Cancel
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? (
                <span className="flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Saving...
                </span>
              ) : (
                <span className="flex items-center">
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </span>
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

