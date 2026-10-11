import React from "react";
import WorkList from "../../components/WorkList.jsx";
export default function Blogs({ data }) {
  return <WorkList kind="blog" data={data} />;
}
