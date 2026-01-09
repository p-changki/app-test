import type {
  ClassChip,
  FilterSelect,
  HeaderAction,
  PaginationItem,
  StudentBreadcrumb,
  StudentRecord,
  StudentTableSummary,
} from "./types";

export const studentBreadcrumbs: StudentBreadcrumb[] = [
  { label: "홈", href: "/dashboard" },
  { label: "학생 관리" },
];

export const classSection = {
  title: "학급 선택",
  actionLabel: "반 관리 설정",
};

export const classChips: ClassChip[] = [
  {
    id: "all",
    label: "전체 학생",
    count: 120,
    color: "primary",
    icon: "folder_shared",
    variant: "all",
    active: true,
  },
  { id: "divider-1", isDivider: true },
  { id: "math-advanced", label: "수학 심화 A반", count: 15, color: "indigo" },
  { id: "math-basic", label: "수학 기초 B반", count: 22, color: "indigo" },
  {
    id: "english-advanced",
    label: "영어 심화 S반",
    count: 18,
    color: "emerald",
  },
  { id: "english-basic", label: "영어 기초 B반", count: 20, color: "emerald" },
  {
    id: "unassigned",
    label: "신규/미배정",
    count: 3,
    color: "rose",
    icon: "help_outline",
    variant: "unassigned",
  },
  { id: "add-class", isAddButton: true },
];

export const pageSummary = {
  title: "전체 학생 관리",
  description: "총 120명의 학생 정보를 관리하고 있습니다.",
};

export const headerActions: HeaderAction[] = [
  {
    id: "bulk-transfer",
    label: "일괄 반이동",
    icon: "swap_horiz",
    variant: "secondary",
  },
  { id: "send-alert", label: "알림 발송", icon: "send", variant: "secondary" },
  {
    id: "add-student",
    label: "학생 등록",
    icon: "person_add",
    variant: "primary",
  },
];

export const filterSelects: FilterSelect[] = [
  {
    id: "grade",
    placeholder: "학년 전체",
    options: [
      { label: "고등학교 1학년", value: "h1" },
      { label: "고등학교 2학년", value: "h2" },
      { label: "고등학교 3학년", value: "h3" },
    ],
  },
  {
    id: "status",
    placeholder: "상태 전체",
    options: [
      { label: "재원중", value: "active" },
      { label: "휴원", value: "pause" },
      { label: "졸업", value: "grad" },
    ],
  },
];

export const studentRecords: StudentRecord[] = [
  {
    id: "student-kim-minjun",
    name: "김민준",
    studentId: "ST-20230501",
    avatarUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDLlidok0fCHuswxfn8xb4HGkpH3nCBZiLcB_riUWkSRpDng-BXb8_EUE0GKxXUtsH9JW72l_Frd-AfMG397jCLiilW2jSWSlHlnBky1NHB-JQ8dYiLPb0kpYT5Y6sbvc-mdQOKEVZjAZdBD69rVWCu4dsiJqiDuPKrIUtz33Pa4VVLEFeaB-Y4S9vpgEsw1v4ab4nilHKtIn9zh0Pxf1mjD05EAcukiCx4aRFB2CUrN0bBSaH0nszFSSLxuKu7N9irvBRcEh8OKiE",
    className: "수학 심화 A반",
    classColor: "indigo",
    school: "서울고 (2학년)",
    contact: "010-1234-5678",
    attendance: 95,
    attendanceVariant: "good",
    averageScore: 90,
    averageVariant: "good",
    status: { label: "재원중", variant: "primary" },
    actionLabel: "반 변경",
  },
  {
    id: "student-kim-minsu",
    name: "김민수",
    studentId: "ST-2023001",
    avatarUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCtUOvXgmKFKSAZtNhsB7QLfMpsfa0ES9OSQgMFowE2PeRfy47VNDEILS01zfnu7GI7p1hpeqWMJkVVhsBwyONFMaFnVdBjR7tzyTrzxfC5IwhFRpyXttPKRQ7n1ZybXyF170AcIapYZxVd-0tjqJwwdUbtCQk2omwTk4sXbrR4sS48TTwN33Oa3MCLwiJPbxAD9D366-D5LNX59BUJ_FyZLuWxcpLmWdbrDEaHLGI3cCJwTGKk9jXUwItutpabUsguCX5CYKfjvL8",
    className: "수학 심화 A반",
    classColor: "indigo",
    school: "서울고 (2학년)",
    contact: "010-1234-5678",
    attendance: 95,
    attendanceVariant: "good",
    averageScore: 88,
    averageVariant: "neutral",
    status: { label: "재원중", variant: "primary" },
    actionLabel: "반 변경",
  },
  {
    id: "student-lee-jieun",
    name: "이지은",
    studentId: "ST-2023042",
    avatarUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuB7csvCfeFQd2nfaWJdpF5k5wQzyJMRbVzhG_7nnXDH68EYPAd1JdCC0Mh1B0KWTZR4VxD4Zy6OuXbTjy_oSnQQUWiAGkobOVIUziFkWMfLI-5kGpjAU0z3JBw19CGuu1CfYnULJL2d6GdeFhGgvp9WsTTYnlxqrh3FZhU7hCtY-a5P1-DjpgpL5dUDsjpYC9Hkxa7i-TVeqbO52LfryHJ0cifo1K9pqpTx1PVfuATm8SGzbe4nfoLvNUgYKKDjbhOazDtWMV3OZsg",
    className: "영어 기초 B반",
    classColor: "emerald",
    school: "강남고 (1학년)",
    contact: "010-9876-5432",
    attendance: 75,
    attendanceVariant: "danger",
    averageScore: 92,
    averageVariant: "good",
    status: { label: "재원중", variant: "primary" },
    actionLabel: "반 변경",
  },
  {
    id: "student-park-junhyung",
    name: "박준형",
    studentId: "ST-2023055",
    avatarUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDf-dQiwcPsuNFpbrz8Eve7eISkBiG5lj4-5-X4fbaibWrBMt8FqyCKMApaRNJxGgHQ8yT9L7Xb9w_LuW0cBE2ZoH1Okf_554cW5YWfTvT_t7QO6ZtTDB6u3uEJY30s7XQjAttWJGsDFgtFU7xudSyzJh1HUl-dUY2TmGH5yQrSTpag8nwo-O_8K4E9nMpKhLd0P__xQrDSCdS6qb6mxbr-oopJrJ0Vt4ug6dq5-RN4VKapbYpcNJn53PausNFNsbazHYez7H2BwmU",
    className: "수학 심화 A반",
    classColor: "indigo",
    school: "반포고 (3학년)",
    contact: "010-5555-4444",
    attendance: 88,
    attendanceVariant: "warning",
    averageScore: 76,
    averageVariant: "neutral",
    status: { label: "휴원", variant: "warning" },
    actionLabel: "반 변경",
  },
  {
    id: "student-choi-younghee",
    name: "최영희",
    studentId: "ST-2023067",
    avatarUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuD76H7-wrkNJifE8Z2Iir3jIdxtqnlOQE4K8udLptaFtw_7-PRQ8O3iTq4qEWQ8Rmyf5n325967SeA-IWr8kV9rN9EiH9ybXRl3qTWIGT75L0oPK7raEEnlI2XkiVMu-b_qwB8P1NYopXK5cZ_s3oDtMrDe8ovpl9R_ZjqbT8EWzSiUSqAhqPGWXJqAAUWOm5IEbew2ST4D3H_T3I7OhomT8hYk9fsZWa9Y_b75gsiKMMnrzzq_TGOGTjjTA436IQuwD34b3K1AuWc",
    className: "미배정",
    classColor: "dashed",
    school: "서초고 (1학년)",
    contact: "010-3333-2222",
    unassigned: true,
    emptyPerformance: "데이터 없음",
    status: { label: "재원중", variant: "primary" },
    actionLabel: "반 배정",
    highlight: { label: "신규", variant: "new" },
  },
  {
    id: "student-jung-sujin",
    name: "정수진",
    studentId: "ST-2023089",
    avatarUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDdgy_0VXTy8RorS8YHlRk4U9KRcpUrX8fznv8DmPQJ_Qw0SzD6Bd6cadOqa4VfP6ZhYCByE7N6vEiyXtzOm9v3kYfyXCn--VA2v92iooy-d4q5d_qK73jOhT93EK7B1_ssAU_DD2UbotAU5fXSR4NW1H6FlT2u-8_JsTrPKgSPyidZEE93M_1wUhjjo3J3K3jnpVRyDuaklukpF9g89ppSKXLFyztvslSCrQBcY7HytumX4NLS3oCpznVPpge3T1MYQ4YZPo-dzg0",
    className: "수학 심화 A반",
    classColor: "indigo",
    school: "세화고 (2학년)",
    contact: "010-1111-9999",
    attendance: 91,
    attendanceVariant: "good",
    averageScore: 82,
    averageVariant: "neutral",
    status: { label: "재원중", variant: "primary" },
    actionLabel: "반 변경",
  },
];

export const tableSummary: StudentTableSummary = {
  total: 120,
  rangeLabel: "1-5",
};

export const pagination: PaginationItem[] = ["1", "2", "3", "...", "12"];
