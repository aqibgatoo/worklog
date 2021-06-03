import { useRouter } from "next/router";
import { FormEvent, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Input, Button } from "../../src/components";
import { Layout } from "../../src/layout";

export type Worklog = {
  pageTitle: string;
  title: string;
  startDate: string;
  endDate: string;
};

export const AddWorkLog = ({}) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<Worklog>({
    defaultValues: {
      title: "",
      startDate: "",
      endDate: "",
    },
  });
  const submit = async (worklog: Worklog) => {
    setLoading(true);
    console.log(worklog);
    const payload = {
      data: {
        type: "work_log",
        attributes: {
          title: worklog.title,
          field_title: worklog.title,
          field_end_date: worklog.endDate,
          field_start_date: worklog.startDate,
        },
        relationships: {
          field_user: {
            data: {
              type: "user--user",
              id: "6c5883f1-47ca-4e16-bfb5-9d6d35453240",
            },
          },
        },
      },
    };
    try {
      const response = await fetch(process.env.NEXT_JSON_API_URL, {
        method: "POST",
        mode: "cors",
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_ACCESS_TOKEN}`,
          "Content-Type": "application/vnd.api+json",
        },
        body: JSON.stringify(payload),
      });
      setLoading(false);
      if (response.status === 201) {
        router.push("/");
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };
  return (
    <Layout>
      <h3>New Worklog</h3>
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
              placeholder="Work log 2021 - 2022"
            />
          )}
        />
        <Controller
          control={control}
          rules={{ required: true }}
          name="startDate"
          render={({ field: { onChange, onBlur, value, ref } }) => (
            <Input
              value={value}
              handleInputChange={onChange}
              label="Start Date"
              type="date"
              placeholder="dd/mm/yyyy"
            />
          )}
        />
        <Controller
          control={control}
          name="endDate"
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
    </Layout>
  );
};

export default AddWorkLog;
