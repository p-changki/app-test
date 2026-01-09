import type { SubNavLink } from "@/components/layout/AssistantSubNav";
import { ClassListClient } from "@/features/class-management/ClassListClient";
import {
  classDayOptions,
  classLevelOptions,
  classManagementRecords,
  classStatusOptions,
} from "@/data/classManagement";
import { classSubNavLinks } from "@/features/class-management/navigation";

export function ClassManagementOverview() {
  return (
    <ClassListClient
      classRecords={classManagementRecords}
      levelOptions={classLevelOptions}
      dayOptions={classDayOptions}
      statusOptions={classStatusOptions}
      navLinks={classSubNavLinks as readonly SubNavLink[]}
      activeHref="/class-management"
      breadcrumbs={[
        { label: "홈", href: "/dashboard" },
        { label: "수업 관리" },
      ]}
    />
  );
}
