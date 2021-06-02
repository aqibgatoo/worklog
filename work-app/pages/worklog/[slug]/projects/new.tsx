import { useRouter } from "next/router";
import { useState } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { Input, Button } from "../../../../src/components";
import { Layout } from "../../../../src/layout";
import { Source } from "../../../../src/types";

export type Project = {
  title: string;
  description: string;
  startDate: string;
  endDate: string;
};
export const AddProject = ({}) => {
  const {
    query: { slug, id },
    push,
  } = useRouter();

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<Project>({
    defaultValues: {
      title: "",
      description: "",
      startDate: "",
      endDate: "",
    },
  });
  const [loading, setLoading] = useState(false);

  const submit = async (objective: Project) => {
    setLoading(true);

    console.log(objective);
    const payload = {
      data: {
        type: "paragraph--project",
        attributes: {
          field_project_description: objective.description,
          field_project_title: objective.title,
          field_start_date: objective.startDate,
          field_end_date: objective.endDate,
        },
      },
    };
    console.log(JSON.stringify(payload));

    try {
      const response = await fetch(
        "http://worklog.ddev.site/jsonapi/paragraph/project",
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
            type: "paragraph--project",
            id: paragraph.data.id,
            meta: {
              target_revision_id:
                paragraph.data.attributes.drupal_internal__revision_id,
            },
          },
        ],
      };
      const res = await fetch(
        `http://worklog.ddev.site/jsonapi/node/work_log/${id}/relationships/field_projects`,
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
      <h3>New Project</h3>
      <hr />
      <form onSubmit={handleSubmit(submit)}>
        <Controller
          control={control}
          name="title"
          rules={{ required: true }}
          render={({ field: { onChange, onBlur, value, ref } }) => (
            <Input
              value={value}
              handleInputChange={onChange}
              label="Title"
              placeholder="Spectacular Project"
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

        <Controller
          control={control}
          name="startDate"
          rules={{ required: true }}
          render={({ field: { onChange, onBlur, value, ref } }) => (
            <Input
              value={value}
              handleInputChange={onChange}
              label="Start Date"
              type="date"
            />
          )}
        />
        <Controller
          control={control}
          name="endDate"
          rules={{ required: true }}
          render={({ field: { onChange, onBlur, value, ref } }) => (
            <Input
              value={value}
              handleInputChange={onChange}
              label="End Date"
              type="date"
            />
          )}
        />
        <input
          type="submit"
          p="2"
          px="4"
          bg="green"
          color="white"
          rounded="2"
        />
      </form>
    </Layout>
  );
};

export default AddProject;
