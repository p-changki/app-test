import { classEntities } from "@/data/classes";

const subjectBases = classEntities.map((klass) => {
  const [base] = klass.subject.split("(");
  return base.trim();
});

export const classRegistrationSubjectOptions: readonly string[] = [
  ...new Set(subjectBases.length ? subjectBases : ["종합 교과"]),
];

export const classRegistrationAudienceTags: readonly string[] = [
  ...new Set(classEntities.map((klass) => `${klass.level} 대상`)),
];

type ClassroomOption = {
  value: string;
  label: string;
};

export const classRegistrationClassrooms: ClassroomOption[] = Array.from(
  new Map(
    classEntities.map((klass) => [
      klass.schedule.location,
      {
        value: klass.schedule.location,
        label: `${klass.schedule.location} (${klass.name})`,
      },
    ])
  ).values()
);

const parseTimeRange = (range: string) => {
  const [start, end] = range.split("-").map((part) => part.trim());
  return { start, end };
};

type ScheduleSlot = {
  id: string;
  day: string;
  start: string;
  end: string;
};

export const classRegistrationScheduleSlots: ScheduleSlot[] =
  classEntities.flatMap((klass) => {
    const { start, end } = parseTimeRange(klass.schedule.time);
    return klass.schedule.days.map((day) => ({
      id: `${klass.id}-${day}`,
      day: `${day}요일`,
      start,
      end,
    }));
  });
