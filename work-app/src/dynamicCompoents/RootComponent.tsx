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
} from "../components";

export interface RootComponentProps {
  data?: any;
}

//Root Component reprsents the root of component hierarchy on a page
// from which every component gets rendered
const RootComponent = ({ data }) => {
  const {
    query: { type },
  } = useRouter();

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
const getComponent = (type: ComponentType, data: any): ReactElement => {
  switch (type) {
    case ComponentType.Worklog:
      return <WorklogItem data={data} />;
    case ComponentType.Highlights:
      return <HighlightsList data={data} />;
    case ComponentType.Recognition:
      return (
        <Recognition
          createdAt={data.created}
          description={data.field_description}
          important={data.field_important_recognition}
          recognizedFor={data.field_recognized_for}
          recognizedBy={data.field_recognized_by}
          sources={data.field_source}
        />
      );
    case ComponentType.Certification:
      return (
        <Certification
          title={data.field_certification_title}
          completionDate={data.field_completion_date}
          source={data.field_link}
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
          description={data.field_project_description}
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
          sources={data.field_contribution_source}
        />
      );
    default:
      return <div>Not Found</div>;
  }
};

export type HighlightsProps = {
  data: any;
};

const HighlightsList = ({ data }: HighlightsProps) => {
  return (
    <div>
      {data.field_highlights.map((item, index) => (
        <div key={`${item.type}${index}`}>
          {getComponent(item.type, item)}
          <hr />
        </div>
      ))}
    </div>
  );
};

const WorklogItem = ({ data: worklog }) => {
  return (
    <article>
      <Link
        href={`/wg${worklog.path.alias}?id=${worklog.id}&type=highlights`}
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
