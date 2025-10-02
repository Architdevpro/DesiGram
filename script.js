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
    
postsContainer.innerHTML = posts.map(post => `
        <article class="post" data-post-id="${post.id}">
            <div class="post-header">
                <div class="post-avatar"></div>
                <a href="#" class="post-username">${post.username}</a>
            </div>
            <div class="post-content ${post.colorClass}">
                ${post.imageUrl ? `<img src="${post.imageUrl}" alt="Post image" style="max-width: 100%; max-height: 100%; object-fit: contain;" onerror="this.style.display='none'; this.nextElementSibling.style.display='block';">` : ''}
                <div ${post.imageUrl ? 'style="display: none;"' : ''}>${post.caption}</div>
            </div>
            <div class="post-actions">
                <button class="action-btn like-btn" 
                       onclick="sharePost(${post.id})">
                    <svg class="action-icon" viewBox="0 0 24 24">
                        <path d="M12.003 2.001c5.55 0 10.001 4.451 10.001 9.996 0 5.546-4.451 9.997-10.001 9.997-5.55 0-9.996-4.451-9.996-9.997 0-5.545 4.446-9.996 9.996-9.996zm0 1.5c-4.69 0-8.496 3.807-8.496 8.496s3.807 8.497 8.496 8.497 8.497-3.807 8.497-8.497-3.807-8.496-8.497-8.496zm-.747 7.75h-3.5c-.414 0-.75.336-.75.75s.336.75.75.75h3.5v3.5c0 .414.336.75.75.75s.75-.336.75-.75v-3.5h3.5c.414 0 .75-.336.75-.75s-.336-.75-.75-.75h-3.5v-3.5c0-.414-.336-.75-.75-.75s-.75.336-.75.75v3.5z"/>
                    </svg>
                </button>
            </div>
            <div class="likes">${post.likes} ${post.likes === 1 ? 'like' : 'likes'}</div>
            <div class="post-caption">
                <span class="caption-username">${post.username}</span>
                ${post.caption}
            </div>
            <div class="post-time">${formatTime(post.timestamp)}</div>
        </article>
    `).join('');
}

function renderStories() {
    const userStories = stories.map(story => `
        <div class="story" onclick="viewStory(${story.id})">
                  <div class="story-avatar">
                <div class="story-preview ${story.background}" style="width: 52px; height: 52px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-size: 10px; text-align: center; padding: 4px; box-sizing: border-box;">
                    ${story.text.substring(0, 20)}${story.text.length > 20 ? '...' : ''}
                </div>
            </div>
            <div class="story-username">${story.username}</div>
        </div>
    `).join('');
    
    // Update stories container (keep the add story button)
    const addStoryHtml = storiesContainer.querySelector('.add-story').outerHTML;
    storiesContainer.innerHTML = addStoryHtml + userStories;
}
