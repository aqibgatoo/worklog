import { ReactElement } from "react";
import { formatDate } from "../utils/format-date";
import Link from "next/link";
import { ComponentType } from "../utils/mapper";
import { useRouter } from "next/router";
import {
  Certification,
  Objective,
  Recognition,
  Project,
  Contribution,
} from ".";
import WorklogDetails from "./WorklogDetails";

export interface RootComponentProps {
  data: any[];
}

//Root Component reprsents the root of component hierarchy on a page
// from which every component gets rendered
const RootComponent = ({ data }) => {
  const {
    query: { type },
  } = useRouter();
  //   <div
  //   display="flex"
  //   justifyContent="space-between"
  //   alignItems="flex-start"
  // >
  //   <h1 variant="heading.h2" mb="10">
  //     Worklogs
  //   </h1>
  //   <Button onClick={handleAddWorklog} label="Add New" />
  // </div>

  return (
    <div>
      {data.map((item, index) => (
        <div key={`${item.type}${index}`}>
          {getComponent(type || item.type, item)}
        </div>
      ))}
    </div>
  );
};

// Returns comoponent based on component type passed
export const getComponent = (type: ComponentType, data: any): ReactElement => {
  switch (type) {
    case ComponentType.Worklog:
      return <WorklogItem data={data} />;
    case ComponentType.WorklogDetails:
      return <WorklogDetails data={data} />;
    case ComponentType.Recognition:
      return (
        <Recognition
          createdAt={data.created}
          description={data.field_description.processed}
          important={data.field_important_recognition}
          recognizedFor={data.field_recognized_for}
          recognizedBy={data.field_recognized_by}
          sources={[{ ...data.field_source }]}
        />
      );
    case ComponentType.Certification:
      return (
        <Certification
          title={data.field_certification_title}
          completionDate={data.field_completion_date}
          source={{ ...data.field_link }}
        />
      );
    case ComponentType.Objective:
      return (
        <Objective
          goal={data.field_goal}
          createdAt={data.created}
          type={data.field_type}
          description={data.field_description_objective.processed}
          important={data.field_important}
          stakeholders={data.field_stakeholders}
          sources={data.field_source_objective}
        />
      );
    case ComponentType.Project:
      return (
        <Project
          title={data.field_project_title}
          startDate={data.field_start_date}
          endDate={data.field_end_date}
          description={data.field_project_description.processed}
        />
      );
    case ComponentType.Contribution:
      return (
        <Contribution
          title={data.field_title}
          technology={data.field_technology}
          createdAt={data.created}
          type={data.field_contribution_type}
          important={data.field_contribution_important}
          sources={[{ ...data.field_contribution_source }]}
        />
      );
    default:
      return <div>Not Found</div>;
  }
};

const WorklogItem = ({ data: worklog }) => {
  return (
    <article>
      <Link
        href={`${worklog.path.alias}?id=${worklog.id}&type=worklog_details`}
        passHref
      >
        <a textDecoration="none">
          <h2 variant="heading.h3" mb="4">
            {worklog.title}
          </h2>
        </a>
      </Link>
      <div mb="4" color="gray">
        {worklog.uid?.display_name ? (
          <span>
            By <span fontWeight="semibold">{worklog.uid?.display_name}</span>
          </span>
        ) : null}
        <span> - {formatDate(worklog.created)}</span>
      </div>
      <hr />
    </article>
  );
};

export default RootComponent;
