import React, {
  useState,
  useCallback,
  useMemo,
  useRef,
  useEffect,
} from "react";
import "../styles/Timeline.css";
import { getDateRange } from "../lib/utils";

const Timeline = ({ fromDate, toDate }) => {
  const [zoomLevel, setZoomLevel] = useState(1);
  const [panOffset, setPanOffset] = useState(0);
  const [mousePosition, setMousePosition] = useState(0.5);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, offset: 0 });
  const [containerWidth, setContainerWidth] = useState(1500);

  const timelineRef = useRef(null);

  useEffect(() => {
    const handleResize = () => {
      if (timelineRef.current) {
        setContainerWidth(timelineRef.current.offsetWidth);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const baseTimelineData = useMemo(() => {
    if (!fromDate || !toDate) return [];

    const allDates = getDateRange(new Date(fromDate), new Date(toDate));
    const segments = [];

    allDates.forEach((date, dayIndex) => {
      for (let hour = 0; hour < 24; hour++) {
        for (let minute = 0; minute < 60; minute += 5) {
          let intensity = 0.1 + Math.random() * 0.9;
          segments.push({
            intensity,
            color: "#22c55e",
            width: 4,
            time: `${String(hour).padStart(2, "0")}:${String(minute).padStart(
              2,
              "0"
            )}`,
            dayIndex,
            date,
          });
        }
      }
    });

    return segments;
  }, [fromDate, toDate]);

  const visibleSegments = useMemo(() => {
    if (!baseTimelineData.length) return [];

    const scaledSegmentWidth = 4 * zoomLevel;

    const viewportLeft = -panOffset;
    const viewportRight = viewportLeft + containerWidth;

    const startIndex = Math.max(
      0,
      Math.floor(viewportLeft / scaledSegmentWidth)
    );
    const endIndex = Math.min(
      baseTimelineData.length,
      Math.ceil(viewportRight / scaledSegmentWidth) + 1
    );

    return baseTimelineData
      .slice(startIndex, endIndex)
      .map((segment, index) => ({
        ...segment,
        width: scaledSegmentWidth,
        left: (startIndex + index) * scaledSegmentWidth + panOffset,
      }));
  }, [baseTimelineData, zoomLevel, panOffset, containerWidth]);

  const timeLabels = useMemo(() => {
    if (!fromDate || !toDate) return [];

    const labels = [];
    const scaledSegmentWidth = 4 * zoomLevel;
    const totalDays = getDateRange(new Date(fromDate), new Date(toDate));

    let intervalHours = 24;
    if (zoomLevel >= 1.5 && zoomLevel < 3) intervalHours = 6;
    else if (zoomLevel >= 3 && zoomLevel < 5) intervalHours = 3;
    else if (zoomLevel >= 5) intervalHours = 1;

    totalDays.forEach((date, dayIndex) => {
      if (intervalHours === 24) {
        const segmentIndex = dayIndex * 288;
        const left = segmentIndex * scaledSegmentWidth + panOffset;

        if (left > -200 && left < containerWidth + 200) {
          labels.push({
            left,
            time: "",
            date: date.toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            }),
            isDateMarker: true,
          });
        }
      } else {
        for (let hour = 0; hour < 24; hour += intervalHours) {
          const segmentIndex = dayIndex * 288 + hour * 12;
          const left = segmentIndex * scaledSegmentWidth + panOffset;

          if (left > -200 && left < containerWidth + 200) {
            if (hour === 0) {
              labels.push({
                left,
                time: "00:00",
                date: date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                }),
                isDateMarker: true,
              });
            } else {
              labels.push({
                left,
                time: `${String(hour).padStart(2, "0")}:00`,
                date: "",
                isDateMarker: false,
              });
            }
          }
        }
      }
    });

    return labels;
  }, [zoomLevel, panOffset, containerWidth, fromDate, toDate]);

  const handleMouseMove = useCallback(
    (e) => {
      if (!timelineRef.current) return;

      const rect = timelineRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      setMousePosition(x / rect.width);

      if (isDragging) {
        const deltaX = e.clientX - dragStart.x;
        setPanOffset(dragStart.offset + deltaX);
      }
    },
    [isDragging, dragStart]
  );

  const handleWheel = useCallback(
    (e) => {
      e.preventDefault();

      const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1;
      const newZoomLevel = Math.max(0.5, Math.min(10, zoomLevel * zoomFactor));

      const mouseX = mousePosition * containerWidth;
      const currentContentX = mouseX - panOffset;
      const zoomRatio = newZoomLevel / zoomLevel;
      const newContentX = currentContentX * zoomRatio;
      const newPanOffset = mouseX - newContentX;

      setZoomLevel(newZoomLevel);
      setPanOffset(newPanOffset);
    },
    [zoomLevel, mousePosition, panOffset, containerWidth]
  );

  const handleMouseDown = useCallback(
    (e) => {
      setIsDragging(true);
      setDragStart({
        x: e.clientX,
        offset: panOffset,
      });
    },
    [panOffset]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mouseup", handleMouseUp);
      document.addEventListener("mousemove", handleMouseMove);
      return () => {
        document.removeEventListener("mouseup", handleMouseUp);
        document.removeEventListener("mousemove", handleMouseMove);
      };
    }
  }, [isDragging, handleMouseUp, handleMouseMove]);

  if (!fromDate || !toDate) return null;

  return (
    <div className="timeline-container" ref={timelineRef}>
      <div className="time-labels">
        {timeLabels.map((label, index) => (
          <div
            key={`${label.time}-${label.date}-${index}`}
            className={`time-label ${
              label.isDateMarker ? "date-marker" : "time-marker"
            }`}
            style={{
              left: `${label.left}px`,
              opacity:
                label.left > -100 && label.left < containerWidth + 100 ? 1 : 0,
            }}
          >
            {label.time && <div className="time-text">{label.time}</div>}
            {label.date && <div className="date-text">{label.date}</div>}
          </div>
        ))}
      </div>

      <div
        className="timeline-track-container"
        onMouseMove={handleMouseMove}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        style={{ cursor: isDragging ? "grabbing" : "grab" }}
      >
        <div
          className="timeline-track"
          style={{
            position: "relative",
            width: `${baseTimelineData.length * (4 * zoomLevel)}px`,
            height: "60px",
          }}
        >
          {visibleSegments.map((segment, index) => (
            <div
              key={index}
              className="timeline-segment"
              style={{
                position: "absolute",
                left: `${segment.left}px`,
                width: `${segment.width}px`,
                height: "60px",
                backgroundColor: segment.color,
                opacity: segment.intensity,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Timeline;
