import type { DriveItem } from "./types";
import { sampleMediaThumbnails } from "./sample-media-thumbnails";

// People in the system
const ME = { owner: "You (kiran.pingle)", ownerInitials: "KP", ownerColor: "#002896", ownerAvatar: undefined };
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
  { id: "fd-mkt-events",    name: "Events",              location: "in Marketing Assets" },
  { id: "fd-design",        name: "Product Design",      location: "in My Drive" },
  { id: "fd-mkt-campaigns", name: "Campaigns",           location: "in Marketing Assets" },
  { id: "fd-mkt-research",  name: "Market Research",     location: "in Marketing Assets" },
  { id: "fd-engineering",   name: "Engineering Docs",    location: "in My Drive" },
];

export const recentFileGroups: { group: string; items: DriveItem[] }[] = [
  {
    group: "Today",
    items: withMinimumItems([
      { id: "r1",  name: "Ouch_both_beyond.pptx — Final Presentation for the Global Product Strategy Review", type: "ppt",   modified: "Sep 14, 2026, 9:42 AM", size: "18.4 MB", ...ME,        location: "My Drive" },
      { id: "r2",  name: "Report Q2-2025.xlsx",             type: "excel", modified: "Sep 14, 2026, 8:15 AM",  size: "3.2 MB",   ...person(0), location: "Team Drive" },
      { id: "r3",  name: "Annual Report.docx",              type: "word",  modified: "Sep 14, 2026, 7:58 AM",  size: "5.6 MB",   ...ME,        location: "My Drive" },
      { id: "r4",  name: "Brand Guidelines v3.pdf",         type: "pdf",   modified: "Sep 14, 2026, 7:30 AM",  size: "12.1 MB",  ...person(1), location: "Team Drive" },
      { id: "r5",  name: "Product Roadmap H2.pptx",         type: "ppt",   modified: "Sep 14, 2026, 6:55 AM",  size: "9.8 MB",   ...person(2), location: "My Drive" },
      { id: "r1i1", name: "Campaign_Shoot_Day1.jpg",        type: "image", modified: "Sep 14, 2026, 6:10 AM",  size: "5.2 MB",   ...ME,        thumbnail: sampleMediaThumbnails[3],  location: "My Drive" },
      { id: "r1i2", name: "Hero_Banner_Sep.png",            type: "image", modified: "Sep 14, 2026, 5:55 AM",  size: "2.8 MB",   ...person(3), thumbnail: sampleMediaThumbnails[4],  location: "Team Drive" },
      { id: "r1i3", name: "Product_Shot_White.jpg",         type: "image", modified: "Sep 14, 2026, 5:40 AM",  size: "3.6 MB",   ...person(4), thumbnail: sampleMediaThumbnails[5],  location: "My Drive" },
    ], 10, "recent-today"),
  },
  {
    group: "Last Week",
    items: withMinimumItems([
      { id: "r6",  name: "Meeting_Recording_Sep08.mp4",     type: "video", modified: "Sep 10, 2026",            size: "320 MB",   ...ME,        thumbnail: sampleMediaThumbnails[0],  location: "My Drive" },
      { id: "r7",  name: "Budget_Forecast_2026.xlsx",       type: "excel", modified: "Sep 9, 2026",             size: "2.1 MB",   ...person(3), location: "Team Drive" },
      { id: "r8",  name: "viability_assessment.pdf",        type: "pdf",   modified: "Sep 8, 2026",             size: "4.5 MB",   ...ME,        location: "My Drive" },
      { id: "r9",  name: "Campaign_Banner_v2.png",          type: "image", modified: "Sep 7, 2026",             size: "1.8 MB",   ...person(4), thumbnail: sampleMediaThumbnails[1],  location: "Team Drive" },
      { id: "r10", name: "Architecture_Notes.docx",         type: "word",  modified: "Sep 7, 2026",             size: "890 KB",   ...ME,        location: "My Drive" },
      { id: "r11", name: "Sunflower-field-shoot.jpg",       type: "image", modified: "Sep 6, 2026",             size: "4.2 MB",   ...person(5), thumbnail: sampleMediaThumbnails[2],  location: "My Drive" },
      { id: "r6i1", name: "Autumn_Shoot_Final.jpg",         type: "image", modified: "Sep 9, 2026",             size: "7.1 MB",   ...person(6), thumbnail: sampleMediaThumbnails[6],  location: "Team Drive" },
      { id: "r6i2", name: "Studio_Portrait_v2.jpg",         type: "image", modified: "Sep 9, 2026",             size: "4.8 MB",   ...ME,        thumbnail: sampleMediaThumbnails[7],  location: "My Drive" },
      { id: "r6i3", name: "Event_Coverage_Wide.jpg",        type: "image", modified: "Sep 8, 2026",             size: "6.3 MB",   ...person(7), thumbnail: sampleMediaThumbnails[8],  location: "Team Drive" },
      { id: "r6i4", name: "Landscape_Promo.jpg",            type: "image", modified: "Sep 8, 2026",             size: "9.4 MB",   ...person(8), thumbnail: sampleMediaThumbnails[9],  location: "My Drive" },
    ], 12, "recent-week"),
  },
  {
    group: "Last Month",
    items: withMinimumItems([
      { id: "r12",  name: "Podcast_Interview_Aug.mp3",      type: "audio", modified: "Aug 28, 2026",            size: "64 MB",    ...ME,        location: "My Drive" },
      { id: "r13",  name: "UI_Mockups_v4.pdf",              type: "pdf",   modified: "Aug 25, 2026",            size: "22.3 MB",  ...person(6), location: "Team Drive" },
      { id: "r14",  name: "Onboarding_Checklist.docx",      type: "word",  modified: "Aug 20, 2026",            size: "1.1 MB",   ...person(7), location: "My Drive" },
      { id: "r15",  name: "Project_Atlas_Assets.zip",       type: "zip",   modified: "Aug 15, 2026",            size: "156 MB",   ...ME,        location: "My Drive" },
      { id: "r16",  name: "Sales_Dashboard_Sep.xlsx",       type: "excel", modified: "Aug 12, 2026",            size: "3.7 MB",   ...person(8), location: "Team Drive" },
      { id: "r12i1", name: "Summer_Campaign_Shoot.jpg",     type: "image", modified: "Aug 28, 2026",            size: "8.2 MB",   ...person(9), thumbnail: sampleMediaThumbnails[10], location: "Team Drive" },
      { id: "r12i2", name: "Office_Team_Photo.jpg",         type: "image", modified: "Aug 26, 2026",            size: "5.5 MB",   ...ME,        thumbnail: sampleMediaThumbnails[11], location: "My Drive" },
      { id: "r12i3", name: "Product_Detail_Macro.jpg",      type: "image", modified: "Aug 24, 2026",            size: "4.1 MB",   ...person(0), thumbnail: sampleMediaThumbnails[12], location: "Team Drive" },
      { id: "r12i4", name: "Promo_Reel_Thumbnail.png",      type: "image", modified: "Aug 22, 2026",            size: "1.9 MB",   ...person(1), thumbnail: sampleMediaThumbnails[13], location: "My Drive" },
      { id: "r12i5", name: "Background_Abstract.jpg",       type: "image", modified: "Aug 20, 2026",            size: "3.3 MB",   ...person(2), thumbnail: sampleMediaThumbnails[14], location: "My Drive" },
    ], 10, "recent-month"),
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
  { id: "d8",  name: "Campaign_Banner_v2.png",         type: "image",  modified: "Sep 7, 2026, 11:00 AM",  size: "1.8 MB",  ...ME, thumbnail: sampleMediaThumbnails[1],  location: "My Drive", shared: true },
  { id: "d9",  name: "Architecture_Notes.docx",        type: "word",   modified: "Sep 7, 2026, 9:45 AM",   size: "890 KB",  ...ME, location: "My Drive" },
  { id: "d10", name: "Podcast_Interview_Aug.mp3",      type: "audio",  modified: "Aug 28, 2026, 4:00 PM",  size: "64 MB",   ...ME, location: "My Drive" },
  { id: "d11", name: "Project_Atlas_Assets.zip",       type: "zip",    modified: "Aug 15, 2026, 10:30 AM", size: "156 MB",  ...ME, location: "My Drive" },
  { id: "d12", name: "Sunflower-field-shoot.jpg",      type: "image",  modified: "Sep 6, 2026, 8:20 AM",   size: "4.2 MB",  ...ME, thumbnail: sampleMediaThumbnails[2],  location: "My Drive" },
  { id: "d13", name: "UI_Mockups_v4.pdf",              type: "pdf",    modified: "Aug 25, 2026, 2:15 PM",  size: "22.3 MB", ...ME, location: "My Drive" },
  { id: "d14", name: "Logo_Final.svg",                 type: "vector", modified: "Aug 10, 2026, 5:00 PM",  size: "320 KB",  ...ME, location: "My Drive" },
  { id: "d15", name: "Meeting_Recording_Sep08.mp4",    type: "video",  modified: "Sep 10, 2026, 3:00 PM",  size: "320 MB",  ...ME, thumbnail: sampleMediaThumbnails[0],  location: "My Drive" },
  { id: "d16", name: "Product_Lifestyle_Shot.jpg",     type: "image",  modified: "Sep 5, 2026, 2:30 PM",   size: "6.1 MB",  ...ME, thumbnail: sampleMediaThumbnails[15], location: "My Drive" },
  { id: "d17", name: "Team_Offsite_Group.jpg",         type: "image",  modified: "Sep 4, 2026, 10:00 AM",  size: "4.7 MB",  ...ME, thumbnail: sampleMediaThumbnails[16], location: "My Drive", shared: true },
  { id: "d18", name: "Winter_Campaign_Key.jpg",        type: "image",  modified: "Sep 3, 2026, 4:15 PM",   size: "7.8 MB",  ...ME, thumbnail: sampleMediaThumbnails[17], location: "My Drive" },
  { id: "d19", name: "Abstract_Background.jpg",        type: "image",  modified: "Sep 2, 2026, 9:00 AM",   size: "2.9 MB",  ...ME, thumbnail: sampleMediaThumbnails[18], location: "My Drive" },
  { id: "d20", name: "Brand_Photography_Vol2.jpg",     type: "image",  modified: "Sep 1, 2026, 11:30 AM",  size: "5.4 MB",  ...ME, thumbnail: sampleMediaThumbnails[19], location: "My Drive", starred: true },
  { id: "d21", name: "Event_Recap_Highlight.jpg",      type: "image",  modified: "Aug 30, 2026, 3:00 PM",  size: "3.2 MB",  ...ME, thumbnail: sampleMediaThumbnails[20], location: "My Drive" },
  { id: "d22", name: "Promo_Video_Thumbnail.jpg",      type: "image",  modified: "Aug 29, 2026, 1:45 PM",  size: "1.6 MB",  ...ME, thumbnail: sampleMediaThumbnails[21], location: "My Drive" },
], 30, "my-drive");

export const sharedItems: DriveItem[] = withMinimumItems([
  { id: "s1",  name: "Campaign Assets — Japan Autumn Launch Photography, Video, and Social Media Toolkit", type: "folder", modified: "Sep 9, 2026", size: "–", owner: "Yuki Sato", ownerInitials: "YS", ownerColor: "#9B3FD4", ownerAvatar: "/avatars/yuki-sato.svg", location: "Team Drive", shared: true },
  { id: "s2",  name: "Design Resources",           type: "folder", modified: "Sep 6, 2026",  size: "–",       owner: "Kenji Tanaka",  ownerInitials: "KT", ownerColor: "#0080B0", ownerAvatar: "/avatars/kenji-tanaka.svg",  location: "Team Drive", shared: true },
  { id: "s3",  name: "Marketing Q3",               type: "folder", modified: "Aug 28, 2026", size: "–",       owner: "Aisha Patel",   ownerInitials: "AP", ownerColor: "#C14020", ownerAvatar: "/avatars/aisha-patel.svg",   location: "Marketing",  shared: true },
  { id: "s4",  name: "Product Launch Deck.pptx",   type: "ppt",    modified: "Sep 10, 2026", size: "8.1 MB",  owner: "Yuki Sato",     ownerInitials: "YS", ownerColor: "#9B3FD4", ownerAvatar: "/avatars/yuki-sato.svg",     location: "Team Drive", shared: true },
  { id: "s5",  name: "Campaign_Banner_v2.png",       type: "image", modified: "Sep 5, 2026",  size: "3.2 MB",  owner: "Kenji Tanaka",  ownerInitials: "KT", ownerColor: "#0080B0", ownerAvatar: "/avatars/kenji-tanaka.svg", thumbnail: sampleMediaThumbnails[1],  location: "Team Drive", shared: true },
  { id: "s6",  name: "Brand Guidelines.pdf",         type: "pdf",   modified: "Aug 30, 2026", size: "5.8 MB",  owner: "Aisha Patel",   ownerInitials: "AP", ownerColor: "#C14020", ownerAvatar: "/avatars/aisha-patel.svg",   location: "Marketing",  shared: true },
  { id: "s7",  name: "Q3_Review_Notes.docx",         type: "word",  modified: "Aug 22, 2026", size: "1.4 MB",  owner: "Marcus Lee",    ownerInitials: "ML", ownerColor: "#1A8040", ownerAvatar: "/avatars/marcus-lee.svg",    location: "My Drive",   shared: true },
  { id: "s8",  name: "Engineering_Roadmap.xlsx",     type: "excel", modified: "Aug 18, 2026", size: "2.9 MB",  owner: "Nina Kowalski", ownerInitials: "NK", ownerColor: "#7A5500", ownerAvatar: "/avatars/nina-kowalski.svg", location: "Team Drive", shared: true },
  { id: "s9",  name: "UX_Research_Findings.pdf",     type: "pdf",   modified: "Aug 14, 2026", size: "7.2 MB",  owner: "Olivia Brown",  ownerInitials: "OB", ownerColor: "#005E8B", ownerAvatar: "/avatars/olivia-brown.svg",  location: "Team Drive", shared: true },
  { id: "s10", name: "Sprint_Planning_Sep.docx",     type: "word",  modified: "Sep 2, 2026",  size: "620 KB",  owner: "James Wilson",  ownerInitials: "JW", ownerColor: "#4E3DB0", ownerAvatar: "/avatars/james-wilson.svg",  location: "My Drive",   shared: true },
  { id: "s11", name: "Sales_Forecast_Q4.xlsx",       type: "excel", modified: "Sep 8, 2026",  size: "1.9 MB",  owner: "Anita Desai",   ownerInitials: "AD", ownerColor: "#008080", ownerAvatar: "/avatars/anita-desai.svg",   location: "Team Drive", shared: true },
  { id: "s12", name: "Onboarding_Kit_v2.zip",        type: "zip",   modified: "Aug 10, 2026", size: "45.3 MB", owner: "Chen Wei",       ownerInitials: "CW", ownerColor: "#B0004E", ownerAvatar: "/avatars/chen-wei.svg",      location: "Team Drive", shared: true },
  { id: "s13", name: "Japan_Autumn_KeyVisual.jpg",   type: "image", modified: "Sep 9, 2026",  size: "5.8 MB",  owner: "Yuki Sato",     ownerInitials: "YS", ownerColor: "#9B3FD4", ownerAvatar: "/avatars/yuki-sato.svg",     thumbnail: sampleMediaThumbnails[22], location: "Team Drive", shared: true },
  { id: "s14", name: "Event_Banner_Wide.jpg",        type: "image", modified: "Sep 7, 2026",  size: "4.4 MB",  owner: "Kenji Tanaka",  ownerInitials: "KT", ownerColor: "#0080B0", ownerAvatar: "/avatars/kenji-tanaka.svg", thumbnail: sampleMediaThumbnails[23], location: "Team Drive", shared: true },
  { id: "s15", name: "Social_Square_Oct.png",        type: "image", modified: "Sep 6, 2026",  size: "2.1 MB",  owner: "Aisha Patel",   ownerInitials: "AP", ownerColor: "#C14020", ownerAvatar: "/avatars/aisha-patel.svg",   thumbnail: sampleMediaThumbnails[24], location: "Marketing",  shared: true },
  { id: "s16", name: "Product_Flatlay_v3.jpg",       type: "image", modified: "Sep 4, 2026",  size: "6.7 MB",  owner: "Marcus Lee",    ownerInitials: "ML", ownerColor: "#1A8040", ownerAvatar: "/avatars/marcus-lee.svg",    thumbnail: sampleMediaThumbnails[25], location: "Team Drive", shared: true },
  { id: "s17", name: "Brand_Ambassador_Photo.jpg",   type: "image", modified: "Sep 3, 2026",  size: "3.9 MB",  owner: "Nina Kowalski", ownerInitials: "NK", ownerColor: "#7A5500", ownerAvatar: "/avatars/nina-kowalski.svg", thumbnail: sampleMediaThumbnails[26], location: "Team Drive", shared: true },
], 28, "shared");

export const starredItems: DriveItem[] = withMinimumItems([
  { id: "st1", name: "Q3 Report — International Growth and Customer Experience Performance Review.pdf", type: "pdf", modified: "Sep 14, 2026, 10:30 AM", size: "2.4 MB", ...ME, location: "My Drive", starred: true, shared: true },
  { id: "st2", name: "Meeting Notes",              type: "folder", modified: "Sep 12, 2026, 11:20 AM", size: "–",       ...ME,         location: "My Drive", starred: true, shared: true },
  { id: "st3", name: "Budget_2026.xlsx",           type: "excel",  modified: "Sep 8, 2026",            size: "512 KB",  ...ME,         location: "My Drive", starred: true },
  { id: "st4", name: "Brand Guidelines.pdf",       type: "pdf",    modified: "Aug 30, 2026",           size: "5.8 MB",  ...person(0),  location: "Team Drive", starred: true, shared: true },
  { id: "st5", name: "Product Roadmap H2.pptx",   type: "ppt",    modified: "Sep 14, 2026",           size: "9.8 MB",  ...person(2),  location: "My Drive", starred: true },
], 25, "starred");

const teamFolderDefs: { id: string; name: string }[] = [
  { id: "td-design",       name: "Team Design — Design System, Research, and Cross-functional Planning Materials" },
  { id: "td-dev",          name: "Dev Team Folder" },
  { id: "td-q4-goals",     name: "Q4 Goals 2026" },
  { id: "team-drive-4",    name: "Team Party-2025" },
  { id: "team-drive-5",    name: "Annual Workshop-2026" },
  { id: "td-launch",       name: "Product Launch-2026" },
  { id: "td-q3-review",    name: "Quarterly Review-Q3" },
  { id: "team-drive-8",    name: "Marketing Meet-Sep" },
  { id: "td-mkt-strategy", name: "Q3 Marketing Strategy" },
  { id: "td-brand",        name: "Brand Guidelines v2.0" },
  { id: "team-drive-11",   name: "Product Launch Deck" },
  { id: "team-drive-12",   name: "Annual Report 2025" },
  { id: "team-drive-13",   name: "UX Research Findings" },
  { id: "team-drive-14",   name: "Sales Dashboard Redesign" },
  { id: "team-drive-15",   name: "Design System Library" },
  { id: "team-drive-16",   name: "Customer Insights Q3" },
  { id: "team-drive-17",   name: "Engineering Roadmap" },
  { id: "team-drive-18",   name: "Recruiting Resources" },
  { id: "team-drive-19",   name: "Partner Campaigns Sep" },
  { id: "team-drive-20",   name: "Project Atlas" },
  { id: "team-drive-21",   name: "Product Research Hub" },
  { id: "team-drive-22",   name: "Board Materials" },
  { id: "td-events",       name: "Company Events 2026" },
  { id: "td-knowledge",    name: "Knowledge Base" },
  { id: "td-onboarding",   name: "Team Onboarding Docs" },
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

export const teamDriveItems: DriveItem[] = teamFolderDefs.map(({ id, name }, index) => ({
  id,
  name,
  type: "folder",
  modified: teamModifiedDates[index % teamModifiedDates.length],
  size: teamSizes[index % teamSizes.length],
  ...teamOwners[index % teamOwners.length],
  location: "Team Drive",
}));

export const trashItems: DriveItem[] = withMinimumItems([
  { id: "trash-1", name: "Old Data", type: "folder", modified: "Mar 28, 2026, 12:56 AM", size: "184.4 MB", ...ME, location: "My Drive" },
  { id: "trash-2", name: "IMG000123.jpg", type: "image", modified: "Mar 28, 2026, 12:56 AM", size: "184.4 MB", ...ME, thumbnail: sampleMediaThumbnails[0], location: "My Drive" },
  { id: "trash-3", name: "IMG0001223.jpg", type: "image", modified: "Mar 28, 2026, 12:56 AM", size: "184.4 MB", ...ME, thumbnail: sampleMediaThumbnails[1], location: "My Drive" },
  { id: "trash-4", name: "IMG0001245.jpg", type: "image", modified: "Mar 28, 2026, 12:56 AM", size: "184.4 MB", ...ME, thumbnail: sampleMediaThumbnails[2], location: "My Drive" },
  { id: "trash-5", name: "Feb-2025 Meeting Notes.docx", type: "word", modified: "Mar 28, 2026, 12:56 AM", size: "184.4 MB", ...ME, location: "My Drive" },
  { id: "trash-6", name: "Old Datasheet.xlsx", type: "excel", modified: "Mar 28, 2026, 12:56 AM", size: "184.4 MB", ...ME, location: "My Drive" },
], 25, "trash");

export const STORAGE_USED_MB = 125.5;
export const STORAGE_TOTAL_TB = 3;
// Kept independent of the demo labels so the sidebar meter remains visibly useful in prototypes.
export const STORAGE_PERCENT = 40;

// ── Folder hierarchy ─────────────────────────────────────────────────────────

export type FolderNode = { id: string; name: string; parentId: string | null };

export const folderTree: FolderNode[] = [
  // Team Drive virtual root (not a navigable page itself)
  { id: "td-root",         name: "Team Drive",          parentId: null },

  // Root (shown in My Drive)
  { id: "fd-marketing",    name: "Marketing Assets",    parentId: null },
  { id: "fd-engineering",  name: "Engineering Docs",    parentId: null },
  { id: "fd-design",       name: "Product Design",      parentId: null },
  { id: "fd-finance",      name: "Finance & Reports",   parentId: null },
  { id: "fd-hr",           name: "HR Resources",        parentId: null },
  { id: "fd-legal",        name: "Legal & Compliance",  parentId: null },
  { id: "fd-operations",   name: "Operations",          parentId: null },
  { id: "fd-analytics",    name: "Analytics & BI",      parentId: null },

  // Marketing subfolders
  { id: "fd-mkt-campaigns",  name: "Campaigns",           parentId: "fd-marketing" },
  { id: "fd-mkt-brand",      name: "Brand Guidelines",    parentId: "fd-marketing" },
  { id: "fd-mkt-events",     name: "Events",              parentId: "fd-marketing" },
  { id: "fd-mkt-social",     name: "Social Media",        parentId: "fd-marketing" },
  { id: "fd-mkt-print",      name: "Print Materials",     parentId: "fd-marketing" },
  { id: "fd-mkt-video",      name: "Video Production",    parentId: "fd-marketing" },
  { id: "fd-mkt-email",      name: "Email Templates",     parentId: "fd-marketing" },
  { id: "fd-mkt-research",   name: "Market Research",     parentId: "fd-marketing" },

  // Campaigns subfolders (level 3)
  { id: "fd-camp-2026q1", name: "Q1 2026",           parentId: "fd-mkt-campaigns" },
  { id: "fd-camp-2026q2", name: "Q2 2026",           parentId: "fd-mkt-campaigns" },
  { id: "fd-camp-2026q3", name: "Q3 2026",           parentId: "fd-mkt-campaigns" },
  { id: "fd-camp-2025",   name: "Archive 2025",      parentId: "fd-mkt-campaigns" },
  { id: "fd-camp-global", name: "Global Campaigns",  parentId: "fd-mkt-campaigns" },

  // Brand Guidelines subfolders (level 3)
  { id: "fd-brand-logos",   name: "Logos & Icons",   parentId: "fd-mkt-brand" },
  { id: "fd-brand-colors",  name: "Color Palettes",  parentId: "fd-mkt-brand" },
  { id: "fd-brand-type",    name: "Typography",      parentId: "fd-mkt-brand" },
  { id: "fd-brand-photo",   name: "Photography",     parentId: "fd-mkt-brand" },

  // Engineering subfolders
  { id: "fd-eng-backend",   name: "Backend",          parentId: "fd-engineering" },
  { id: "fd-eng-frontend",  name: "Frontend",         parentId: "fd-engineering" },
  { id: "fd-eng-infra",     name: "Infrastructure",   parentId: "fd-engineering" },
  { id: "fd-eng-mobile",    name: "Mobile Apps",      parentId: "fd-engineering" },
  { id: "fd-eng-docs",      name: "API Docs",         parentId: "fd-engineering" },
  { id: "fd-eng-specs",     name: "Tech Specs",       parentId: "fd-engineering" },
  { id: "fd-eng-security",  name: "Security",         parentId: "fd-engineering" },
  { id: "fd-eng-testing",   name: "QA & Testing",     parentId: "fd-engineering" },

  // Backend subfolders (level 3)
  { id: "fd-be-auth",      name: "Auth Service",      parentId: "fd-eng-backend" },
  { id: "fd-be-payments",  name: "Payments",          parentId: "fd-eng-backend" },
  { id: "fd-be-search",    name: "Search Service",    parentId: "fd-eng-backend" },
  { id: "fd-be-catalog",   name: "Product Catalog",   parentId: "fd-eng-backend" },
  { id: "fd-be-notifs",    name: "Notifications",     parentId: "fd-eng-backend" },

  // Frontend subfolders (level 3)
  { id: "fd-fe-components", name: "Components",       parentId: "fd-eng-frontend" },
  { id: "fd-fe-pages",      name: "Pages",            parentId: "fd-eng-frontend" },
  { id: "fd-fe-hooks",      name: "Custom Hooks",     parentId: "fd-eng-frontend" },
  { id: "fd-fe-tests",      name: "Tests",            parentId: "fd-eng-frontend" },

  // Design subfolders
  { id: "fd-des-ux",      name: "UX Research",        parentId: "fd-design" },
  { id: "fd-des-ui",      name: "UI Components",      parentId: "fd-design" },
  { id: "fd-des-proto",   name: "Prototypes",         parentId: "fd-design" },
  { id: "fd-des-assets",  name: "Design Assets",      parentId: "fd-design" },
  { id: "fd-des-tokens",  name: "Design Tokens",      parentId: "fd-design" },
  { id: "fd-des-motion",  name: "Motion & Animation", parentId: "fd-design" },

  // UX Research subfolders (level 3)
  { id: "fd-ux-interviews", name: "User Interviews",  parentId: "fd-des-ux" },
  { id: "fd-ux-usability",  name: "Usability Tests",  parentId: "fd-des-ux" },
  { id: "fd-ux-surveys",    name: "Surveys & Data",   parentId: "fd-des-ux" },
  { id: "fd-ux-personas",   name: "Personas",         parentId: "fd-des-ux" },
  { id: "fd-ux-journeys",   name: "Journey Maps",     parentId: "fd-des-ux" },

  // Finance subfolders
  { id: "fd-fin-budgets",   name: "Budgets",           parentId: "fd-finance" },
  { id: "fd-fin-reports",   name: "Financial Reports", parentId: "fd-finance" },
  { id: "fd-fin-invoices",  name: "Invoices",          parentId: "fd-finance" },
  { id: "fd-fin-tax",       name: "Tax Documents",     parentId: "fd-finance" },
  { id: "fd-fin-audits",    name: "Audits",            parentId: "fd-finance" },

  // HR subfolders
  { id: "fd-hr-policies",   name: "Policies",           parentId: "fd-hr" },
  { id: "fd-hr-onboarding", name: "Onboarding",         parentId: "fd-hr" },
  { id: "fd-hr-training",   name: "Training Materials", parentId: "fd-hr" },
  { id: "fd-hr-benefits",   name: "Benefits",           parentId: "fd-hr" },

  // Operations subfolders
  { id: "fd-ops-processes", name: "Processes",  parentId: "fd-operations" },
  { id: "fd-ops-vendors",   name: "Vendors",    parentId: "fd-operations" },
  { id: "fd-ops-logistics", name: "Logistics",  parentId: "fd-operations" },

  // ── Level 4: under Campaigns quarters ──────────────────────────────────────
  { id: "fd-q1-awareness",  name: "Awareness",       parentId: "fd-camp-2026q1" },
  { id: "fd-q1-conversion", name: "Conversion",      parentId: "fd-camp-2026q1" },
  { id: "fd-q1-retention",  name: "Retention",       parentId: "fd-camp-2026q1" },
  { id: "fd-q1-reports",    name: "Reports",         parentId: "fd-camp-2026q1" },
  { id: "fd-q2-launch",     name: "Product Launch",  parentId: "fd-camp-2026q2" },
  { id: "fd-q2-seasonal",   name: "Seasonal Promos", parentId: "fd-camp-2026q2" },
  { id: "fd-q2-social",     name: "Social Ads",      parentId: "fd-camp-2026q2" },
  { id: "fd-q3-summer",     name: "Summer Sale",     parentId: "fd-camp-2026q3" },
  { id: "fd-q3-back",       name: "Back to School",  parentId: "fd-camp-2026q3" },
  { id: "fd-q3-partner",    name: "Partner Collabs", parentId: "fd-camp-2026q3" },
  { id: "fd-arch-q1",       name: "Q1 2025",         parentId: "fd-camp-2025" },
  { id: "fd-arch-q2",       name: "Q2 2025",         parentId: "fd-camp-2025" },
  { id: "fd-arch-q3",       name: "Q3 2025",         parentId: "fd-camp-2025" },
  { id: "fd-arch-q4",       name: "Q4 2025",         parentId: "fd-camp-2025" },
  { id: "fd-glob-apac",     name: "APAC",            parentId: "fd-camp-global" },
  { id: "fd-glob-emea",     name: "EMEA",            parentId: "fd-camp-global" },
  { id: "fd-glob-amer",     name: "Americas",        parentId: "fd-camp-global" },

  // ── Level 4: under Brand Guidelines ────────────────────────────────────────
  { id: "fd-logo-primary",  name: "Primary Logo",    parentId: "fd-brand-logos" },
  { id: "fd-logo-sub",      name: "Sub-brands",      parentId: "fd-brand-logos" },
  { id: "fd-logo-icon",     name: "App Icons",       parentId: "fd-brand-logos" },
  { id: "fd-logo-dark",     name: "Dark Variants",   parentId: "fd-brand-logos" },
  { id: "fd-col-primary",   name: "Primary Palette", parentId: "fd-brand-colors" },
  { id: "fd-col-ext",       name: "Extended Palette",parentId: "fd-brand-colors" },
  { id: "fd-col-dark",      name: "Dark Mode",       parentId: "fd-brand-colors" },
  { id: "fd-type-display",  name: "Display",         parentId: "fd-brand-type" },
  { id: "fd-type-body",     name: "Body",            parentId: "fd-brand-type" },
  { id: "fd-type-mono",     name: "Monospace",       parentId: "fd-brand-type" },
  { id: "fd-photo-people",  name: "People",          parentId: "fd-brand-photo" },
  { id: "fd-photo-product", name: "Product",         parentId: "fd-brand-photo" },
  { id: "fd-photo-lifestyle",name:"Lifestyle",        parentId: "fd-brand-photo" },

  // ── Level 4: under Backend services ────────────────────────────────────────
  { id: "fd-auth-oauth",    name: "OAuth",           parentId: "fd-be-auth" },
  { id: "fd-auth-sso",      name: "SSO",             parentId: "fd-be-auth" },
  { id: "fd-auth-mfa",      name: "MFA",             parentId: "fd-be-auth" },
  { id: "fd-pay-checkout",  name: "Checkout",        parentId: "fd-be-payments" },
  { id: "fd-pay-refunds",   name: "Refunds",         parentId: "fd-be-payments" },
  { id: "fd-pay-reports",   name: "Reports",         parentId: "fd-be-payments" },
  { id: "fd-pay-intl",      name: "International",   parentId: "fd-be-payments" },
  { id: "fd-srch-indexing", name: "Indexing",        parentId: "fd-be-search" },
  { id: "fd-srch-ranking",  name: "Ranking",         parentId: "fd-be-search" },
  { id: "fd-srch-suggest",  name: "Suggestions",     parentId: "fd-be-search" },
  { id: "fd-cat-products",  name: "Products",        parentId: "fd-be-catalog" },
  { id: "fd-cat-categories",name: "Categories",      parentId: "fd-be-catalog" },
  { id: "fd-cat-pricing",   name: "Pricing",         parentId: "fd-be-catalog" },
  { id: "fd-notif-email",   name: "Email",           parentId: "fd-be-notifs" },
  { id: "fd-notif-push",    name: "Push",            parentId: "fd-be-notifs" },
  { id: "fd-notif-sms",     name: "SMS",             parentId: "fd-be-notifs" },

  // ── Level 4: under Frontend ─────────────────────────────────────────────────
  { id: "fd-comp-ui",       name: "UI Primitives",   parentId: "fd-fe-components" },
  { id: "fd-comp-layout",   name: "Layout",          parentId: "fd-fe-components" },
  { id: "fd-comp-forms",    name: "Forms",           parentId: "fd-fe-components" },
  { id: "fd-comp-charts",   name: "Charts",          parentId: "fd-fe-components" },
  { id: "fd-pages-auth",    name: "Auth Pages",      parentId: "fd-fe-pages" },
  { id: "fd-pages-dash",    name: "Dashboard",       parentId: "fd-fe-pages" },
  { id: "fd-pages-profile", name: "Profile",         parentId: "fd-fe-pages" },
  { id: "fd-hooks-data",    name: "Data Fetching",   parentId: "fd-fe-hooks" },
  { id: "fd-hooks-ui",      name: "UI State",        parentId: "fd-fe-hooks" },
  { id: "fd-tests-unit",    name: "Unit Tests",      parentId: "fd-fe-tests" },
  { id: "fd-tests-e2e",     name: "E2E Tests",       parentId: "fd-fe-tests" },

  // ── Level 4: under UX Research ──────────────────────────────────────────────
  { id: "fd-int-2026",      name: "2026 Sessions",   parentId: "fd-ux-interviews" },
  { id: "fd-int-2025",      name: "2025 Sessions",   parentId: "fd-ux-interviews" },
  { id: "fd-int-raw",       name: "Raw Recordings",  parentId: "fd-ux-interviews" },
  { id: "fd-usa-moderated", name: "Moderated",       parentId: "fd-ux-usability" },
  { id: "fd-usa-unmod",     name: "Unmoderated",     parentId: "fd-ux-usability" },
  { id: "fd-usa-reports",   name: "Reports",         parentId: "fd-ux-usability" },
  { id: "fd-sur-quant",     name: "Quantitative",    parentId: "fd-ux-surveys" },
  { id: "fd-sur-qual",      name: "Qualitative",     parentId: "fd-ux-surveys" },
  { id: "fd-per-b2c",       name: "B2C Personas",    parentId: "fd-ux-personas" },
  { id: "fd-per-b2b",       name: "B2B Personas",    parentId: "fd-ux-personas" },
  { id: "fd-jrn-current",   name: "Current State",   parentId: "fd-ux-journeys" },
  { id: "fd-jrn-future",    name: "Future State",    parentId: "fd-ux-journeys" },

  // ── Level 4: under Finance ──────────────────────────────────────────────────
  { id: "fd-bud-2026",      name: "FY2026",          parentId: "fd-fin-budgets" },
  { id: "fd-bud-2025",      name: "FY2025",          parentId: "fd-fin-budgets" },
  { id: "fd-bud-dept",      name: "By Department",   parentId: "fd-fin-budgets" },
  { id: "fd-rep-quarterly", name: "Quarterly",       parentId: "fd-fin-reports" },
  { id: "fd-rep-annual",    name: "Annual",          parentId: "fd-fin-reports" },
  { id: "fd-rep-board",     name: "Board Reports",   parentId: "fd-fin-reports" },
  { id: "fd-inv-2026",      name: "2026",            parentId: "fd-fin-invoices" },
  { id: "fd-inv-2025",      name: "2025",            parentId: "fd-fin-invoices" },
  { id: "fd-tax-corp",      name: "Corporate",       parentId: "fd-fin-tax" },
  { id: "fd-tax-intl",      name: "International",   parentId: "fd-fin-tax" },
  { id: "fd-aud-internal",  name: "Internal",        parentId: "fd-fin-audits" },
  { id: "fd-aud-external",  name: "External",        parentId: "fd-fin-audits" },

  // ── Level 4: under HR ───────────────────────────────────────────────────────
  { id: "fd-pol-code",      name: "Code of Conduct", parentId: "fd-hr-policies" },
  { id: "fd-pol-leave",     name: "Leave Policies",  parentId: "fd-hr-policies" },
  { id: "fd-pol-remote",    name: "Remote Work",     parentId: "fd-hr-policies" },
  { id: "fd-onb-eng",       name: "Engineering",     parentId: "fd-hr-onboarding" },
  { id: "fd-onb-design",    name: "Design",          parentId: "fd-hr-onboarding" },
  { id: "fd-onb-sales",     name: "Sales",           parentId: "fd-hr-onboarding" },
  { id: "fd-trn-technical", name: "Technical",       parentId: "fd-hr-training" },
  { id: "fd-trn-soft",      name: "Soft Skills",     parentId: "fd-hr-training" },
  { id: "fd-trn-compliance",name: "Compliance",      parentId: "fd-hr-training" },
  { id: "fd-ben-health",    name: "Health & Dental", parentId: "fd-hr-benefits" },
  { id: "fd-ben-401k",      name: "401k & Pension",  parentId: "fd-hr-benefits" },
  { id: "fd-ben-perks",     name: "Perks & Extras",  parentId: "fd-hr-benefits" },

  // ── Level 5: deep examples ──────────────────────────────────────────────────
  { id: "fd-oauth-flows",   name: "Auth Flows",      parentId: "fd-auth-oauth" },
  { id: "fd-oauth-tokens",  name: "Token Design",    parentId: "fd-auth-oauth" },
  { id: "fd-oauth-pkce",    name: "PKCE Specs",      parentId: "fd-auth-oauth" },
  { id: "fd-sso-saml",      name: "SAML",            parentId: "fd-auth-sso" },
  { id: "fd-sso-oidc",      name: "OIDC",            parentId: "fd-auth-sso" },
  { id: "fd-checkout-web",  name: "Web",             parentId: "fd-pay-checkout" },
  { id: "fd-checkout-app",  name: "Mobile App",      parentId: "fd-pay-checkout" },
  { id: "fd-checkout-intl", name: "International",   parentId: "fd-pay-checkout" },
  { id: "fd-q1aw-display",  name: "Display Ads",     parentId: "fd-q1-awareness" },
  { id: "fd-q1aw-video",    name: "Video Ads",       parentId: "fd-q1-awareness" },
  { id: "fd-q1aw-social",   name: "Social",          parentId: "fd-q1-awareness" },
  { id: "fd-comp-ui-btn",   name: "Buttons",         parentId: "fd-comp-ui" },
  { id: "fd-comp-ui-form",  name: "Form Controls",   parentId: "fd-comp-ui" },
  { id: "fd-comp-ui-modal", name: "Modals & Dialogs",parentId: "fd-comp-ui" },
  { id: "fd-comp-ui-nav",   name: "Navigation",      parentId: "fd-comp-ui" },
  { id: "fd-int26-q1",      name: "Q1 Sessions",     parentId: "fd-int-2026" },
  { id: "fd-int26-q2",      name: "Q2 Sessions",     parentId: "fd-int-2026" },
  { id: "fd-int26-q3",      name: "Q3 Sessions",     parentId: "fd-int-2026" },

  // ── Team Drive root folders (level 1) ──────────────────────────────────────
  { id: "td-design",        name: "Team Design",              parentId: "td-root" },
  { id: "td-dev",           name: "Dev Team Folder",          parentId: "td-root" },
  { id: "td-q4-goals",      name: "Q4 Goals 2026",            parentId: "td-root" },
  { id: "td-launch",        name: "Product Launch-2026",      parentId: "td-root" },
  { id: "td-q3-review",     name: "Quarterly Review-Q3",      parentId: "td-root" },
  { id: "td-mkt-strategy",  name: "Q3 Marketing Strategy",    parentId: "td-root" },
  { id: "td-brand",         name: "Brand Guidelines v2.0",    parentId: "td-root" },
  { id: "td-knowledge",     name: "Knowledge Base",           parentId: "td-root" },
  { id: "td-onboarding",    name: "Team Onboarding Docs",     parentId: "td-root" },
  { id: "td-events",        name: "Company Events 2026",      parentId: "td-root" },

  // ── Level 2: under Team Design ──────────────────────────────────────────────
  { id: "td-design-ux",     name: "UX Research",              parentId: "td-design" },
  { id: "td-design-sys",    name: "Design System Library",    parentId: "td-design" },
  { id: "td-design-plan",   name: "Cross-functional Planning",parentId: "td-design" },

  // ── Level 2: under Dev Team Folder ──────────────────────────────────────────
  { id: "td-dev-roadmap",   name: "Engineering Roadmap",      parentId: "td-dev" },
  { id: "td-dev-backend",   name: "Backend Services",         parentId: "td-dev" },
  { id: "td-dev-frontend",  name: "Frontend",                 parentId: "td-dev" },

  // ── Level 2: under Q3 Marketing Strategy ────────────────────────────────────
  { id: "td-mkt-campaigns", name: "Campaigns",                parentId: "td-mkt-strategy" },
  { id: "td-mkt-content",   name: "Content Calendar",         parentId: "td-mkt-strategy" },
  { id: "td-mkt-analytics", name: "Analytics",                parentId: "td-mkt-strategy" },

  // ── Level 3: under UX Research ──────────────────────────────────────────────
  { id: "td-ux-q3",         name: "Q3 Findings",              parentId: "td-design-ux" },
  { id: "td-ux-archive",    name: "Archive 2025",             parentId: "td-design-ux" },
  { id: "td-ux-personas",   name: "Personas",                 parentId: "td-design-ux" },

  // ── Level 3: under Engineering Roadmap ──────────────────────────────────────
  { id: "td-road-q4",       name: "Q4 2026",                  parentId: "td-dev-roadmap" },
  { id: "td-road-q3",       name: "Q3 2026",                  parentId: "td-dev-roadmap" },
  { id: "td-road-backlog",  name: "Backlog",                  parentId: "td-dev-roadmap" },

  // ── Level 3: under Campaigns ────────────────────────────────────────────────
  { id: "td-camp-sept",     name: "September",                parentId: "td-mkt-campaigns" },
  { id: "td-camp-oct",      name: "October",                  parentId: "td-mkt-campaigns" },
  { id: "td-camp-partner",  name: "Partner Campaigns",        parentId: "td-mkt-campaigns" },

  // ── Level 4: under Q3 Findings ──────────────────────────────────────────────
  { id: "td-q3f-reports",   name: "Reports",                  parentId: "td-ux-q3" },
  { id: "td-q3f-surveys",   name: "Surveys",                  parentId: "td-ux-q3" },
  { id: "td-q3f-raw",       name: "Raw Data",                 parentId: "td-ux-q3" },

  // ── Level 4: under Q4 2026 (roadmap) ────────────────────────────────────────
  { id: "td-q4r-sprints",   name: "Sprint Plans",             parentId: "td-road-q4" },
  { id: "td-q4r-miles",     name: "Milestones",               parentId: "td-road-q4" },
  { id: "td-q4r-retro",     name: "Retrospectives",           parentId: "td-road-q4" },

  // ── Level 4: under September campaigns ──────────────────────────────────────
  { id: "td-sept-social",   name: "Social Media",             parentId: "td-camp-sept" },
  { id: "td-sept-email",    name: "Email",                    parentId: "td-camp-sept" },
  { id: "td-sept-display",  name: "Display Ads",              parentId: "td-camp-sept" },

  // ── Trashed folders (generated by withMinimumItems from trashItems) ─────────
  // "trash-root" is a virtual parent, like "td-root", so these don't leak into My Drive's root listing.
  { id: "trash-root", name: "Trash",         parentId: null },
  { id: "trash-1",     name: "Old Data",     parentId: "trash-root" },
  { id: "trash-7",     name: "Old Data (2)", parentId: "trash-root" },
  { id: "trash-13",    name: "Old Data (3)", parentId: "trash-root" },
  { id: "trash-19",    name: "Old Data (4)", parentId: "trash-root" },
  { id: "trash-25",    name: "Old Data (5)", parentId: "trash-root" },
];

const FILE_TEMPLATES: Omit<DriveItem, "id">[] = [
  { name: "Project Overview.pptx",      type: "ppt",   modified: "Sep 10, 2026", size: "8.4 MB",  owner: people[0].owner, ownerInitials: people[0].ownerInitials, ownerColor: people[0].ownerColor, ownerAvatar: people[0].ownerAvatar, location: "My Drive" },
  { name: "Requirements Doc.docx",      type: "word",  modified: "Sep 8, 2026",  size: "1.2 MB",  owner: people[1].owner, ownerInitials: people[1].ownerInitials, ownerColor: people[1].ownerColor, ownerAvatar: people[1].ownerAvatar, location: "My Drive" },
  { name: "Budget Tracker.xlsx",        type: "excel", modified: "Sep 5, 2026",  size: "2.8 MB",  owner: people[2].owner, ownerInitials: people[2].ownerInitials, ownerColor: people[2].ownerColor, ownerAvatar: people[2].ownerAvatar, location: "My Drive" },
  { name: "Design Specs.pdf",           type: "pdf",   modified: "Sep 3, 2026",  size: "5.6 MB",  owner: people[3].owner, ownerInitials: people[3].ownerInitials, ownerColor: people[3].ownerColor, ownerAvatar: people[3].ownerAvatar, location: "My Drive" },
  { name: "Meeting Notes Sep.docx",     type: "word",  modified: "Sep 1, 2026",  size: "340 KB",  owner: people[4].owner, ownerInitials: people[4].ownerInitials, ownerColor: people[4].ownerColor, ownerAvatar: people[4].ownerAvatar, location: "My Drive" },
  { name: "Brand Kit.zip",              type: "zip",   modified: "Aug 28, 2026", size: "48.2 MB", owner: people[5].owner, ownerInitials: people[5].ownerInitials, ownerColor: people[5].ownerColor, ownerAvatar: people[5].ownerAvatar, location: "My Drive" },
  { name: "Hero Banner.png",            type: "image", modified: "Aug 25, 2026", size: "3.1 MB",  owner: people[6].owner, ownerInitials: people[6].ownerInitials, ownerColor: people[6].ownerColor, ownerAvatar: people[6].ownerAvatar, location: "My Drive", thumbnail: sampleMediaThumbnails[6] },
  { name: "Campaign Video.mp4",         type: "video", modified: "Aug 20, 2026", size: "210 MB",  owner: people[7].owner, ownerInitials: people[7].ownerInitials, ownerColor: people[7].ownerColor, ownerAvatar: people[7].ownerAvatar, location: "My Drive", thumbnail: sampleMediaThumbnails[7] },
  { name: "Analytics Report Q3.pdf",    type: "pdf",   modified: "Aug 18, 2026", size: "7.3 MB",  owner: people[8].owner, ownerInitials: people[8].ownerInitials, ownerColor: people[8].ownerColor, ownerAvatar: people[8].ownerAvatar, location: "My Drive" },
  { name: "Style Guide v2.pdf",         type: "pdf",   modified: "Aug 15, 2026", size: "11.4 MB", owner: people[9].owner, ownerInitials: people[9].ownerInitials, ownerColor: people[9].ownerColor, ownerAvatar: people[9].ownerAvatar, location: "My Drive" },
  { name: "Roadmap 2026.pptx",          type: "ppt",   modified: "Aug 12, 2026", size: "6.9 MB",  owner: people[0].owner, ownerInitials: people[0].ownerInitials, ownerColor: people[0].ownerColor, ownerAvatar: people[0].ownerAvatar, location: "My Drive" },
  { name: "User Research Results.xlsx", type: "excel", modified: "Aug 10, 2026", size: "1.7 MB",  owner: people[1].owner, ownerInitials: people[1].ownerInitials, ownerColor: people[1].ownerColor, ownerAvatar: people[1].ownerAvatar, location: "My Drive" },
  { name: "Wireframes Final.pdf",       type: "pdf",   modified: "Aug 7, 2026",  size: "4.2 MB",  owner: people[2].owner, ownerInitials: people[2].ownerInitials, ownerColor: people[2].ownerColor, ownerAvatar: people[2].ownerAvatar, location: "My Drive" },
  { name: "Icon Library.zip",           type: "zip",   modified: "Aug 5, 2026",  size: "22.7 MB", owner: people[3].owner, ownerInitials: people[3].ownerInitials, ownerColor: people[3].ownerColor, ownerAvatar: people[3].ownerAvatar, location: "My Drive" },
  { name: "Onboarding Deck.pptx",       type: "ppt",   modified: "Aug 1, 2026",  size: "3.4 MB",  owner: people[4].owner, ownerInitials: people[4].ownerInitials, ownerColor: people[4].ownerColor, ownerAvatar: people[4].ownerAvatar, location: "My Drive" },
  { name: "Competitor Analysis.docx",   type: "word",  modified: "Jul 28, 2026", size: "2.1 MB",  owner: people[5].owner, ownerInitials: people[5].ownerInitials, ownerColor: people[5].ownerColor, ownerAvatar: people[5].ownerAvatar, location: "My Drive" },
  { name: "Performance Dashboard.xlsx", type: "excel", modified: "Jul 24, 2026", size: "4.5 MB",  owner: people[6].owner, ownerInitials: people[6].ownerInitials, ownerColor: people[6].ownerColor, ownerAvatar: people[6].ownerAvatar, location: "My Drive" },
  { name: "Product Photos.zip",         type: "zip",   modified: "Jul 20, 2026", size: "87.3 MB", owner: people[7].owner, ownerInitials: people[7].ownerInitials, ownerColor: people[7].ownerColor, ownerAvatar: people[7].ownerAvatar, location: "My Drive" },
  { name: "Legal Review Notes.docx",    type: "word",  modified: "Jul 15, 2026", size: "560 KB",  owner: people[8].owner, ownerInitials: people[8].ownerInitials, ownerColor: people[8].ownerColor, ownerAvatar: people[8].ownerAvatar, location: "My Drive" },
  { name: "Q2 KPI Summary.xlsx",        type: "excel", modified: "Jul 10, 2026", size: "1.3 MB",  owner: people[9].owner, ownerInitials: people[9].ownerInitials, ownerColor: people[9].ownerColor, ownerAvatar: people[9].ownerAvatar, location: "My Drive" },
];

function buildFolderItems(folderId: string): DriveItem[] {
  const children = folderTree.filter(f => f.parentId === folderId);
  const subfolderItems: DriveItem[] = children.map((child, i) => ({
    id: `${child.id}-item`,
    name: child.name,
    type: "folder" as const,
    modified: "Sep 1, 2026",
    size: "—",
    owner: people[i % people.length].owner,
    ownerInitials: people[i % people.length].ownerInitials,
    ownerColor: people[i % people.length].ownerColor,
    ownerAvatar: people[i % people.length].ownerAvatar,
    location: "My Drive",
    parentId: folderId,
  }));
  const fileItems: DriveItem[] = FILE_TEMPLATES.map((tpl, i) => ({
    ...tpl,
    id: `${folderId}-file-${i + 1}`,
    parentId: folderId,
  }));
  return [...subfolderItems, ...fileItems];
}

export function getFolderItems(folderId: string): DriveItem[] {
  return buildFolderItems(folderId);
}

export function getFolderBreadcrumb(folderId: string): FolderNode[] {
  const crumbs: FolderNode[] = [];
  let current: FolderNode | undefined = folderTree.find(f => f.id === folderId);
  while (current) {
    crumbs.unshift(current);
    current = current.parentId ? folderTree.find(f => f.id === current!.parentId) : undefined;
  }
  return crumbs;
}

export const allFolderIds = folderTree.map(f => f.id).filter(id => id !== "td-root" && id !== "trash-root");

export const myDriveFolders: DriveItem[] = folderTree
  .filter(f => f.parentId === null && f.id !== "td-root" && f.id !== "trash-root")
  .map((f, i) => ({
    id: f.id,
    name: f.name,
    type: "folder" as const,
    modified: "Sep 1, 2026",
    size: "—",
    owner: people[i % people.length].owner,
    ownerInitials: people[i % people.length].ownerInitials,
    ownerColor: people[i % people.length].ownerColor,
    ownerAvatar: people[i % people.length].ownerAvatar,
    location: "My Drive",
  }));

export function getAllFolderFileItems(): DriveItem[] {
  return allFolderIds.flatMap(id => buildFolderItems(id).filter(item => item.type !== "folder"));
}
