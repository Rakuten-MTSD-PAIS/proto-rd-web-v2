# Rakuten Drive prototype knowledge

This file is the working UI reference for AI changes to this prototype. It describes the implemented Drive experience and the reference screenshots supplied in this workspace. Treat it as the source of truth until direct Figma node data is available.

## Product and routes

The application is a desktop-first cloud-drive prototype. `/` redirects to `/drive/recent`. All Drive routes share one application shell.

| Route | Purpose | Main content pattern |
| --- | --- | --- |
| `/drive/recent` | Recently used files | Collapsible recent folders, a file-type filter, then files grouped by date |
| `/drive/my-drive` | Personal root | Toolbar, filters, and one unified folder/file table |
| `/drive/team-drive` | Shared team root | Toolbar, filters, folder cards, team file table |
| `/drive/shared` | Items others shared | Filters, folder cards, file table with owner and location |
| `/drive/starred` | Starred items | Filters, folder cards, file table with owner and location |
| `/drive/trash` | Deleted items | Empty-state message and destructive `Empty Trash` action |

The left navigation also reserves Transfer links for Send Files, My Link, and Received Link. These routes do not yet have page implementations.

## Shared app shell

### Sidebar

- Desktop: 260px wide pale-gray sidebar, with the Rakuten Drive mark, primary navigation, Transfer group, storage plan, and Upgrade Plan action.
- Tablet (`768px–1023px`): compact 64px icon rail; labels and storage card are hidden.
- Mobile (`<768px`): sidebar is an off-canvas menu opened by the header hamburger. A translucent backdrop closes it.
- Active nav: pale blue fill with `#002896` icon/text. Inactive icons use dark gray.
- Main navigation order: Recent, My Drive, Team Drive, Shared with Me, Starred, Trash.
- Transfer is expandable. The group stays below a divider.

### Header

- Pale-gray header surface, with the search field on the left and account controls on the right.
- Search placeholder: `Search files and folders`.
- Desktop account controls: white outlined English selector, white outlined notification button, white outlined profile selector with the cat avatar and chevron.
- The English selector and notification control use 48px hit areas. The profile selector uses a 32px rounded-square image within a 48px control.
- Mobile hides the language selector first; search remains the priority.
- Clicking the profile selector opens the account menu. Clicking the upload split-button chevron opens Upload Files / Upload Folder.

### Content surface

- The Drive shell background is `#F2F2F7`.
- Page content is white with rounded top corners (16px desktop, 12px mobile).
- Desktop content uses 24px padding. My Drive reduces this to 16px on small screens.

## List and table system

- Tables use 64px item rows and a 42px header row.
- Standard columns: checkbox, Name, Modified, Size, then optional Owner and Location, plus a fixed 152px action area.
- Header text: 14px regular, gray (`#636366`). File names: 16px, near-black (`#18181A`). Metadata: 14px gray.
- File type icons are 32px. Folders are blue; documents retain type-specific icons.
- Every item row has a 1px `#E5E5EA` bottom divider.
- On hover or keyboard focus, rows get a very pale background and reveal Download, Share, Star, and More actions at the right. The action slot is always reserved; never replace the location text or shift columns on hover.
- Hover controls use a 150ms opacity/translate/filter transition and have 32px target areas. Press feedback scales to `0.96`.
- Checkboxes become visible on hover/focus. Header checkboxes select all conceptually; functional selection persistence is not implemented yet.

## Page-specific reference

### My Drive

- Header: `My Drive`, Create Folder action, Upload split button.
- Filter row: Type, People, Modified and list/grid segmented control.
- Current default is list view. The My Drive list includes System Data, My Documents, Webinar 2025, then the supplied document/media/archive rows.
- Use the exact supplied timestamp format, e.g. `Mar 28, 2026, 12:56 AM`, and `184.4 MB` sizes where present.

### Recent

- Starts with a collapsible `Recent Folders` section made of compact horizontal folder cards.
- `Recent Files` supports the Type filter popover. Filter choices: Folders, Documents, Spreadsheets, Presentations, Audios, PDFs, Zips, PNGs.
- Files are grouped by Today, Last Week, and Last Month.
- The filter's empty state reads: `No files match the selected filter.`

### Team Drive, Shared with Me, Starred

- Keep the shared toolbar/filter language intact.
- Team Drive exposes the action toolbar; Shared with Me and Starred do not.
- Shared and Starred file tables include Owner and Location.

### Trash

- Use the clear empty state: `Trash is empty` and `Items deleted from Drive will appear here`.
- Any real Empty Trash implementation must use a confirmation dialog before destructive behavior.

## Visual tokens

| Role | Value |
| --- | --- |
| Brand/primary | `#002896` |
| Canvas/sidebar | `#F2F2F7` |
| Main surface | `#FFFFFF` |
| Main text | `#18181A` |
| Secondary text | `#636366` |
| Divider/border | `#E5E5EA` |
| Hover surface | `#F9F9FB` |
| Active nav fill | `rgba(0, 40, 150, 0.1)` |
| Danger | `#C10503` |

- Font family: Rakuten Sans UI (with Rakuten Sans fallbacks).
- Common radii: 8px for controls and rows; 12px for header account controls; 16px for the desktop content surface.
- Use 1px structural borders. Keep icons outline-based and use `currentColor` where possible.
- All interactive focus states use a visible 2px primary outline with 2px offset.

## Implementation rules for AI

1. Preserve the shell across all Drive pages. Do not introduce a second header or sidebar.
2. Keep desktop, tablet, and mobile navigation behavior intact.
3. Never use `transition: all`; animate only named compositor-friendly properties. Respect `prefers-reduced-motion`.
4. Do not cause table columns or row content to move on hover.
5. Use accessible labels for icon-only buttons and use native buttons/inputs where suitable.
6. Reuse `FileTable`, `FileRow`, `FileIcon`, `PageToolbar`, `FilterBar`, `Header`, and `Sidebar` before adding page-specific variants.
7. Maintain the current file data in `src/lib/mock-data.ts` until it is replaced by a real data layer.

## Direct Figma limitation

The configured Figma MCP endpoint is OAuth authenticated, but its design-reading tools are not exposed in the active session. Therefore this document intentionally distinguishes implemented/reference-screenshot facts from unverified Figma properties. When Figma node access becomes available, append node IDs, exact dimensions, variables, asset links, and component-state details here rather than overwriting the working rules above without verification.
