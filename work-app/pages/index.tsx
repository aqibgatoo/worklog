import { useEffect, useState } from "react";
import { getEntitiesFromContext } from "next-drupal";
import Link from "next/link";
import Image from "next/image";
import { Layout } from "../src/layout";
import { formatDate } from "../src/utils/format-date";
import { useRouter } from "next/router";
import Button from "../src/components/Button";
import { useAuth } from "../src/auth/AuthContext";

export default function IndexPage({ worklogs }) {
  const router = useRouter();

  const handleAddWorklog = () => {
    router.push("/worklogs/new/");
  };

  return (
    <Layout>
      <div
        display="flex"
        justifyContent="space-between"
        alignItems="flex-start"
      >
        <h1 variant="heading.h2" mb="10">
          Worklogs
        </h1>
        <Button onClick={handleAddWorklog} label="Add New" />


      </div>

      {worklogs?.length ? (
        worklogs.map((worklog) => (
          <article key={worklog.id} py="10">
            <Link href={worklog.path.alias} passHref>
              <a textDecoration="none">
                <h2 variant="heading.h3" mb="4">
                  {worklog.title}
                </h2>
              </a>
            </Link>
            <div mb="4" color="gray">
              {worklog.uid?.display_name ? (
                <span>
                  By{" "}
                  <span fontWeight="semibold">{worklog.uid?.display_name}</span>
                </span>
              ) : null}
              <span> - {formatDate(worklog.created)}</span>
            </div>
            {worklog.field_image?.uri && (
              <div>
                <Image
                  src={`${process.env.NEXT_PUBLIC_DRUPAL_BASE_URL}${worklog.field_image.uri.url}`}
                  width={640}
                  height={400}
                  layout="responsive"
                  objectFit="cover"
                />
              </div>
            )}
            <hr />
          </article>
        ))
      ) : (
        <p>No worklogs found</p>
      )}
    </Layout>
  );
}

export async function getStaticProps(context) {
  const worklogs = await getEntitiesFromContext("node", "work_log", context, {
    params: {
      include:
        "field_certifications,field_contributions,field_objectives,field_projects,field_recognitions,field_user",
      sort: "-created",
    },
  });

  return {
    props: {
      worklogs,
      revalidate: 1,
    },
  };
}
