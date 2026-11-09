// shared by the client TabSection and the home page that reads ?tab=
export type Tab = 'about' | 'writing' | 'videos' | 'reading';
export const tabs: Tab[] = ['about', 'writing', 'videos', 'reading'];
export const isTab = (t: unknown): t is Tab => tabs.includes(t as Tab);
