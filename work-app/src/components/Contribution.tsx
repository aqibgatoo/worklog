import { formatDate } from "../utils/format-date";
import Reference, { ReferenceProps } from "./Reference";
import { Icon } from "reflexjs";
import { Source } from "../types";

export type ContributionProps = {
  type: string;
  technology: string;
  createdAt: string;
  title: string;
  important?: boolean;
  sources: Source[];
};
const Contribution = ({
  title,
  technology,
  createdAt,
  type,
  important,
  sources,
}: ContributionProps) => {
  return (
    <div>
      <p>
        {type} - {technology}
      </p>
      <div
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        mb="3"
      >
        <p>{formatDate(createdAt)}</p>
        {important && <Icon name="star" size="8" />}
      </div>

      <p>{title}</p>
      <h5 mt="3">References</h5>
      {sources.map(({ uri, title }, index) => (
        <Reference key={uri} uri={uri} title={title} index={index + 1} />
      ))}
    </div>
  );
};

export default Contribution;
