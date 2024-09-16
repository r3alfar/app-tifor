import { ComponentProps } from 'react'
import { cn } from "@/lib/utils"
import {
  Card,
  CardContent,
} from "@/components/ui/card"
import './Auth.css'
import { useState } from "react"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Checkbox } from '@/components/ui/checkbox'
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth"
import { useToast } from '@/hooks/use-toast'

type CardProps = ComponentProps<typeof Card>

interface RegisterProps extends CardProps {
  onSwitchToLogin: () => void;
}

const formSchema = z
  .object({
    fullname: z.string().min(3).max(50),
    employee_id: z.string().min(3).max(50),
    email: z.string().min(2).max(50),
    password: z.string().min(3).max(25),
    password_confirm: z.string().min(3).max(25),
  })
  .refine((data) => data.password === data.password_confirm, {
    message: "Password don't match",
    path: ["password_confirm"],
  });



function RegisterCard({ onSwitchToLogin, className, ...props }: RegisterProps) {
  const [error] = useState('')
  const { toast } = useToast();
  // let userCreds;
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullname: "",
      employee_id: "",
      email: "",
      password: "",
      password_confirm: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    const auth = getAuth();
    createUserWithEmailAndPassword(auth, values.email, values.password)
      .then((userCredential) => {
        const userCreds = userCredential.user;
        console.log(userCreds);
        console.log("Created user: ", userCredential);
        onSwitchToLogin();
        toast({
          title: "Register Success",
          description: (
            <div className='flex flex-col'>
              <span>Succesfully Register</span>
              <span>Please Login to Continue</span>
            </div>
          ),

        });


      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(`Error ${errorCode} Create user : ${errorMessage}`);

      });
  }

  return (
    <Card className={cn(className)} {...props}>
      {/* <CardHeader>
        <CardTitle>Register</CardTitle>
        <CardDescription>Log back to your account</CardDescription>
      </CardHeader> */}
      <CardContent>
        <Form {...form}>
          {error && <p>{error}</p>}
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className='mt-4 space-y-3'>
              <FormField
                control={form.control}
                name="fullname"
                render={({ field }) => (
                  <FormItem className='space-y-0'>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Input Fullname" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* USERNAME */}
              <FormField
                control={form.control}
                name="employee_id"
                render={({ field }) => (
                  <FormItem className='space-y-0'>
                    <FormLabel>Employee ID</FormLabel>
                    <FormControl>
                      <Input placeholder="Input Employee ID" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* EMAIL */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className='space-y-0'>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type='email' placeholder="example: email@gmail.com" {...field} />
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
                  <FormItem className='space-y-0'>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="Enter at least 8+ character" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* CONFIRM PASSWORD */}
              <FormField
                control={form.control}
                name="password_confirm"
                render={({ field }) => (
                  <FormItem className='space-y-0'>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="Retype your password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className='mt-4 flex flex-col justify-center '>
              <div className='flex items-start space-x-2 my-3'>
                <Checkbox id='terms' />
                <label
                  htmlFor='terms'
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  By signing up, I agree with the Terms of Use & Privacy Policy
                </label>
              </div>
              <Button type="submit">Submit</Button>
              <div className='flex flex-row justify-center items-center gap-x-2'>
                <p>Have an account?</p>
                <Button className='m-0 p-0 text-purple-700' variant="link" onClick={() => onSwitchToLogin()}>Log In</Button>
              </div>
            </div>

          </form>
        </Form>
      </CardContent>
      {/* <CardFooter className='m-0 p-0 flex flex-col'>
        <div className='flex flex-row justify-center items-center gap-x-2'>
          <p>Have an account?</p>
          <Button className='m-0 p-0 text-purple-700' variant="link" onClick={() => onSwitchToLogin()}>Log In</Button>
        </div>

      </CardFooter> */}
    </Card>
  )
}

export default RegisterCard