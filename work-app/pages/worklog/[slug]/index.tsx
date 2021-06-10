import Image from "next/image";
import Link from "next/link";
import { getPathsForEntityType, getEntityFromContext } from "next-drupal";
import { Button, Recognition } from "../../../src/components";
import { Layout } from "../../../src/layout";
import { formatDate } from "../../../src/utils/format-date";
import { Icon } from "reflexjs";
import { useRouter } from "next/router";
import Collapsible from "../../../src/components/Collapsible";
import AddCertification from "./certifications/new";
import { useState } from "react";
import AddRecognition from "./recognitions/new";
import { addChildEntity } from "../../../src/api/client";
import RecognitionSection from "./recognitions/RecognitionSection";
export default function Index({ worklog }) {
  if (!worklog) return null;
  const {
    push,
    query: { slug },
  } = useRouter();

  const [addCertification, setAddCertification] = useState(false);
  const handleAdd = (route: string) => () => {
    console.log(worklog);
    push(`${route}?id=${worklog.id}`);
  };
  const submit = async (id, childEntity, attributes): Promise<boolean> => {
    // setLoading(true);
    const result = await addChildEntity(id, childEntity, attributes);
    // setLoading(false);
    if (result.succeeded) {
      return true;
    }
  };

  return (
    <Layout>
      <article py="10">
        <h1 fontSize="5xl" lineHeight="1" mb="6">
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
        <RecognitionSection worklog={worklog} />
        <hr />
        <div
          display="flex"
          justifyContent="space-between"
          alignItems="baseline"
        >
          <h2 fontSize="2xl">Objectives</h2>
          <Button
            onClick={handleAdd(`/worklog/${slug}/objectives/new`)}
            label=" Add New"
          />
        </div>
        {worklog.field_objectives.length ? (
          <div
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            mb="3"
          >
            <h3>{worklog.field_objectives.length}</h3>
            <Link href={`${slug}/objectives`} passHref>
              <a variant="button.link">
                View
                <Icon name="arrow" ml="1" />
              </a>
            </Link>
          </div>
        ) : (
          <p>No Objectives found</p>
        )}
        <hr />

        <div
          display="flex"
          justifyContent="space-between"
          alignItems="baseline"
        >
          <h2 fontSize="2xl">Contributions</h2>
          <Button
            onClick={handleAdd(`/worklog/${slug}/contributions/new`)}
            label=" Add New"
          />
        </div>
        {worklog.field_contributions.length ? (
          <div
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            mb="3"
          >
            <h3>{worklog.field_contributions.length}</h3>
            <Link href={`${slug}/contributions`} passHref>
              <a variant="button.link">
                View
                <Icon name="arrow" ml="1" />
              </a>
            </Link>
          </div>
        ) : (
          <p>No contributions found</p>
        )}
        <hr />

        <div
          display="flex"
          justifyContent="space-between"
          alignItems="baseline"
        >
          <h2 fontSize="2xl">Certifications</h2>
          <Button
            onClick={handleAdd(`/worklog/${slug}/certifications/new`)}
            label=" Add New"
          />
        </div>
        {worklog.field_certifications.length ? (
          <div
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            mb="3"
          >
            <h3>{worklog.field_certifications.length}</h3>
            <Link href={`${slug}/certifications`} passHref>
              <a variant="button.link">
                View
                <Icon name="arrow" ml="1" />
              </a>
            </Link>
          </div>
        ) : (
          <p>No certifications found</p>
        )}
        <hr />
        <div
          display="flex"
          justifyContent="space-between"
          alignItems="baseline"
        >
          <h2 fontSize="2xl">Projects</h2>
          <Button
            onClick={handleAdd(`/worklog/${slug}/projects/new`)}
            label=" Add New"
          />
        </div>
        {worklog.field_projects.length ? (
          <div
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            mb="3"
          >
            <h3>{worklog.field_projects.length}</h3>
            <Link href={`${slug}/projects`} passHref>
              <a variant="button.link">
                View
                <Icon name="arrow" ml="1" />
              </a>
            </Link>
          </div>
        ) : (
          <p>No projects found</p>
        )}
        <hr />

        <div py="6" display="flex" justifyContent="center">
          <Link href="/worklogs" passHref>
            <a variant="button.link">
              <Icon name="arrow" transform="rotate(180deg)" mr="2" />
              Back
            </a>
          </Link>
        </div>
      </article>
    </Layout>
  );
}

export async function getStaticPaths() {
  let paths = await getPathsForEntityType("node", "work_log");
  // paths.forEach((element) => {
  //   console.log(element.params);
  // });
  paths = paths.map((e) => ({
    params: {
      slug: e.params.slug[1],
    },
  }));
  return {
    paths: paths,
    fallback: true,
  };
}

export async function getStaticProps(context) {
  console.log(context.params);
  // console.log(context.params.slug.join('/'));
  context.params = { slug: [context.params.slug] };

  const worklog = await getEntityFromContext("node", "work_log", context, {
    prefix: "/worklog",
    params: {
      include:
        "field_certifications,field_contributions,field_objectives,field_projects,field_recognitions,field_user",
      sort: "-created",
    },
  });

  if (!worklog) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      worklog,
      revalidate: 1,
    },
  };
}
