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
  <path
    fillRule="evenodd"
    clipRule="evenodd"
    d="M3.07692 6.92308C4.00154 6.92308 4.82231 7.33923 5.38539 7.98538L13.9162 3.72077C13.8715 3.51231 13.8462 3.29769 13.8462 3.07692C13.8462 1.37769 15.2238 0 16.9231 0C18.6223 0 20 1.37769 20 3.07692C20 4.77615 18.6223 6.15385 16.9231 6.15385C15.9985 6.15385 15.1785 5.73769 14.6146 5.09154L6.08385 9.35615C6.12846 9.56462 6.15385 9.77923 6.15385 10C6.15385 10.2208 6.12846 10.4354 6.08385 10.6438L14.6146 14.9085C15.1777 14.2631 15.9985 13.8462 16.9231 13.8462C18.6223 13.8462 20 15.2238 20 16.9231C20 18.6223 18.6223 20 16.9231 20C15.2238 20 13.8462 18.6223 13.8462 16.9231C13.8462 16.7023 13.8715 16.4877 13.9162 16.2792L5.38539 12.0146C4.82154 12.66 4.00154 13.0769 3.07692 13.0769C1.37769 13.0769 0 11.6992 0 10C0 8.30077 1.37769 6.92308 3.07692 6.92308Z"
    fill="currentColor"
  />,
  "0 0 20 20"
);

export const ShareLineIcon = makeIcon(
  <path
    fillRule="evenodd"
    clipRule="evenodd"
    d="M14.6154 16.5385C14.6154 15.4777 15.4777 14.6154 16.5385 14.6154C17.5992 14.6154 18.4615 15.4777 18.4615 16.5385C18.4615 17.5992 17.5992 18.4615 16.5385 18.4615C15.4777 18.4615 14.6154 17.5992 14.6154 16.5385ZM1.53846 10C1.53846 8.94 2.40077 8.07692 3.46154 8.07692C4.52231 8.07692 5.38462 8.94 5.38462 10C5.38462 11.0608 4.52231 11.9231 3.46154 11.9231C2.40077 11.9231 1.53846 11.0608 1.53846 10ZM14.6154 3.46154C14.6154 2.40154 15.4777 1.53846 16.5385 1.53846C17.5992 1.53846 18.4615 2.40154 18.4615 3.46154C18.4615 4.52154 17.5992 5.38462 16.5385 5.38462C15.4777 5.38462 14.6154 4.52154 14.6154 3.46154ZM0 10C0 11.9115 1.55 13.4615 3.46154 13.4615C4.47385 13.4615 5.37615 13.0192 6.00923 12.3262L13.1423 15.8923C13.1023 16.1023 13.0769 16.3169 13.0769 16.5385C13.0769 18.45 14.6269 20 16.5385 20C18.45 20 20 18.45 20 16.5385C20 14.6269 18.45 13.0769 16.5385 13.0769C15.3992 13.0769 14.3969 13.6354 13.7662 14.4846L6.76385 10.9831C6.85769 10.67 6.92308 10.3438 6.92308 10C6.92308 9.65615 6.85769 9.33 6.76385 9.01692L13.7662 5.51539C14.3969 6.36539 15.3992 6.92308 16.5385 6.92308C18.45 6.92308 20 5.37308 20 3.46154C20 1.55 18.45 0 16.5385 0C14.6269 0 13.0769 1.55 13.0769 3.46154C13.0769 3.68308 13.1023 3.89769 13.1423 4.10692L6.00923 7.67385C5.37615 6.98077 4.47385 6.53846 3.46154 6.53846C1.55 6.53846 0 8.08846 0 10Z"
    fill="currentColor"
  />,
  "0 0 20 20"
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
  ShareLineIcon,
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
  StarFilledIcon,
};

export function StarFilledIcon({ size = 20, className, ...props }: { size?: number; className?: string } & SVGProps<SVGSVGElement>) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} {...props}>
      <path fillRule="evenodd" clipRule="evenodd" d="M19.2705 6.96135L13.3105 6.14294L10.7683 0.497858C10.4698 -0.165953 9.53061 -0.165953 9.23138 0.497858L6.69065 6.14294L0.729206 6.96135C0.038448 7.05596 -0.245394 7.90515 0.249214 8.39897L4.64453 12.7857L3.54301 19.003C3.41839 19.7099 4.17146 20.2429 4.79222 19.886L9.99983 16.8916L15.2082 19.886C15.829 20.2429 16.582 19.7099 16.4574 19.003L15.3559 12.7857L19.7504 8.39897C20.2458 7.90515 19.9612 7.05596 19.2705 6.96135Z" fill="currentColor" />
    </svg>
  );
}
