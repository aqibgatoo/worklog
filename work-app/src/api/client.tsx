export type APIResult = {
  succeeded: boolean;
};

const getUserId = async (): Promise<string> => {
  const userId = localStorage.getItem("userId");
  if (!userId) {
    const response = await fetch(`${process.env.NEXT_PUBLIC_JSON_API_URL}`, {
      method: "GET",
      headers: {
        Authorization: `Basic ${localStorage.getItem("token")}`,
      },
    });
    if (response.status === 200) {
      const result = await response.json();
      const id = result.meta.links.me.meta.id;
      localStorage.setItem("userId", id);
      return id;
    }
  }
  return userId;
};

const createWorkLog = async (attributes: Object): Promise<APIResult> => {
  try {
    const userId = await getUserId();
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_JSON_API_URL}/node/work_log`,
      {
        method: "POST",
        headers: {
          Authorization: `Basic ${localStorage.getItem("token")}`,
          "Content-Type": "application/vnd.api+json",
        },
        body: JSON.stringify({
          data: {
            type: "work_log",
            attributes: attributes,
            relationships: {
              field_user: {
                data: {
                  type: "user--user",
                  id: userId,
                },
              },
            },
          },
        }),
      }
    );
    if (response.status === 201) {
      return { succeeded: true };
    }
  } catch (e) {
    console.log(e);
    return { succeeded: false };
  }
};

export type ChildEntity =
  | "certificate"
  | "recognition"
  | "project"
  | "contribution"
  | "objective";
// Entity to realationship mapping
export enum ChildEntityParentRelationship {
  "certificate" = "certifications",
  "recognition" = "recognitions",
  "project" = "projects",
  "contribution" = "contributions",
  "objective" = "objectives",
}

const addChildEntity = async (
  parentEntityId: string,
  type: ChildEntity,
  attributes: Object
): Promise<APIResult> => {
  const method = "POST";
  const headers = {
    Authorization: `Basic ${localStorage.getItem("token")}`, // "X-CSRF-Token": JSON.parse(localStorage.getItem("user")).logoutToken,
    "Content-Type": "application/vnd.api+json",
  };
  const childEntityPayload = {
    data: {
      type: `paragraph--${type}`,
      attributes: attributes,
    },
  };

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_JSON_API_URL}/paragraph/${type}`,
      {
        method,
        headers,
        body: JSON.stringify(childEntityPayload),
      }
    );
    if (response.status !== 201) {
      return { succeeded: false };
    }
    const addedChildEntity = await response.json();

    const linkingPayload = {
      data: [
        {
          type: `paragraph--${type}`,
          id: addedChildEntity.data.id,
          meta: {
            target_revision_id:
              addedChildEntity.data.attributes.drupal_internal__revision_id,
          },
        },
      ],
    };
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_JSON_API_URL}/node/work_log/${parentEntityId}/relationships/field_${ChildEntityParentRelationship[type]}`,
      {
        method,
        headers,
        body: JSON.stringify(linkingPayload),
      }
    );
    if (res.status === 204) {
      return { succeeded: true };
    }
  } catch (error) {
    console.log(error);
    return { succeeded: false };
  }
};

export { createWorkLog, addChildEntity };
