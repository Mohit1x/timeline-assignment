import React, { useState, useCallback } from "react";
import Calendar from "../components/calender-component";
import "../styles/date-picker.css";

const DatePicker = ({ fromDate, toDate, onFromDateChange, onToDateChange }) => {
  const [showFromCalendar, setShowFromCalendar] = useState(false);
  const [showToCalendar, setShowToCalendar] = useState(false);

  const formatDate = useCallback((dateStr) => {
    if (!dateStr) return "";
    const [month, day, year] = dateStr.split("/");
    return `${month}/${day}/${year}`;
  }, []);

  return (
    <div className="date-picker-container">
      <div className="date-input-group">
        <input
          type="text"
          value={formatDate(fromDate)}
          onClick={() => setShowFromCalendar(true)}
          placeholder="04/17/2024"
          readOnly
          className="date-input"
        />
        <span className="date-separator">to</span>
        <input
          type="text"
          value={formatDate(toDate)}
          onClick={() => setShowToCalendar(true)}
          placeholder="05/01/2024"
          readOnly
          className="date-input"
        />
      </div>

      {showFromCalendar && (
        <Calendar
          onDateSelect={onFromDateChange}
          onClose={() => setShowFromCalendar(false)}
          selectedDate={fromDate}
        />
      )}

      {showToCalendar && (
        <Calendar
          onDateSelect={onToDateChange}
          onClose={() => setShowToCalendar(false)}
          selectedDate={toDate}
        />
      )}
    </div>
  );
};

export default DatePicker;
