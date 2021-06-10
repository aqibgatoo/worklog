import { useRouter } from "next/router";
import { useState } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { addChildEntity, ChildEntity } from "../../../../src/api/client";
import { Input, Button } from "../../../../src/components";
import { Layout } from "../../../../src/layout";
import { Source } from "../../../../src/types";

export enum RecognitionValue {
  "Select" = "None",
  "Enthusiasm" = "Enthusiasm",
  "Kindness" = "Kindness",
  "Openness" = "Openness",
}

export type Recognition = {
  description: string;
  link?: Source;
  recognizedFor: RecognitionValue;
  recognizedBy: string;
  important: boolean;
};
export type RecognitionProps = {
  slug: string | string[];
  id: string;
  onSaved: (value: boolean) => void;
};
export const AddRecognition = ({ slug, id, onSaved }: RecognitionProps) => {
  const { push } = useRouter();

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<Recognition>({
    defaultValues: {
      description: "",
      link: { uri: "", title: "" },
      important: false,
      recognizedFor: RecognitionValue.Select,
      recognizedBy: "",
    },
  });
  const [loading, setLoading] = useState(false);


  return (
    <div>
      <form onSubmit={handleSubmit(submit)}>
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
            name="recognizedFor"
            rules={{ required: true }}
            render={({ field: { onChange, onBlur, value, ref } }) => (
              <>
                <label htmlFor="recognizedFor">Recognzied For</label>
                <select
                  id="recognizedFor"
                  value={value}
                  onChange={onChange}
                  p="2"
                  flex="1"
                  rounded="4"
                  borderColor="white"
                >
                  {Object.entries(RecognitionValue).map(([key, value]) => (
                    <option
                      key={key}
                      disabled={value === RecognitionValue.Select}
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
        <Controller
          control={control}
          name="recognizedBy"
          rules={{ required: true }}
          render={({ field: { onChange, onBlur, value, ref } }) => (
            <Input
              value={value}
              handleInputChange={onChange}
              label="Recognized By"
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
          name="important"
          render={({ field: { onChange, onBlur, value, ref } }) => (
            <Input
              value={value}
              handleInputChange={onChange}
              label="Important"
              type="checkbox"
            />
          )}
        />
      </form>
      <Button label="Submit" loading={loading} type="submit" />x
    </div>
  );
};

export default AddRecognition;
