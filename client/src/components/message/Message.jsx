import "./message.css";
import { format } from "timeago.js";
import { useEffect, useState } from "react";
import axios from "axios";

export default function Message({ message, own, elses }) {
  const [colleage, setColleage] = useState(null);

  useEffect(() => {
    console.log(elses);
    const getColleage = async () => {
      try {
        const colleage = await axios.get(`/users/?userId=${elses}`);
        setColleage(colleage.data);
      } catch (e) {
        console.log(e);
      }
    };
    getColleage();
  }, []);
  return (
    <div className={own ? "message own" : "message"}>
      <div className="messageTop">
        {/* <img
          className="messageImg"
          src="https://images.pexels.com/photos/3686769/pexels-photo-3686769.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500"
          alt=""
        /> */}
        {own ? (
          <div className="messageBottom">Me, {format(message.createdAt)}</div>
        ) : (
          <div className="messageBottom">
            {colleage?.username}, {format(message.createdAt)}
          </div>
        )}
      </div>
      <div className="messageText">
        <div className="textInMessage">{message.text}</div>
      </div>
    </div>
  );
}
