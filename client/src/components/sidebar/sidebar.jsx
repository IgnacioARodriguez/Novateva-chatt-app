import "./sidebar.css";
import QuestionAnswerOutlinedIcon from "@mui/icons-material/QuestionAnswerOutlined";
import SettingsInputComponentIcon from "@mui/icons-material/SettingsInputComponent";
import { Typography } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAtom } from "@fortawesome/free-solid-svg-icons";
import settingsIcon from "./Group 11.1.png";
import { useHistory } from "react-router-dom";

export default function Sidebar({ user }) {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const history = useHistory();

  const handleClickLogout = () => {
    window.localStorage.removeItem("user");
    window.location.reload();
  };

  return (
    <div className="sideBarContainer">
      <div className="chatContainer">
        <QuestionAnswerOutlinedIcon
          style={{ height: "18px", marginLeft: "57px", marginRight: "15px" }}
        />
        <div className="chatText">Chat</div>
        <div className="messageCountContainer">
          <div className="messageCount">19</div>
        </div>
      </div>
      <div className="logoutContainer">
        <img src={settingsIcon} />
        <button onClick={handleClickLogout} className="logoutButon">
          Logout
        </button>
      </div>
    </div>
  );
}
