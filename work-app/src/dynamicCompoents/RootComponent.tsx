import { ReactElement } from "react";
import { formatDate } from "../utils/format-date";
import Link from "next/link";
import { Component, ComponentType, NormalizedResponse } from "../utils/mapper";
import { useRouter } from "next/router";
export interface RootComponentProps {
  data?: Component | Component[];
}

//Root Component reprsents the root of component hierarchy
// from which every component gets rendered
const RootComponent = ({ data }: RootComponentProps) => {
  const {
    query: { params },
  } = useRouter();
  console.log(params);

  return (
    <div>
      {Array.isArray(data) &&
        data.map((item, index) => (
          <div key={`${item.type}${index}`}>
            {getComponent(item.type, item.data)}
          </div>
        ))}
    </div>
  );
};

// Returns comoponent based on component type passed
const getComponent = (type: ComponentType, data: any): ReactElement => {
  console.log("type is " + type);

  switch (type) {
    case "worklogs":
      return <WorklogList data={data} />;
    case "highlights":
      return <HighlightsList data={data} />;
    default:
      return <div>Not Found</div>;
  }
};

const HighlightsList = ({ data }) => {

  return (
    <div>
      {!!data.field_contributions?.length &&
        getComponent("recognitions", data.field_contributions)}
      {!!data.field_certifications?.length &&
        getComponent("certifications", data.field_certifications)}
      {!!data.field_contributions?.length &&
        getComponent("contributions", data.field_contributions)}
      {!!data.field_objectives?.length &&
        getComponent("objectives", data.field_objectives)}
      {!!data.field_projects?.length &&
        getComponent("projects", data.field_projects)}
    </div>
  );
};

const WorklogList = ({ data }) => {
  return data.map((worklog) => (
    <article key={worklog.id} py="10">
      <Link href={`/wg${worklog.path.alias}?id=${worklog.id}`} passHref>
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
  ));
};

export default RootComponent;
