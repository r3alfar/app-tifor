import { AiFillHome, AiOutlineUser } from 'react-icons/ai';
import { TbNotebook, TbCalendarUser } from "react-icons/tb";
import './Footer.css';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-item">
        <AiFillHome size={24} />
        <span>Home</span>
      </div>
      <div className="footer-item">
        <TbNotebook size={24} />
        <span>My Logs</span>
      </div>

      <div className="footer-item">
        <TbCalendarUser size={24} />
        <span>Schedule</span>
      </div>
      <div className="footer-item">
        <AiOutlineUser size={24} />
        <span>Profile</span>
      </div>
    </footer>
  )
}

export default Footer