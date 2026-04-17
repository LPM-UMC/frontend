import type { StudyProgram } from "./study-program";
import type { Dean, Gkmf } from "./user";

export type Faculty = {
  id: string;
  code: string;
  name: string;
  dean?: Dean | null;
  gkmf?: Gkmf | null;
  study_programs?: StudyProgram[] | null;
};
