export interface NormalizedResponse {
  data: { components: Component[] };
}
export type Component = {
  type: ComponentType;
  data: any;
};

export enum ComponentType {
  Highlights = "highlights",
  Recognition = "paragraph--recognition",
  Objective = "paragraph--objective",
  Certification = "paragraph--certificate",
  Contribution = "paragraph--contribution",
  Worklog = "node--work_log",
  Project = "paragraph--project",
}

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
