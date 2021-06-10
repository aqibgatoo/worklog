const createWorkLog = async (url: RequestInfo, payload: RequestInit) => {
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_ACCESS_TOKEN}`,
        "Content-Type": "application/vnd.api+json",
      },
      body: JSON.stringify(payload),
    });
    return await response.json();
  } catch (e) {
    console.log(e);
    return {};
  }
};

export type APIResult = {
  succeeded: boolean;
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
    Authorization: `Bearer ${process.env.NEXT_PUBLIC_ACCESS_TOKEN}`,
    "Content-Type": "application/vnd.api+json",
  };
  // setLoading(true);
  // console.log(certification);
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
      `${process.env.NEXT_JSON_API_URL}/node/work_log/${parentEntityId}/relationships/field_${ChildEntityParentRelationship[type]}`,
      {
        method,
        headers,
        body: JSON.stringify(linkingPayload),
      }
    );
    // setLoading(false);
    // push(`/worklog/${slug}`);
  } catch (error) {
    // setLoading(false);
    console.log(error);
    return { succeeded: true };
  }
  return { succeeded: true };
};

export { createWorkLog, addChildEntity };
