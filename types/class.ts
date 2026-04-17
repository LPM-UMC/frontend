export type Class = {
  id: string;
  code: string;
  name: string;
  class: string;
  lecturer_name: string;
  first_meeting: {
    meeting_date: Date;
    scheduled_start_time: Date;
    scheduled_end_time: Date;
    started_at: Date;
    ended_at: Date;
    status: "on_time";
  };
  study_program_id: string;
}
