import { getPathsForEntityType, getEntityFromContext } from "next-drupal";

import { Layout } from "../../../../src/layout";
import { Project } from "../../../../src/components";
export default function Index({ worklog }) {
  if (!worklog) return null;
  return (
    <Layout>
      <h2 fontSize="2xl">Projects</h2>
      {worklog.field_projects.length ? (
        worklog.field_projects.map(
          ({
            id,
            field_project_title,
            field_start_date,
            field_end_date,
            field_project_description,
          }) => (
            <div key={id} mt="2">
              <Project
                title={field_project_title}
                startDate={field_start_date}
                endDate={field_end_date}
                description={field_project_description.processed}
              />
              <hr />
            </div>
          )
        )
      ) : (
        <p>No projects found</p>
      )}
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
