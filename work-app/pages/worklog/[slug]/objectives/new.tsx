import { useRouter } from "next/router";
import { useState } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { Input, Button } from "../../../../src/components";
import { Layout } from "../../../../src/layout";
import { Source } from "../../../../src/types";

export enum ObjectiveType {
  "Select" = "Select",
  "Personal" = "Personal",
  "Departmental" = "Departmental",
  "Organizational" = "Organizational",
}
export type Stakeholder = {
  name: string;
};

export type Objective = {
  goal: string;
  description: string;
  links: Source[];
  stakeholders: Stakeholder[];
  type: ObjectiveType;
  important: boolean;
};

export const AddObjective = ({}) => {
  const {
    query: { slug, id },
    push,
  } = useRouter();

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<Objective>({
    defaultValues: {
      goal: "",
      links: [{ uri: "", title: "" }],
      stakeholders: [{ name: "" }],
      type: ObjectiveType.Select,
      important: false,
    },
  });
  const {
    fields: links,
    append: appendLink,
    remove: removeLink,
  } = useFieldArray({
    control,
    name: "links",
  });
  const {
    fields: stakeholders,
    append: appendStakeholder,
    remove: removeStakeholder,
  } = useFieldArray({
    control,
    name: "stakeholders",
  });
  const [loading, setLoading] = useState(false);

  const submit = async (objective: Objective) => {
    setLoading(true);
    console.log(objective);
    const payload = {
      data: {
        type: "paragraph--objective",
        attributes: {
          field_description_objective: objective.description,
          field_goal: objective.goal,
          field_important: objective.important,
          field_source_objective: objective.links
            .filter((link) => link.uri)
            .map(({ uri, title }) => {
              return {
                uri,
                title,
              };
            }),
          field_type: objective.type,
          field_stakeholders: objective.stakeholders
            .filter((stakeholder) => stakeholder.name)
            .map(({ name }) => {
              return name;
            }),
        },
      },
    };
    console.log(JSON.stringify(payload));

    try {
      const response = await fetch(
        "http://worklog.ddev.site/jsonapi/paragraph/objective",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_ACCESS_TOKEN}`,
            "Content-Type": "application/vnd.api+json",
          },
          body: JSON.stringify(payload),
        }
      );
      const paragraph = await response.json();
      console.log(paragraph);

      const newPayload = {
        data: [
          {
            type: "paragraph--objective",
            id: paragraph.data.id,
            meta: {
              target_revision_id:
                paragraph.data.attributes.drupal_internal__revision_id,
            },
          },
        ],
      };
      const res = await fetch(
        `http://worklog.ddev.site/jsonapi/node/work_log/${id}/relationships/field_objectives`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_ACCESS_TOKEN}`,
            "Content-Type": "application/vnd.api+json",
          },
          body: JSON.stringify(newPayload),
        }
      );
      setLoading(false);
      push(`/worklog/${slug}`);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };
  return (
    <Layout>
      <h3>New Objective</h3>
      <hr />
      <form onSubmit={handleSubmit(submit)}>
        <Controller
          control={control}
          name="goal"
          rules={{ required: true }}
          render={({ field: { onChange, onBlur, value, ref } }) => (
            <Input
              value={value}
              handleInputChange={onChange}
              label="Title"
              placeholder="Added tests to Drupal Core"
            />
          )}
        />
        <div display="flex" flexDirection="column">
          <Controller
            control={control}
            name="description"
            rules={{ required: true }}
            render={({ field: { onChange, onBlur, value, ref } }) => (
              <>
                <label htmlFor="description">Description</label>
                <textarea
                  p="2"
                  rounded="4"
                  borderColor="white"
                  id="description"
                  value={value}
                  onChange={onChange}
                />
              </>
            )}
          />
        </div>
        <div display="flex" flexDirection="column">
          <Controller
            control={control}
            name="type"
            rules={{ required: true }}
            render={({ field: { onChange, onBlur, value, ref } }) => (
              <>
                <label htmlFor="objectiveType">Objective Type</label>
                <select
                  id="objectiveType"
                  value={value}
                  onChange={onChange}
                  p="2"
                  flex="1"
                  rounded="4"
                  borderColor="white"
                >
                  {Object.entries(ObjectiveType).map(([key, value]) => (
                    <option
                      key={key}
                      disabled={value === ObjectiveType.Select}
                      value={value}
                    >
                      {key}
                    </option>
                  ))}
                </select>
              </>
            )}
          />
        </div>
        {links.map((item, index) => (
          <div
            key={item.id}
            display="flex"
            flexDirection="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <div flex="1">
              <Controller
                control={control}
                name={`links.${index}.uri`}
                render={({ field: { onChange, onBlur, value, ref } }) => (
                  <Input
                    value={value}
                    handleInputChange={onChange}
                    label="URL"
                    type="text"
                    placeholder="https://www.google.com"
                  />
                )}
              />
            </div>
            <div flex="1" ml="2">
              <Controller
                control={control}
                name={`links.${index}.title`}
                render={({ field: { onChange, onBlur, value, ref } }) => (
                  <Input
                    value={value}
                    handleInputChange={onChange}
                    label="Link Text"
                    type="text"
                    placeholder=""
                  />
                )}
              />
            </div>
            <button
              opacity={index === 0 ? 0 : 1}
              ml="2"
              p="2"
              disabled={index === 0}
              px="4"
              bg="green"
              color="white"
              onClick={() => removeLink(index)}
            >
              Delete
            </button>
          </div>
        ))}

        <button
          p="2"
          px="4"
          mb="2"
          bg="green"
          color="white"
          onClick={() => appendLink({ uri: "", title: "" })}
        >
          Append
        </button>

        {stakeholders.map((item, index) => (
          <div
            key={item.id}
            display="flex"
            flexDirection="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <div flex="1">
              <Controller
                control={control}
                name={`links.${index}.name`}
                render={({ field: { onChange, onBlur, value, ref } }) => (
                  <Input
                    value={value}
                    handleInputChange={onChange}
                    label="Name"
                    type="text"
                    placeholder="Doland Trumph"
                  />
                )}
              />
            </div>
            <button
              opacity={index === 0 ? 0 : 1}
              ml="2"
              p="2"
              disabled={index === 0}
              px="4"
              bg="green"
              color="white"
              onClick={() => removeStakeholder(index)}
            >
              Delete
            </button>
          </div>
        ))}

        <button
          p="2"
          px="4"
          mb="2"
          bg="green"
          color="white"
          onClick={() => appendStakeholder({ name: "" })}
        >
          Append
        </button>

        <Controller
          control={control}
          name="important"
          render={({ field: { onChange, onBlur, value, ref } }) => (
            <Input
              value={value}
              handleInputChange={onChange}
              label="Important Objective"
              type="checkbox"
            />
          )}
        />

        <Button label="Submit" loading={loading} type="submit" />
      </form>
    </Layout>
  );
};

export default AddObjective;
