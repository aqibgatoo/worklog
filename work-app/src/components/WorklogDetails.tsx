import Image from "next/image";
import Link from "next/link";
import { getPathsForEntityType, getEntityFromContext } from "next-drupal";
import {
  Button,
  Recognition,
  Collapsible,
  RecognitionSection,
  ContributionSection,
  ProjectSection,
  CertificationSection,
  ObjectiveSection,
} from ".";
import { formatDate } from "../utils/format-date";
import { Icon } from "reflexjs";
import { useRouter } from "next/router";
import { useState } from "react";
import { addChildEntity } from "../api/client";
import { getComponent } from "./RootComponent";
const WorklogDetails = ({ data: worklog }) => {
  return (
    <article>
      <div>
        <h1 fontSize="3xl" lineHeight="1" mb="6">
          {worklog.title}
        </h1>
        <div mb="4" color="gray">
          <span>
            By <strong>{worklog.field_user?.display_name}</strong>
          </span>
        </div>
        <div>
          <span>
            {formatDate(worklog.field_start_date)} -{" "}
            {formatDate(worklog.field_end_date)}
          </span>
        </div>
        <hr />
        {worklog.field_highlights.map((item, index) => (
          <div key={`${item.type}${index}`}>
            {getComponent(item.type, item)}
            <hr />
          </div>
        ))}
      </div>
      <RecognitionSection worklog={worklog} />
      <hr />
      <ObjectiveSection worklog={worklog} />
      <hr />
      <ContributionSection worklog={worklog} />
      <hr />
      <CertificationSection worklog={worklog} />
      <hr />
      <ProjectSection worklog={worklog} />
      <hr />
      <div py="6" display="flex" justifyContent="center">
        <Link href="/" passHref>
          <a variant="button.link">
            <Icon name="arrow" transform="rotate(180deg)" mr="2" />
            Back
          </a>
        </Link>
      </div>
    </article>
  );
};
export default WorklogDetails;
