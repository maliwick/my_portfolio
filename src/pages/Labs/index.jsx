import React from "react";
import WorkList from "../../components/WorkList.jsx";
export default function Labs({ data }) {
  return <WorkList kind="labs" data={data} />;
}
