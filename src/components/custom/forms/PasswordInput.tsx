
import { Button } from "@/components/ui/button"

import { Input } from "@/components/ui/input"
import { Eye, EyeOff } from "lucide-react"
import { forwardRef, useState } from "react"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> { }


const PasswordInput = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, placeholder, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false)
    // const [isFocused, setIsFocused] = useState(false)

    const togglePasswordVisibility = () => {
      setShowPassword(!showPassword)
    }

    return (
      <div className="relative">
        <Input
          type={showPassword ? 'text' : 'password'}
          placeholder={placeholder}
          className={className}
          ref={ref}
          {...props}
        />
        {
          <Button
            type='button'
            variant="ghost"
            size={"sm"}
            className='absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent'
            onClick={togglePasswordVisibility}
            // onMouseLeave={handleMouseLeave}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {
              showPassword ?
                <EyeOff
                  className='w-4 h-4 text-gray-500'
                />

                :
                <Eye
                  className='w-4 h-4 text-gray-500'
                />
            }

          </Button>


        }

      </div>
    )
  }
)

PasswordInput.displayName = "PasswordInput"

// export default { PasswordInput }
export default PasswordInput