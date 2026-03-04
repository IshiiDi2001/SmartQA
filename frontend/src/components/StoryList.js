import React from "react";

const StoryList = ({ stories }) => (
  <div className="mb-6">
    <h2 className="text-2xl font-semibold mb-4">Fetched Stories</h2>
    <ul className="space-y-2">
      {stories.map((s) => (
        <li
          key={s.key}
          className="p-4 bg-white rounded shadow hover:bg-gray-50 transition"
        >
          <b>{s.key}</b>: {s.summary}
        </li>
      ))}
    </ul>
  </div>
);

export default StoryList;
