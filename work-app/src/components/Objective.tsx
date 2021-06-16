import { formatDate } from "../utils/format-date";
import Reference, { ReferenceProps } from "./Reference";
import { Icon } from "reflexjs";
import { Source } from "../types";

export type ObjectiveProps = {
  goal: string;
  createdAt: string;
  type: string;
  description: string;
  important: boolean;
  stakeholders: string[];
  sources: Source[];
};

const Objective = ({
  goal,
  createdAt,
  type,
  description,
  important,
  stakeholders,
  sources,
}: ObjectiveProps) => {
  return (
    <div>
      <h4>{goal}</h4>
      <p>{type}</p>
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
      {stakeholders.length && (
        <div>
          <h5 my="2">Stakeholders</h5>
          {stakeholders.map((name, index) => (
            <div key={`${name}${index}`}>
              <p>
                {index + 1}.&nbsp;{name}
              </p>
            </div>
          ))}
        </div>
      )}
      {!!sources.length && (
        <>
          <h5 mt="3">References</h5>
          {sources.map(({ uri, title }, index) => (
            <Reference key={uri} uri={uri} title={title} index={index + 1} />
          ))}
        </>
      )}
    </div>
  );
};

export default Objective;
