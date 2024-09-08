import { ComponentProps } from 'react'
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import './Auth.css'
import { BellRing, Check } from "lucide-react"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

type CardProps = ComponentProps<typeof Card>


interface LoginProps extends CardProps {
  onSwitchToRegister: () => void
}

const formSchema = z.object({
  employee_id: z.string().min(2).max(50),
  password: z.string().min(3).max(25)
})

function LoginCard({ onSwitchToRegister, className, ...props }: LoginProps) {

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      employee_id: "",
      password: ""
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values)
  }
  return (
    <Card className={cn(className)} {...props}>
      {/* <CardHeader>
        <CardTitle>Login</CardTitle>
        <CardDescription>Log back to your account</CardDescription>
      </CardHeader> */}
      <CardContent className="grid gap-4 space-y-2">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className='mt-4 space-y-3'>
              {/* USERNAME */}
              <FormField
                control={form.control}
                name="employee_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* PASSWORD */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="Enter Password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className='mt-4 flex flex-col justify-center '>
              <Button type="submit">Submit</Button>
              <div className='flex flex-row justify-center items-center gap-x-2'>
                <p>Don't have an account?</p>
                <Button className='m-0 p-0 text-purple-700' variant="link" onClick={() => onSwitchToRegister()}>Log In</Button>
              </div>
            </div>
          </form>
        </Form>
      </CardContent>
      {/* <CardFooter className='flex flex-col'>
        <Button className="w-full">
          <Check className="mr-2 h-4 w-4" /> Mark all as read
        </Button>
        <div className='flex flex-row justify-center items-center gap-x-2'>
          <p>Dont have an account?</p>
          <Button className='m-0 p-0 text-purple-600' variant="link" onClick={() => onSwitchToRegister()}>Sign Up</Button>
        </div>

      </CardFooter> */}
    </Card>
  )
}

export default LoginCard