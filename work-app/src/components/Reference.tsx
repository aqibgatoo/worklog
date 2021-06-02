import Link from "next/link";
export type ReferenceProps = {
  title?: string;
  uri: string;
  index?: number;
};

const Reference = ({ index = 1, uri, title }: ReferenceProps) => {
  return uri ? (
    <p>
      {index}.&nbsp;
      <Link href={uri} passHref>
        <a textDecoration="none" color="green">
          <span fontStyle="italic"> {title || uri}</span>
        </a>
      </Link>
    </p>
  ) : (
    <div></div>
  );
};

export default Reference;
