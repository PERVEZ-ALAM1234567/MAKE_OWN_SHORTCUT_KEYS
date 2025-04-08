// script.js

// DOM Elements
const actionSelect = document.getElementById('action-select');
const shortcutInput = document.getElementById('shortcut-input');
const addShortcutBtn = document.getElementById('add-shortcut-btn');
const shortcutList = document.getElementById('shortcut-list');

// Stores custom shortcuts
const customShortcuts = {};

// Normalize key combinations (e.g., Ctrl+Shift+A)
function normalizeShortcut(shortcut) {
  return shortcut
    .toLowerCase() // Convert all letters to lowercase
    .split('+') // Split the shortcut into individual keys (e.g., "Ctrl+Shift+A" → ["ctrl", "shift", "a"])
    .map((key) => key.trim()) // Remove any extra spaces around each key
    .sort() // Sort the keys alphabetically (to ensure "Ctrl+Shift+A" is treated the same as "Shift+Ctrl+A")
    .join('+'); // Rejoin the sorted keys into a normalized string (e.g., "a+ctrl+shift")
}


// Add a shortcut to the list
function addShortcut(action, shortcut) {
  const normalizedShortcut = normalizeShortcut(shortcut);

  // Check if the shortcut already exists
  if (customShortcuts[normalizedShortcut]) {
    alert('Shortcut already defined!');
    return;
  }

  // Save the shortcut and its action
  customShortcuts[normalizedShortcut] = action;

  // Update the UI
  const listItem = document.createElement('li');
  listItem.innerHTML = `
    ${action} (${shortcut})
    <button onclick="removeShortcut('${normalizedShortcut}', this)">Remove</button>
  `;
  shortcutList.appendChild(listItem);
}

// Remove a shortcut
function removeShortcut(shortcut, buttonElement) {
  delete customShortcuts[shortcut]; // Remove from storage
  const listItem = buttonElement.parentElement; // Get the parent <li>
  shortcutList.removeChild(listItem); // Remove the <li> from the list
}

// Handle global keydown events
function handleKeydown(event) {
  // Get the key combination
  const keys = [];
  if (event.ctrlKey) keys.push('ctrl');
  if (event.shiftKey) keys.push('shift');
  if (event.altKey) keys.push('alt');
  keys.push(event.key);
  const shortcut = normalizeShortcut(keys.join('+'));

  // Trigger the action if the shortcut is defined
  const action = customShortcuts[shortcut];
  if (action) {
    event.preventDefault(); // Prevent default browser behavior
    triggerAction(action); // Call the action handler
  }
}

// Trigger a specific action
function triggerAction(action) {
  switch (action) {
    case 'show-alert':
      alert('Custom Alert Triggered!');
      break;
    case 'change-color':
      document.body.style.backgroundColor =
        '#' + Math.floor(Math.random() * 16777215).toString(16);
      break;
    case 'log-message':
      console.log('Custom Message Logged!');
      break;
    default:
      console.error('Unknown action:', action);
  }
}

// Event Listener for adding shortcuts
addShortcutBtn.addEventListener('click', () => {
  const action = actionSelect.value;
  const shortcut = shortcutInput.value.trim();

  if (!shortcut) {
    alert('Please enter a valid shortcut.');
    return;
  }

  addShortcut(action, shortcut);
  shortcutInput.value = ''; // Clear input
});

// Add global keydown event listener
document.addEventListener('keydown', handleKeydown);