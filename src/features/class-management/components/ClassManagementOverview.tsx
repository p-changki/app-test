import type { SubNavLink } from "@/components/layout/AssistantSubNav";
import { ClassListClient } from "@/features/class-management/ClassListClient";
import { classManagementRecords } from "@/data/classManagement";
import { classSubNavLinks } from "@/features/class-management/navigation";

export function ClassManagementOverview() {
  return (
    <ClassListClient
      classRecords={classManagementRecords}
      navLinks={classSubNavLinks as readonly SubNavLink[]}
      activeHref="/class-management"
      breadcrumbs={[
        { label: "홈", href: "/dashboard" },
        { label: "수업 관리" },
      ]}
    />
  );
}
