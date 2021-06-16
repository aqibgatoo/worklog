import { getEntitiesFromContext } from "next-drupal";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useAuth } from "../src/auth/AuthContext";
import { RootComponent } from "../src/components";
import { Layout } from "../src/layout";
const Index = ({ data }) => {
  const { push } = useRouter();
  const { user, login, logout } = useAuth();
  useEffect(() => {
    if (!user) {
      push("/login");
    }
  }, [user]);
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
