"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import {
  createInquiry,
  useInquiryStore,
} from "@/features/inquiry-dashboard/inquiryStore";

type SenderRole = "student" | "parent";

export function StudentInquiryCreatePage() {
  const router = useRouter();
  const inquiries = useInquiryStore();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [notice, setNotice] = useState<string | null>(null);
  const [senderRole, setSenderRole] = useState<SenderRole>("student");

  const profile = useMemo(() => {
    const first = inquiries[0];
    return {
      studentName: first?.student.name ?? "학생",
      parentName: first?.parent?.name ?? "학부모",
    };
  }, [inquiries]);

  const handleSubmit = () => {
    const trimmedTitle = title.trim();
    const trimmedContent = content.trim();
    if (!trimmedTitle || !trimmedContent) {
      setNotice("제목과 내용을 모두 입력해주세요.");
      return;
    }
    const author =
      senderRole === "parent"
        ? profile.parentName
        : `${profile.studentName} 학생`;
    const id = createInquiry({
      title: trimmedTitle,
      content: trimmedContent,
      role: senderRole,
      author,
    });
    setNotice(null);
    router.push(`/student-inquiries/${id}`);
  };

  return (
    <div className="bg-background-light dark:bg-background-dark min-h-screen text-[#111418] dark:text-white">
      <main className="flex justify-center py-10 px-4">
        <div className="layout-content-container flex flex-col max-w-[960px] w-full gap-6">
          <nav className="flex flex-wrap gap-2 items-center">
            <button
              type="button"
              className="text-[#617589] dark:text-[#a1b0c0] text-sm font-medium hover:text-primary"
              onClick={() => router.push("/student-inquiries")}
            >
              문의 관리
            </button>
            <span className="text-[#617589] dark:text-[#a1b0c0] text-sm material-symbols-outlined">
              chevron_right
            </span>
            <span className="text-[#111418] dark:text-white text-sm font-semibold">
              새 문의 접수
            </span>
          </nav>
          <div className="flex flex-col gap-2">
            <h1 className="text-[#111418] dark:text-white text-4xl font-black leading-tight tracking-[-0.033em]">
              새 문의 접수
            </h1>
            <p className="text-[#617589] dark:text-[#a1b0c0] text-base font-normal leading-normal">
              학습 및 생활 관련 궁금한 점을 남겨주시면 담당 강사가 순차적으로
              답변해 드립니다.
            </p>
          </div>
          <div className="@container">
            <div className="flex flex-1 flex-col items-start justify-between gap-4 rounded-xl border border-[#dbe0e6] dark:border-[#2d3a4a] bg-white dark:bg-[#1a2633] p-6 @[480px]:flex-row @[480px]:items-center shadow-sm">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2 text-primary">
                  <span className="material-symbols-outlined text-xl">
                    info
                  </span>
                  <p className="text-[#111418] dark:text-white text-base font-bold leading-tight">
                    문의 작성 안내
                  </p>
                </div>
                <p className="text-[#617589] dark:text-[#a1b0c0] text-sm font-normal leading-normal mt-1">
                  수신인은{" "}
                  <span className="font-bold text-primary">책임 강사</span>로
                  자동 지정되며, 영업일 기준 1-2일 내에 답변을 확인하실 수
                  있습니다.
                </p>
              </div>
              <button
                type="button"
                className="text-sm font-bold leading-normal tracking-[0.015em] flex items-center gap-2 text-primary hover:underline"
              >
                운영 정책 확인
                <span className="material-symbols-outlined text-lg">
                  arrow_forward
                </span>
              </button>
            </div>
          </div>
          <div className="bg-white dark:bg-[#1a2633] rounded-xl border border-[#dbe0e6] dark:border-[#2d3a4a] p-8 shadow-sm flex flex-col gap-8">
            <div className="flex flex-col gap-2">
              <label className="text-[#111418] dark:text-white text-base font-semibold">
                작성자
              </label>
              <div className="flex w-full max-w-md items-center gap-2 rounded-lg bg-[#f0f2f4] dark:bg-[#253241] border border-[#dbe0e6] dark:border-[#2d3a4a] p-2">
                {(["student", "parent"] as SenderRole[]).map((role) => {
                  const isActive = senderRole === role;
                  return (
                    <button
                      key={role}
                      type="button"
                      className={`flex-1 rounded-lg px-3 py-2 text-sm font-bold transition-colors ${
                        isActive
                          ? "bg-primary text-white shadow-sm"
                          : "text-[#617589] dark:text-[#a1b0c0] hover:text-primary"
                      }`}
                      onClick={() => setSenderRole(role)}
                    >
                      {role === "student" ? "학생" : "학부모"}
                    </button>
                  );
                })}
              </div>
              <p className="text-[#617589] dark:text-[#a1b0c0] text-xs">
                학부모 계정으로 문의를 접수할 경우 학부모 이름으로 기록됩니다.
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[#111418] dark:text-white text-base font-semibold">
                작성자 이름
              </label>
              <div className="flex w-full max-w-md items-stretch rounded-lg bg-[#f0f2f4] dark:bg-[#253241] border border-[#dbe0e6] dark:border-[#2d3a4a]">
                <input
                  className="flex w-full min-w-0 flex-1 bg-transparent text-[#617589] dark:text-[#a1b0c0] h-14 p-4 text-base font-medium outline-none"
                  readOnly
                  value={
                    senderRole === "parent"
                      ? profile.parentName
                      : `${profile.studentName} 학생`
                  }
                />
                <div className="text-[#617589] dark:text-[#a1b0c0] flex items-center justify-center px-4">
                  <span className="material-symbols-outlined">badge</span>
                </div>
              </div>
              <p className="text-[#617589] dark:text-[#a1b0c0] text-xs">
                계정에 등록된 이름이 자동으로 표시됩니다.
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[#111418] dark:text-white text-base font-semibold">
                수신인
              </label>
              <div className="flex w-full max-w-md items-stretch rounded-lg bg-[#f0f2f4] dark:bg-[#253241] border border-[#dbe0e6] dark:border-[#2d3a4a]">
                <input
                  className="flex w-full min-w-0 flex-1 bg-transparent text-[#617589] dark:text-[#a1b0c0] h-14 p-4 text-base font-medium outline-none"
                  readOnly
                  value="책임 강사 (자동 지정)"
                />
                <div className="text-[#617589] dark:text-[#a1b0c0] flex items-center justify-center px-4">
                  <span className="material-symbols-outlined">lock</span>
                </div>
              </div>
              <p className="text-[#617589] dark:text-[#a1b0c0] text-xs">
                문의 보안을 위해 수신 강사는 변경할 수 없습니다.
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <label
                className="text-[#111418] dark:text-white text-base font-semibold"
                htmlFor="inquiry-title"
              >
                문의 제목
              </label>
              <input
                className="form-input flex w-full rounded-lg text-[#111418] dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 border border-[#dbe0e6] dark:border-[#2d3a4a] bg-white dark:bg-[#101922] h-14 p-4 text-base font-normal placeholder:text-[#617589] dark:placeholder:text-[#a1b0c0] transition-all"
                id="inquiry-title"
                placeholder="제목을 입력해 주세요"
                type="text"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
              />
            </div>
            <div className="flex flex-col gap-2">
              <label
                className="text-[#111418] dark:text-white text-base font-semibold"
                htmlFor="inquiry-content"
              >
                상세 내용
              </label>
              <textarea
                className="form-textarea flex w-full min-h-[300px] rounded-lg text-[#111418] dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 border border-[#dbe0e6] dark:border-[#2d3a4a] bg-white dark:bg-[#101922] p-4 text-base font-normal placeholder:text-[#617589] dark:placeholder:text-[#a1b0c0] transition-all resize-none"
                id="inquiry-content"
                placeholder="학습 관련 질문이나 요청 사항을 구체적으로 적어주세요."
                value={content}
                onChange={(event) => setContent(event.target.value)}
              />
            </div>
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#f0f2f4] dark:border-[#2d3a4a]">
              <button
                type="button"
                className="px-6 h-12 rounded-lg text-[#617589] dark:text-[#a1b0c0] font-bold hover:bg-background-light dark:hover:bg-[#101922] transition-colors"
                onClick={() => router.push("/student-inquiries")}
              >
                취소
              </button>
              <button
                type="button"
                className="px-8 h-12 rounded-lg bg-primary text-white font-bold hover:bg-primary/90 transition-all shadow-md active:scale-95 flex items-center gap-2"
                onClick={handleSubmit}
              >
                <span className="material-symbols-outlined text-xl">send</span>
                문의 제출
              </button>
            </div>
            {notice ? (
              <p className="text-xs font-medium text-red-500">{notice}</p>
            ) : null}
          </div>
          <div className="flex justify-center pb-10">
            <p className="text-[#617589] dark:text-[#a1b0c0] text-sm text-center max-w-[600px]">
              작성된 문의 내용은 관리 시스템의 보안 정책에 따라 암호화되어
              전송됩니다.
              <br />
              긴급한 기술적 오류 발생 시 고객센터(1588-XXXX)로 연락
              부탁드립니다.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
