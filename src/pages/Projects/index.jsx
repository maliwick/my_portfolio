import React from "react";
import WorkList from "../../components/WorkList.jsx";
export default function Projects({ data }) {
  return <WorkList kind="projects" data={data} />;
}
