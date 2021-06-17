import { getEntitiesFromContext } from "next-drupal";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useAuth } from "../src/auth/AuthContext";
import { RootComponent } from "../src/components";
import { Layout } from "../src/layout";
const Index = ({ data }) => {
  const { push } = useRouter();
  const {  user } = useAuth();

  return (
    <Layout>
      <RootComponent
        data={data.filter((d) => d?.uid?.drupal_internal__uid === +user?.id)}
      />
    </Layout>
  );
};

export async function getServerSideProps(context) {
  const id = context.query?.id;
  const data = await getEntitiesFromContext("node", "work_log", context, {
    params: {
      include:
        "field_certifications,field_contributions,field_objectives,field_projects,field_recognitions,field_highlights,field_user,uid",
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
