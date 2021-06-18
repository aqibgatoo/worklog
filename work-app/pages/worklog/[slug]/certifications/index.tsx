import { getResourceFromContext } from "next-drupal";

import { Layout } from "../../../../src/layout";
import Certification from "../../../../src/components/Certification";
import { useRouter } from "next/router";
export default function Index({ worklog }) {
  if (!worklog) return null;
  const router = useRouter();

  const handleAddWorklog = () => {
    router.push("/worklog/create");
  };
  return (
    <Layout>
      <h2 fontSize="2xl">Certifications</h2>
      {worklog.field_certifications.length ? (
        worklog.field_certifications.map(
          ({
            id,
            field_certification_title,
            field_completion_date,
            field_link,
          }) => (
            <div key={id} mt="2">
              <Certification
                title={field_certification_title}
                completionDate={field_completion_date}
                source={{ ...field_link }}
              />
              <hr />
            </div>
          )
        )
      ) : (
        <p>No Certifications found.</p>
      )}
      <hr />
    </Layout>
  );
}

export async function getServerSideProps(context) {
  context.params = { slug: [context.params.slug] };
  const worklog = await getResourceFromContext("node--work_log", context, {
    prefix: `/worklog`,
    params: {
      include:
        "field_certifications,field_contributions,field_objectives,field_projects,field_recognitions,field_user",
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
