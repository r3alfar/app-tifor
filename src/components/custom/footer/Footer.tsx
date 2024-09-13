import { AiFillHome, AiOutlineUser } from 'react-icons/ai';
import { TbNotebook, TbCalendarUser } from "react-icons/tb";
import './Footer.css';
import { useNavigate } from 'react-router-dom';

function Footer() {

  const navigate = useNavigate();

  const handleScheduleClick = () => {
    navigate('/schedule');
  }
  const handleHomeClick = () => {
    navigate('/home');
  }
  const handleMyLogClick = () => {
    navigate('/mylog');
  }

  return (
    <footer className="footer">
      <div className="footer-item" onClick={handleHomeClick}>
        <AiFillHome size={24} />
        <span>Home</span>
      </div>
      <div className="footer-item" onClick={handleMyLogClick}>
        <TbNotebook size={24} />
        <span>My Logs</span>
      </div>

      <div className="footer-item" onClick={handleScheduleClick}>
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