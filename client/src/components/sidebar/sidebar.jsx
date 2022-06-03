import "./sidebar.css";
import QuestionAnswerOutlinedIcon from "@mui/icons-material/QuestionAnswerOutlined";
import { Typography } from "@mui/material";

export default function Sidebar({ user }) {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;

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
    </div>
  );
}
