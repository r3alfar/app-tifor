import DefaultNav from './defaultNav'
import MobileNav from './mobileNav'

function MyNavbar() {
  return (
    <header className="w-full border-b-2 border-purple-800">
      <div className="flex h-48 items-center px-4 justify-center ">
        <DefaultNav />
        <MobileNav />
      </div>
    </header>
  )
}

export default MyNavbar