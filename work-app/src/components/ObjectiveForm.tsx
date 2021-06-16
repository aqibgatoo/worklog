import { useRouter } from "next/router";
import { useState } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { addChildEntity, ChildEntity } from "../../src/api/client";
import { Input, Button } from "../../src/components";
import { Layout } from "../../src/layout";
import { Source } from "../../src/types";

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
export type ObjectiveProps = {
  slug: string | string[];
  id: string;
};
export const ObjectiveForm = ({ slug, id }: ObjectiveProps) => {
  const { push } = useRouter();

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
    const result = await addChildEntity(id, "objective", {
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
    });
    setLoading(false);
    if (result.succeeded) {
      push(`/worklog/${slug}`);
    }
  };
  return (
    <div>
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
                name={`links.${index}.uri` as const}
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
                name={`links.${index}.title` as const}
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
                name={`stakeholders.${index}.name` as const}
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
    </div>
  );
};

export default ObjectiveForm;
