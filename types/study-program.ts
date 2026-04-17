import type { HeadOfStudyProgram } from "./user";

export type StudyProgram = {
  id: string;
  code: string;
  name: string;
  degree_level: string;
  head_of_study_program?: HeadOfStudyProgram | null;
  faculty?: {
    id: string;
    code: string;
    name: string;
    dean?: {
      id: string;
      nidn: string;
      name: string;
    } | null;
    gkmf?: {
      id: string;
      nidn: string;
      name: string;
    } | null;
  };
};
