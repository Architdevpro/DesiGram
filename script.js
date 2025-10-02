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
// Interactive Functions
function toggleLike(postId) {
    const post = posts.find(p => p.id === postId);
    if (post) {
        post.liked = !post.liked;
        post.likes += post.liked ? 1 : -1;
        renderPosts();
    }
                                               }
                      function sharePost(postId) {
    const post = posts.find(p => p.id === postId);
    if (post) {
        if (navigator.share) {
            navigator.share({
                title: 'DesiGram Post',
                text: post.caption,
                url: window.location.href
            });
        } else {
            // Fallback for browsers that don't support Web Share API
            const shareText = `Check out this post on DesiGram: "${post.caption}"`;
            navigator.clipboard.writeText(shareText).then(() => {
                showNotification('Post link copied to clipboard!');
            }).catch(() => {
                showNotification('Share feature not available');
            });
        }
    }
}

function viewStory(storyId) {
    const story = stories.find(s => s.id === storyId);
    if (story) {
        alert(`Story by ${story.username}: "${story.text}"`);
    }
              }
      // Search Functionality
function handleSearch(e) {
    const query = e.target.value.toLowerCase().trim();
    
    if (query.length === 0) {
        searchResults.style.display = 'none';
        return;
    }
    
    // Search through posts and stories
    const results = [];
    
    posts.forEach(post => {
        if (post.caption.toLowerCase().includes(query) || post.username.toLowerCase().includes(query)) {
            results.push({
                type: 'post',
                text: `Post: ${post.caption.substring(0, 50)}...`,
                id: post.id
            });
        }
    });
    
    stories.forEach(story => {
        if (story.text.toLowerCase().includes(query) || story.username.toLowerCase().includes(query)) {
            results.push({
                type: 'story',
                text: `Story: ${story.text.substring(0, 50)}...`,
                id: story.id
            });
        }
    });
          if (results.length === 0) {
        searchResults.innerHTML = '<div class="search-result-item">No results found</div>';
    } else {
        searchResults.innerHTML = results.map(result => 
            `<div class="search-result-item" onclick="goToResult('${result.type}', ${result.id})">${result.text}</div>`
        ).join('');
    }
    
    searchResults.style.display = 'block';
}

function goToResult(type, id) {
    if (type === 'post') {
        const postElement = document.querySelector(`[data-post-id="${id}"]`);
        if (postElement) {
            postElement.scrollIntoView({ behavior: 'smooth' });
        }
    } else if (type === 'story') {
        viewStory(id);
    }
    searchResults.style.display = 'none';
    searchInput.value = '';
}

// Utility Functions
function formatTime(timestamp) {
    const now = new Date();
    const diff = now - timestamp;
  const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
}

function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function showProfile() {
    alert(`Profile: ${currentUser}\nPosts: ${posts.length}\nStories: ${stories.length}`);
}
function showNotification(message) {
    // Create a simple notification
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 80px;
        right: 20px;
        background: #262626;
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        z-index: 1001;
        font-size: 14px;
        opacity: 0;
        transition: opacity 0.3s;
  `;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => notification.style.opacity = '1', 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => document.body.removeChild(notification), 300);
    }, 3000);
}

function loadInitialContent() {
    // Load any saved data from localStorage
    const savedPosts = localStorage.getItem('desigramPosts');
    const savedStories = localStorage.getItem('desigramStories');
    
    if (savedPosts) {
        posts = JSON.parse(savedPosts).map(post => ({
            ...post,
            timestamp: new Date(post.timestamp)
        }));
    }
    
    if (savedStories) {
        stories = JSON.parse(savedStories).map(story => ({
            ...story,
          timestamp: new Date(story.timestamp)
        }));
    }
    renderPosts();
    renderStories();
    
    // Save data whenever it changes
    const saveData = () => {
        localStorage.setItem('desigramPosts', JSON.stringify(posts));
        localStorage.setItem('desigramStories', JSON.stringify(stories));
    };
    
    // Save data periodically
    setInterval(saveData, 5000);
    
    // Save data when page is about to unload
    window.addEventListener('beforeunload', saveData);
}
