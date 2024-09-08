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
import './Auth.css'
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
import { getAuth, signInWithCustomToken, signInWithEmailAndPassword } from 'firebase/auth'
import { useNavigate } from 'react-router-dom'
import { useToast } from '@/hooks/use-toast'
import { ToastAction } from "@/components/ui/toast"

type CardProps = ComponentProps<typeof Card>

interface LoginProps extends CardProps {
  onSwitchToRegister: () => void
}

const formSchema = z.object({
  employee_id: z.string().min(2).max(50),
  password: z.string().min(3).max(25)
})

function LoginCard({ onSwitchToRegister, className, ...props }: LoginProps) {
  const navigate = useNavigate();
  const { toast } = useToast();
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
    const auth = getAuth()
    signInWithEmailAndPassword(auth, values.employee_id, values.password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        console.log(user);
        toast({
          variant: "default",
          title: "Successfully Logged in",
        })
        navigate('/home')
        // ...
      })
      .catch((error) => {
        form.reset();
        const errorCode = error.code;
        const errorMessage = error.message;
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: "There was a problem with your request.",
          action: <ToastAction altText="Try again">Try again</ToastAction>,
        })
        console.log(`Error ${errorCode} Login : ${errorMessage}`);
      })
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
                    <FormLabel>Email / EmployeeID</FormLabel>
                    <FormControl>
                      <Input type='email' {...field} />
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
                <Button className='m-0 p-0 text-purple-700' variant="link" onClick={() => onSwitchToRegister()}>Sign Up</Button>
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