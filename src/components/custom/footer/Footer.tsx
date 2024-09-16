import { AiFillHome, AiOutlineUser, AiOutlineHome } from 'react-icons/ai';
import { TbNotebook, TbNotebookOff, TbCalendarUser, TbCalendarFilled } from "react-icons/tb";
import './Footer.css';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

function Footer() {

  const navigate = useNavigate();
  const [isHome, setIsHome] = useState(false);
  const [isMyLog, setIsMyLog] = useState(false);
  const [isSchedule, setIsSchedule] = useState(false);

  const handleScheduleClick = () => {
    console.log("schedule clicked");
    if (!isSchedule) setIsSchedule(true);
    else setIsSchedule(false);
    setIsHome(false);
    setIsMyLog(false);
    navigate('/schedule');
  }
  const handleHomeClick = () => {
    console.log("home clicked")
    if (!isHome) setIsHome(true);
    else setIsHome(false);
    setIsSchedule(false);
    setIsMyLog(false);
    navigate('/home');
  }
  const handleMyLogClick = () => {
    console.log("mylog clicked")
    if (!isMyLog) setIsMyLog(true);
    else setIsMyLog(false);
    setIsHome(false);
    setIsSchedule(false);
    navigate('/mylog');
  }

  return (
    <footer className="footer">
      <div className="footer-item" onClick={handleHomeClick}>
        {
          isHome ?
            <AiFillHome size={24} />
            :
            <AiOutlineHome size={24} />
        }
        {/* <AiFillHome size={24} /> */}
        <span>Home</span>
      </div>
      <div className="footer-item" onClick={handleMyLogClick}>
        {
          isMyLog ?
            <TbNotebook size={24} />
            :
            <TbNotebookOff size={24} />
        }
        <span>My Logs</span>
      </div>

      <div className="footer-item" onClick={handleScheduleClick}>
        {
          isSchedule ?
            <TbCalendarFilled size={24} />
            :
            <TbCalendarUser size={24} />
        }
        {/* <TbCalendarUser size={24} /> */}
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