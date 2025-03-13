import { useEffect, useRef, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { useIntersectionObserver } from '@/hooks/useIntersectionObserver'


interface Task {
  id: string
  title: string
  category: string
  schedule: string
  description: string
}

export function DailyList() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const loadMoreRef = useRef(null)

  const intersection = new IntersectionObserver((entries) => {
    const [entry] = entries
    if (entry.isIntersecting && hasMore && !loading) {
      setPage(prev => prev + 1)
      fetchTasks(page)
    }
  }, {
    threshold: 1
  })

  useEffect(() => {
    if (loadMoreRef.current) {
      intersection.observe(loadMoreRef.current)
    }
    return () => {
      if (loadMoreRef.current) {
        intersection.unobserve(loadMoreRef.current)
      }
    }
  }, [loadMoreRef.current])

  async function fetchTasks(pageNum: number) {
    setLoading(true)
    try {
      const token = localStorage.getItem('access_token')
      const storedUserDetail = JSON.parse(localStorage.getItem("userDetail") || '{}')
      
      const qParams = {
        filter: {
          user_created: {
            _eq: storedUserDetail.id
          }
        },
        sort: ['-schedule'],
        page: pageNum,
        limit: 10
      }

      const queryString = new URLSearchParams({
        filter: JSON.stringify(qParams.filter)
      }).toString()
      
      const response = await window.api.get(
        `${import.meta.env.VITE_DIRECTUS_BASE_URL}/items/activity?${queryString}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      )

      const newTasks = response.data.data
      setTasks(prev => [...prev, ...newTasks])
      setHasMore(newTasks.length > 0)
    } catch (error) {
      console.error('Error fetching tasks:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      {tasks.map(task => (
        <Card key={task.id}>
          <CardHeader>
            <CardTitle>{task.title}</CardTitle>
            <CardDescription>{task.category}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">{new Date(task.schedule).toLocaleDateString()}</p>
            <p className="mt-2">{task.description}</p>
          </CardContent>
        </Card>
      ))}
      {loading && <p className="text-center">Loading more tasks...</p>}
      <div ref={loadMoreRef} className="h-4" />
    </div>
  )
}