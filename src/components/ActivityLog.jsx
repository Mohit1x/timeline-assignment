import { useState } from "react";
import DatePicker from "../components/date-picker";
import "../styles/activity-log.css";
import Timeline from "./timeline-component";

const ActivityLog = () => {
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  return (
    <div className="activity-log">
      <h1>Activity Log</h1>

      <DatePicker
        fromDate={fromDate}
        toDate={toDate}
        onFromDateChange={setFromDate}
        onToDateChange={setToDate}
      />
      <Timeline fromDate={fromDate} toDate={toDate} />
    </div>
  );
};

export default ActivityLog;
