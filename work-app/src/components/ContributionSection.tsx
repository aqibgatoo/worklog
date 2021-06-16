import Link from "next/link";
import { Button, Recognition, Project } from ".";
import { Icon } from "reflexjs";
import { useRouter } from "next/router";
import { useState } from "react";
import RecognitionForm from "./RecognitonForm";
import { Contribution } from ".";
import CollapsibleWithoutTitle from "./CollapsibleWithoutTitle";
import ContributionForm from "./ContributionForm";
const ContributionSection = ({ worklog }) => {
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
                <Contribution
                  type={field_contribution_type}
                  technology={field_technology}
                  createdAt={created}
                  important={field_contribution_important}
                  title={field_title}
                  sources={[{ ...field_contribution_source }]}
                />
                <hr />
              </div>
            )
          )
        ) : (
          <p>No contributions found</p>
        )}
      </div>

      {worklog.field_contributions.length > 0 && (
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

export default ContributionSection;
