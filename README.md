# StaffCo Integrations Prototype

A fully functional integrations dashboard built with Next.js 15, TypeScript, Tailwind CSS, and shadcn/ui.

## Features

### 🎨 Design
- **Matches reference designs** from `current-ui.png` and `target-design.png`
- Custom color palette with StaffCo branding
- DM Sans font for UI, JetBrains Mono for code/emails
- Smooth animations with Framer Motion
- Responsive layout with fixed sidebar and topbar

### 🔌 Four Complete Screens

1. **Integrations Page** (`/`)
   - Overview of all available integrations
   - Three categories: Project Management, Messaging & Notifications, Calendars
   - Interactive provider cards with hover effects
   - Connected/disconnected states
   - Search functionality
   - Staggered card animations

2. **Task Management Settings** (`/task-settings`)
   - Configure Jira integration
   - Select projects to sync
   - Configure task assignment rules
   - User email mapping with matched/unmatched states
   - Sync now functionality
   - Sticky save button

3. **Messaging Settings** (`/messaging-settings`)
   - Configure Slack notifications
   - Select notification channel
   - Toggle notification types (Daily Summary, Overtime Alerts, etc.)
   - Live message preview
   - Settings persistence

4. **OAuth Modal** (Component)
   - Multi-state connection flow:
     - Connecting (with loader)
     - Authorizing (fake browser chrome)
     - Success (with spring animation)
     - Error (with retry)
   - Auto-advances through states
   - Smooth transitions

### 🎯 Technical Highlights

- **State Management**: React Context for connection state
- **Real SVG Logos**: Custom-designed logos for all 9 providers
- **Animations**: Framer Motion for page transitions, card stagger, hover effects
- **UI Components**: shadcn/ui for consistent, accessible components
- **TypeScript**: Fully typed for reliability
- **Toast Notifications**: Using Sonner for user feedback

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Open http://localhost:3000
```

### Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
app/
├── page.tsx                    # Main integrations page
├── task-settings/page.tsx      # Task management settings
├── messaging-settings/page.tsx # Messaging settings
├── layout.tsx                  # Root layout with providers
└── globals.css                 # Global styles & color palette

components/
├── sidebar.tsx                 # Navigation sidebar
├── topbar.tsx                  # Top navigation bar
├── app-layout.tsx              # Main layout wrapper
├── provider-logos.tsx          # SVG logos for all providers
├── provider-card.tsx           # Integration card component
└── oauth-modal.tsx             # OAuth connection flow

contexts/
└── connection-context.tsx      # Global connection state
```

## Color Palette

- Primary: `#0066FF`
- Success: `#16A34A`
- Warning: `#F59E0B`
- Error: `#EF4444`
- Background: `#F8F9FB`
- Card: `#FFFFFF`

## Integrations Included

### Project Management (5)
- Jira (connected by default)
- Asana
- Trello
- ClickUp
- Linear

### Messaging & Notifications (3)
- Slack
- Microsoft Teams
- Discord

### Calendars (1)
- Google Calendar (connected by default)

## Features Implemented

✅ Sidebar with company switcher and navigation
✅ Topbar with invite button, notifications, and user menu
✅ Search integrations
✅ Category sections with provider cards
✅ Connect/disconnect flow with OAuth modal
✅ Task management settings with project selection
✅ User mapping (matched/unmatched)
✅ Messaging settings with notification toggles
✅ Slack message preview
✅ Framer Motion animations throughout
✅ Toast notifications for user actions
✅ Responsive design
✅ TypeScript for type safety

## Technologies Used

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Fonts**: DM Sans, JetBrains Mono
- **Toast**: Sonner

## Design Compliance

This prototype matches the visual quality and layout specified in:
- `reference/current-ui.png` - Sidebar and topbar styling
- `reference/target-design.png` - Card layout and design quality

The result looks like a production-ready SaaS product with professional polish.

## License

MIT
