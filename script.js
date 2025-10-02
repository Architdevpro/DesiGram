// App State
let posts = [];
let stories = [];
let currentUser = 'you';

// DOM Elements
const createBtn = document.getElementById('createBtn');
const createPostModal = document.getElementById('createPostModal');
const closeModalBtn = document.getElementById('closeModalBtn');
const createPostForm = document.getElementById('createPostForm');
const postsContainer = document.getElementById('postsContainer');
const storiesContainer = document.getElementById('storiesContainer');
const addStoryBtn = document.getElementById('addStoryBtn');
const storyModal = document.getElementById('storyModal');
const closeStoryModalBtn = document.getElementById('closeStoryModalBtn');
const createStoryForm =  
document.getElementById('searchInput');
const searchResults = document.getElementById('searchResults');

// Initialize App
document.addEventListener('DOMContentLoaded', function() {
    loadInitialContent();
    setupEventListeners();
});

// Event Listeners
function setupEventListeners() {
    // Modal controls
    createBtn.addEventListener('click', () => openModal(createPostModal));
    closeModalBtn.addEventListener('click', () => closeModal(createPostModal));
    closeStoryModalBtn.addEventListener('click', () => closeModal(storyModal));
    
    // Story creation
    addStoryBtn.addEventListener('click', () => openModal(storyModal));
    
    // Form submissions
    createPostForm.addEventListener('submit', handleCreatePost);
    createStoryForm.addEventListener('submit', handleCreateStory);
    
    // Search functionality
    searchInput.addEventListener('input', handleSearch);
  searchInput.addEventListener('focus', () => searchResults.style.display = 'block');
    searchInput.addEventListener('blur', () => {
        setTimeout(() => searchResults.style.display = 'none', 200);
    });
    
    // Navigation
    document.getElementById('homeBtn').addEventListener('click', () => scrollToTop());
    document.getElementById('profileBtn').addEventListener('click', () => showProfile());
    
    // Close modals when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            closeModal(e.target);
        }
    });
}

// Modal Functions
function openModal(modal) {
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closeModal(modal) {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
      // Reset forms
    const forms = modal.querySelectorAll('form');
    forms.forEach(form => form.reset());
}

// Post Creation
function handleCreatePost(e) {
    e.preventDefault();
    
    const caption = document.getElementById('postCaption').value;
    const imageUrl = document.getElementById('postImage').value;
    const colorClass = document.getElementById('postColor').value;
    
    if (!caption.trim()) {
        alert('Please enter a caption for your post.');
        return;
    }
const newPost = {
        id: Date.now(),
        username: currentUser,
        caption: caption.trim(),
        imageUrl: imageUrl.trim(),
        colorClass: colorClass,
        likes: 0,
        liked: false,
        timestamp: new Date()
    };
    posts.unshift(newPost);
    renderPosts();
    closeModal(createPostModal);
    
    // Show success message
    showNotification('Post shared successfully!');
}

// Story Creation
function handleCreateStory(e) {
    e.preventDefault();
    
    const text = document.getElementById('storyText').value;
    const background = document.getElementById('storyBackground').value;
    
    if (!text.trim()) {
        alert('Please enter some text for your story.');
        return;
    }
    
    const newStory = {
        id: Date.now(),
        username: currentUser,
        text: text.trim(),
        background: background,
        timestamp: new Date()
    };
    
    stories.unshift(newStory);
    renderStories();
    closeModal(storyModal);
      // Show success message
    showNotification('Story added successfully!');
}

// Render Functions
function renderPosts() {
    if (posts.length === 0) {
        postsContainer.innerHTML = `
            <div class="empty-state">
                <h3>No posts yet</h3>
                <p>Create your first post to get started!</p>
            </div>
        `;
        return;
    }
    
