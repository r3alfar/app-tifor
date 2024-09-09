// import { Button } from '@/components/ui/button'
import LogoImage from '@/assets/logo-bernofarm.png'

// const mainNavItems = ['A', 'B', 'C'];

export default function DefaultNav() {
  return (
    <div className="flex flex-col items-center">
      <img src={LogoImage} alt="Logo" className="h-24" />
      <div className="flex-row justify-center md:flex hidden">
        <h1 className="font-extrabold text-3xl">Med Rep - Activity Log</h1>

      </div>
    </div >

  );
}