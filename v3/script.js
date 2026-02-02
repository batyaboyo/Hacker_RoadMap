/* ============================================
   CYBERSECURITY ROADMAP - JAVASCRIPT
   Progress tracking with localStorage
   ============================================ */

// ============================================
// CONSTANTS & CONFIGURATION
// ============================================

const STORAGE_KEY = 'cyberpath-progress';
const THEME_KEY = 'cyberpath-theme';

// All trackable items organized by phase
const LEARNING_ITEMS = {
    soc: [
        'soc-networking', 'soc-linux', 'soc-windows', 'soc-fundamentals',
        'soc-siem', 'soc-ir', 'soc-mitre', 'soc-scripting',
        'soc-project1', 'soc-project2', 'soc-project3', 'soc-project4'
    ],
    hack: [
        'hack-networking', 'hack-web', 'hack-owasp', 'hack-recon',
        'hack-exploit', 'hack-reporting',
        'hack-project1', 'hack-project2', 'hack-project3'
    ],
    red: [
        'red-ad', 'red-privesc', 'red-lateral', 'red-persistence',
        'red-evasion', 'red-c2',
        'red-project1', 'red-project2', 'red-project3'
    ],
    ai: [
        'ai-python', 'ai-ml', 'ai-architecture', 'ai-threats',
        'ai-prompt', 'ai-privacy',
        'ai-project1', 'ai-project2', 'ai-project3'
    ]
};

// ============================================
// PROGRESS DATA MANAGEMENT
// ============================================

/**
 * Initialize progress data from localStorage or create empty structure
 * @returns {Object} Progress data object
 */
function initProgress() {
    const stored = localStorage.getItem(STORAGE_KEY);

    if (stored) {
        try {
            return JSON.parse(stored);
        } catch (e) {
            console.error('Error parsing stored progress:', e);
            return createEmptyProgress();
        }
    }

    return createEmptyProgress();
}

/**
 * Create an empty progress object with all items set to false
 * @returns {Object} Empty progress object
 */
function createEmptyProgress() {
    const progress = {};

    Object.values(LEARNING_ITEMS).flat().forEach(id => {
        progress[id] = false;
    });

    return progress;
}

/**
 * Save progress data to localStorage
 * @param {Object} progress - Progress data to save
 */
function saveProgress(progress) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch (e) {
        console.error('Error saving progress:', e);
    }
}

// ============================================
// UI UPDATE FUNCTIONS
// ============================================

/**
 * Update the main progress bar and percentage display
 */
function updateProgressBar() {
    const progress = initProgress();
    const allItems = Object.values(LEARNING_ITEMS).flat();
    const completed = allItems.filter(id => progress[id]).length;
    const total = allItems.length;
    const percentage = Math.round((completed / total) * 100);

    // Update progress bar width
    const progressBar = document.getElementById('progressBar');
    if (progressBar) {
        progressBar.style.width = `${percentage}%`;
    }

    // Update percentage text
    const percentageElement = document.getElementById('progressPercentage');
    if (percentageElement) {
        percentageElement.textContent = `${percentage}%`;
    }

    // Update completed count
    const completedCount = document.getElementById('completedCount');
    const totalCount = document.getElementById('totalCount');
    if (completedCount) completedCount.textContent = completed;
    if (totalCount) totalCount.textContent = total;

    // Update phase progress indicators
    updatePhaseProgress();
}

/**
 * Update individual phase progress displays
 */
function updatePhaseProgress() {
    const progress = initProgress();

    Object.entries(LEARNING_ITEMS).forEach(([phase, items]) => {
        const completed = items.filter(id => progress[id]).length;
        const total = items.length;
        const percentage = Math.round((completed / total) * 100);

        // Update mini card progress
        const phaseProgressElement = document.querySelector(`[data-phase="${phase}"]`);
        if (phaseProgressElement) {
            phaseProgressElement.textContent = `${percentage}%`;
        }
    });
}

/**
 * Sync checkbox states with stored progress data
 */
function syncCheckboxes() {
    const progress = initProgress();

    Object.entries(progress).forEach(([id, completed]) => {
        const checkbox = document.querySelector(`input[data-id="${id}"]`);
        if (checkbox) {
            checkbox.checked = completed;
        }
    });
}

// ============================================
// EVENT HANDLERS
// ============================================

/**
 * Toggle a learning item's completion status
 * @param {string} itemId - The ID of the item to toggle
 */
function toggleItem(itemId) {
    const progress = initProgress();
    const checkbox = document.querySelector(`input[data-id="${itemId}"]`);

    if (checkbox) {
        progress[itemId] = checkbox.checked;
        saveProgress(progress);
        updateProgressBar();
    }
}

/**
 * Toggle phase expand/collapse state
 * @param {string} phaseId - The ID of the phase (soc, hack, red, ai)
 */
function togglePhase(phaseId) {
    const phaseCard = document.querySelector(`.phase-card[data-phase="${phaseId}"]`);

    if (phaseCard) {
        phaseCard.classList.toggle('expanded');
    }
}

/**
 * Reset all progress after user confirmation
 */
function resetProgress() {
    const confirmed = confirm(
        '⚠️ Are you sure you want to reset all progress?\n\n' +
        'This will clear all your completed items and cannot be undone.'
    );

    if (confirmed) {
        const emptyProgress = createEmptyProgress();
        saveProgress(emptyProgress);
        syncCheckboxes();
        updateProgressBar();

        // Close all phases
        document.querySelectorAll('.phase-card').forEach(card => {
            card.classList.remove('expanded');
        });

        // Show feedback
        alert('✅ Progress has been reset successfully!');
    }
}

/**
 * Toggle mobile navigation menu
 */
function toggleMobileMenu() {
    const nav = document.querySelector('.nav');
    if (nav) {
        nav.classList.toggle('active');
    }
}

/**
 * Handle smooth scroll for navigation links
 */
function handleNavClick(event) {
    const link = event.target.closest('.nav-link');

    if (link) {
        // Close mobile menu if open
        const nav = document.querySelector('.nav');
        if (nav) {
            nav.classList.remove('active');
        }

        // Update active state
        document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
        link.classList.add('active');
    }
}

/**
 * Update active nav link based on scroll position
 */
function updateActiveNavOnScroll() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    let currentSection = '';

    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.offsetHeight;

        if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
            currentSection = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSection}`) {
            link.classList.add('active');
        }
    });
}

// ============================================
// THEME MANAGEMENT
// ============================================

/**
 * Get the current theme from localStorage or default to 'dark'
 * @returns {string} Current theme ('dark' or 'light')
 */
function getTheme() {
    return localStorage.getItem(THEME_KEY) || 'dark';
}

/**
 * Save theme preference to localStorage
 * @param {string} theme - Theme to save ('dark' or 'light')
 */
function saveTheme(theme) {
    try {
        localStorage.setItem(THEME_KEY, theme);
    } catch (e) {
        console.error('Error saving theme:', e);
    }
}

/**
 * Apply the specified theme to the document
 * @param {string} theme - Theme to apply ('dark' or 'light')
 */
function applyTheme(theme) {
    if (theme === 'light') {
        document.documentElement.setAttribute('data-theme', 'light');
    } else {
        document.documentElement.removeAttribute('data-theme');
    }

    // Update theme icon
    const themeIcon = document.getElementById('themeIcon');
    if (themeIcon) {
        themeIcon.textContent = theme === 'light' ? '☀️' : '🌙';
    }
}

/**
 * Toggle between dark and light themes
 */
function toggleTheme() {
    const currentTheme = getTheme();
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

    saveTheme(newTheme);
    applyTheme(newTheme);

    console.log(`🎨 Theme switched to: ${newTheme}`);
}

/**
 * Initialize theme from localStorage on page load
 */
function initTheme() {
    const savedTheme = getTheme();
    applyTheme(savedTheme);
}

// ============================================
// INITIALIZATION
// ============================================

/**
 * Initialize the application when DOM is ready
 */
function initApp() {
    // Initialize theme from localStorage
    initTheme();

    // Sync checkboxes with stored progress
    syncCheckboxes();

    // Update progress displays
    updateProgressBar();

    // Add reset button event listener
    const resetBtn = document.getElementById('resetBtn');
    if (resetBtn) {
        resetBtn.addEventListener('click', resetProgress);
    }

    // Add theme toggle event listener
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }

    // Add mobile menu toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', toggleMobileMenu);
    }

    // Add navigation click handler
    const nav = document.querySelector('.nav');
    if (nav) {
        nav.addEventListener('click', handleNavClick);
    }

    // Add scroll listener for active nav state
    window.addEventListener('scroll', updateActiveNavOnScroll);

    // Expand first phase by default for new users
    const progress = initProgress();
    const hasProgress = Object.values(progress).some(v => v === true);

    if (!hasProgress) {
        const firstPhase = document.querySelector('.phase-card[data-phase="soc"]');
        if (firstPhase) {
            firstPhase.classList.add('expanded');
        }
    }

    console.log('🛡️ CyberPath initialized successfully!');
    console.log('📊 Progress tracking: localStorage');
    console.log('🎨 Theme preference: localStorage');
}

// Run initialization when DOM is loaded
document.addEventListener('DOMContentLoaded', initApp);

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Get progress statistics
 * @returns {Object} Progress statistics
 */
function getProgressStats() {
    const progress = initProgress();
    const allItems = Object.values(LEARNING_ITEMS).flat();
    const completed = allItems.filter(id => progress[id]).length;
    const total = allItems.length;

    const phaseStats = {};
    Object.entries(LEARNING_ITEMS).forEach(([phase, items]) => {
        const phaseCompleted = items.filter(id => progress[id]).length;
        phaseStats[phase] = {
            completed: phaseCompleted,
            total: items.length,
            percentage: Math.round((phaseCompleted / items.length) * 100)
        };
    });

    return {
        overall: {
            completed,
            total,
            percentage: Math.round((completed / total) * 100)
        },
        phases: phaseStats
    };
}

// Expose stats function for debugging
window.getProgressStats = getProgressStats;
