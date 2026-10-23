# Portfolio 2.0 — Bryson Prakash Almeida

An interactive, 3D digital workspace engineering portfolio highlighting software development, cloud infrastructure, networking labs, and creative video media. Built with **React 19**, **Three.js**, **React Three Fiber (@react-three/fiber)**, **Drei (@react-three/drei)**, and **Vite**.

## ✨ Features

- **Interactive 3D Workspace Scene**:
  - Detailed procedural 3D models with beveled geometry (`RoundedBox`):
    - **Developer Workstation (01 • Projects)**: Ultra-wide curved screen with syntax highlighting code editor, aluminum stand, mechanical keyboard, and optical mouse.
    - **Blade Server Rack (02 • Systems & Cloud)**: Multi-blade enterprise rack with drive bay caddies and pulsing status LEDs.
    - **Engineering Journal (03 • Resume)**: Leather-bound technical notebook with gold ribbon bookmark and drafting pen.
    - **Cinema Camera (04 • Creative)**: Mirrorless camera with textured grip, optical glass elements, knurled dials, and recording tally light.
    - **Security ID Badge (05 • About)**: Holographic credential badge with avatar silhouette, EMV chip, and lanyard.
    - **Cyber Command Terminal (06 • GitHub)**: Phosphor terminal console with live command output and industrial switchgear.
  - Floating 3D HTML pin tags (`<Html>`) providing instant click-to-explore navigation.
  - Ambient floating particles (`<Sparkles>`) and soft contact ground shadows.
  - Smooth orbit controls with gentle auto-rotation and interactive hover highlights.

- **Featured Projects Showcase**:
  - Custom procedural SVG visual previews for every project (RAKSHA ZONE, Royal Enfield Clone, Digital Literacy, BankMAN CRCE, Restaurant Billing, Calorie Tracker, AWS EC2 + RDS Listmonk, and DynamoDB CRUD).
  - Live search bar and category filtering (All, Web, Systems, Java).
  - Quick access buttons to live production sites and GitHub source code.

- **Cloud & Systems Architecture Hub**:
  - Real-world cloud lab breakdowns (VPC, EC2 + RDS, DynamoDB single-table design, strongSwan IPsec VPN).
  - Interactive in-app terminal simulator with runnable commands (`aws ec2 describe-instances`, `uname -a`, `sudo ipsec status`, `dynamodb query`).
  - Categorized technical proficiency matrix.

- **Curriculum Vitae (Resume) Hub**:
  - In-app tabbed summary (Overview, Education with 89.47% distinction, Skills, Experience).
  - Direct 1-click download and new-tab preview for `Bryson_Prakash_Almeida_CV_Final.pdf`.

- **Creative & Video Media**:
  - Showcase of short-form reels, motion graphics, and festive visual campaigns.
  - Direct link to official YouTube channel `@sauceop8165`.

- **Live GitHub Explorer**:
  - Fetches recent public repositories from the GitHub API with local fallback caching.

- **Contact & Micro-interactions**:
  - One-click copy email with animated toast notification.
  - Zero-dependency Web Audio synthesizers for optional high-tech UI feedback sounds (press `M` to toggle).
  - Keyboard shortcuts: `1` to `7` for direct panel opening, `Esc` to close, `M` for audio.
  - Full mobile fallback view and responsive touch drawer.

## 🛠️ Tech Stack

- **Framework**: React 19, Vite 8
- **3D Graphics**: Three.js, @react-three/fiber, @react-three/drei
- **Linter**: Oxlint
- **Styling**: Modern CSS3, custom CSS custom properties, responsive glassmorphism

## 🚀 Running Locally

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run oxlint check
npm run lint

# Build for production
npm run build

# Preview production build
npm run preview
```
