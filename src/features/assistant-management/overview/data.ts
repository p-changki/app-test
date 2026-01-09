import { assistantEntities } from "@/data/assistants";

export type StageCategory = "pending" | "approved" | "rejected";

export type StageTab = {
  label: string;
  count: number;
  stage: StageCategory;
};

export type Applicant = {
  name: string;
  phone: string;
  email: string;
  appliedAt: string;
  instructor: string;
  role: string;
  badgeColor: "amber" | "blue" | "emerald";
  highlight?: boolean;
  stage: StageCategory;
};

type ApplicantSeed = {
  assistantId: string;
  email: string;
  appliedAt: string;
  instructor: string;
  role: string;
  badgeColor: Applicant["badgeColor"];
  highlight?: boolean;
  stage: StageCategory;
};

const applicantSeeds: ApplicantSeed[] = [
  {
    assistantId: "assistant-kim-minsu",
    email: "pjh@example.com",
    appliedAt: "2024. 06. 20 14:30",
    instructor: "김민수 선생님",
    role: "중등 수학 보조",
    badgeColor: "amber",
    stage: "pending",
  },
  {
    assistantId: "assistant-lee-jieun",
    email: "soomin@example.com",
    appliedAt: "2024. 06. 19 09:15",
    instructor: "이서연 선생님",
    role: "고등 영어 채점",
    badgeColor: "blue",
    highlight: true,
    stage: "approved",
  },
  {
    assistantId: "assistant-park-sungho",
    email: "taehee@example.com",
    appliedAt: "2024. 06. 18 10:20",
    instructor: "박준형 선생님",
    role: "초등 과학 실험",
    badgeColor: "emerald",
    stage: "rejected",
  },
];

export const applicants: Applicant[] = applicantSeeds
  .map((seed) => {
    const assistant = assistantEntities.find(
      (entity) => entity.id === seed.assistantId
    );
    if (!assistant) {
      return null;
    }
    return {
      name: assistant.name,
      phone: assistant.phone,
      email: seed.email,
      appliedAt: seed.appliedAt,
      instructor: seed.instructor,
      role: seed.role,
      badgeColor: seed.badgeColor,
      highlight: seed.highlight,
      stage: seed.stage,
    };
  })
  .filter(Boolean) as Applicant[];

const stageCount = applicantSeeds.reduce(
  (acc, seed) => {
    if (seed.stage === "pending") acc.pending += 1;
    else if (seed.stage === "approved") acc.approved += 1;
    else acc.rejected += 1;
    return acc;
  },
  { pending: 0, approved: 0, rejected: 0 }
);

export const stageTabs: StageTab[] = [
  { label: "승인 대기", count: stageCount.pending, stage: "pending" },
  { label: "승인 완료", count: stageCount.approved, stage: "approved" },
  { label: "반려됨", count: stageCount.rejected, stage: "rejected" },
];
