import Link from "next/link";
import { Button, Recognition, Project } from ".";
import { Icon } from "reflexjs";
import { useRouter } from "next/router";
import { useState } from "react";
import RecognitionForm from "./RecognitonForm";
import { Objective } from ".";
import CollapsibleWithoutTitle from "./CollapsibleWithoutTitle";
import ObjectiveForm from "./ObjectiveForm";
import Collapsible from "./Collapsible";
import { generateSlug } from "../utils/helpers";

const ObjectiveSection = ({ worklog }) => {
  if (!worklog) return null;
  const { push, query } = useRouter();
  const slug = generateSlug(query.index as []);

  const id = worklog.id;
  const [showForm, setShowForm] = useState(false);

  return (
    <div>
      <div display="flex" flexDirection="column">
        <div display="flex" flexDirection="row" justifyContent="space-between">
          <h2 fontSize="2xl">Objectives</h2>
          <Button
            onClick={() => setShowForm(!showForm)}
            label={showForm ? "Hide" : "Add New"}
          />
        </div>
        <CollapsibleWithoutTitle isCollapsed={showForm}>
          <ObjectiveForm slug={slug} id={id} />
        </CollapsibleWithoutTitle>
        {worklog.field_objectives.length ? (
          worklog.field_objectives.map(
            ({
              id,
              field_goal,
              created,
              field_type,
              field_important,
              field_stakeholders,
              field_description_objective,
              field_source_objective,
            }) => (
              <div key={id} mt="2">
                <Collapsible title={field_goal}>
                  <Objective
                    goal={field_goal}
                    createdAt={created}
                    type={field_type}
                    important={field_important}
                    stakeholders={field_stakeholders}
                    description={field_description_objective.processed}
                    sources={field_source_objective}
                  />
                </Collapsible>
              </div>
            )
          )
        ) : (
          <p>No Objectives found</p>
        )}
      </div>

      {worklog.field_objectives.length > 0 && (
        <Link href={`${slug}/objectives`} passHref>
          <a variant="button.link">
            View
            <Icon name="arrow" ml="1" />
          </a>
        </Link>
      )}
    </div>
  );
};

export default ObjectiveSection;
