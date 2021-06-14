import { formatDate } from "../utils/format-date";
import Reference from "./Reference";
import { Icon } from "reflexjs";
import { Source } from "../types";

export type RecognitionProps = {
  createdAt: string;
  description: string;
  important: boolean;
  recognizedFor: string;
  recognizedBy: string;
  sources: Source[];
};

const Recognition = ({
  createdAt,
  description,
  important,
  recognizedFor,
  recognizedBy,
  sources,
}) => {
  return (
    <div>
      <div
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        mb="3"
      >
        <p>{formatDate(createdAt)}</p>
        {important && <Icon name="star" size="8" />}
      </div>
      <div
        dangerouslySetInnerHTML={{
          __html: description,
        }}
      ></div>
      <p my="2">
        Recognized for <strong>{recognizedFor}</strong> - by{" "}
        <strong>{recognizedBy}</strong>
      </p>

      <h5 mt="3">References</h5>
      {sources.map(({ uri, title }, index) => (
        <Reference key={uri} uri={uri} title={title} index={index + 1} />
      ))}
    </div>
  );
};

export default Recognition;
