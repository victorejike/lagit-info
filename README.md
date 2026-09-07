# LegitInfo — Verified Social & News Platform

A high-fidelity, interactive prototype of **LegitInfo** featuring smooth animated page transitions between two primary views:
1. **Posts** (Social debate feed with dual Agreed vs Disagreed perspectives)
2. **News** (Verified journalism with LegitScores and fact-checking metrics)

---

## 🌟 Key Features

- **Smooth Tab Navigation**: Animated sliding pill indicator and seamless page slide/fade transitions between Posts and News.
- **Duality Debate Comments**:
  - **Agreed (Green)** vs **Disagreed (Red)** split columns.
  - Real-time consensus ratio meter.
  - Interactive stance selector (`[ ✓ Agree ]` or `[ ✕ Disagree ]`) to post comments into either column dynamically.
  - Expandable *"View more"* comment accordions.
- **Interactive Post Feed**:
  - Exact replication of the featured post by **Victor Ejike**.
  - Interactive Like & Heart reaction toggling with bouncy micro-animations.
  - Post creation modal triggered by *"What's on your mind, Victor?"*.
- **Verified News Experience**:
  - Category filtering (*All*, *AI & Tech*, *Fact-Check Alerts*, *Policy*, *Science*).
  - **98% LegitScore** Breaking News dossier with primary citations.
  - Debunked claim alerts with expert fact-check consensus.
- **Zero-Dependency Standalone Mode**: Can run directly in any web browser without build tools or web servers.

---

## 🚀 How to Run

### Option 1: Quick Launch Script (Recommended)
Open a terminal inside this directory and run:
```bash
./start.sh
```
Then visit:
```
http://localhost:3000
```
- Direct Posts View: `http://localhost:3000/#posts`
- Direct News View: `http://localhost:3000/#news`

### Option 2: Python One-Liner
```bash
python3 -m http.server 3000
```

### Option 3: Double-Click Standalone File
Open `standalone.html` directly in Google Chrome, Edge, Safari, or Firefox without any server.

---

## 📁 Project Structure

```
lagit-info/
├── index.html        # Main application markup
├── styles.css        # Dark theme palette, CSS transitions & micro-animations
├── app.js            # Tab switching, stance selection, dynamic comments & reactions
├── standalone.html   # Fully self-contained portable HTML file (bundled with assets)
├── serve.py          # Python server with no-cache headers
├── start.sh          # Quick launch script
└── assets/           # Avatars, post graphics, and UI previews
```
