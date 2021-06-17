import Link from "next/link";
import { Button, Recognition, Project } from ".";
import { Icon } from "reflexjs";
import { useRouter } from "next/router";
import { useState } from "react";
import RecognitionForm from "./RecognitonForm";
import { Contribution } from ".";
import CollapsibleWithoutTitle from "./CollapsibleWithoutTitle";
import ContributionForm from "./ContributionForm";
import Collapsible from "./Collapsible";
import { generateSlug } from "../utils/helpers";

const ContributionSection = ({ worklog }) => {
  if (!worklog) return null;
  const { push, query } = useRouter();
  const slug = generateSlug(query.index as []);

  const id = worklog.id;
  const [showForm, setShowForm] = useState(false);

  return (
    <div>
      <div display="flex" flexDirection="column">
        <div display="flex" flexDirection="row" justifyContent="space-between">
          <h2 fontSize="2xl">Contributions</h2>
          <Button
            onClick={() => setShowForm(!showForm)}
            label={showForm ? "Hide" : "Add New"}
          />
        </div>
        <CollapsibleWithoutTitle isCollapsed={showForm}>
          <ContributionForm slug={slug} id={id} />
        </CollapsibleWithoutTitle>
        {worklog.field_contributions.length ? (
          worklog.field_contributions.map(
            ({
              id,
              field_contribution_type,
              field_technology,
              created,
              field_contribution_important,
              field_title,
              field_contribution_source,
            }) => (
              <div key={id} mt="2">
                <Collapsible title={field_title}>
                  <Contribution
                    type={field_contribution_type}
                    technology={field_technology}
                    createdAt={created}
                    important={field_contribution_important}
                    title={field_title}
                    sources={[{ ...field_contribution_source }]}
                  />
                </Collapsible>
              </div>
            )
          )
        ) : (
          <p>No contributions found</p>
        )}
      </div>

      {worklog.field_contributions.length > 0 && (
        <Link href={`${slug}/contributions`} passHref>
          <a variant="button.link">
            View
            <Icon name="arrow" ml="1" />
          </a>
        </Link>
      )}
    </div>
  );
};

export default ContributionSection;
