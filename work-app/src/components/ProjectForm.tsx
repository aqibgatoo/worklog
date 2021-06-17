import { useRouter } from "next/router";
import { useState } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { addChildEntity, ChildEntity } from "../../src/api/client";
import { Input, Button } from "../../src/components";
import { Layout } from "../../src/layout";
import { Source } from "../../src/types";

export type Project = {
  title: string;
  description: string;
  startDate: string;
  endDate: string;
};
export type ProjectProps = {
  slug: string | string[];
  id: string;
};
export const ProjectForm = ({ slug, id }: ProjectProps) => {
  const { replace } = useRouter();

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

  const submit = async (project: Project) => {
    setLoading(true);
    const result = await addChildEntity(id, "project", {
      field_project_description: project.description,
      field_project_title: project.title,
      field_start_date: project.startDate,
      field_end_date: project.endDate,
    });
    setLoading(false);
    if (result.succeeded) {
      replace(`/${slug}`);
    }
  };
  return (
    <div>
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
        <Button label="Submit" loading={loading} type="submit" />
      </form>
    </div>
  );
};

export default ProjectForm;
