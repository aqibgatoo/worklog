import { useRouter } from "next/router";
import { FormEvent, useState } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { addChildEntity, ChildEntity } from "../../src/api/client";
import { Input, Button } from "../../src/components";
import { Source } from "../../src/types";

export type Certification = {
  title: string;
  link?: Source;
  completionDate: string;
};

export type CertificationProps = {
  slug: string | string[];
  id: string;
};

export const ContributionForm = ({ slug, id }: CertificationProps) => {
  const { replace } = useRouter();
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<Certification>({
    defaultValues: {
      title: "",
      link: { uri: "", title: "" },
      completionDate: "",
    },
  });
  const [loading, setLoading] = useState(false);
  // const { fields, append, remove } = useFieldArray({
  //   control,
  //   name: "links",
  // });
  const submit = async (certification: Certification) => {
    setLoading(true);
    const result = await addChildEntity(id, "certificate", {
      field_certification_title: certification.title,
      field_completion_date: certification.completionDate,
      field_link: certification.link,
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
              placeholder="Drupal Developer"
            />
          )}
        />

        <div
          display="flex"
          flexDirection="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <div flex="1">
            <Controller
              control={control}
              name="link.uri"
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
          <div ml="2" flex="1">
            <Controller
              control={control}
              name="link.title"
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
        </div>

        <Controller
          control={control}
          name="completionDate"
          render={({ field: { onChange, onBlur, value, ref } }) => (
            <Input
              value={value}
              handleInputChange={onChange}
              label="Completion Date"
              type="date"
            />
          )}
        />
        <Button label="Submit" loading={loading} type="submit" />
      </form>
    </div>
  );
};

export default ContributionForm;
