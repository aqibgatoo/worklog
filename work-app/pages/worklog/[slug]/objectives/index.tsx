import { getPathsForEntityType, getEntityFromContext } from "next-drupal";

import { Layout } from "../../../../src/layout";
import { Objective } from "../../../../src/components";
export default function Index({ worklog }) {
  if (!worklog) return null;
  return (
    <Layout>
      <h2 fontSize="2xl">Objectives</h2>
      {worklog.field_objectives.length ? (
        worklog.field_objectives.map(
          ({
            id,
            field_goal,
            created,
            field_type,
            field_important,
            field_stakeholders,
            field_description_objective,
            field_source_objective,
          }) => (
            <div key={id} mt="2">
              <Objective
                goal={field_goal}
                createdAt={created}
                type={field_type}
                important={field_important}
                stakeholders={field_stakeholders}
                description={field_description_objective.processed}
                sources={field_source_objective}
              />
              <hr />
            </div>
          )
        )
      ) : (
        <p>No Objectives found</p>
      )}
      <hr />
    </Layout>
  );
}
export async function getServerSideProps(context) {
  context.params = { slug: [context.params.slug] };

  const worklog = await getEntityFromContext("node", "work_log", context, {
    prefix: "/worklog",
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
