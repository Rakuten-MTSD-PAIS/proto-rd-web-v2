import type { DriveItem } from "./types";
import { sampleMediaThumbnails } from "./sample-media-thumbnails";

// People in the system
const ME = { owner: "You (taro.rakuten)", ownerInitials: "TR", ownerColor: "#002896", ownerAvatar: "/profile-cat.png" };
const people = [
  { owner: "Yuki Sato",      ownerInitials: "YS", ownerColor: "#9B3FD4", ownerAvatar: "/avatars/yuki-sato.svg" },
  { owner: "Kenji Tanaka",   ownerInitials: "KT", ownerColor: "#0080B0", ownerAvatar: "/avatars/kenji-tanaka.svg" },
  { owner: "Aisha Patel",    ownerInitials: "AP", ownerColor: "#C14020", ownerAvatar: "/avatars/aisha-patel.svg" },
  { owner: "Marcus Lee",     ownerInitials: "ML", ownerColor: "#1A8040", ownerAvatar: "/avatars/marcus-lee.svg" },
  { owner: "Nina Kowalski",  ownerInitials: "NK", ownerColor: "#7A5500", ownerAvatar: "/avatars/nina-kowalski.svg" },
  { owner: "Chen Wei",       ownerInitials: "CW", ownerColor: "#B0004E", ownerAvatar: "/avatars/chen-wei.svg" },
  { owner: "Olivia Brown",   ownerInitials: "OB", ownerColor: "#005E8B", ownerAvatar: "/avatars/olivia-brown.svg" },
  { owner: "James Wilson",   ownerInitials: "JW", ownerColor: "#4E3DB0", ownerAvatar: "/avatars/james-wilson.svg" },
  { owner: "Anita Desai",    ownerInitials: "AD", ownerColor: "#008080", ownerAvatar: "/avatars/anita-desai.svg" },
  { owner: "Kiran Pingle",   ownerInitials: "KP", ownerColor: "#636366", ownerAvatar: "/avatars/kiran-pingle.svg" },
];

function person(i: number) { return people[i % people.length]; }

function withMinimumItems(items: DriveItem[], minimum: number, prefix: string): DriveItem[] {
  const expanded = Array.from({ length: minimum }, (_, index) => {
    const item = items[index % items.length];
    const copy = Math.floor(index / items.length);
    const extensionIndex = item.name.lastIndexOf(".");
    const name = copy === 0
      ? item.name
      : extensionIndex > -1
        ? `${item.name.slice(0, extensionIndex)} (${copy + 1})${item.name.slice(extensionIndex)}`
        : `${item.name} (${copy + 1})`;

    const thumbnail = (item.type === "image" || item.type === "video")
      ? sampleMediaThumbnails[(index * 7 + prefix.length) % sampleMediaThumbnails.length]
      : item.thumbnail;

    return {
      ...item,
      id: `${prefix}-${index + 1}`,
      name,
      thumbnail,
      creator: item.creator ?? item.owner,
      sharedWith: item.sharedWith ?? (item.shared ? [people[(index + 1) % people.length].owner] : []),
    };
  });

  return [...expanded.filter((item) => item.type === "folder"), ...expanded.filter((item) => item.type !== "folder")];
}

export const recentFolders = [
  { id: "rf1", name: "Meeting Notes Q3",    location: "in My Drive" },
  { id: "rf2", name: "Product Design",      location: "in My Drive" },
  { id: "rf3", name: "Campaign Assets",     location: "in Team Drive" },
  { id: "rf4", name: "UX Research 2026",    location: "in My Drive" },
  { id: "rf5", name: "Engineering Docs",    location: "in Team Drive" },
];

export const recentFileGroups: { group: string; items: DriveItem[] }[] = [
  {
    group: "Today",
    items: withMinimumItems([
      { id: "r1",  name: "Ouch_both_beyond.pptx — Final Presentation for the Global Product Strategy Review", type: "ppt", modified: "Sep 14, 2026, 9:42 AM", size: "18.4 MB", ...ME, location: "My Drive" },
      { id: "r2",  name: "Report Q2-2025.xlsx",             type: "excel", modified: "Sep 14, 2026, 8:15 AM",  size: "3.2 MB",   ...person(0),   location: "Team Drive" },
      { id: "r3",  name: "Annual Report.docx",              type: "word",  modified: "Sep 14, 2026, 7:58 AM",  size: "5.6 MB",   ...ME,          location: "My Drive" },
      { id: "r4",  name: "Brand Guidelines v3.pdf",         type: "pdf",   modified: "Sep 14, 2026, 7:30 AM",  size: "12.1 MB",  ...person(1),   location: "Team Drive" },
      { id: "r5",  name: "Product Roadmap H2.pptx",         type: "ppt",   modified: "Sep 14, 2026, 6:55 AM",  size: "9.8 MB",   ...person(2),   location: "My Drive" },
    ], 8, "recent-today"),
  },
  {
    group: "Last Week",
    items: withMinimumItems([
      { id: "r6",  name: "Meeting_Recording_Sep08.mp4",     type: "video", modified: "Sep 10, 2026",            size: "320 MB",   ...ME,          thumbnail: "/media-thumbnails/meeting-recording.svg", location: "My Drive" },
      { id: "r7",  name: "Budget_Forecast_2026.xlsx",       type: "excel", modified: "Sep 9, 2026",             size: "2.1 MB",   ...person(3),   location: "Team Drive" },
      { id: "r8",  name: "viability_assessment.pdf",        type: "pdf",   modified: "Sep 8, 2026",             size: "4.5 MB",   ...ME,          location: "My Drive" },
      { id: "r9",  name: "Campaign_Banner_v2.png",          type: "image", modified: "Sep 7, 2026",             size: "1.8 MB",   ...person(4),   thumbnail: "/media-thumbnails/campaign-banner.svg", location: "Team Drive" },
      { id: "r10", name: "Architecture_Notes.docx",         type: "word",  modified: "Sep 7, 2026",             size: "890 KB",   ...ME,          location: "My Drive" },
      { id: "r11", name: "Sunflower-field-shoot.jpg",       type: "image", modified: "Sep 6, 2026",             size: "4.2 MB",   ...person(5),   thumbnail: "/media-thumbnails/sunflower-field.svg", location: "My Drive" },
    ], 10, "recent-week"),
  },
  {
    group: "Last Month",
    items: withMinimumItems([
      { id: "r12", name: "Podcast_Interview_Aug.mp3",       type: "audio", modified: "Aug 28, 2026",            size: "64 MB",    ...ME,          location: "My Drive" },
      { id: "r13", name: "UI_Mockups_v4.pdf",               type: "pdf",   modified: "Aug 25, 2026",            size: "22.3 MB",  ...person(6),   location: "Team Drive" },
      { id: "r14", name: "Onboarding_Checklist.docx",       type: "word",  modified: "Aug 20, 2026",            size: "1.1 MB",   ...person(7),   location: "My Drive" },
      { id: "r15", name: "Project_Atlas_Assets.zip",        type: "zip",   modified: "Aug 15, 2026",            size: "156 MB",   ...ME,          location: "My Drive" },
      { id: "r16", name: "Sales_Dashboard_Sep.xlsx",        type: "excel", modified: "Aug 12, 2026",            size: "3.7 MB",   ...person(8),   location: "Team Drive" },
    ], 7, "recent-month"),
  },
];

export const recentItems: DriveItem[] = recentFileGroups.flatMap((g) => g.items);

export const myDriveItems: DriveItem[] = withMinimumItems([
  { id: "d1",  name: "Claude skills: Mariam Vossough @ The Women's AI Voice — Workshop Notes, Research, and Campaign Assets", type: "folder", modified: "Sep 12, 2026, 11:20 AM", size: "–", ...ME, location: "My Drive", shared: true, sharedWith: ["Kenji Tanaka", "Aisha Patel", "Marcus Lee", "Nina Kowalski", "Chen Wei"], starred: true },
  { id: "d2",  name: "My Documents",               type: "folder", modified: "Sep 10, 2026, 9:05 AM",  size: "–",        ...ME, location: "My Drive" },
  { id: "d3",  name: "Webinar 2025",               type: "folder", modified: "Aug 28, 2026, 2:44 PM",  size: "–",        ...ME, location: "My Drive", shared: true },
  { id: "d4",  name: "Ouch_both_beyond.pptx",      type: "ppt",    modified: "Sep 14, 2026, 9:42 AM",  size: "18.4 MB",  ...ME, location: "My Drive" },
  { id: "d5",  name: "Annual Report.docx",          type: "word",   modified: "Sep 14, 2026, 7:58 AM",  size: "5.6 MB",   ...ME, location: "My Drive", starred: true },
  { id: "d6",  name: "Budget_Forecast_2026.xlsx",   type: "excel",  modified: "Sep 9, 2026, 3:15 PM",   size: "2.1 MB",   ...ME, location: "My Drive" },
  { id: "d7",  name: "viability_assessment.pdf",    type: "pdf",    modified: "Sep 8, 2026, 1:30 PM",   size: "4.5 MB",   ...ME, location: "My Drive" },
  { id: "d8",  name: "Campaign_Banner_v2.png",      type: "image",  modified: "Sep 7, 2026, 11:00 AM",  size: "1.8 MB",   ...ME, thumbnail: "/media-thumbnails/campaign-banner.svg", location: "My Drive", shared: true },
  { id: "d9",  name: "Architecture_Notes.docx",     type: "word",   modified: "Sep 7, 2026, 9:45 AM",   size: "890 KB",   ...ME, location: "My Drive" },
  { id: "d10", name: "Podcast_Interview_Aug.mp3",   type: "audio",  modified: "Aug 28, 2026, 4:00 PM",  size: "64 MB",    ...ME, location: "My Drive" },
  { id: "d11", name: "Project_Atlas_Assets.zip",    type: "zip",    modified: "Aug 15, 2026, 10:30 AM", size: "156 MB",   ...ME, location: "My Drive" },
  { id: "d12", name: "Sunflower-field-shoot.jpg",   type: "image",  modified: "Sep 6, 2026, 8:20 AM",   size: "4.2 MB",   ...ME, thumbnail: "/media-thumbnails/sunflower-field.svg", location: "My Drive" },
  { id: "d13", name: "UI_Mockups_v4.pdf",           type: "pdf",    modified: "Aug 25, 2026, 2:15 PM",  size: "22.3 MB",  ...ME, location: "My Drive" },
  { id: "d14", name: "Logo_Final.svg",              type: "vector", modified: "Aug 10, 2026, 5:00 PM",  size: "320 KB",   ...ME, location: "My Drive" },
  { id: "d15", name: "Meeting_Recording_Sep08.mp4", type: "video",  modified: "Sep 10, 2026, 3:00 PM", size: "320 MB",   ...ME, thumbnail: "/media-thumbnails/meeting-recording.svg", location: "My Drive" },
], 25, "my-drive");

export const sharedItems: DriveItem[] = withMinimumItems([
  { id: "s1",  name: "Campaign Assets — Japan Autumn Launch Photography, Video, and Social Media Toolkit", type: "folder", modified: "Sep 9, 2026", size: "–", owner: "Yuki Sato", ownerInitials: "YS", ownerColor: "#9B3FD4", ownerAvatar: "/avatars/yuki-sato.svg", location: "Team Drive", shared: true },
  { id: "s2",  name: "Design Resources",           type: "folder", modified: "Sep 6, 2026",  size: "–",       owner: "Kenji Tanaka",  ownerInitials: "KT", ownerColor: "#0080B0", ownerAvatar: "/avatars/kenji-tanaka.svg",  location: "Team Drive", shared: true },
  { id: "s3",  name: "Marketing Q3",               type: "folder", modified: "Aug 28, 2026", size: "–",       owner: "Aisha Patel",   ownerInitials: "AP", ownerColor: "#C14020", ownerAvatar: "/avatars/aisha-patel.svg",   location: "Marketing",  shared: true },
  { id: "s4",  name: "Product Launch Deck.pptx",   type: "ppt",    modified: "Sep 10, 2026", size: "8.1 MB",  owner: "Yuki Sato",     ownerInitials: "YS", ownerColor: "#9B3FD4", ownerAvatar: "/avatars/yuki-sato.svg",     location: "Team Drive", shared: true },
  { id: "s5",  name: "Campaign_Banner_v2.png",     type: "image",  modified: "Sep 5, 2026",  size: "3.2 MB",  owner: "Kenji Tanaka",  ownerInitials: "KT", ownerColor: "#0080B0", ownerAvatar: "/avatars/kenji-tanaka.svg", thumbnail: "/media-thumbnails/campaign-banner.svg", location: "Team Drive", shared: true },
  { id: "s6",  name: "Brand Guidelines.pdf",       type: "pdf",    modified: "Aug 30, 2026", size: "5.8 MB",  owner: "Aisha Patel",   ownerInitials: "AP", ownerColor: "#C14020", ownerAvatar: "/avatars/aisha-patel.svg",   location: "Marketing",  shared: true },
  { id: "s7",  name: "Q3_Review_Notes.docx",       type: "word",   modified: "Aug 22, 2026", size: "1.4 MB",  owner: "Marcus Lee",    ownerInitials: "ML", ownerColor: "#1A8040", ownerAvatar: "/avatars/marcus-lee.svg",    location: "My Drive",   shared: true },
  { id: "s8",  name: "Engineering_Roadmap.xlsx",   type: "excel",  modified: "Aug 18, 2026", size: "2.9 MB",  owner: "Nina Kowalski", ownerInitials: "NK", ownerColor: "#7A5500", ownerAvatar: "/avatars/nina-kowalski.svg", location: "Team Drive", shared: true },
  { id: "s9",  name: "UX_Research_Findings.pdf",   type: "pdf",    modified: "Aug 14, 2026", size: "7.2 MB",  owner: "Olivia Brown",  ownerInitials: "OB", ownerColor: "#005E8B", ownerAvatar: "/avatars/olivia-brown.svg",  location: "Team Drive", shared: true },
  { id: "s10", name: "Sprint_Planning_Sep.docx",   type: "word",   modified: "Sep 2, 2026",  size: "620 KB",  owner: "James Wilson",  ownerInitials: "JW", ownerColor: "#4E3DB0", ownerAvatar: "/avatars/james-wilson.svg",  location: "My Drive",   shared: true },
  { id: "s11", name: "Sales_Forecast_Q4.xlsx",     type: "excel",  modified: "Sep 8, 2026",  size: "1.9 MB",  owner: "Anita Desai",   ownerInitials: "AD", ownerColor: "#008080", ownerAvatar: "/avatars/anita-desai.svg",   location: "Team Drive", shared: true },
  { id: "s12", name: "Onboarding_Kit_v2.zip",      type: "zip",    modified: "Aug 10, 2026", size: "45.3 MB", owner: "Chen Wei",       ownerInitials: "CW", ownerColor: "#B0004E", ownerAvatar: "/avatars/chen-wei.svg",      location: "Team Drive", shared: true },
], 25, "shared");

export const starredItems: DriveItem[] = withMinimumItems([
  { id: "st1", name: "Q3 Report — International Growth and Customer Experience Performance Review.pdf", type: "pdf", modified: "Sep 14, 2026, 10:30 AM", size: "2.4 MB", ...ME, location: "My Drive", starred: true, shared: true },
  { id: "st2", name: "Meeting Notes",              type: "folder", modified: "Sep 12, 2026, 11:20 AM", size: "–",       ...ME,         location: "My Drive", starred: true, shared: true },
  { id: "st3", name: "Budget_2026.xlsx",           type: "excel",  modified: "Sep 8, 2026",            size: "512 KB",  ...ME,         location: "My Drive", starred: true },
  { id: "st4", name: "Brand Guidelines.pdf",       type: "pdf",    modified: "Aug 30, 2026",           size: "5.8 MB",  ...person(0),  location: "Team Drive", starred: true, shared: true },
  { id: "st5", name: "Product Roadmap H2.pptx",   type: "ppt",    modified: "Sep 14, 2026",           size: "9.8 MB",  ...person(2),  location: "My Drive", starred: true },
], 25, "starred");

const teamFolderNames = [
  "Team Design — Design System, Research, and Cross-functional Planning Materials", "Dev Team Folder", "Q4 Goals 2026", "Team Party-2025", "Annual Workshop-2026",
  "Product Launch-2026", "Quarterly Review-Q3", "Marketing Meet-Sep", "Q3 Marketing Strategy",
  "Brand Guidelines v2.0", "Product Launch Deck", "Annual Report 2025", "UX Research Findings",
  "Sales Dashboard Redesign", "Design System Library", "Customer Insights Q3", "Engineering Roadmap",
  "Recruiting Resources", "Partner Campaigns Sep", "Project Atlas", "Product Research Hub", "Board Materials",
  "Company Events 2026", "Knowledge Base", "Team Onboarding Docs",
];
const teamOwners = [
  { owner: "Kiran Pingle",   ownerInitials: "KP", ownerColor: "#636366", ownerAvatar: "/avatars/kiran-pingle.svg" },
  { owner: "Yuki Sato",      ownerInitials: "YS", ownerColor: "#9B3FD4", ownerAvatar: "/avatars/yuki-sato.svg" },
  { owner: "Kenji Tanaka",   ownerInitials: "KT", ownerColor: "#0080B0", ownerAvatar: "/avatars/kenji-tanaka.svg" },
  { owner: "Aisha Patel",    ownerInitials: "AP", ownerColor: "#C14020", ownerAvatar: "/avatars/aisha-patel.svg" },
  { owner: "Marcus Lee",     ownerInitials: "ML", ownerColor: "#1A8040", ownerAvatar: "/avatars/marcus-lee.svg" },
  { owner: "Nina Kowalski",  ownerInitials: "NK", ownerColor: "#7A5500", ownerAvatar: "/avatars/nina-kowalski.svg" },
  { owner: "Chen Wei",       ownerInitials: "CW", ownerColor: "#B0004E", ownerAvatar: "/avatars/chen-wei.svg" },
  { owner: "Olivia Brown",   ownerInitials: "OB", ownerColor: "#005E8B", ownerAvatar: "/avatars/olivia-brown.svg" },
  { owner: "James Wilson",   ownerInitials: "JW", ownerColor: "#4E3DB0", ownerAvatar: "/avatars/james-wilson.svg" },
  { owner: "Anita Desai",    ownerInitials: "AD", ownerColor: "#008080", ownerAvatar: "/avatars/anita-desai.svg" },
];
const teamModifiedDates = [
  "Sep 14, 2026", "Sep 11, 2026", "Sep 9, 2026", "Sep 5, 2026", "Sep 1, 2026",
  "Aug 25, 2026", "Aug 18, 2026", "Aug 10, 2026", "Jul 28, 2026", "Jul 15, 2026",
];
const teamSizes = ["184.4 MB", "220.7 MB", "198.9 MB", "88.3 MB", "312.7 MB", "156.4 MB", "63.8 MB", "421 MB", "45.2 MB", "275.1 MB", "130.6 MB"];

export const teamDriveItems: DriveItem[] = teamFolderNames.map((name, index) => ({
  id: `team-drive-${index + 1}`,
  name,
  type: "folder",
  modified: teamModifiedDates[index % teamModifiedDates.length],
  size: teamSizes[index % teamSizes.length],
  ...teamOwners[index % teamOwners.length],
  location: "Team Drive",
}));

export const trashItems: DriveItem[] = withMinimumItems([
  { id: "trash-1", name: "Old Data", type: "folder", modified: "Mar 28, 2026, 12:56 AM", size: "184.4 MB", ...ME, location: "My Drive" },
  { id: "trash-2", name: "IMG000123.jpg", type: "image", modified: "Mar 28, 2026, 12:56 AM", size: "184.4 MB", ...ME, thumbnail: "/media-thumbnails/meeting-recording.svg", location: "My Drive" },
  { id: "trash-3", name: "IMG0001223.jpg", type: "image", modified: "Mar 28, 2026, 12:56 AM", size: "184.4 MB", ...ME, thumbnail: "/media-thumbnails/campaign-banner.svg", location: "My Drive" },
  { id: "trash-4", name: "IMG0001245.jpg", type: "image", modified: "Mar 28, 2026, 12:56 AM", size: "184.4 MB", ...ME, thumbnail: "/media-thumbnails/sunflower-field.svg", location: "My Drive" },
  { id: "trash-5", name: "Feb-2025 Meeting Notes.docx", type: "word", modified: "Mar 28, 2026, 12:56 AM", size: "184.4 MB", ...ME, location: "My Drive" },
  { id: "trash-6", name: "Old Datasheet.xlsx", type: "excel", modified: "Mar 28, 2026, 12:56 AM", size: "184.4 MB", ...ME, location: "My Drive" },
], 25, "trash");

export const STORAGE_USED_MB = 125.5;
export const STORAGE_TOTAL_TB = 3;
// Kept independent of the demo labels so the sidebar meter remains visibly useful in prototypes.
export const STORAGE_PERCENT = 40;
