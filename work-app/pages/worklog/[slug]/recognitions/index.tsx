import { getResourceFromContext } from "next-drupal";

import { Layout } from "../../../../src/layout";
import { Recognition } from "../../../../src/components";
export default function ArticlePage({ worklog }) {
  if (!worklog) return null;

  return (
    <Layout>
      <h2 fontSize="2xl">Recognitions</h2>
      {worklog.field_recognitions.length ? (
        worklog.field_recognitions.map(
          ({
            id,
            created,
            field_important_recognition,
            field_description,
            field_recognized_by,
            field_recognized_for,
            field_source,
          }) => (
            <div key={id} mt="2">
              <Recognition
                createdAt={created}
                important={field_important_recognition}
                description={field_description.processed}
                recognizedBy={field_recognized_by}
                recognizedFor={field_recognized_for}
                sources={[{ ...field_source }]}
              />
              <hr />
            </div>
          )
        )
      ) : (
        <p>No Recognitions found</p>
      )}
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
