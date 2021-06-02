import { Source } from "../types";
import { formatDate } from "../utils/format-date";
import Reference, { ReferenceProps } from "./Reference";

export type CertificationProps = {
  title: string;
  completionDate: string;
  source?: Source;
};
const Certification = ({
  title,
  completionDate,
  source,
}: CertificationProps) => {
  return (
    <div>
      <h4>{title}</h4>
      <p>Completed - {formatDate(completionDate)}</p>

      {source && source.uri && (
        <>
          <h5 mt="3">References</h5>
          <Reference uri={source.uri} title={source.title} />
        </>
      )}
    </div>
  );
};

export default Certification;
