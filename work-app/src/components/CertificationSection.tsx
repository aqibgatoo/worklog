import Link from "next/link";
import { Button, Recognition, Project } from ".";
import { Icon } from "reflexjs";
import { useRouter } from "next/router";
import { useState } from "react";
import { Certification } from ".";
import CollapsibleWithoutTitle from "./CollapsibleWithoutTitle";
import Collapsible from "./Collapsible";
import CertificationForm from "./CertificationForm";
import { generateSlug } from "../utils/helpers";

const CertificationSection = ({ worklog }) => {
  if (!worklog) return null;
  const { push, query } = useRouter();
  const slug = generateSlug(query.index as []);
  const id = worklog.id;
  const [showForm, setShowForm] = useState(false);

  return (
    <div>
      <div display="flex" flexDirection="column">
        <div display="flex" flexDirection="row" justifyContent="space-between">
          <h2 fontSize="2xl">Certifications</h2>
          <Button
            onClick={() => setShowForm(!showForm)}
            label={showForm ? "Hide" : "Add New"}
          />
        </div>
        <CollapsibleWithoutTitle isCollapsed={showForm}>
          <CertificationForm slug={slug} id={id} />
        </CollapsibleWithoutTitle>
        {worklog.field_certifications.length ? (
          worklog.field_certifications.map(
            ({
              id,
              field_certification_title,
              field_completion_date,
              field_link,
            }) => (
              <div key={id} mt="2">
                <Collapsible title={field_certification_title}>
                  <Certification
                    title={field_certification_title}
                    completionDate={field_completion_date}
                    source={{ ...field_link }}
                  />
                </Collapsible>
              </div>
            )
          )
        ) : (
          <p>No Certifications found.</p>
        )}
      </div>

      {worklog.field_contributions.length > 0 && (
        <Link href={`${slug}/certifications`} passHref>
          <a variant="button.link">
            View
            <Icon name="arrow" ml="1" />
          </a>
        </Link>
      )}
    </div>
  );
};

export default CertificationSection;
