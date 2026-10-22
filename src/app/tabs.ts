// shared by the client TabSection and the server pages that read ?tab= / ?from=
export type Tab = 'about' | 'experience' | 'projects' | 'oss' | 'videos' | 'reading';
export const tabs: Tab[] = ['about', 'projects', 'oss', 'experience', 'videos', 'reading'];
export const isTab = (t: unknown): t is Tab => tabs.includes(t as Tab);
