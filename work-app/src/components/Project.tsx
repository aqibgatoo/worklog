import { formatDate } from "../utils/format-date";
import Reference, { ReferenceProps } from "./Reference";
import { Icon } from "reflexjs";

export type ProjectProps = {
  title: string;
  startDate: string;
  endDate: string;
  description: string;
};

const Project = ({ title, startDate, endDate, description }: ProjectProps) => {
  return (
    <div>
      <h4>{title} </h4>
      <p>Start Date - {formatDate(startDate)}</p>
      <p>End Date - {formatDate(endDate)}</p>
      <div
        dangerouslySetInnerHTML={{
          __html: description,
        }}
      />
    </div>
  );
};

export default Project;
