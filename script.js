const items = [
  'Stake',
  'Beef',
  'Chicken',
  'Cantina Chicken',
  'Rice',
  'Refried Beans',
  'Nacho cheese sauce'
];

const pageStart = document.getElementById('page-start');
const pageSelection = document.getElementById('page-selection');
const pageAction = document.getElementById('page-action');
const pageSummary = document.getElementById('page-summary');
const optionGrid = document.getElementById('optionGrid');
const startBtn = document.getElementById('startBtn');
const selectionBackBtn = document.getElementById('selectionBackBtn');
const actionBackBtn = document.getElementById('actionBackBtn');
const actionContinueBtn = document.getElementById('actionContinueBtn');
const summaryRestartBtn = document.getElementById('summaryRestartBtn');
const actionTitle = document.getElementById('actionTitle');
const addControls = document.getElementById('addControls');
const removeControls = document.getElementById('removeControls');
const quantityInput = document.getElementById('quantityInput');
const removeQuantityInput = document.getElementById('removeQuantityInput');
const summaryText = document.getElementById('summaryText');
const timerStatus = document.getElementById('timerStatus');
const timerDisplay = document.getElementById('timerDisplay');
const selectionMessage = document.getElementById('selectionMessage');
const lowStockBanner = document.getElementById('lowStockBanner');
const holdingBtn = document.getElementById('holdingBtn');
const pageHolding = document.getElementById('page-holding');
const holdingList = document.getElementById('holdingList');
const discardedList = document.getElementById('discardedList');
const holdingBackBtn = document.getElementById('holdingBackBtn');
const printReportBtn = document.getElementById('printReportBtn');
const newShiftBtn = document.getElementById('newShiftBtn');
const printReport = document.getElementById('printReport');

let selectedItem = null;
let selectedAction = null;
let holdTimer = null;
let selectionMessageTimeout = null;
let lowStockMessageTimeout = null;
let lowStockAlertedItems = new Set();
let holdingItems = [];
let discardedItems = [];

const FOUR_HOURS_MS = 4 * 60 * 60 * 1000;
const EIGHT_HOURS_MS = 8 * 60 * 60 * 1000;
const NACHO_CHEESE_SAUCE = 'Nacho cheese sauce';

function getHoldDurationMs(itemName) {
  return itemName === NACHO_CHEESE_SAUCE ? EIGHT_HOURS_MS : FOUR_HOURS_MS;
}

function getHoldDurationHours(itemName) {
  return getHoldDurationMs(itemName) / (60 * 60 * 1000);
}

function showPage(page) {
  [pageStart, pageSelection, pageAction, pageSummary, pageHolding].forEach((section) => {
    section.classList.toggle('hidden', section !== page);
  });

  if (page !== pageSelection) {
    clearSelectionMessage();
  }
}

function showSelectionMessage(message) {
  selectionMessage.textContent = message;
  selectionMessage.classList.remove('hidden');
  if (selectionMessageTimeout) {
    clearTimeout(selectionMessageTimeout);
  }
  selectionMessageTimeout = setTimeout(() => {
    clearSelectionMessage();
  }, 6000);
}

function clearSelectionMessage() {
  selectionMessage.textContent = '';
  selectionMessage.classList.add('hidden');
}

function playNotificationSound() {
  try {
    const context = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.type = 'sine';
    oscillator.frequency.value = 880;
    gain.gain.value = 0.12;
    oscillator.connect(gain);
    gain.connect(context.destination);
    oscillator.start();
    oscillator.stop(context.currentTime + 0.14);
    oscillator.onended = () => {
      gain.disconnect();
      oscillator.disconnect();
      if (context.state !== 'closed') {
        context.close();
      }
    };
  } catch (error) {
    console.warn('Notification sound unavailable:', error);
  }
}

function showLowStockNotification(message) {
  lowStockBanner.textContent = message;
  lowStockBanner.classList.remove('hidden');
  playNotificationSound();
  if (lowStockMessageTimeout) {
    clearTimeout(lowStockMessageTimeout);
  }
  lowStockMessageTimeout = setTimeout(() => {
    lowStockBanner.textContent = '';
    lowStockBanner.classList.add('hidden');
  }, 6000);
}

function getHoldingTotals() {
  return holdingItems.reduce((totals, entry) => {
    totals[entry.item] = (totals[entry.item] || 0) + entry.quantity;
    return totals;
  }, {});
}

function checkLowStockNotifications() {
  const totals = getHoldingTotals();
  Object.entries(totals).forEach(([item, quantity]) => {
    if (quantity < 2 && !lowStockAlertedItems.has(item)) {
      showLowStockNotification(`Low stock alert: ${item} only has ${quantity} left.`);
      lowStockAlertedItems.add(item);
    } else if (quantity >= 2 && lowStockAlertedItems.has(item)) {
      lowStockAlertedItems.delete(item);
    }
  });
}

function resetActionForm() {
  selectedAction = null;
  actionContinueBtn.disabled = true;
  addControls.classList.add('hidden');
  removeControls.classList.add('hidden');
  quantityInput.value = 1;
  removeQuantityInput.value = 1;
  document.querySelectorAll('input[name="actionType"]').forEach((radio) => {
    radio.checked = false;
  });
}

function setActionTitle() {
  actionTitle.textContent = `What should we do with ${selectedItem}?`;
}

function formatDuration(ms) {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
  const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
  const seconds = String(totalSeconds % 60).padStart(2, '0');
  return `${hours}:${minutes}:${seconds}`;
}

function getRemainingMs(expiresAt) {
  return Math.max(0, expiresAt - Date.now());
}

function formatDateTime(timestamp) {
  return new Date(timestamp).toLocaleString();
}
function playDiscardSound() {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) {
      return;
    }
    const audioCtx = new AudioContext();
    const oscillator = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    oscillator.type = 'triangle';
    oscillator.frequency.value = 660;
    gain.gain.setValueAtTime(0.001, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.14, audioCtx.currentTime + 0.02);

    oscillator.connect(gain);
    gain.connect(audioCtx.destination);
    oscillator.start(audioCtx.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(220, audioCtx.currentTime + 0.22);
    gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.22);
    oscillator.stop(audioCtx.currentTime + 0.25);

    setTimeout(() => {
      audioCtx.close();
    }, 500);
  } catch (error) {
    console.warn('Audio notifications are not supported in this browser.', error);
  }
}
function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => {
    const entities = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    };
    return entities[character];
  });
}

function startHoldTimer() {
  if (holdTimer) {
    return;
  }
  timerStatus.classList.remove('hidden');
  holdTimer = setInterval(() => {
    updateHoldingItems();
    renderHoldingList();
    renderTimer();
  }, 1000);
}

function stopHoldTimer() {
  if (holdTimer) {
    clearInterval(holdTimer);
    holdTimer = null;
  }
  if (holdingItems.length === 0) {
    timerStatus.classList.add('hidden');
  }
}

function updateHoldingItems() {
  const now = Date.now();
  const stillHolding = [];
  let discardedAny = false;

  holdingItems.forEach((item) => {
    if (item.expiresAt <= now) {
      discardedItems.unshift({
        item: item.item,
        quantity: item.quantity,
        discardedAt: now
      });
      discardedAny = true;
    } else {
      stillHolding.push(item);
    }
  });

  holdingItems = stillHolding;
  if (holdingItems.length === 0) {
    stopHoldTimer();
  }

  if (discardedAny) {
    playDiscardSound();
  }

  checkLowStockNotifications();
}

function renderHoldingList() {
  if (holdingItems.length === 0) {
    holdingList.innerHTML = '<p class="help-text">No products are currently holding.</p>';
  } else {
    holdingList.innerHTML = holdingItems
      .map((item) => {
        const remaining = formatDuration(getRemainingMs(item.expiresAt));
        return `
          <div class="hold-item">
            <div>
              <strong>${item.item}</strong> x${item.quantity}
            </div>
            <div>${remaining} left</div>
          </div>
        `;
      })
      .join('');
  }

  if (discardedItems.length === 0) {
    discardedList.innerHTML = '<p class="help-text">No discarded items yet.</p>';
  } else {
    discardedList.innerHTML = discardedItems
      .map((item) => {
        return `
          <div class="hold-item">
            <div>
              <strong>${item.item}</strong> x${item.quantity}
            </div>
            <div>Discarded</div>
          </div>
        `;
      })
      .join('');
  }
}

function renderTimer() {
  if (holdingItems.length === 0) {
    timerStatus.classList.add('hidden');
    return;
  }
  const nextExpire = holdingItems.reduce((earliest, item) => {
    const remaining = getRemainingMs(item.expiresAt);
    return remaining < earliest ? remaining : earliest;
  }, Infinity);
  timerDisplay.textContent = formatDuration(nextExpire === Infinity ? 0 : nextExpire);
  if (nextExpire === 0) {
    updateHoldingItems();
    renderHoldingList();
    alert('A hold timer item has reached 0 and was discarded.');
  }
}

function addHoldItem(itemName, quantity) {
  const now = Date.now();
  holdingItems.push({
    item: itemName,
    quantity,
    startedAt: now,
    expiresAt: now + getHoldDurationMs(itemName)
  });
  renderHoldingList();
  checkLowStockNotifications();
  startHoldTimer();
}

function removeHoldItem(itemName, quantity) {
  let remainingToRemove = quantity;
  holdingItems = holdingItems.reduce((acc, entry) => {
    if (entry.item !== itemName || remainingToRemove === 0) {
      acc.push(entry);
      return acc;
    }

    const removeCount = Math.min(entry.quantity, remainingToRemove);
    const remainingQuantity = entry.quantity - removeCount;
    remainingToRemove -= removeCount;

    if (remainingQuantity > 0) {
      acc.push({ ...entry, quantity: remainingQuantity });
    }

    return acc;
  }, []);

  if (holdingItems.length === 0) {
    stopHoldTimer();
  }

  renderHoldingList();
  checkLowStockNotifications();
  return quantity - remainingToRemove;
}

function buildReportRows(itemsToPrint, emptyText, rowBuilder) {
  if (itemsToPrint.length === 0) {
    return `<p>${emptyText}</p>`;
  }

  return `
    <table>
      <thead>
        <tr>
          <th>Product</th>
          <th>Quantity</th>
          <th>Status</th>
          <th>Time</th>
        </tr>
      </thead>
      <tbody>
        ${itemsToPrint.map(rowBuilder).join('')}
      </tbody>
    </table>
  `;
}

function buildPrintReport() {
  const now = Date.now();
  const heldRows = buildReportRows(
    holdingItems,
    'No products are currently holding.',
    (item) => `
      <tr>
        <td>${escapeHtml(item.item)}</td>
        <td>${escapeHtml(item.quantity)}</td>
        <td>Holding</td>
        <td>${formatDuration(getRemainingMs(item.expiresAt))} left</td>
      </tr>
    `
  );
  const discardedRows = buildReportRows(
    discardedItems,
    'No discarded items.',
    (item) => `
      <tr>
        <td>${escapeHtml(item.item)}</td>
        <td>${escapeHtml(item.quantity)}</td>
        <td>Discarded</td>
        <td>${formatDateTime(item.discardedAt)}</td>
      </tr>
    `
  );

  printReport.innerHTML = `
    <h1>Taco Bell Drop Buddy Hold Report</h1>
    <p class="report-date">Printed ${formatDateTime(now)}</p>
    <section>
      <h2>Currently Holding</h2>
      ${heldRows}
    </section>
    <section>
      <h2>Discarded Products</h2>
      ${discardedRows}
    </section>
  `;
}

function printHoldReport() {
  updateHoldingItems();
  renderHoldingList();
  buildPrintReport();
  window.print();
}

function startNewShift() {
  const shouldClearShift = confirm('Start a new shift and delete all held and discarded product data?');
  if (!shouldClearShift) {
    return;
  }

  holdingItems = [];
  discardedItems = [];
  stopHoldTimer();
  renderHoldingList();
  renderTimer();
  timerStatus.classList.add('hidden');
  showSelectionMessage('New shift started. Holding and discarded data was deleted.');
  showPage(pageSelection);
}

function buildSummary() {
  const action = selectedAction === 'add' ? 'added' : 'removed';
  const quantity = selectedAction === 'add' ? quantityInput.value : removeQuantityInput.value;
  summaryText.textContent = `${quantity} ${selectedItem} will be ${action}.`;
  if (selectedAction === 'add') {
    timerStatus.classList.remove('hidden');
    timerDisplay.textContent = formatDuration(getHoldDurationMs(selectedItem));
  } else {
    timerStatus.classList.add('hidden');
  }
}

items.forEach((item) => {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'option-button';
  button.textContent = item;
  button.addEventListener('click', () => {
    selectedItem = item;
    setActionTitle();
    resetActionForm();
    showPage(pageAction);
  });
  optionGrid.appendChild(button);
});

startBtn.addEventListener('click', () => {
  showPage(pageSelection);
});

selectionBackBtn.addEventListener('click', () => {
  showPage(pageStart);
});

actionBackBtn.addEventListener('click', () => {
  showPage(pageSelection);
});

holdingBtn.addEventListener('click', () => {
  renderHoldingList();
  showPage(pageHolding);
});

holdingBackBtn.addEventListener('click', () => {
  showPage(pageSelection);
});

printReportBtn.addEventListener('click', () => {
  printHoldReport();
});

newShiftBtn.addEventListener('click', () => {
  startNewShift();
});

summaryRestartBtn.addEventListener('click', () => {
  showPage(pageStart);
  summaryText.textContent = '';
  timerStatus.classList.add('hidden');
  if (holdTimer) {
    clearInterval(holdTimer);
    holdTimer = null;
  }
});

document.querySelectorAll('input[name="actionType"]').forEach((radio) => {
  radio.addEventListener('change', (event) => {
    selectedAction = event.target.value;
    actionContinueBtn.disabled = false;
    if (selectedAction === 'add') {
      addControls.classList.remove('hidden');
      removeControls.classList.add('hidden');
    } else {
      addControls.classList.add('hidden');
      removeControls.classList.remove('hidden');
    }
  });
});

actionContinueBtn.addEventListener('click', () => {
  if (!selectedItem || !selectedAction) {
    return;
  }

  if (selectedAction === 'add') {
    const quantity = Number(quantityInput.value);
    if (Number.isNaN(quantity) || quantity < 1) {
      alert('Please enter a valid quantity greater than 0.');
      return;
    }
    addHoldItem(selectedItem, quantity);

    const timerNote = ` and started a ${getHoldDurationHours(selectedItem)}-hour hold timer`;
    showSelectionMessage(`Added ${quantity} ${selectedItem}${quantity === 1 ? '' : 's'}${timerNote}.`);
    resetActionForm();
    showPage(pageSelection);
    return;
  }

  const removeQuantity = Number(removeQuantityInput.value);
  if (selectedAction === 'remove' && (Number.isNaN(removeQuantity) || removeQuantity < 1)) {
    alert('Please enter a valid quantity greater than 0.');
    return;
  }

  if (selectedAction === 'remove') {
    const totals = getHoldingTotals();
    const available = totals[selectedItem] || 0;

    if (available === 0) {
      alert(`There are no held ${selectedItem} products to remove.`);
      return;
    }

    const removed = removeHoldItem(selectedItem, removeQuantity);
    showSelectionMessage(`Removed ${removed} ${selectedItem}${removed === 1 ? '' : 's'} from held products.`);
    resetActionForm();
    showPage(pageSelection);
    return;
  }

  buildSummary();
  showPage(pageSummary);
});

showPage(pageStart);
