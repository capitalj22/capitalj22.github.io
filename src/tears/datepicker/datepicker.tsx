import classNames from "classnames";
import "./datepicker.scss";
import { useState } from "react";

export function TearDates({ dateSelected }) {
  const setDay = (day: "today" | "yday" | "yyday") => {
    setSelectedItem(day);
    
    const date = new Date();

    if (day === "yday") {
      date.setDate(date.getDate() - 1);
    } else if (day === "yyday") {
      date.setDate(date.getDate() - 2);
    }

    dateSelected(date);
    return;
  };
  const [selectedItem, setSelectedItem] = useState("today");

  const today = new Date();
  const yesterday = new Date(today);
  const yesteryesterday = new Date(today);

  yesterday.setDate(today.getDate() - 1);
  yesteryesterday.setDate(today.getDate() - 2);
  const yday = {
    month: yesterday.toLocaleString("default", { month: "long" }).slice(0, 3),
    day: yesterday.toLocaleString("default", { day: "numeric" }),
  };
  const yyday = {
    month: yesteryesterday
      .toLocaleString("default", { month: "long" })
      .slice(0, 3),
    day: yesteryesterday.toLocaleString("default", { day: "numeric" }),
  };

  return (
    <div className="days">
      <button
        className={classNames("day fulldate", {
          selected: selectedItem === "yyday",
        })}
        onClick={() => setDay("yyday")}
      >
        <span className="month">{yyday.month}</span>
        <span className="date">{yyday.day}</span>
      </button>
      <button
        className={classNames("day", { selected: selectedItem === "yday" })}
        onClick={() => setDay("yday")}
      >
        Yesterday
      </button>
      <button
        className={classNames("day", { selected: selectedItem === "today" })}
        onClick={() => setDay("today")}
      >
        Today
      </button>
    </div>
  );
}
