import { getResourceFromContext } from "next-drupal";


import { Layout } from "../../../../src/layout";
import Contribution from "../../../../src/components/Contribution";
export default function Index({ worklog }) {
  if (!worklog) return null;
  console.log(worklog);

  return (
    <Layout>
      <h2 fontSize="2xl">Contributions</h2>
      {worklog.field_contributions.length ? (
        worklog.field_contributions.map(
          ({
            id,
            field_contribution_type,
            field_technology,
            created,
            field_contribution_important,
            field_title,
            field_contribution_source,
          }) => (
            <div key={id} mt="2">
              <Contribution
                type={field_contribution_type}
                technology={field_technology}
                createdAt={created}
                important={field_contribution_important}
                title={field_title}
                sources={[{ ...field_contribution_source }]}
              />
              <hr />
            </div>
          )
        )
      ) : (
        <p>No contributions found</p>
      )}
      <hr />
    </Layout>
  );
}

export async function getServerSideProps(context) {
  context.params = { slug: [context.params.slug] };

  const worklog = await getResourceFromContext("node--work_log", context, {
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
