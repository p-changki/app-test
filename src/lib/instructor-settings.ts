export type InstructorSettings = {
  pushEnabled: boolean;
  emailEnabled: boolean;
};

export const defaultInstructorSettings: InstructorSettings = {
  pushEnabled: true,
  emailEnabled: false,
};

const SETTINGS_STORAGE_KEY = "instructor-settings";
const SETTINGS_EVENT = "instructor-settings-change";

export function loadInstructorSettings(): InstructorSettings {
  if (typeof window === "undefined") {
    return defaultInstructorSettings;
  }

  try {
    const raw = window.localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (!raw) {
      return defaultInstructorSettings;
    }
    const parsed = JSON.parse(raw) as Partial<InstructorSettings>;
    return {
      ...defaultInstructorSettings,
      ...parsed,
    };
  } catch {
    return defaultInstructorSettings;
  }
}

export function saveInstructorSettings(settings: InstructorSettings) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
  window.dispatchEvent(new CustomEvent(SETTINGS_EVENT, { detail: settings }));
}

export function onInstructorSettingsChange(
  handler: (settings: InstructorSettings) => void
) {
  if (typeof window === "undefined") {
    return () => {};
  }

  const listener = (event: Event) => {
    const customEvent = event as CustomEvent<InstructorSettings>;
    if (customEvent.detail) {
      handler(customEvent.detail);
      return;
    }
    handler(loadInstructorSettings());
  };

  window.addEventListener(SETTINGS_EVENT, listener);
  return () => window.removeEventListener(SETTINGS_EVENT, listener);
}
