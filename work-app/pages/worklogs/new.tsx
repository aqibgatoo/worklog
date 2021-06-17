import { useRouter } from "next/router";
import { FormEvent, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { createWorkLog } from "../../src/api";
import { useAuth } from "../../src/auth/AuthContext";
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
  const { user } = useAuth();

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
    const result = await createWorkLog({
      title: worklog.title,
      field_title: worklog.title,
      field_end_date: worklog.endDate,
      field_start_date: worklog.startDate,
    });
    setLoading(false);
    if (result.succeeded) {
      router.push("/");
    } else {
      console.log("failed to add worklog");
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
