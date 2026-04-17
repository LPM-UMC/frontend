export type Role = {
  id: string;
  name: string;
  label: string;
}

export type Dean = {
  id: string;
  nidn: string;
  name: string;
};

export type Gkmf = {
  id: string;
  nidn: string;
  name: string;
};

export type HeadOfStudyProgram = {
  id: string;
  nidn: string;
  name: string;
};

export type User = {
  id: string;
  nid?: string | null;
  nim?: string | null;
  name: string;
  email: string;
  picture?: string | null;
  role: Role[];
  study_program?: {
    id: string;
    code: string;
    name: string;
    degree_level: string;
  } | null;
  head_of_study_program: {
    id: string;
    code: string;
    name: string;
    degree_level: string;
  }[];
  faculty?: {
    id: string;
    code: string;
    name: string;
  } | null;
  gkmf?: {
    id: string;
    code: string;
    name: string;
  } | null;
}
