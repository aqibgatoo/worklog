import { getEntitiesFromContext, getEntityFromContext } from "next-drupal";
import RootComponent from "../../src/dynamicCompoents/RootComponent";
import { Layout } from "../../src/layout";
import { normalize, NormalizedResponse } from "../../src/utils/mapper";
const Index = ({ worklogs }) => {
  const json: NormalizedResponse = normalize(worklogs, "worklogs");
  return (
    <Layout>
      <RootComponent data={json.data.components} />
    </Layout>
  );
};

export async function getServerSideProps(context) {
  const id = context.query?.id;
  const worklogs = await getEntitiesFromContext("node", "work_log", context, {
    params: {
      include:
        "field_certifications,field_contributions,field_objectives,field_projects,field_recognitions,field_user",
      sort: "-created",
    },
    filter: (entity) => (id ? entity.id === id : true),
  });

  return {
    props: {
      worklogs: worklogs,
      revalidate: 1,
    },
  };
}

export default Index;
