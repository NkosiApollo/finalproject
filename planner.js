// Elements
const plantPalette = document.getElementById("plant-palette");
const gardenGrid = document.getElementById("garden-grid");
const downloadBtn = document.getElementById("download-btn");

// Grid size 10x10
const gridSize = 10;

// Plant icons
const plantIcons = {
  tomato: "🍅",
  carrot: "🥕",
  lettuce: "🥬",
  potato: "🥔",
  pea: "🫛",
  corn: "🌽",
  strawberry: "🍓",
  cabbage: "🥦",
  cucumber: "🥒",
  onion: "🧅",
  sunflower: "🌻",
  bellpepper: "🫑",
  flower: "🌸",
  custom: "❓",
  nonland: "⬛",
};

// Compatibility map (Saskatchewan-specific examples)
const compatibilityMap = {
  tomato: { good: ["carrot", "lettuce", "onion", "cucumber"], bad: ["potato", "corn", "cabbage"] },
  carrot: { good: ["tomato", "pea", "lettuce"], bad: ["dill"] },
  lettuce: { good: ["carrot", "strawberry", "cucumber"], bad: ["cabbage"] },
  potato: { good: ["corn", "cabbage"], bad: ["tomato", "onion"] },
  pea: { good: ["carrot", "lettuce", "cucumber"], bad: ["onion"] },
  corn: { good: ["potato", "cucumber"], bad: ["tomato"] },
  strawberry: { good: ["lettuce"], bad: ["cabbage"] },
  cabbage: { good: ["potato"], bad: ["lettuce", "tomato"] },
  cucumber: { good: ["lettuce", "pea", "sunflower"], bad: ["potato"] },
  onion: { good: ["tomato", "carrot"], bad: ["pea", "potato"] },
  sunflower: { good: ["cucumber"], bad: [] },
  bellpepper: { good: ["onion", "carrot"], bad: ["fennel"] },
  flower: { good: [], bad: [] },
};

const compatibilityGood = "#c8e6c9"; // light green
const compatibilityBad = "#ffcdd2"; // light red

// Create grid cells
for (let i = 0; i < gridSize * gridSize; i++) {
  const cell = document.createElement("div");
  cell.dataset.index = i;
  cell.textContent = "";
  cell.style.backgroundColor = "";
  cell.classList.add("grid-cell");

  cell.addEventListener("dragover", (e) => e.preventDefault());
  cell.addEventListener("drop", (e) => {
    e.preventDefault();
    const plant = e.dataTransfer.getData("text/plain");
    const icon = plantIcons[plant] || plantIcons["custom"];

    if (plant === "custom") {
      const name = prompt("Enter custom plant name:", "Custom Plant");
      if (name) {
        cell.textContent = name;
        cell.dataset.plant = name.toLowerCase();
      }
    } else {
      cell.textContent = icon;
      cell.dataset.plant = plant;
    }

    updateCompatibilityColors();
  });

  gardenGrid.appendChild(cell);
}

// Drag start event
const plants = plantPalette.querySelectorAll(".plant");
plants.forEach((plant) => {
  plant.addEventListener("dragstart", (e) => {
    e.dataTransfer.setData("text/plain", plant.dataset.plant);
  });
});

function updateCompatibilityColors() {
  const cells = gardenGrid.children;
  for (let i = 0; i < cells.length; i++) {
    cells[i].style.backgroundColor = "";
  }

  for (let i = 0; i < cells.length; i++) {
    const cell = cells[i];
    const plant = cell.dataset.plant;
    if (!plant || plant === "nonland") continue;

    const compatibility = compatibilityMap[plant] || { good: [], bad: [] };

    const neighbors = [
      i - 1,
      i + 1,
      i - gridSize,
      i + gridSize
    ];

    neighbors.forEach((n) => {
      if (n >= 0 && n < cells.length) {
        const neighborCell = cells[n];
        const neighborPlant = neighborCell.dataset.plant;
        if (!neighborPlant || neighborPlant === "nonland") return;

        if (compatibility.good.includes(neighborPlant)) {
          neighborCell.style.backgroundColor = compatibilityGood;
        } else if (compatibility.bad.includes(neighborPlant)) {
          neighborCell.style.backgroundColor = compatibilityBad;
        }
      }
    });
  }
}

// Download plot
downloadBtn.addEventListener("click", () => {
  html2canvas(gardenGrid).then((canvas) => {
    const link = document.createElement("a");
    link.download = "garden-plot.png";
    link.href = canvas.toDataURL();
    link.click();
  });
});
