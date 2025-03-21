// Fetch the JSON data and initialize the soundboard
fetch('sounds.json')
    .then(response => response.json())
    .then(data => {
        initializeSoundboard(data);
    })
    .catch(error => console.error('Error fetching sound data:', error));

// State management
let searchQuery = '';
let selectedCategories = [];
let sortAscending = true;
let showNSFW = false; // Default: Hide NSFW sounds
const activeAudio = []; // To track playing audio

function initializeSoundboard(soundData) {
    const searchBar = document.getElementById('search-bar');
    const categorySearch = document.getElementById('category-search');
    const categoryFilters = document.getElementById('category-filters');
    const soundboard = document.getElementById('soundboard');
    const resetFiltersButton = document.getElementById('reset-filters');
    const stopSoundsButton = document.getElementById('stop-sounds');
    const toggleNSFWCheckbox = document.getElementById('toggle-nsfw');
    const sortAscButton = document.getElementById('sort-asc');
    const sortDescButton = document.getElementById('sort-desc');

    // Extract unique categories and sort them alphabetically
    const categories = Array.from(new Set(soundData.map(sound => sound.category)))
        .sort((a, b) => a.localeCompare(b));

    // Generate initial category buttons
    renderCategoryButtons(categories, soundData, categoryFilters, soundboard);

    // Search functionality for categories
    categorySearch.addEventListener('input', () => {
        const query = categorySearch.value.toLowerCase();
        const filteredCategories = categories.filter(category =>
            category.toLowerCase().includes(query)
        );
        renderCategoryButtons(filteredCategories, soundData, categoryFilters, soundboard);
    });

    // Search bar functionality for sounds
    searchBar.addEventListener('input', () => {
        searchQuery = searchBar.value.toLowerCase();
        filterAndRenderSounds(soundData, soundboard);
    });

    // Reset filters functionality
    resetFiltersButton.addEventListener('click', () => {
        searchQuery = '';
        selectedCategories = [];
        searchBar.value = '';
        categorySearch.value = '';
        renderCategoryButtons(categories, soundData, categoryFilters, soundboard);
        document.querySelectorAll('.filter-button').forEach(button => button.classList.remove('active'));
        filterAndRenderSounds(soundData, soundboard);
    });

    // Stop all sounds functionality
    stopSoundsButton.addEventListener('click', () => {
        stopAllSounds();
    });

    // Toggle NSFW visibility via checkbox
    toggleNSFWCheckbox.addEventListener('change', () => {
        showNSFW = toggleNSFWCheckbox.checked;
        filterAndRenderSounds(soundData, soundboard);
    });

    // Sort functionality
    sortAscButton.addEventListener('click', () => {
        sortAscending = true;
        filterAndRenderSounds(soundData, soundboard);
    });

    sortDescButton.addEventListener('click', () => {
        sortAscending = false;
        filterAndRenderSounds(soundData, soundboard);
    });
}

// Function to render category buttons
function renderCategoryButtons(categories, soundData, categoryFilters, soundboard) {
    categoryFilters.innerHTML = ''; // Clear existing buttons

    categories.forEach(category => {
        const button = document.createElement('button');
        button.className = 'filter-button';
        button.textContent = category;
        button.addEventListener('click', () => {
            toggleCategoryFilter(category, button);
            filterAndRenderSounds(soundData, soundboard);
        });
        categoryFilters.appendChild(button);
    });
}

// Toggle category filter
function toggleCategoryFilter(category, button) {
    const index = selectedCategories.indexOf(category);
    if (index === -1) {
        selectedCategories.push(category);
        button.classList.add('active');
    } else {
        selectedCategories.splice(index, 1);
        button.classList.remove('active');
    }
}

// Filter and render sounds
function filterAndRenderSounds(soundData, soundboard) {
    soundboard.innerHTML = ''; // Clear previous content

    // Sort sound data
    const sortedData = [...soundData].sort((a, b) => {
        return sortAscending ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
    });

    sortedData.forEach(sound => {
        const matchesQuery = sound.name.toLowerCase().includes(searchQuery);
        const matchesCategory =
            selectedCategories.length === 0 || selectedCategories.includes(sound.category);

        const isNSFW = sound.nsfw === "1"; // Check if NSFW key exists and is set to "1"

        if (matchesQuery && matchesCategory && (showNSFW || !isNSFW)) {
            const button = document.createElement('button');
            button.className = 'sound-button';
            button.textContent = sound.name;

            // Play the sound on click
            button.addEventListener('click', () => {
                playSound(sound.src);
            });

            soundboard.appendChild(button);
        }
    });
}

// Function to play a sound (Prevents overlapping)
function playSound(src) {
    stopAllSounds(); // Stop any currently playing sounds

    const audio = new Audio(src);
    activeAudio.push(audio);
    audio.play();

    // Remove audio from active list when it ends
    audio.addEventListener('ended', () => {
        const index = activeAudio.indexOf(audio);
        if (index !== -1) activeAudio.splice(index, 1);
    });
}

// Function to stop all playing sounds
function stopAllSounds() {
    activeAudio.forEach(audio => {
        audio.pause();
        audio.currentTime = 0;
    });
    activeAudio.length = 0; // Clear the audio array
}
