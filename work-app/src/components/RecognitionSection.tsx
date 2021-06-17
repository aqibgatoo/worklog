import Link from "next/link";
import { Button, Recognition } from ".";
import { Icon } from "reflexjs";
import { useRouter } from "next/router";
import Collapsible from "./Collapsible";
import { useState } from "react";
import RecognitionForm from "./RecognitonForm";
import CollapsibleWithoutTitle from "./CollapsibleWithoutTitle";
import { generateSlug } from "../utils/helpers";
const RecognitionSection = ({ worklog }) => {
  if (!worklog) return null;
  const { push, query } = useRouter();
  const slug = generateSlug(query.index as []);
  const id = worklog.id;
  const [showForm, setShowForm] = useState(false);

  return (
    <div>
      <div display="flex" flexDirection="column">
        <div display="flex" flexDirection="row" justifyContent="space-between">
          <h2 fontSize="2xl">Recognitions</h2>
          <Button
            onClick={() => setShowForm(!showForm)}
            label={showForm ? "Hide" : "Add New"}
          />
        </div>
        <CollapsibleWithoutTitle isCollapsed={showForm}>
          <RecognitionForm slug={slug} id={id} />
        </CollapsibleWithoutTitle>
        {worklog.field_recognitions.length ? (
          worklog.field_recognitions.map(
            ({
              id,
              created,
              field_important_recognition,
              field_description,
              field_recognized_by,
              field_recognized_for,
              field_source,
            }) => (
              <div key={id} mt="2">
                <Collapsible title={field_description.value}>
                  <Recognition
                    createdAt={created}
                    important={field_important_recognition}
                    description={field_description.processed}
                    recognizedBy={field_recognized_by}
                    recognizedFor={field_recognized_for}
                    sources={[{ ...field_source }]}
                  />
                </Collapsible>
              </div>
            )
          )
        ) : (
          <p>No Recognitions found</p>
        )}
      </div>

      {worklog.field_recognitions.length > 0 && (
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

export default RecognitionSection;
