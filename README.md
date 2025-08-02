# Rubik’s Cube Timer and Scrambler

A web-based WCA-style cube timer and scramble generator. Choose your puzzle size, generate random scrambles, time your solves (with splits, penalties, and DNFs), track statistics (best, worst, average, Ao5, Ao12), and export your session history in TXT, CSV, or JSON formats.

---

## 🚀 Features

- **Puzzle Selection**  
  2×2, 3×3, 4×4, and 5×5 support with WCA-correct scramble lengths (9, 20, 40, 60 moves).
- **Real-Time Timer**  
  Highly precise timer (milliseconds) with Space-bar start/stop.
- **Splits & Penalties**  
  Record intermediate splits, add +2 s penalties, or mark DNF.
- **Session Statistics**  
  Displays total solves, best, worst, overall average, Ao5, and Ao12.
- **Persistent History**  
  Solve data is stored in `localStorage` and rendered as a log.
- **Export Options**  
  Download your solves as:
  - `.txt`
  - `.csv`
  - `.json`
- **Light / Dark Mode**  
  Toggle between themes for day or night use.
- **Responsive & Neumorphic Design**  
  Modern “claymorphic” UI that adapts to mobile and desktop.

---

## 📂 Repository Structure

```

.
├── index.html         # Main HTML page
├── style.css          # Neumorphic styles & responsive layout
├── script.js          # Timer logic, scramble generator, exports, stats
└── README.md          # This documentation

````

---

## ⚙️ Installation

1. **Clone the repository**  
```
   git clone https://github.com/<your-username>/rubiks-cube-timer.git
   cd rubiks-cube-timer
````

2. **Open in browser**
   Simply open `index.html` in any modern browser (no build tools or server required).

---

## 🎮 Usage

1. **Select Puzzle**
   Use the dropdown to choose 2×2, 3×3, 4×4, or 5×5.
2. **Generate Scramble**
   A valid WCA scramble appears automatically; change size to regenerate.
3. **Start / Stop Timer**

   * Click **Start** or press the **Space** bar.
   * Click **Stop** or press **Space** again.
4. **Splits & Penalties**

   * While timing, click **Split** to record an intermediate time.
   * Click **+2 s** to add a penalty.
   * Click **DNF** to mark as DNF.
5. **Reset & Next Scramble**

   * Click **Reset** to clear the timer and load a new scramble.
6. **Clear History**

   * Click **Clear History** to erase all saved solves (confirm first).
7. **Export Data**

   * Click **Export .TXT**, **.CSV**, or **.JSON** to download your session history.

---

## 🛠️ How It Works

### Scramble Generator

* Uses standard WCA rules: no consecutive moves on the same face, no three moves in a row on the same axis.
* Configurable length based on puzzle type (`puzzleSpecs` in `script.js`).

### Timer & Splits

* `setInterval` updates the clock every 10 ms.
* Splits recorded via timestamp differences.
* Penalties and DNF flags applied before saving.

### Statistics & Logging

* All solves persisted in `localStorage` under key `results`.
* On each load, the log and stats panel are rendered:

  * **Best** / **Worst**: min/max times.
  * **Average**: mean time.
  * **Ao5** / **Ao12**: average of last 5 / last 12 solves (if available).

### Exports

* TXT: simple human-readable lines
* CSV: comma-separated values with headers
* JSON: pretty-printed array of solve objects

---

## 🎨 Customization

* **Color Variables**: Adjust `:root` CSS custom properties (`--bg`, `--fg`, `--clay`, etc.) in `style.css`.
* **Scramble Lengths**: Modify the `puzzleSpecs` object in `script.js` for custom move counts.
* **Locale / Date Format**: Change `toLocaleString()` in `endSolve()` for custom date formatting.

---

## 📜 License

This project is open-source and available under the [MIT License](LICENSE).

---

## 👤 Author

Built by [Subh-Bravo-07](https://github.com/Subh-Bravo-07). Feel free to open issues or submit pull requests!
