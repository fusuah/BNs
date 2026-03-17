"use client"
import { ChevronDown } from "lucide-react";

export default function FilterDropdown({ options = [], selected, onSelect }) {
  return (
    <div className="dropdown dropdown-end ">
      <label tabIndex={0} className="btn h-9 w-32 flex items-center justify-between bg-white text-black border-gray-200 shadow-none">
        {selected || "All"}
        <ChevronDown size={16} />
      </label>
      <ul
        tabIndex={0}
        className="dropdown-content menu p-2 shadow  rounded-box w-40 bg-white text-black"
      >
        {options.map((option) => (
          <li key={option}>
            <button
              className={`justify-start ${
                option === selected ? "font-bold bg-gray-200" : ""
              }`}
              onClick={() => onSelect(option)}
            >
              {option}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
