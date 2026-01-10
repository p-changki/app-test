import { useSyncExternalStore } from "react";

export type InquiryStatus =
  | "조교 이관"
  | "강사 검토"
  | "답변 완료"
  | "학생/학부모 확인 완료"
  | "종료";

export type InquiryActor =
  | "student"
  | "parent"
  | "assistant"
  | "instructor"
  | "system";

export type InquiryAttachment = {
  id: string;
  label: string;
  url?: string;
  embedUrl?: string;
  size?: string;
  kind?: "image" | "file" | "video";
};

export type InquiryMessage = {
  id: string;
  role: InquiryActor;
  author: string;
  content: string;
  createdAt: string;
  attachments?: InquiryAttachment[];
  visibility?: "all" | "staff";
  kind?: "initial" | "message";
  changesStatus?: {
    from: InquiryStatus;
    to: InquiryStatus;
  };
};

export type InquiryRecord = {
  id: string;
  title: string;
  category: string;
  status: InquiryStatus;
  createdAt: string;
  updatedAt: string;
  student: {
    name: string;
    studentId: string;
    grade?: string;
  };
  parent?: {
    name: string;
  };
  instructor: {
    name: string;
    avatarUrl?: string;
  };
  assistant?: {
    name: string;
    initials: string;
  };
  messages: InquiryMessage[];
};

const STORAGE_KEY = "eduops.inquiries";
const MOCK_ONLY = true;

const sampleInquiries: InquiryRecord[] = [
  {
    id: "inq-1",
    title: "수학 심화반 교재 관련 문의드립니다.",
    category: "학습 문의",
    status: "답변 완료",
    createdAt: "2023-10-24 14:20",
    updatedAt: "2023-10-27 14:30",
    student: {
      name: "김민수",
      studentId: "20240101",
      grade: "고2",
    },
    parent: {
      name: "김철수 학부모님",
    },
    instructor: {
      name: "김철수 강사",
      avatarUrl:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuBy_7RZPLACvbwNpmSlXCRWIJEr2xd01cj8Xso2L7BviTrRBaHnzWebjO0AdyOg5HRPBGMgpLTmXOhIM0HQ2bEhHTePEQoEpp_FxRUKdFDVfTO5m9OtC5Q7BdkG_mWSQI4x_K24V7aW5vMGqK_n68ll13nPDPy0d-kEYXBdcQ407YaQfAwuFfwIwz2r-CXOIpWDo4ZaiUKsXH6_xxL-sUVy-p5cfdKrEOyehl2ma_9ft-uoH_hyfXmiLUDmxORbymBrYIH36uxL8ec",
    },
    assistant: {
      name: "이영희 조교",
      initials: "이",
    },
    messages: [
      {
        id: "inq-1-msg-1",
        role: "parent",
        author: "김철수 학부모님",
        content:
          "안녕하세요, 김철수 선생님. 수학 심화 과정(미적분)을 수강하고 있는 김민수 학생의 학부모입니다.\n\n수업 시간에 배운 치환적분법을 활용한 문제들 중에서, 복합 함수의 미분 역과정이 포함된 고난도 문항(교재 142페이지 15번)의 풀이 과정이 잘 이해되지 않는다고 합니다. 특히 적분 상수를 결정하는 조건이 주어지지 않았을 때 어떤 식으로 접근해야 하는지 상세한 설명을 부탁드립니다.\n\n아이가 혼자 고민을 많이 하고 있는데, 원리 위주의 설명을 덧붙여 주시면 감사하겠습니다.",
        createdAt: "2023-10-24 14:20",
        kind: "initial",
        attachments: [
          {
            id: "inq-1-attach-1",
            label: "질문_문제_사진.jpg (2.4MB)",
            url: "https://lh3.googleusercontent.com/aida-public/AB6AXuCSSYsmOpYSZAK2Wo9TAPXBSTWKpCpqk-LP6z8zaeciMUrUwZl_Aiy6x6T_tlQDYUuV_zRu8FuRUb5YncRKZN08v6ICSubJ1oKv13im7e_PCQOPLi1szyv2Psip16RdW7MvzKCoDdrqrg7o3TnPhdqF0jvF8M7fslZ4kpioIcnFXE3Y-eq83IM6LZ4LfZEK0SP5IMHMutvC2b9SZ2FvZxvDMItXFgRZQzfHZE4EHeHnANbny9c9izY8Bl6n5Tt3IMLSOc2CaJXYvrQ",
            kind: "image",
          },
          {
            id: "inq-1-attach-2",
            label: "풀이_시도_노트.pdf (1.1MB)",
            kind: "file",
          },
        ],
      },
      {
        id: "inq-1-msg-2",
        role: "student",
        author: "김민수 학생",
        content:
          "추가로 궁금한 점이 생겼습니다. 문제에서 범위가 지정되지 않았을 때의 적분 상수 C를 구하는 것과, 정적분으로 정의된 함수에서의 차이점이 헷갈립니다. 이 부분도 같이 설명 부탁드릴게요.",
        createdAt: "2023-10-24 16:45",
      },
      {
        id: "inq-1-msg-3",
        role: "instructor",
        author: "김철수 강사 (대표)",
        content:
          "민수 학생, 그리고 학부모님 안녕하세요. 질문하신 내용에 대해 답변 드립니다.\n\n복합 함수의 치환적분에서 가장 중요한 포인트는 '속함수의 미분'이 식 안에 포함되어 있는지를 확인하는 것입니다. 교재 142페이지 15번의 경우, 지수함수의 지수 부분에 이차함수가 합성되어 있어 해당 부분을 치환하면 계수만 조정하여 간단히 해결할 수 있습니다.\n\n적분 상수 결정에 관하여: 문제 조건에 f(0)=1 과 같은 함숫값이 명시되지 않았더라도, 해당 문항이 '연속함수' 조건을 포함하고 있다면 특정 지점에서의 좌우 극한값이 같음을 이용해 상수를 결정할 수 있습니다.\n\n상세한 풀이 과정을 첨부파일로 동봉하니 아이와 함께 확인해 보시기 바랍니다. 추가 질문이 있다면 언제든 남겨주세요.",
        createdAt: "2023-10-25 10:15",
        attachments: [
          {
            id: "inq-1-attach-3",
            label: "[강사제공] 미적분_치환적분_심화풀이_노트.pdf",
            kind: "file",
          },
        ],
        changesStatus: {
          from: "강사 검토",
          to: "답변 완료",
        },
      },
    ],
  },
  {
    id: "inq-6",
    title: "[자료 공유] 3월 모의고사 해설 라이브 안내",
    category: "자료 공유",
    status: "답변 완료",
    createdAt: "2023-10-28 09:10",
    updatedAt: "2023-10-28 09:10",
    student: {
      name: "최윤서",
      studentId: "20241012",
      grade: "고2",
    },
    instructor: {
      name: "김철수 강사",
    },
    messages: [
      {
        id: "inq-6-msg-1",
        role: "instructor",
        author: "김철수 강사",
        content:
          "윤서 학생 안녕하세요.\n\n3월 모의고사 해설 자료를 공유드립니다. 아래 PDF와 라이브 영상을 확인해주세요. 실시간 라이브가 종료되면 동일 링크에서 다시보기로 제공됩니다.",
        createdAt: "2023-10-28 09:10",
        kind: "initial",
        attachments: [
          {
            id: "inq-6-attach-1",
            label: "3월 모의고사 해설 PDF (4.2MB)",
            kind: "file",
            url: "https://example.com/mock-exam-mar-solution.pdf",
            size: "4.2MB",
          },
          {
            id: "inq-6-attach-2",
            label: "3월 모의고사 해설 라이브",
            kind: "video",
            url: "https://www.youtube.com/embed/5qap5aO4i9A",
            embedUrl: "https://www.youtube.com/embed/5qap5aO4i9A",
          },
        ],
      },
    ],
  },
  {
    id: "inq-2",
    title: "학원비 결제 오류 관련 확인 부탁드립니다.",
    category: "행정 문의",
    status: "강사 검토",
    createdAt: "2023-10-26 10:15",
    updatedAt: "2023-10-26 12:30",
    student: {
      name: "박지민",
      studentId: "20220914",
      grade: "고1",
    },
    instructor: {
      name: "최지우 강사",
      avatarUrl:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuAcOfVQCA-0f_hfJlwB0sXlMed9t_HL0Fd7dCi7gRz2sClwt9rMYP3c0CiY9ZH-6XTqM57vtmIqVKdHuRamBYTmp5RfxhPzDcbgbu2_N3CqmlN6y6sBrTVZ7F0AK3nqelT0YTh41iCqd2jhJ0-K9mOkE5nh_IXRvoXsAawbA91CJz57q03qtj7E7o4W55Hnabp_GtUY417KfYwAKMc_oJcvn2Wi_fBVCy-6z8iwLSfLTOM_EBh0ErYCgOhprZSRLBlFkT49GXydSbo",
    },
    assistant: {
      name: "행정실 (재무팀)",
      initials: "행",
    },
    messages: [
      {
        id: "inq-2-msg-1",
        role: "parent",
        author: "박지민 학부모님",
        content:
          "안녕하세요. 10월 26일 오전 결제 과정에서 오류가 발생해 수강료가 중복으로 결제되었습니다.\n\n카드사 앱에는 동일 금액이 2건 승인 처리되어 있고, 학원 시스템에서는 1건만 반영되어 있는 것으로 보입니다. 중복 결제된 건에 대한 취소/환불 처리 부탁드립니다.\n\n아래는 결제 내역 캡처본이며, 필요한 정보가 더 있으면 말씀해 주세요.",
        createdAt: "2023-10-26 10:15",
        kind: "initial",
        attachments: [
          {
            id: "inq-2-attach-1",
            label: "결제_내역_캡처.png (1.8MB)",
            kind: "image",
          },
        ],
      },
      {
        id: "inq-2-msg-2",
        role: "assistant",
        author: "행정실 (재무팀)",
        content:
          "결제 내역 확인 중입니다. 카드 승인 내역과 내부 결제 기록을 대조하고 있어요. 확인 완료되는 대로 안내 드리겠습니다.",
        createdAt: "2023-10-26 11:05",
        visibility: "staff",
      },
      {
        id: "inq-2-msg-3",
        role: "instructor",
        author: "최지우 강사",
        content:
          "학부모님 안녕하세요. 현재 재무팀에서 중복 결제 여부를 확인 중이며, 확인 즉시 환불 절차를 안내드리겠습니다. 추가로 카드 승인 문자나 결제 영수증이 있으시면 첨부 부탁드립니다.",
        createdAt: "2023-10-26 12:30",
      },
    ],
  },
  {
    id: "inq-3",
    title: "출결 현황이 실제와 다르게 표시됩니다.",
    category: "학사 문의",
    status: "답변 완료",
    createdAt: "2023-10-25 09:00",
    updatedAt: "2023-10-25 10:30",
    student: {
      name: "정수빈",
      studentId: "20210822",
      grade: "고3",
    },
    instructor: {
      name: "김철수 강사",
      avatarUrl:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuAdbjkYOwI-KT0L76fl9Mp1x1lJGpp_eIXPlaRj4diHa26PsIpJyENaJYRDI_2e1ysvu4oBgZY4HI5A5kg57KM9hc8nkSOGMJxS5QWscPFF2hYoiqptMdlJRaZNUUe8T0PxaJn1ObPbQEYwYkkFl8wFgW34D2UBYSKKrwyAd0e-2XJFLvuvMnnzyWblhL081ZFpYQMwJOv9vj0obmS0tbvLd3FjIwTJl0GQLQ_UcF6GUd0sdWpe0oiZhze6i93mYtaBCouG5N0cfDU",
    },
    assistant: {
      name: "이영희 조교",
      initials: "이",
    },
    messages: [
      {
        id: "inq-3-msg-1",
        role: "student",
        author: "정수빈 학생",
        content:
          "안녕하세요. 출결 현황이 실제와 다르게 표시됩니다.\n\n10월 23일(월) 3교시는 출석했는데 결석으로 기록되어 있고, 10월 24일(화) 2교시는 지각으로 표시됩니다. 출석 체크는 담당 조교님이 정상적으로 진행하셨다고 들었는데, 시스템에 반영이 안 된 것 같습니다.\n\n출석부 사진이 필요하시면 보내드릴게요. 확인 부탁드립니다.",
        createdAt: "2023-10-25 09:00",
        kind: "initial",
      },
      {
        id: "inq-3-msg-2",
        role: "assistant",
        author: "이영희 조교",
        content:
          "출결 시스템 로그를 확인 중입니다. 당일 출석 체크 기록을 조회해 실제 출석부와 대조하겠습니다.",
        createdAt: "2023-10-25 09:40",
        visibility: "staff",
      },
      {
        id: "inq-3-msg-3",
        role: "instructor",
        author: "김철수 강사",
        content:
          "수빈 학생, 확인해보니 10월 23일 3교시 출석 기록이 누락되어 있었습니다. 시스템에 정상 반영되도록 수정 요청을 올렸고, 오늘 중으로 업데이트될 예정입니다. 불편을 드려 죄송합니다.",
        createdAt: "2023-10-25 10:30",
        changesStatus: {
          from: "강사 검토",
          to: "답변 완료",
        },
      },
    ],
  },
  {
    id: "inq-4",
    title: "지난주 진로 상담에 감사드립니다.",
    category: "상담 문의",
    status: "종료",
    createdAt: "2023-10-20 16:45",
    updatedAt: "2023-10-20 18:10",
    student: {
      name: "윤민호",
      studentId: "20230211",
      grade: "중3",
    },
    instructor: {
      name: "박지성 멘토",
    },
    messages: [
      {
        id: "inq-4-msg-1",
        role: "student",
        author: "윤민호 학생",
        content:
          "박지성 멘토님, 지난주 진로 상담 정말 감사드립니다.\n\n추천해주신 학습 로드맵과 전공 선택 기준이 큰 도움이 됐습니다. 상담 후에 제 관심 분야를 다시 정리해볼 수 있었어요.\n\n추가로 추천해주신 참고 자료가 있다면 알려주시면 감사하겠습니다.",
        createdAt: "2023-10-20 16:45",
        kind: "initial",
      },
      {
        id: "inq-4-msg-2",
        role: "instructor",
        author: "박지성 멘토",
        content:
          "민호 학생, 좋은 피드백 고마워요. 추천 자료는 별도 메일로 공유했고, 이번 주 안에 학습 계획을 함께 점검해보면 좋겠습니다. 필요하면 언제든 문의 주세요.",
        createdAt: "2023-10-20 18:10",
      },
    ],
  },
  {
    id: "inq-5",
    title: "보충 수업 일정 확인 문의",
    category: "수업 문의",
    status: "학생/학부모 확인 완료",
    createdAt: "2023-10-18 11:20",
    updatedAt: "2023-10-18 14:10",
    student: {
      name: "강현수",
      studentId: "20240100",
      grade: "고1",
    },
    instructor: {
      name: "김철수 강사",
    },
    messages: [
      {
        id: "inq-5-msg-1",
        role: "student",
        author: "강현수 학생",
        content:
          "보충 수업 일정 확인 문의드립니다.\n\n다음 주 보충 수업이 있는지, 있다면 날짜와 시간대를 알고 싶습니다. 학교 일정 때문에 가능한 시간대를 미리 조율해야 해서요.\n\n지난주 안내받은 공지에서 보충 수업이 있다고만 되어 있어서 구체 일정 안내 부탁드립니다.",
        createdAt: "2023-10-18 11:20",
        kind: "initial",
      },
      {
        id: "inq-5-msg-2",
        role: "assistant",
        author: "학사 운영팀",
        content:
          "보충 수업 일정이 확정되는 대로 공지하겠습니다. 희망 시간대가 있다면 알려주세요.",
        createdAt: "2023-10-18 12:05",
        visibility: "staff",
      },
      {
        id: "inq-5-msg-3",
        role: "instructor",
        author: "김철수 강사",
        content:
          "현수 학생, 보충 수업은 10월 21일(토) 오전 10시에 진행합니다. 참석이 어렵다면 대체 일정을 알려주세요.",
        createdAt: "2023-10-18 14:10",
      },
    ],
  },
];

let inquiryState: InquiryRecord[] = [...sampleInquiries];
let initialized = false;
const listeners = new Set<() => void>();

function ensureInit() {
  if (initialized || typeof window === "undefined") {
    return;
  }
  if (MOCK_ONLY) {
    inquiryState = [...sampleInquiries];
    initialized = true;
    return;
  }
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        inquiryState = parsed;
      } else {
        inquiryState = [...sampleInquiries];
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(inquiryState));
      }
    }
  } catch {
    // ignore storage errors
  }
  initialized = true;
}

function persist(data: InquiryRecord[]) {
  if (typeof window === "undefined") return;
  if (MOCK_ONLY) return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // ignore storage errors
  }
}

function subscribe(listener: () => void) {
  ensureInit();
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function getClientSnapshot() {
  ensureInit();
  if (MOCK_ONLY && inquiryState.length === 0) {
    inquiryState = [...sampleInquiries];
  }
  return inquiryState;
}

function getServerSnapshot() {
  return sampleInquiries;
}

function setState(updater: (prev: InquiryRecord[]) => InquiryRecord[]) {
  const next = updater(getClientSnapshot());
  inquiryState = next;
  persist(next);
  listeners.forEach((listener) => listener());
}

function formatNow() {
  const now = new Date();
  const pad = (value: number) => String(value).padStart(2, "0");
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(
    now.getDate()
  )} ${pad(now.getHours())}:${pad(now.getMinutes())}`;
}

function createMessageId() {
  return `msg-${Date.now().toString(36)}`;
}

function createInquiryId() {
  return `inq-${Date.now().toString(36)}`;
}

function resolveBaseTemplate() {
  return (
    sampleInquiries[0] ?? {
      instructor: { name: "담당 강사" },
      student: { name: "학생", studentId: "20240000" },
    }
  );
}

export function useInquiryStore<T = InquiryRecord[]>(
  selector?: (state: InquiryRecord[]) => T
): T {
  const derivedSelector = selector ?? ((state) => state as unknown as T);
  return useSyncExternalStore(
    subscribe,
    () => derivedSelector(getClientSnapshot()),
    () => derivedSelector(getServerSnapshot())
  );
}

function resolveInquiryId(id: string, inquiries: InquiryRecord[]) {
  if (!id) return undefined;
  const trimmed = id.trim();
  const direct = inquiries.find((item) => item.id === trimmed);
  if (direct) return trimmed;
  const normalized = trimmed.replace(/^row-/, "inq-");
  const normalizedHit = inquiries.find((item) => item.id === normalized);
  if (normalizedHit) return normalized;
  const numeric = normalized.match(/\d+/)?.[0];
  if (numeric) {
    const numericId = `inq-${numeric}`;
    const numericHit = inquiries.find((item) => item.id === numericId);
    if (numericHit) return numericId;
    const index = Number(numeric) - 1;
    if (index >= 0 && index < inquiries.length) {
      return inquiries[index].id;
    }
  }
  return inquiries[0]?.id;
}

export function useInquiryById(id: string) {
  return useInquiryStore((inquiries) => {
    const resolvedId = resolveInquiryId(id, inquiries);
    return inquiries.find((item) => item.id === resolvedId);
  });
}

export function setInquiryStatus(
  id: string,
  nextStatus: InquiryStatus,
  options?: {
    recordMessage?: boolean;
    actor?: { role: InquiryActor; name: string };
    note?: string;
  }
) {
  setState((prev) =>
    prev.map((inquiry) => {
      if (inquiry.id !== id) return inquiry;
      const recordMessage = options?.recordMessage ?? true;
      const fromStatus = inquiry.status;
      const updatedAt = formatNow();
      const messages = recordMessage
        ? [
            ...inquiry.messages,
            {
              id: createMessageId(),
              role: options?.actor?.role ?? "system",
              author: options?.actor?.name ?? "시스템",
              content:
                options?.note ??
                `문의 상태를 "${nextStatus}"(으)로 변경했습니다.`,
              createdAt: updatedAt,
              changesStatus: { from: fromStatus, to: nextStatus },
            },
          ]
        : inquiry.messages;
      return {
        ...inquiry,
        status: nextStatus,
        updatedAt,
        messages,
      };
    })
  );
}

export function addInquiryMessage(
  id: string,
  message: Omit<InquiryMessage, "id" | "createdAt"> & {
    createdAt?: string;
  }
) {
  setState((prev) =>
    prev.map((inquiry) => {
      if (inquiry.id !== id) return inquiry;
      const createdAt = message.createdAt ?? formatNow();
      const nextMessage: InquiryMessage = {
        ...message,
        id: createMessageId(),
        createdAt,
      };
      const nextStatus = message.changesStatus?.to ?? inquiry.status;
      return {
        ...inquiry,
        status: nextStatus,
        updatedAt: createdAt,
        messages: [...inquiry.messages, nextMessage],
      };
    })
  );
}

export function deleteInquiryMessage(id: string, messageId: string) {
  setState((prev) =>
    prev.map((inquiry) => {
      if (inquiry.id !== id) return inquiry;
      return {
        ...inquiry,
        messages: inquiry.messages.filter(
          (message) => message.id !== messageId
        ),
      };
    })
  );
}

export function createInquiry(input: {
  title: string;
  content: string;
  category?: string;
  role?: InquiryActor;
  author?: string;
}) {
  const base = resolveBaseTemplate();
  return createInquiryForStudent({
    title: input.title,
    content: input.content,
    category: input.category ?? "학습 문의",
    role: input.role ?? "student",
    author: input.author,
    student: { ...base.student },
    parent: base.parent ? { ...base.parent } : undefined,
    instructor: { ...base.instructor },
    status: "조교 이관",
  });
}

export function createInquiryForStudent(input: {
  title: string;
  content: string;
  category: string;
  role: InquiryActor;
  author?: string;
  student: InquiryRecord["student"];
  parent?: InquiryRecord["parent"];
  instructor?: InquiryRecord["instructor"];
  attachments?: InquiryAttachment[];
  status?: InquiryStatus;
}) {
  const createdAt = formatNow();
  const base = resolveBaseTemplate();
  const role = input.role;
  const author =
    input.author ??
    (role === "parent"
      ? (input.parent?.name ?? "학부모")
      : `${input.student.name} 학생`);
  const nextInquiry: InquiryRecord = {
    id: createInquiryId(),
    title: input.title,
    category: input.category,
    status:
      input.status ??
      (role === "student" || role === "parent" ? "조교 이관" : "답변 완료"),
    createdAt,
    updatedAt: createdAt,
    student: { ...input.student },
    parent: input.parent ? { ...input.parent } : undefined,
    instructor: { ...(input.instructor ?? base.instructor) },
    assistant: base.assistant ? { ...base.assistant } : undefined,
    messages: [
      {
        id: createMessageId(),
        role,
        author,
        content: input.content,
        createdAt,
        kind: "initial",
        attachments: input.attachments,
        visibility: "all",
      },
    ],
  };

  setState((prev) => [nextInquiry, ...prev]);
  return nextInquiry.id;
}
