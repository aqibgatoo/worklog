import Image from "next/image";
import Link from "next/link";
import { getPathsForEntityType, getEntityFromContext } from "next-drupal";
import { Button, Recognition } from "../../../../src/components";
import { Layout } from "../../../../src/layout";
import { formatDate } from "../../../../src/utils/format-date";
import { Icon } from "reflexjs";
import { useRouter } from "next/router";
import Collapsible from "../../../../src/components/Collapsible";
import AddCertification from "../certifications/new";
import { useState } from "react";
import AddRecognition from "./new";
import { addChildEntity } from "../../../../src/api/client";
import RecognitionForm from "./RecognitonForm";
import CollapsibleWithoutTitle from "../../../../src/components/CollapsibleWithoutTitle";
const RecognitionSection = ({ worklog }) => {
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
