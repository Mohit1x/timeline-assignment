import React, { useState, useCallback, useMemo } from "react";
import "../styles/calender.css";

const Calendar = ({ onDateSelect, onClose }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const getDaysInMonth = useCallback((month, year) => {
    return new Date(year, month + 1, 0).getDate();
  }, []);

  const getFirstDayOfMonth = useCallback((month, year) => {
    return new Date(year, month, 1).getDay();
  }, []);

  const handleDateClick = useCallback(
    (day) => {
      // const date = new Date(currentYear, currentMonth, day);
      const formattedDate = `${String(currentMonth + 1).padStart(
        2,
        "0"
      )}/${String(day).padStart(2, "0")}/${currentYear}`;
      onDateSelect(formattedDate);
      onClose();
    },
    [currentMonth, currentYear, onDateSelect, onClose]
  );

  const navigateMonth = useCallback(
    (direction) => {
      if (direction === "prev") {
        if (currentMonth === 0) {
          setCurrentMonth(11);
          setCurrentYear((prev) => prev - 1);
        } else {
          setCurrentMonth((prev) => prev - 1);
        }
      } else {
        if (currentMonth === 11) {
          setCurrentMonth(0);
          setCurrentYear((prev) => prev + 1);
        } else {
          setCurrentMonth((prev) => prev + 1);
        }
      }
    },
    [currentMonth]
  );

  const renderCalendarDays = useMemo(() => {
    const daysInMonth = getDaysInMonth(currentMonth, currentYear);
    const firstDay = getFirstDayOfMonth(currentMonth, currentYear);
    const days = [];

    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      days.push(
        <div
          key={day}
          className="calendar-day"
          onClick={() => handleDateClick(day)}
        >
          {day}
        </div>
      );
    }

    return days;
  }, [
    currentMonth,
    currentYear,
    getDaysInMonth,
    getFirstDayOfMonth,
    handleDateClick,
  ]);

  return (
    <div className="calendar-overlay" onClick={onClose}>
      <div className="calendar" onClick={(e) => e.stopPropagation()}>
        <div className="calendar-header">
          <button onClick={() => navigateMonth("prev")}>&lt;</button>
          <span>
            {months[currentMonth]} {currentYear}
          </span>
          <button onClick={() => navigateMonth("next")}>&gt;</button>
        </div>
        <div className="calendar-weekdays">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div key={day} className="weekday">
              {day}
            </div>
          ))}
        </div>
        <div className="calendar-days">{renderCalendarDays}</div>
      </div>
    </div>
  );
};

export default Calendar;
