import { useRouter } from "next/router";
import { FormEvent, useState } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { addChildEntity, ChildEntity } from "../../src/api/client";
import { Input, Select, Button } from "../../src/components";
import { Source } from "../../src/types";

export enum ContributionType {
  "Select" = "None",
  "Code contributions" = "Code contributions",
  "Event contributions" = "Event contributions",
  "Non Code contributions" = "Non Code contributions",
}

export enum Technology {
  "Any" = "Any",
  "Accessibility" = "Accessibility",
  "Ansible" = "Ansible",
  "Ansible Docker AWS" = "Ansible Docker AWS",
  "Apache Web Server" = "Apache Web Server",
  "Cohesion" = "Cohesion",
  "CSS, HAML" = "CSS, HAML",
  "Cypress" = "Cypress",
  "Drupal" = "Drupal",
  "Drupal 8 with Cohesion" = "Drupal 8 with Cohesion",
  "General" = "General",
  "GitLab" = "GitLab",
  "JavaScript" = "JavaScript",
  "jQuery" = "jQuery",
  "Kubernetes" = "Kubernetes",
  "Laravel" = "Laravel",
  "Magento" = "Magento",
  "Mautic" = "Mautic",
  "Mautic, Lando" = "Mautic, Lando",
  "Nginx Web Server" = "Nginx Web Server",
  "Node.js" = "Node.js",
  "OpenShift" = "OpenShift",
  "PHP" = "PHP",
  "QA" = "QA",
  "Ruby on Rails, VueJs" = "Ruby on Rails, VueJs",
  "SQL Server, Docker, MacOS, Azure Data Studio" = "SQL Server, Docker, MacOS, Azure Data Studio",
  "Test Automation" = "Test Automation",
  "Testing WordPress" = "Testing WordPress",
}

export type Contribution = {
  title: string;
  link?: Source;
  type: ContributionType;
  technology: Technology;
  important: boolean;
  date: string;
};
export type ContributionProps = {
  slug: string | string[];
  id: string;
};
export const ContributionForm = ({ slug, id }: ContributionProps) => {
  const { push } = useRouter();

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<Contribution>({
    defaultValues: {
      title: "",
      link: { uri: "", title: "" },
      type: ContributionType.Select,
      technology: Technology.Any,
      important: false,
      date: "",
    },
  });
  const [loading, setLoading] = useState(false);

  const submit = async (contribution: Contribution) => {
    setLoading(true);
    const result = await addChildEntity(id, "contribution", {
      field_title: contribution.title,
      field_contribution_date: contribution.date,
      field_contribution_important: contribution.important,
      field_contribution_source: contribution.link,
      field_contribution_type: contribution.type,
      field_technology: contribution.technology,
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
          name="title"
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
        <div display="flex" flexDirection="row" alignItems="center">
          <div flex="1">
            <Controller
              control={control}
              name="type"
              rules={{ required: true }}
              render={({ field: { onChange, onBlur, value, ref } }) => (
                <Select
                  handleChange={onChange}
                  value={value}
                  label="Contribution Type"
                  options={ContributionType}
                />
              )}
            />
          </div>
          <div flex="1" ml="2">
            <Controller
              control={control}
              name="technology"
              rules={{ required: true }}
              render={({ field: { onChange, onBlur, value, ref } }) => (
                <Select
                  handleChange={onChange}
                  value={value}
                  label="Technology"
                  options={Technology}
                />
              )}
            />
          </div>
        </div>

        <div
          display="flex"
          flexDirection="row"
          justifyContent="space-between"
          alignItems="center"
          mt="3"
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
          name="date"
          rules={{ required: true }}
          render={({ field: { onChange, onBlur, value, ref } }) => (
            <Input
              value={value}
              handleInputChange={onChange}
              label="Contribution Date"
              type="date"
            />
          )}
        />
        <Controller
          control={control}
          name="important"
          render={({ field: { onChange, onBlur, value, ref } }) => (
            <Input
              value={value}
              handleInputChange={onChange}
              label="Important Contribution"
              type="checkbox"
            />
          )}
        />
        <Button label="Submit" loading={loading} type="submit" />
      </form>
    </div>
  );
};

export default ContributionForm;
