import DefaultNav from './defaultNav'
import MobileNav from './mobileNav'

function MyNavbar() {
  return (
    <header className="w-full border-b-2 border-purple-800">
      <div className="flex h-24 md:h-48 items-center px-2 md:px-4 justify-between md:justify-center">

        <div className='hidden mb:block'>
          <DefaultNav />
        </div>
        <div className='block mb:hidden w-full'>
          <MobileNav />
        </div>
        
      </div>
    </header>
  )
}

export default MyNavbar