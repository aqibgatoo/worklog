import Link from "next/link";
import { Button, Recognition, Project } from ".";
import { Icon } from "reflexjs";
import { useRouter } from "next/router";
import { useState } from "react";
import ProjectForm from "./ProjectForm";
import CollapsibleWithoutTitle from "./CollapsibleWithoutTitle";
const ProjectSection = ({ worklog }) => {
  if (!worklog) return null;
  const {
    push,
    query: { slug },
  } = useRouter();
  const id = worklog.id;
  const [showForm, setShowForm] = useState(false);

  // const handleAdd = (route: string) => () => {
  //   console.log(worklog);
  //   push(`${route}?id=${worklog.id}`);
  // };

  // const handleAddition = (value: boolean) => {
  //   setAdded(value);
  // };

  return (
    <div>
      <div display="flex" flexDirection="column">
        <div display="flex" flexDirection="row" justifyContent="space-between">
          <h2 fontSize="2xl">Projects</h2>
          <Button
            onClick={() => setShowForm(!showForm)}
            label={showForm ? "Hide" : "Add New"}
          />
        </div>
        <CollapsibleWithoutTitle isCollapsed={showForm}>
          <ProjectForm slug={slug} id={id} />
        </CollapsibleWithoutTitle>
        {worklog.field_projects.length ? (
          worklog.field_projects.map(
            ({
              id,
              field_project_title,
              field_start_date,
              field_end_date,
              field_project_description,
            }) => (
              <div key={id} mt="2">
                <Project
                  title={field_project_title}
                  startDate={field_start_date}
                  endDate={field_end_date}
                  description={field_project_description.processed}
                />
                <hr />
              </div>
            )
          )
        ) : (
          <p>No projects found</p>
        )}
      </div>

      {worklog.field_projects.length > 0 && (
        <Link href={`${slug}/recognitions`} passHref>
          <a variant="button.link">
            View
            <Icon name="arrow" ml="1" />
          </a>
        </Link>
      )}
    </div>
  );
};

export default ProjectSection;
