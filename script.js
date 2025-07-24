const cropData = {
  "Carrot": [15, 0.26], "Strawberry": [14, 0.29], "Blueberry": [18, 0.14],
  "Orange Tulip": [767, 0.04], "Tomato": [27, 0.35], "Daffodil": [903, 0.14],
  "Corn": [36, 1.40], "Watermelon": [2708, 4.90], "Pumpkin": [3069, 5.60],
  "Apple": [248, 2.10], "Lilac": [31588, 2.10], "Bamboo": [3610, 2.80],
  "Coconut": [361, 9.80], "Cactus": [3069, 4.90], "Dragon Fruit": [4287, 8.40],
  "Mango": [5866, 10.50], "Bone Blossom": [180500, 2.10], "Grape": [7085, 2.10],
  "Mushroom": [136278, 17.50], "Pepper": [7220, 3.50], "Cacao": [10830, 5.60],
  "Sunflower": [144400, 11.55], "Candy Blossom": [82200, 2.85], "Beanstalk": [25270, 7.00],
  "Ember Lily": [60166, 8.40], "Sugar Apple": [43320, 8.55], "Burning Bud": [63178, 8.40],
  "Giant Pinecone": [60000, 3.00]
};

const mutationValues = {
  Alienlike: 100, Amber: 10, AncientAmber: 50, Aurora: 90, Bloodlit: 4,
  Burnt: 4, Celestial: 120, Ceramic: 30, Chilled: 2, Choc: 2,
  Clay: 3, Cloudtouched: 5, Cooked: 10, Dawnbound: 150, Disco: 125,
  Drenched: 5, Fried: 8, Frozen: 10, Heavenly: 5, HistoricAmber: 150,
  HoneyGlazed: 5, Infected: 75, Meteoric: 125, Molten: 25, Moonlit: 2,
  OldAmber: 20, Paradisal: 100, Plasma: 5, Pollinated: 3, Sandy: 3,
  Shocked: 100, Sundried: 85, Tempestuous: 12, Twisted: 5, Verdant: 4,
  Voidtouched: 135, Wet: 2, Wiltproof: 4, Windstruck: 2, Zombified: 25,
  Tranquil: 20, Radioactive: 80, FoxfireChakra: 90, Friendbound: 70
};

let selectedCrop = null;
const selectedMutations = new Set();
let selectedGrowth = "1";

const minSheckle = document.getElementById('minSheckle');
const minWeight = document.getElementById('minWeight');
const valueMutation = document.getElementById('valueMutation');
const numMutation = document.getElementById('numMutation');
const growthMutationGrid = document.getElementById('growthMutationGrid');
const autoTotalPrice = document.getElementById('autoTotalPrice');
const manualTotalPrice = document.getElementById('manualTotalPrice');
const autoWeight = document.getElementById('autoWeight');
const manualWeight = document.getElementById('manualWeight');
const sortOrder = document.getElementById('sortOrder');
const mutationGrid = document.getElementById('mutationGrid');
const showMutationBtn = document.getElementById('showMutationBtn');
const cropGrid = document.getElementById('cropGrid');
const showCropBtn = document.getElementById('showCropBtn');
const cropSortOrder = document.getElementById('cropSortOrder');

function formatNumber(num) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

function updateMutationSum() {
  let sum = 0;
  selectedMutations.forEach(name => {
    sum += mutationValues[name] || 0;
  });
  valueMutation.value = sum;
  numMutation.value = selectedMutations.size;
  calculateAuto();
}

function calculateAuto() {
  const mS = parseFloat(minSheckle.value);
  const bW = parseFloat(minWeight.value);
  const sM = parseFloat(valueMutation.value);
  const nM = parseFloat(numMutation.value);
  const gM = parseFloat(selectedGrowth);
  const manW = parseFloat(manualWeight.value);
  const manTP = parseFloat(manualTotalPrice.value);
  const mf = 1 + sM - nM;

  if (manualWeight.value === '' && manualTotalPrice.value === '') {
    autoTotalPrice.value = "";
    autoWeight.value = "";
    autoTotalPrice.placeholder = "Input your crop data";
    autoWeight.placeholder = "Input your crop data";
    return;
  }

  if (!isNaN(mS) && !isNaN(bW) && !isNaN(mf) && !isNaN(gM) && !isNaN(manW)) {
    const totalPrice = mS * mf * gM * Math.pow(manW / bW, 2);
    autoTotalPrice.value = "≤ " + formatNumber(Math.round(totalPrice));
  }

  if (!isNaN(mS) && !isNaN(bW) && !isNaN(mf) && !isNaN(gM) && !isNaN(manTP)) {
    const weight = bW * Math.sqrt(manTP / (mS * mf * gM));
    autoWeight.value = "≤ " + weight.toFixed(2);
  }
}

function populateMutationGrid() {
  mutationGrid.innerHTML = '';
  let entries = Object.entries(mutationValues).map(([n, v]) => ({ name: n, value: v }));
  const order = sortOrder.value;
  if (order === 'name-asc') entries.sort((a, b) => a.name.localeCompare(b.name));
  if (order === 'name-desc') entries.sort((a, b) => b.name.localeCompare(a.name));
  if (order === 'value-asc') entries.sort((a, b) => a.value - b.value);
  if (order === 'value-desc') entries.sort((a, b) => b.value - a.value);

  entries.forEach(e => {
    const card = document.createElement('div');
    card.className = 'mutation-card';

    const label = document.createElement('label');
    label.className = 'card-label';
    label.textContent = `${e.name} (${e.value})`;
    if (selectedMutations.has(e.name)) label.classList.add('selected');

    label.addEventListener('click', () => {
      if (selectedMutations.has(e.name)) {
        selectedMutations.delete(e.name);
        label.classList.remove('selected');
      } else {
        selectedMutations.add(e.name);
        label.classList.add('selected');
      }
      updateMutationSum();
    });

    card.appendChild(label);
    mutationGrid.appendChild(card);
  });

  updateMutationSum();
}

function populateGrowthMutationGrid() {
  const growthOptions = [
    { name: "None (1)", value: "1", class: "" },
    { name: "Ripe (1)", value: "1", class: "" },
    { name: "Gold (20)", value: "20", class: "" },
    { name: "Rainbow (50)", value: "50", class: "" }
  ];

  growthMutationGrid.innerHTML = '';

  growthOptions.forEach(option => {
    const card = document.createElement('div');
    card.className = 'growth-card';

    const label = document.createElement('label');
    label.className = `card-label ${option.class}`;
    label.textContent = option.name;
    if (selectedGrowth === option.value) label.classList.add('selected');

    label.addEventListener('click', () => {
      selectedGrowth = option.value;
      populateGrowthMutationGrid();
      calculateAuto();
    });

    card.appendChild(label);
    growthMutationGrid.appendChild(card);
  });
}

function populateCropGrid() {
  cropGrid.innerHTML = '';
  let entries = Object.entries(cropData).map(([n, v]) => ({ name: n, sheckle: v[0], weight: v[1] }));
  const order = cropSortOrder.value;
  if (order === 'name-asc') entries.sort((a, b) => a.name.localeCompare(b.name));
  if (order === 'name-desc') entries.sort((a, b) => b.name.localeCompare(a.name));
  if (order === 'value-asc') entries.sort((a, b) => a.sheckle - b.sheckle);
  if (order === 'value-desc') entries.sort((a, b) => b.sheckle - a.sheckle);

  entries.forEach(e => {
    const card = document.createElement('div');
    card.className = 'crop-card';

    const label = document.createElement('label');
    label.className = 'card-label';
    label.textContent = `${e.name}`;
    if (selectedCrop === e.name) label.classList.add('selected');

    label.addEventListener('click', () => {
      selectedCrop = e.name;
      updateCrop();
      showCropBtn.textContent = selectedCrop;
      cropGrid.style.display = 'none';
    });

    card.appendChild(label);
    cropGrid.appendChild(card);
  });
}

function updateCrop() {
  const d = cropData[selectedCrop];
  if (d) {
    minSheckle.value = d[0];
    minWeight.value = parseFloat(d[1]).toFixed(2);
  } else {
    minSheckle.value = '';
    minWeight.value = '';
  }
  calculateAuto();
}

// Event listeners
showMutationBtn.addEventListener('click', () => {
  mutationGrid.style.display = mutationGrid.style.display === 'grid' ? 'none' : 'grid';
  showMutationBtn.textContent = mutationGrid.style.display === 'grid' ? 'Hide Mutation List' : 'Show Mutation List';
  if (mutationGrid.style.display === 'grid') populateMutationGrid();
});

showCropBtn.addEventListener('click', () => {
  cropGrid.style.display = cropGrid.style.display === 'grid' ? 'none' : 'grid';
  if (cropGrid.style.display === 'grid') populateCropGrid();
});

sortOrder.addEventListener('change', () => {
  if (mutationGrid.style.display === 'grid') populateMutationGrid();
});

cropSortOrder.addEventListener('change', () => {
  if (cropGrid.style.display === 'grid') populateCropGrid();
});

manualTotalPrice.addEventListener('input', calculateAuto);
manualWeight.addEventListener('input', calculateAuto);

document.addEventListener('DOMContentLoaded', () => {
  populateGrowthMutationGrid();
});
