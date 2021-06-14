export interface NormalizedResponse {
  data: { components: Component[] };
}
export type Component = {
  type: ComponentType;
  data: any;
};

export type ComponentType =
  | "highlights"
  | "recognitions"
  | "objectives"
  | "certifications"
  | "contributions"
  | "worklogs"
  | "projects";

// For the time being consider the data as being worklogs array
export const normalize = (
  data: any[],
  type: ComponentType
): NormalizedResponse => {
  return {
    data: {
      components: [
        {
          type: type,
          data: data,
        },
      ],
    },
  };
};
