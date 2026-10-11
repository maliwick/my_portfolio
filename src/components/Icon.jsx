import React from "react";
const paths = {
  arrow: "M7 17 17 7M7 7h10v10",
  shield: "M12 3 4 6v6c0 5 8 9 8 9s8-4 8-9V6l-8-3Zm-4 9 3 3 5-6",
  code: "m8 6-6 6 6 6m8-12 6 6-6 6m-3-14-2 16",
  book: "M3 4h7l2 2 2-2h7v15h-7l-2 2-2-2H3V4Zm9 2v15",
  tools: "m14 6 4-4 4 4-4 4-4-4ZM3 18l9-9 3 3-9 9H3v-3Z",
  mail: "M3 5h18v14H3V5Zm0 0 9 7 9-7",
  phone:
    "M5 3h4l2 5-3 2c1 3 3 5 6 6l2-3 5 2v4c0 2-2 2-3 2C10 21 3 14 3 6c0-1 0-3 2-3Z",
  github:
    "M9 20c-5 1-5-2-7-2m14 4v-4c0-1-.3-2-1-2 4 0 6-2 6-5 0-2-1-3-2-4 0-1 0-2-.2-3-2 0-3 1-4 1a12 12 0 0 0-6 0C8 4 6 3 4 4c-.3 1-.3 2 0 3-1 1-2 2-2 4 0 3 2 5 6 5-.7.5-1 1-1 2v4",
  linkedin: "M4 9v12M4 4v.1M10 21V9m0 5c0-7 10-7 10 0v7",
  menu: "M4 6h16M4 12h16M4 18h16",
  close: "m6 6 12 12M6 18 18 6",
};
export default function Icon({ name = "arrow", ...props }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="20"
      height="20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      <path d={paths[name] || paths.arrow} />
    </svg>
  );
}
