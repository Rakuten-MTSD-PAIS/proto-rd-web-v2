import { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

function makeIcon(paths: React.ReactNode, viewBox = "0 0 16 16") {
  return function Icon({ size = 16, className, width, height, ...props }: IconProps) {
    return (
      <svg
        width={width ?? size}
        height={height ?? size}
        viewBox={viewBox}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        {...props}
      >
        {paths}
      </svg>
    );
  };
}

// Navigation icons — extracted from Rakuten Drive reference code (svg-icon.svg)

export const ClockIcon = makeIcon(
  <>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M8 2C4.686 2 2 4.686 2 8s2.686 6 6 6 6-2.686 6-6-2.686-6-6-6zM1 8C1 4.134 4.134 1 8 1s7 3.134 7 7-3.134 7-7 7S1 11.866 1 8z"
      fill="currentColor"
    />
    <path
      d="M8.5 4.5v3.793l2.354 2.353-.707.708L7.5 9V4.5h1z"
      fill="currentColor"
    />
  </>
);

export const FolderIcon = makeIcon(
  <>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M1 4.5A1.5 1.5 0 012.5 3H6l1 1.5h6.5A1.5 1.5 0 0115 6v7a1.5 1.5 0 01-1.5 1.5h-11A1.5 1.5 0 011 13V4.5zm1.5-.5a.5.5 0 00-.5.5V13a.5.5 0 00.5.5h11a.5.5 0 00.5-.5V6a.5.5 0 00-.5-.5H6.586L5.586 4H2.5z"
      fill="currentColor"
    />
  </>
);

export const FolderSharedIcon = makeIcon(
  <>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M1 4.5A1.5 1.5 0 012.5 3H6l1 1.5h6.5A1.5 1.5 0 0115 6v7a1.5 1.5 0 01-1.5 1.5h-11A1.5 1.5 0 011 13V4.5zm1.5-.5a.5.5 0 00-.5.5V13a.5.5 0 00.5.5h11a.5.5 0 00.5-.5V6a.5.5 0 00-.5-.5H6.586L5.586 4H2.5z"
      fill="currentColor"
    />
    <path
      d="M7.5 9.5a1.5 1.5 0 100-3 1.5 1.5 0 000 3zm-2.5 2.5c0-1.38 1.12-2.5 2.5-2.5s2.5 1.12 2.5 2.5H5z"
      fill="currentColor"
    />
  </>
);

export const ShareIcon = makeIcon(
  <>
    <circle cx="12" cy="4" r="1.5" fill="currentColor" />
    <circle cx="4" cy="8" r="1.5" fill="currentColor" />
    <circle cx="12" cy="12" r="1.5" fill="currentColor" />
    <path
      d="M5.3 7.4l5.4-2.8M5.3 8.6l5.4 2.8"
      stroke="currentColor"
      strokeWidth="1.1"
      strokeLinecap="round"
    />
  </>
);

export const StarIcon = makeIcon(
  <>
    <path
      d="M8 1.5l1.796 3.64 4.017.585-2.907 2.831.686 3.999L8 10.647l-3.592 1.908.686-4L2.187 5.725l4.017-.585L8 1.5z"
      stroke="currentColor"
      strokeWidth="1.1"
      strokeLinejoin="round"
      fill="none"
    />
  </>
);

export const TrashIcon = makeIcon(
  <>
    <path
      d="M6 1h4M1.5 3h13M4.5 3l.5 10h7l.5-10M6.5 6v5M9.5 6v5"
      stroke="currentColor"
      strokeWidth="1.1"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </>
);

// Upload icon — arrow up with base (from svg-icon.svg y≈317)
export const UploadIcon = makeIcon(
  <>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M10.286 8.96H5.714V4.48H3.429L7.586.322A.578.578 0 018 .134c.156 0 .314.063.427.188L12.571 4.48H10.286V8.96z"
      fill="currentColor"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M14.857 10.08v2.8H1.143v-2.8H0v2.8C0 13.497.514 14 1.143 14h13.714C15.486 14 16 13.497 16 12.88v-2.8h-1.143z"
      fill="currentColor"
    />
    <path d="M5.714 11.2h4.572v-1.12H5.714v1.12z" fill="currentColor" />
  </>
);

// Create folder / add folder icon
export const FolderPlusIcon = makeIcon(
  <>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M1 4.5A1.5 1.5 0 012.5 3H6l1 1.5h6.5A1.5 1.5 0 0115 6v7a1.5 1.5 0 01-1.5 1.5h-11A1.5 1.5 0 011 13V4.5zm1.5-.5a.5.5 0 00-.5.5V13a.5.5 0 00.5.5h11a.5.5 0 00.5-.5V6a.5.5 0 00-.5-.5H6.586L5.586 4H2.5z"
      fill="currentColor"
    />
    <path
      d="M8.5 8v3M7 9.5h3"
      stroke="currentColor"
      strokeWidth="1.1"
      strokeLinecap="round"
    />
  </>
);

export const SearchIcon = makeIcon(
  <>
    <circle cx="7" cy="7" r="4.5" stroke="currentColor" strokeWidth="1.2" />
    <path d="M10.5 10.5L14 14" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
  </>
);

export const ChevronDownIcon = makeIcon(
  <>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M2.47 5.22a.75.75 0 011.06 0L8 9.69l4.47-4.47a.75.75 0 111.06 1.06l-5 5a.75.75 0 01-1.06 0l-5-5a.75.75 0 010-1.06z"
      fill="currentColor"
    />
  </>
);

export const ChevronLeftIcon = makeIcon(
  <>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M10.78 2.47a.75.75 0 010 1.06L6.31 8l4.47 4.47a.75.75 0 11-1.06 1.06l-5-5a.75.75 0 010-1.06l5-5a.75.75 0 011.06 0z"
      fill="currentColor"
    />
  </>
);

export const ChevronRightIcon = makeIcon(
  <>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M5.22 2.47a.75.75 0 011.06 0l5 5a.75.75 0 010 1.06l-5 5a.75.75 0 11-1.06-1.06L9.69 8 5.22 3.53a.75.75 0 010-1.06z"
      fill="currentColor"
    />
  </>
);

// List view icon — from reference code svg list-outline paths
export const ListIcon = makeIcon(
  <>
    <path d="M2 3.5h12M2 7h12M2 10.5h12M2 14h12" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
  </>
);

// Grid view icon
export const GridIcon = makeIcon(
  <>
    <rect x="1.5" y="1.5" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.2" />
    <rect x="9.5" y="1.5" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.2" />
    <rect x="1.5" y="9.5" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.2" />
    <rect x="9.5" y="9.5" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.2" />
  </>
);

// Three dots vertical (more menu) — from reference code svg y≈567
export const MoreVerticalIcon = makeIcon(
  <>
    <circle cx="8" cy="3" r="1.3" fill="currentColor" />
    <circle cx="8" cy="8" r="1.3" fill="currentColor" />
    <circle cx="8" cy="13" r="1.3" fill="currentColor" />
  </>
);

export const SortIcon = makeIcon(
  <>
    <path d="M3 5h10M5 8h6M7 11h2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
  </>
);

// Send icon (paper airplane) — from reference code svg y≈241
export const SendIcon = makeIcon(
  <>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M14.864 1C14.783 1 14.7.01 14.616.03L.903.396C-.059.632-.327 2.06.465 2.729L2.004 4.027l1.11-.668L1.143 1.746 12.862 1 4.133 5.2l-.002-.002-.703.434V14l3.636-3.014 2.705 2.219c.207.17.443.248.676.248.43 0 .85-.277 1.043-.757L15.897 1.847C16.246.958 15.66 1 14.864 1z"
      fill="currentColor"
    />
  </>
);

// Link icon
export const LinkIcon = makeIcon(
  <>
    <path
      d="M6.5 9.5l-1 1A2.828 2.828 0 009.5 14.5l3-3a2.828 2.828 0 000-4L10.5 9.5"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
    />
    <path
      d="M9.5 6.5l1-1A2.828 2.828 0 006.5 1.5l-3 3a2.828 2.828 0 000 4L5.5 6.5"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
    />
    <path d="M6.5 9.5l3-3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
  </>
);

// Inbox icon
export const InboxIcon = makeIcon(
  <>
    <path
      d="M1 10l2-7h10l2 7H1z"
      stroke="currentColor"
      strokeWidth="1.1"
      strokeLinejoin="round"
    />
    <path
      d="M1 10v3h14v-3"
      stroke="currentColor"
      strokeWidth="1.1"
      strokeLinejoin="round"
    />
    <path d="M5.5 12a2.5 2.5 0 005 0" stroke="currentColor" strokeWidth="1.1" />
  </>
);

// Transfer icon (two arrows)
export const TransferIcon = makeIcon(
  <>
    <path d="M3 5l3-3 3 3M6 2v9" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M13 11l-3 3-3-3M10 14V5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
  </>
);

// --- File type icons ---

export const FileIcon = makeIcon(
  <>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M3 2a1 1 0 011-1h5.586a1 1 0 01.707.293l3.414 3.414A1 1 0 0114 5.414V14a1 1 0 01-1 1H4a1 1 0 01-1-1V2zm1 0v12h9V6H8a1 1 0 01-1-1V2H4zm4 0v3h3.586L8 2z"
      fill="currentColor"
    />
  </>
);

export const FilePdfIcon = makeIcon(
  <>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M3 2a1 1 0 011-1h5.586a1 1 0 01.707.293l3.414 3.414A1 1 0 0114 5.414V14a1 1 0 01-1 1H4a1 1 0 01-1-1V2zm1 0v12h9V6H8a1 1 0 01-1-1V2H4zm4 0v3h3.586L8 2z"
      fill="#C10503"
      fillOpacity="0.8"
    />
    <rect x="4" y="9" width="8" height="3" rx="0.5" fill="#C10503" fillOpacity="0.15" />
    <text x="5" y="11.5" fontSize="2.5" fontWeight="700" fill="#C10503">PDF</text>
  </>
);

export const FileExcelIcon = makeIcon(
  <>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M3 2a1 1 0 011-1h5.586a1 1 0 01.707.293l3.414 3.414A1 1 0 0114 5.414V14a1 1 0 01-1 1H4a1 1 0 01-1-1V2zm1 0v12h9V6H8a1 1 0 01-1-1V2H4zm4 0v3h3.586L8 2z"
      fill="#3D8A58"
      fillOpacity="0.6"
    />
    <rect x="3" y="8" width="5" height="6" rx="0.5" fill="#3D8A58" />
    <text x="3.8" y="12.5" fontSize="2.8" fontWeight="700" fill="white">X</text>
  </>
);

export const FileWordIcon = makeIcon(
  <>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M3 2a1 1 0 011-1h5.586a1 1 0 01.707.293l3.414 3.414A1 1 0 0114 5.414V14a1 1 0 01-1 1H4a1 1 0 01-1-1V2zm1 0v12h9V6H8a1 1 0 01-1-1V2H4zm4 0v3h3.586L8 2z"
      fill="#3770C3"
      fillOpacity="0.6"
    />
    <rect x="3" y="8" width="5" height="6" rx="0.5" fill="#3770C3" />
    <text x="3.5" y="12.5" fontSize="2.5" fontWeight="700" fill="white">W</text>
  </>
);

export const FilePptIcon = makeIcon(
  <>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M3 2a1 1 0 011-1h5.586a1 1 0 01.707.293l3.414 3.414A1 1 0 0114 5.414V14a1 1 0 01-1 1H4a1 1 0 01-1-1V2zm1 0v12h9V6H8a1 1 0 01-1-1V2H4zm4 0v3h3.586L8 2z"
      fill="#C25B33"
      fillOpacity="0.6"
    />
    <rect x="3" y="8" width="5" height="6" rx="0.5" fill="#C25B33" />
    <text x="3.8" y="12.5" fontSize="2.8" fontWeight="700" fill="white">P</text>
  </>
);

export const FileImageIcon = makeIcon(
  <>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M3 2a1 1 0 011-1h5.586a1 1 0 01.707.293l3.414 3.414A1 1 0 0114 5.414V14a1 1 0 01-1 1H4a1 1 0 01-1-1V2zm1 0v12h9V6H8a1 1 0 01-1-1V2H4zm4 0v3h3.586L8 2z"
      fill="#7D00BE"
      fillOpacity="0.5"
    />
    <circle cx="6.5" cy="9" r="1" fill="#7D00BE" />
    <path d="M4 14l3.5-4 2 2.5 1.5-1.5 3 3H4z" fill="#7D00BE" fillOpacity="0.7" />
  </>
);

export const FileVideoIcon = makeIcon(
  <>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M3 2a1 1 0 011-1h5.586a1 1 0 01.707.293l3.414 3.414A1 1 0 0114 5.414V14a1 1 0 01-1 1H4a1 1 0 01-1-1V2zm1 0v12h9V6H8a1 1 0 01-1-1V2H4zm4 0v3h3.586L8 2z"
      fill="#FF41BE"
      fillOpacity="0.5"
    />
    <path d="M5.5 8.5v3l4-1.5-4-1.5z" fill="#FF41BE" />
  </>
);

export const FileAudioIcon = makeIcon(
  <>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M3 2a1 1 0 011-1h5.586a1 1 0 01.707.293l3.414 3.414A1 1 0 0114 5.414V14a1 1 0 01-1 1H4a1 1 0 01-1-1V2zm1 0v12h9V6H8a1 1 0 01-1-1V2H4zm4 0v3h3.586L8 2z"
      fill="#FF41BE"
      fillOpacity="0.5"
    />
    <path
      d="M8 8v3M6.5 9.5v1M9.5 9.5v1M5 10.5v0.5M11 10.5v0.5"
      stroke="#FF41BE"
      strokeWidth="1.1"
      strokeLinecap="round"
    />
  </>
);

export const FileZipIcon = makeIcon(
  <>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M3 2a1 1 0 011-1h5.586a1 1 0 01.707.293l3.414 3.414A1 1 0 0114 5.414V14a1 1 0 01-1 1H4a1 1 0 01-1-1V2zm1 0v12h9V6H8a1 1 0 01-1-1V2H4zm4 0v3h3.586L8 2z"
      fill="#7D00BE"
      fillOpacity="0.5"
    />
    <path
      d="M7 2h2v2H7V2zM7 4h2v2H7V4zM7 6h2v2H7V6zM7 8h2v2H7V8z"
      fill="#7D00BE"
      fillOpacity="0.6"
    />
    <rect x="6.5" y="10" width="3" height="3" rx="0.5" fill="#7D00BE" />
  </>
);

// Filled folder for folder cards
export const FolderFillIcon = makeIcon(
  <>
    <path
      d="M1 4.5A1.5 1.5 0 012.5 3H6l1 1.5h6.5A1.5 1.5 0 0115 6v7a1.5 1.5 0 01-1.5 1.5h-11A1.5 1.5 0 011 13V4.5z"
      fill="currentColor"
    />
  </>
);

export const RDIcons = {
  ClockIcon,
  FolderIcon,
  FolderSharedIcon,
  ShareIcon,
  StarIcon,
  TrashIcon,
  UploadIcon,
  FolderPlusIcon,
  SearchIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ListIcon,
  GridIcon,
  MoreVerticalIcon,
  SortIcon,
  SendIcon,
  LinkIcon,
  InboxIcon,
  TransferIcon,
  FileIcon,
  FilePdfIcon,
  FileExcelIcon,
  FileWordIcon,
  FilePptIcon,
  FileImageIcon,
  FileVideoIcon,
  FileAudioIcon,
  FileZipIcon,
  FolderFillIcon,
};
