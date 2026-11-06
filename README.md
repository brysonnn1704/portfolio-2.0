# Portfolio 2.0 — Bryson Prakash Almeida

An interactive, 3D digital workspace engineering portfolio highlighting software development, cloud infrastructure, networking labs, and creative media. Built with **React 19**, **Three.js**, **React Three Fiber (@react-three/fiber)**, **Drei (@react-three/drei)**, and **Vite**.

🌐 **Live URL**: [https://brysonalmeida.vercel.app](https://brysonalmeida.vercel.app)  
🌐 **Custom Domain**: [https://brysonalmeida.com](https://brysonalmeida.com)

---

## ✨ Features & Architecture

- **Floating Hero HUD (Desktop)**:
  - Immediate identity and credentials badge (*"Available for Roles"*).
  - Quick metrics grid: `89.47% Distinction`, `15+ Projects`, `AWS / Docker Cloud`.
  - Quick action buttons: *Explore Work ↗* and *Get In Touch*.
  - Collapsible HUD for clean viewing.

- **Workstations Quick Dock & Keyboard Navigation**:
  - Persistent bottom dock with numbered shortcuts `[1]` through `[7]`.
  - Press `1` for Projects, `2` for Systems, `3` for Resume, `4` for Creative, `5` for About, `6` for GitHub, `7` for Contact.
  - Press `V` to toggle between **3D Interactive Room** and **Accessible 2D Card View**.
  - Press `M` to toggle Web Audio sound effects.
  - Press `Esc` to close any modal dialog or menu.

- **Interactive 2D Doodle Avatar**:
  - Vector character anchored in 3D camera space with 60 FPS inverse-kinematics arm gestures.
  - Smoothly looks at and points to workstations on hover or selection.
  - Dynamic facial expressions and speech bubbles.

- **Atmospheric Space & Cosmic Background**:
  - Deep atmospheric Three.js fog (`#070A0F`) seamlessly blending the studio platform into cosmic space.
  - Emerald and cyan stardust, procedural parallax starfields, and ambient rim lighting.
  - Full `prefers-reduced-motion` compliance.

- **Featured Projects Showcase**:
  - Modern project portfolio including *PastePro (E2EE Clipboard)*, *ParkCloud (India Edition)*, *Study Mode Launcher*, *Restaurant Billing*, *InstaPulse*, and cloud architectures.
  - Real-time category filtering (`All`, `Web`, `Systems`, `Java`) with project counts and keyword search.

- **Cloud & Systems Architecture Hub**:
  - In-app terminal simulator with runnable commands (`aws ec2 describe-instances`, `uname -a`, `sudo ipsec status`, `dynamodb query`).
  - Categorized technical proficiency matrix.

- **Accessibility & Craft**:
  - High-contrast WCAG AA / AAA compliance.
  - Visible focus rings with emerald glow.
  - Screen reader `aria-live` status announcements.
  - Dedicated 2D high-density view mode.

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
