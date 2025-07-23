const cropData = {
  "Carrot": [15, 0.26],
  "Strawberry": [14, 0.29],
  "Blueberry": [18, 0.14],
  "Orange Tulip": [767, 0.04],
  "Tomato": [27, 0.35],
  "Daffodil": [903, 0.14],
  "Corn" : [36, 1.40],
  "Watermelon": [2708, 4.90],
  "Pumpkin": [3069, 5.60],
  "Apple": [248, 2.10],
  "Lilac": [31588, 2.10],
  "Bamboo": [3610, 2.80],
  "Coconut": [361, 9.80],
  "Cactus": [3069, 4.90],
  "Dragon Fruit": [4287, 8.40],
  "Mango": [5866, 10.50],
  "Bone Blossom": [180500, 2.10],
  "Grape": [7085, 2.10],
  "Mushroom": [136278, 17.50],
  "Pepper": [7220, 3.50],
  "Cacao": [10830, 5.60],
  "Sunflower": [144400, 11.55],
  "Candy Blossom": [82200, 2.85],
  "Beanstalk": [25270, 7.00],
  "Ember Lily": [60166, 8.40],
  "Sugar Apple": [43320, 8.55],
  "Burning Bud": [63178, 8.40],
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
  Voidtouched: 135, Wet: 2, Wiltproof: 4, Windstruck: 2, Zombified: 25, Tranquil: 20, Radioactive: 80, FoxfireChakra: 90, Friendbound: 70
};

const jenisTumbuhan = document.getElementById('jenisTumbuhan');
const minSheckle = document.getElementById('minSheckle');
const minWeight = document.getElementById('minWeight');
const valueMutation = document.getElementById('valueMutation');
const numMutation = document.getElementById('numMutation');
const growthMutation = document.getElementById('growthMutation');
const autoTotalPrice = document.getElementById('autoTotalPrice');
const manualTotalPrice = document.getElementById('manualTotalPrice');
const autoWeight = document.getElementById('autoWeight');
const manualWeight = document.getElementById('manualWeight');
const mutationTable = document.getElementById('mutationTable').querySelector('tbody');
const sortOrder = document.getElementById('sortOrder');

function populateTable() {
  mutationTable.innerHTML = '';
  let entries = Object.entries(mutationValues).map(([n,v])=>({name:n,value:v}));
  const order = sortOrder.value;
  if(order==='name-asc') entries.sort((a,b)=>a.name.localeCompare(b.name));
  if(order==='name-desc') entries.sort((a,b)=>b.name.localeCompare(a.name));
  if(order==='value-asc') entries.sort((a,b)=>a.value - b.value);
  if(order==='value-desc') entries.sort((a,b)=>b.value - a.value);
  entries.forEach(e => {
    const row = mutationTable.insertRow();
    row.insertCell().innerText = e.name;
    row.insertCell().innerText = e.value;
    const cb = document.createElement('input'); cb.type='checkbox'; cb.value=e.value;
    cb.addEventListener('change', updateMutationSum);
    row.insertCell().appendChild(cb);
  });
}

function updateMutationSum() {
  const checkedBoxes = Array.from(mutationTable.querySelectorAll('input[type=checkbox]:checked'));
  const sum = checkedBoxes.reduce((acc, cb) => acc + parseInt(cb.value), 0);
  valueMutation.value = sum;
  numMutation.value = checkedBoxes.length;
  calculateAuto();
}

function updateCrop() {
  const d = cropData[jenisTumbuhan.value];
  if(d){ minSheckle.value=d[0]; minWeight.value=parseFloat(d[1]).toFixed(2); }
  else{ minSheckle.value=''; minWeight.value=''; }
  calculateAuto();
}

function formatNumber(num) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

function calculateAuto() {
  const mS = parseFloat(minSheckle.value); 
  const bW = parseFloat(minWeight.value);
  const sM = parseFloat(valueMutation.value);
  const nM = parseFloat(numMutation.value);
  const gM = parseFloat(growthMutation.value);
  const manW = parseFloat(manualWeight.value);
  const manTP = parseFloat(manualTotalPrice.value);
  const mf = 1 + sM - nM;

  if (!isNaN(mS) && !isNaN(bW) && !isNaN(mf) && !isNaN(gM) && !isNaN(manW)) {
    const totalPrice = mS * mf * gM * Math.pow(manW / bW, 2);
    autoTotalPrice.value = formatNumber(Math.round(totalPrice));
  }

  if (!isNaN(mS) && !isNaN(bW) && !isNaN(mf) && !isNaN(gM) && !isNaN(manTP)) {
    const weight = bW * Math.sqrt(manTP / (mS * mf * gM));
    autoWeight.value = weight.toFixed(2);
  }
}

jenisTumbuhan.addEventListener('change', updateCrop);
sortOrder.addEventListener('change', populateTable);
growthMutation.addEventListener('change', calculateAuto);
manualTotalPrice.addEventListener('input', calculateAuto);
manualWeight.addEventListener('input', calculateAuto);

populateTable();
