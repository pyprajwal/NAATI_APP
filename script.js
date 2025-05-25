let wordsData = {};
let currentCategory = null;
let currentIndex = 0;
let showingEnglish = true;
let rightCount = 0;
let wrongCount = 0;

fetch('words.json')
  .then(response => {
    if (!response.ok) throw new Error('Failed to load words.json');
    return response.json();
  })
  .then(data => {
    wordsData = data;
    buildCategoryButtons();
  })
  .catch(err => {
    document.getElementById('message').textContent = 'Error loading words.json: ' + err.message;
  });

function buildCategoryButtons() {
  const categoriesDiv = document.getElementById('categories');
  categoriesDiv.innerHTML = '';
  Object.keys(wordsData).forEach(category => {
    const btn = document.createElement('button');
    btn.textContent = category;
    btn.className = 'btn btn-outline-primary';
    btn.onclick = () => selectCategory(category);
    categoriesDiv.appendChild(btn);
  });
}

function selectCategory(category) {
  currentCategory = category;
  currentIndex = 0;
  showingEnglish = true;
  resetCounters();

  document.getElementById('selectedCategory').textContent = currentCategory;

  if (wordsData[category].length === 0) {
    showFlashcardText('No words in this category.');
    toggleControls(false);
    return;
  }
  toggleControls(true);
  showFlashcard();
}

function showFlashcard() {
  if (!currentCategory) return;
  const word = wordsData[currentCategory][currentIndex];
  showFlashcardText(showingEnglish ? word.English : word.Nepali);
}

function showFlashcardText(text) {
  const textEl = document.getElementById('flashcard-text');
  const flashcardEl = document.getElementById('flashcard');

  textEl.textContent = text;

  // Start font size at 48px
  let fontSize = 48;
  textEl.style.fontSize = fontSize + "px";

  const minFontSize = 12;

  // Reduce font size while text overflows flashcard box
  while (
    (textEl.scrollHeight > flashcardEl.clientHeight || textEl.scrollWidth > flashcardEl.clientWidth) &&
    fontSize > minFontSize
  ) {
    fontSize--;
    textEl.style.fontSize = fontSize + "px";
  }
}


function resetCounters() {
  rightCount = 0;
  wrongCount = 0;
  updateCounters();
}

function updateCounters() {
  document.getElementById('rightCount').textContent = rightCount;
  document.getElementById('wrongCount').textContent = wrongCount;
}

function toggleControls(show) {
  const display = show ? 'flex' : 'none';
  document.getElementById('navigationButtons').style.display = display;
  document.getElementById('counterButtons').style.display = display;
  // You had a 'counters' id toggle here, but no element with that id in your HTML, so skipping it
}

// Flip flashcard on click
document.getElementById('flashcard').addEventListener('click', () => {
  if (!currentCategory) return;
  showingEnglish = !showingEnglish;
  showFlashcard();
});

// Next button
document.getElementById('nextBtn').addEventListener('click', () => {
  if (!currentCategory) return;
  currentIndex++;
  if (currentIndex >= wordsData[currentCategory].length) currentIndex = 0;
  showingEnglish = true;
  showFlashcard();
});

// Previous button
document.getElementById('prevBtn').addEventListener('click', () => {
  if (!currentCategory) return;
  currentIndex--;
  if (currentIndex < 0) currentIndex = wordsData[currentCategory].length - 1;
  showingEnglish = true;
  showFlashcard();
});

// Right button
document.getElementById('rightBtn').addEventListener('click', () => {
  if (!currentCategory) return;
  rightCount++;
  updateCounters();
});

// Wrong button
document.getElementById('wrongBtn').addEventListener('click', () => {
  if (!currentCategory) return;
  wrongCount++;
  updateCounters();
});
