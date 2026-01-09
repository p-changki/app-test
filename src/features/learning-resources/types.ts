export type BreadcrumbItem = {
  label: string;
  href?: string;
};

export type FilterChip = {
  label: string;
  icon: string;
  pinRight?: boolean;
  active?: boolean;
};

export type ResourceItem = {
  id: string;
  title: string;
  description: string;
  icon: {
    name: string;
    className: string;
  };
  subject: {
    label: string;
    className: string;
  };
  uploader: {
    name: string;
    avatarUrl?: string;
    fallbackIcon?: string;
  };
  date: string;
  size: string;
  previewIcon: {
    name: string;
    title: string;
  };
  downloadIcon: {
    name: string;
    title: string;
  };
};
