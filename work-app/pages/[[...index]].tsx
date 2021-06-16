import { getEntitiesFromContext } from "next-drupal";
import { RootComponent } from "../src/components";
import { Layout } from "../src/layout";
const Index = ({ data }) => {
  return (
    <Layout>
      <RootComponent data={data} />
    </Layout>
  );
};

export async function getServerSideProps(context) {
  const id = context.query?.id;
  const data = await getEntitiesFromContext("node", "work_log", context, {
    params: {
      include:
        "field_certifications,field_contributions,field_objectives,field_projects,field_recognitions,field_highlights,field_user",
      sort: "-created",
    },
    filter: (entity) => (id ? entity.id === id : true),
  });

  return {
    props: {
      data,
      revalidate: 1,
    },
  };
}

export default Index;
