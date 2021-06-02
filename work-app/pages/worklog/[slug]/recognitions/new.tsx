import { useRouter } from "next/router";
import { useState } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
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
  onSuccess: (value: boolean) => void;
};

export const AddRecognition = ({ slug, id, onSuccess }: RecognitionProps) => {
  const {
    // query: { slug, id },
    push,
  } = useRouter();

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

  const submit = async (recognition: Recognition) => {
    setLoading(true);
    console.log(recognition);
    const payload = {
      data: {
        type: "paragraph--recognition",
        attributes: {
          field_description: recognition.description,
          field_important_recognition: recognition.important,
          field_recognized_by: recognition.recognizedBy,
          field_recognized_for: recognition.recognizedFor,
          field_source: recognition.link.uri
            ? {
                uri: recognition.link.uri,
                title: recognition.link.title,
              }
            : {},
        },
      },
    };
    console.log(JSON.stringify(payload));

    try {
      const response = await fetch(
        "http://worklog.ddev.site/jsonapi/paragraph/recognition",
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
            type: "paragraph--recognition",
            id: paragraph.data.id,
            meta: {
              target_revision_id:
                paragraph.data.attributes.drupal_internal__revision_id,
            },
          },
        ],
      };
      const res = await fetch(
        `http://worklog.ddev.site/jsonapi/node/work_log/${id}/relationships/field_recognitions`,
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
      reset();
      onSuccess(false);
      push(`/worklog/${slug}`);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };
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

        <Button label="Submit" loading={loading} type="submit" />
      </form>
    </div>
  );
};

export default AddRecognition;
