// CampusConnect Main Application
let eventsData = null;
let galleryData = null;
let contactsData = null;
let aboutData = null;

// Initialize the application
document.addEventListener('DOMContentLoaded', async function() {
  // Load data
  await loadData();
  
  // Initialize components
  initializeApp();
  
  // Determine current page from body data attribute
  const page = document.body.getAttribute('data-page') || 'home';
  loadPage(page);
});

// Load all JSON data
async function loadData() {
  try {
    showLoading('content');
    
    eventsData = await loadJSON('data/events.json');
    galleryData = await loadJSON('data/gallery.json');
    contactsData = await loadJSON('data/contacts.json');
    aboutData = await loadJSON('data/about.json');
    
    if (!eventsData || !galleryData || !contactsData || !aboutData) {
      throw new Error('Failed to load data');
    }
  } catch (error) {
    console.error('Error loading application data:', error);
    document.getElementById('content').innerHTML = `
      <div class="container section text-center">
        <h2>Error Loading Data</h2>
        <p>Please check your connection and try again.</p>
        <button class="btn btn-primary" onclick="location.reload()">Reload</button>
      </div>
    `;
  }
}

// Initialize app components
function initializeApp() {
  renderHeader();
  renderFooter();
  initHeaderScroll();
  
  // Close mobile menu on window resize
  window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
      const navMenu = document.querySelector('.nav-menu');
      if (navMenu && navMenu.classList.contains('active')) {
        navMenu.classList.remove('active');
        document.querySelector('.mobile-menu-toggle').innerHTML = '☰';
      }
    }
  });
}

// Render header navigation
function renderHeader() {
  const header = document.getElementById('site-header');
  const currentPage = document.body.getAttribute('data-page') || 'home';
  
  header.innerHTML = `
    <div class="container">
      <nav class="navbar">
        <a href="index.html" class="logo">CampusConnect</a>
        
        <ul class="nav-menu">
          <li><a href="index.html" class="nav-link ${currentPage === 'home' ? 'active' : ''}">Home</a></li>
          <li><a href="about.html" class="nav-link ${currentPage === 'about' ? 'active' : ''}">About</a></li>
          <li><a href="events.html" class="nav-link ${currentPage === 'events' ? 'active' : ''}">Events</a></li>
          <li><a href="gallery.html" class="nav-link ${currentPage === 'gallery' ? 'active' : ''}">Gallery</a></li>
          <li><a href="feedback.html" class="nav-link ${currentPage === 'feedback' ? 'active' : ''}">Feedback</a></li>
          <li><a href="contact.html" class="nav-link ${currentPage === 'contact' ? 'active' : ''}">Contact</a></li>
        </ul>
        
        <button class="mobile-menu-toggle" onclick="toggleMobileMenu()">☰</button>
      </nav>
    </div>
  `;
}

// Render footer
function renderFooter() {
  const footer = document.getElementById('site-footer');
  
  footer.innerHTML = `
    <div class="container">
      <div class="footer-content">
        <div class="footer-section">
          <h3>CampusConnect</h3>
          <p>Your central hub for college events. Stay updated, stay involved!</p>
        </div>
        
        <div class="footer-section">
          <h3>Quick Links</h3>
          <ul class="footer-links">
            <li><a href="#" onclick="navigateTo('home')">Home</a></li>
            <li><a href="#" onclick="navigateTo('events')">Events</a></li>
            <li><a href="#" onclick="navigateTo('gallery')">Gallery</a></li>
            <li><a href="#" onclick="navigateTo('contact')">Contact</a></li>
          </ul>
        </div>
        
        <div class="footer-section">
          <h3>Categories</h3>
          <ul class="footer-links">
            <li><a href="#" onclick="navigateTo('events', 'technical')">Technical</a></li>
            <li><a href="#" onclick="navigateTo('events', 'cultural')">Cultural</a></li>
            <li><a href="#" onclick="navigateTo('events', 'sports')">Sports</a></li>
            <li><a href="#" onclick="navigateTo('events', 'academic')">Academic</a></li>
          </ul>
        </div>
        
        <div class="footer-section">
          <h3>Contact Info</h3>
          <ul class="footer-links">
            <li>📍 Excellence Institute of Technology</li>
            <li>📞 +91-80-12345678</li>
            <li>✉️ info@college.edu</li>
          </ul>
        </div>
      </div>
      
      <div class="footer-bottom">
        <p>&copy; 2024 CampusConnect - Excellence Institute of Technology. All rights reserved.</p>
      </div>
    </div>
  `;
}

// Navigation function
function navigateTo(page, filter = null) {
  setPageURL(page);
  loadPage(page, filter);
  renderHeader(); // Update active nav link
  
  // Close mobile menu if open
  const navMenu = document.querySelector('.nav-menu');
  if (navMenu && navMenu.classList.contains('active')) {
    navMenu.classList.remove('active');
    document.querySelector('.mobile-menu-toggle').innerHTML = '☰';
  }
}

// Load page content
function loadPage(page, filter = null) {
  const content = document.getElementById('content');
  
  switch (page) {
    case 'home':
      renderHomePage(content);
      break;
    case 'about':
      renderAboutPage(content);
      break;
    case 'events':
      renderEventsPage(content, filter);
      break;
    case 'gallery':
      renderGalleryPage(content, filter);
      break;
    case 'feedback':
      renderFeedbackPage(content);
      break;
    case 'contact':
      renderContactPage(content);
      break;
    default:
      renderHomePage(content);
  }
  
  // Scroll to top
  window.scrollTo({ top: 0, behavior: 'smooth' });
  
  // Reinitialize scroll animations
  setTimeout(() => {
    initScrollAnimations();
  }, 100);
}

// Render Home Page
function renderHomePage(content) {
  if (!eventsData) return;
  
  const upcomingEvents = eventsData.events.filter(event => event.status === 'upcoming').slice(0, 6);
  
  content.innerHTML = `
    <!-- Hero Section -->
    <section class="hero">
      <div class="container">
        <div class="hero-content">
          <h1>Welcome to CampusConnect</h1>
          <p>Stay Updated, Stay Involved!</p>
          <div>
            <a href="#upcoming" class="btn btn-primary" onclick="smoothScrollTo('upcoming')">Explore Events</a>
            <a href="#" class="btn btn-secondary" onclick="navigateTo('about')">Learn More</a>
          </div>
        </div>
      </div>
    </section>

    <!-- Upcoming Events Section -->
    <section id="upcoming" class="section">
      <div class="container">
        <div class="text-center mb-3">
          <h2>Upcoming Events</h2>
          <p>Don't miss out on these exciting upcoming events!</p>
        </div>
        
        <div class="grid grid-3">
          ${upcomingEvents.map(event => createEventCard(event)).join('')}
        </div>
        
        <div class="text-center mt-2">
          <button class="btn btn-primary" onclick="navigateTo('events')">View All Events</button>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="section bg-light">
      <div class="container">
        <div class="text-center mb-3">
          <h2>Why Choose CampusConnect?</h2>
          <p>Your one-stop destination for all college events</p>
        </div>
        
        <div class="grid grid-3">
          <div class="card text-center fade-in-up">
            <div class="card-content">
              <div style="font-size: 3rem; margin-bottom: 1rem;">🎯</div>
              <h3>Stay Updated</h3>
              <p>Get real-time updates about all college events, never miss an important announcement.</p>
            </div>
          </div>
          
          <div class="card text-center fade-in-up">
            <div class="card-content">
              <div style="font-size: 3rem; margin-bottom: 1rem;">📅</div>
              <h3>Easy Planning</h3>
              <p>Browse events by category, date, and location. Plan your schedule effortlessly.</p>
            </div>
          </div>
          
          <div class="card text-center fade-in-up">
            <div class="card-content">
              <div style="font-size: 3rem; margin-bottom: 1rem;">❤️</div>
              <h3>Bookmark Favorites</h3>
              <p>Save events and gallery images you love. Create your personal collection.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  `;
}

// Render About Page
function renderAboutPage(content) {
  content.innerHTML = `
    <section class="section">
      <div class="container">
        <div class="text-center mb-3">
          <h1>About Excellence Institute of Technology</h1>
          <p>Fostering excellence in education and innovation</p>
        </div>
        
        <div class="grid grid-2 mb-3">
          <div class="fade-in-up">
            <h2>Our Legacy</h2>
            <p>Excellence Institute of Technology has been a pioneer in technical education for over two decades. Founded with the vision of creating tomorrow's innovators, our institute has consistently maintained its position as a leading educational institution.</p>
            <p>We believe in nurturing not just academic excellence but also the overall personality development of our students through various cultural, technical, and sports activities.</p>
          </div>
          
          <div class="fade-in-up">
            <h2>Our Mission</h2>
            <p>To provide world-class education that empowers students with knowledge, skills, and values needed to excel in their chosen careers and contribute meaningfully to society.</p>
            
            <h3 class="mt-2">Core Values</h3>
            <ul>
              <li><strong>Excellence:</strong> Striving for the highest standards in everything we do</li>
              <li><strong>Innovation:</strong> Encouraging creative thinking and problem-solving</li>
              <li><strong>Integrity:</strong> Maintaining honesty and transparency in all interactions</li>
              <li><strong>Inclusivity:</strong> Creating an environment where everyone feels valued</li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <section class="section bg-light">
      <div class="container">
        <div class="text-center mb-3">
          <h2>Annual Events</h2>
          <p>Celebrating tradition, innovation, and excellence</p>
        </div>
        
        <div class="grid grid-2">
          <div class="card fade-in-up">
            <div class="card-content">
              <h3 class="text-primary">🔧 Technical Events</h3>
              <p><strong>TechFest:</strong> Our flagship technical festival featuring hackathons, coding competitions, project exhibitions, and tech talks by industry experts.</p>
              <p><strong>Innovation Lab:</strong> Showcasing groundbreaking student research and development projects across various engineering disciplines.</p>
              <p><strong>Robotics Championship:</strong> Inter-college robotics competition challenging students to build autonomous and remote-controlled robots.</p>
            </div>
          </div>
          
          <div class="card fade-in-up">
            <div class="card-content">
              <h3 class="text-warning">🎭 Cultural Events</h3>
              <p><strong>Cultural Extravaganza:</strong> A vibrant celebration of arts, music, dance, and literature featuring performances by talented students from all departments.</p>
              <p><strong>Annual Day:</strong> The grandest celebration of the year with cultural performances, awards ceremonies, and recognition of achievements.</p>
              <p><strong>Literary Fest:</strong> Poetry recitations, drama competitions, and creative writing contests showcasing our students' artistic talents.</p>
            </div>
          </div>
          
          <div class="card fade-in-up">
            <div class="card-content">
              <h3 class="text-success">🏆 Sports Events</h3>
              <p><strong>Inter-Departmental Championships:</strong> Competitions in cricket, football, basketball, volleyball, badminton, and athletics.</p>
              <p><strong>Annual Sports Meet:</strong> A week-long celebration of sportsmanship and athletic excellence with various indoor and outdoor games.</p>
              <p><strong>Fitness Challenges:</strong> Promoting health and wellness through marathon runs, gym competitions, and fitness awareness programs.</p>
            </div>
          </div>
          
          <div class="card fade-in-up">
            <div class="card-content">
              <h3 class="text-info">🎓 Academic Events</h3>
              <p><strong>Research Symposium:</strong> Presenting cutting-edge research work by faculty and students in various engineering and science disciplines.</p>
              <p><strong>Industry Connect:</strong> Career fairs, placement drives, and networking sessions with leading companies and startups.</p>
              <p><strong>Academic Excellence Awards:</strong> Recognizing outstanding academic achievements, research contributions, and innovative projects.</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="text-center mb-3">
          <h2>Event Organizing Bodies</h2>
          <p>Dedicated teams that make our events successful</p>
        </div>
        
        <div class="grid grid-4">
          <div class="text-center fade-in-up">
            <div class="badge badge-primary" style="font-size: 2rem; padding: 1rem; margin-bottom: 1rem;">🎯</div>
            <h3>Student Council</h3>
            <p>Overall event coordination and student representation</p>
          </div>
          
          <div class="text-center fade-in-up">
            <div class="badge badge-warning" style="font-size: 2rem; padding: 1rem; margin-bottom: 1rem;">🎨</div>
            <h3>Cultural Committee</h3>
            <p>Organizing cultural events, art exhibitions, and performances</p>
          </div>
          
          <div class="text-center fade-in-up">
            <div class="badge badge-primary" style="font-size: 2rem; padding: 1rem; margin-bottom: 1rem;">💻</div>
            <h3>Technical Society</h3>
            <p>Managing technical festivals, workshops, and competitions</p>
          </div>
          
          <div class="text-center fade-in-up">
            <div class="badge badge-success" style="font-size: 2rem; padding: 1rem; margin-bottom: 1rem;">⚽</div>
            <h3>Sports Committee</h3>
            <p>Coordinating sports events and fitness activities</p>
          </div>
        </div>
      </div>
    </section>
  `;
}

// Render Events Page
function renderEventsPage(content, initialFilter = null) {
  if (!eventsData) return;
  
  const categories = ['all', 'technical', 'cultural', 'sports', 'academic', 'departmental'];
  
  content.innerHTML = `
    <section class="section">
      <div class="container">
        <div class="text-center mb-3">
          <h1>Events Catalog</h1>
          <p>Discover all the amazing events happening at our college</p>
        </div>
        
        <!-- Filters -->
        <div class="filters">
          ${categories.map(category => `
            <button class="filter-btn ${(!initialFilter && category === 'all') || initialFilter === category ? 'active' : ''}" 
                    onclick="filterEvents('${category}')">${category.charAt(0).toUpperCase() + category.slice(1)}</button>
          `).join('')}
        </div>
        
        <!-- Sort Controls -->
        <div class="sort-controls">
          <label for="sortSelect">Sort by:</label>
          <select id="sortSelect" class="sort-select" onchange="sortEventsBy(this.value)">
            <option value="date">Date</option>
            <option value="name">Name</option>
            <option value="category">Category</option>
          </select>
        </div>
        
        <!-- Events Grid -->
        <div id="events-grid" class="grid grid-3">
          <!-- Events will be populated here -->
        </div>
        
        <!-- Empty State -->
        <div id="empty-state" class="text-center hidden">
          <h3>No events found</h3>
          <p>Try adjusting your filters to see more events.</p>
        </div>
      </div>
    </section>

    <!-- Event Detail Modal -->
    <div id="eventModal" class="modal">
      <div class="modal-content">
        <button class="modal-close" onclick="closeModal('eventModal')">×</button>
        <div id="eventModalContent"></div>
      </div>
    </div>
  `;
  
  // Initialize with filter if provided
  if (initialFilter) {
    filterEventsDisplay(initialFilter);
  } else {
    filterEventsDisplay('all');
  }
}

// Filter events display
function filterEventsDisplay(category) {
  if (!eventsData) return;
  
  const filtered = filterEvents(eventsData.events, category);
  const sorted = sortEvents(filtered, 'date');
  
  displayEvents(sorted);
  updateFilterButtons(category);
}

// Display events in grid
function displayEvents(events) {
  const grid = document.getElementById('events-grid');
  const emptyState = document.getElementById('empty-state');
  
  if (!grid) return;
  
  if (events.length === 0) {
    grid.innerHTML = '';
    if (emptyState) emptyState.classList.remove('hidden');
    return;
  }
  
  if (emptyState) emptyState.classList.add('hidden');
  grid.innerHTML = events.map(event => createEventCard(event)).join('');
  
  // Reinitialize scroll animations for new content
  setTimeout(() => {
    initScrollAnimations();
  }, 100);
}

// Update filter button states
function updateFilterButtons(activeCategory) {
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.classList.remove('active');
    if (btn.textContent.toLowerCase() === activeCategory || 
        (activeCategory === 'all' && btn.textContent.toLowerCase() === 'all')) {
      btn.classList.add('active');
    }
  });
}

// Global functions for event interactions
window.filterEvents = filterEventsDisplay;

window.sortEventsBy = function(sortBy) {
  const activeFilter = document.querySelector('.filter-btn.active').textContent.toLowerCase();
  const filtered = filterEvents(eventsData.events, activeFilter === 'all' ? null : activeFilter);
  const sorted = sortEvents(filtered, sortBy);
  displayEvents(sorted);
};

window.showEventDetails = function(eventId) {
  const event = eventsData.events.find(e => e.id === eventId);
  if (!event) return;
  
  const modalContent = document.getElementById('eventModalContent');
  const isBookmarked = BookmarkManager.isBookmarked('events', event.id);
  const statusBadge = event.status === 'upcoming' ? 'badge-success' : 'badge-secondary';
  const categoryBadge = getCategoryBadgeClass(event.category);
  
  modalContent.innerHTML = `
    <div class="text-center mb-2">
      <img src="${event.image}" alt="${event.name}" style="max-width: 100%; height: 300px; object-fit: cover; border-radius: 0.5rem;"
           onerror="this.src='https://via.placeholder.com/600x300?text=${encodeURIComponent(event.name)}'">
    </div>
    
    <div class="d-flex justify-between align-center mb-2">
      <h2>${event.name}</h2>
      <button class="bookmark-btn ${isBookmarked ? 'bookmarked' : ''}" 
              onclick="toggleEventBookmark(${event.id})" 
              title="${isBookmarked ? 'Remove from bookmarks' : 'Add to bookmarks'}">
        ❤️
      </button>
    </div>
    
    <div class="mb-2">
      <span class="badge ${statusBadge}">${event.status}</span>
      <span class="badge ${categoryBadge}">${event.category}</span>
    </div>
    
    <div class="card-meta mb-2">
      <span class="card-meta-item">📅 ${formatDate(event.date)}</span>
      <span class="card-meta-item">⏰ ${event.time}</span>
      <span class="card-meta-item">📍 ${event.venue}</span>
      <span class="card-meta-item">👥 ${event.organizer}</span>
    </div>
    
    <p><strong>Description:</strong></p>
    <p>${event.longDescription || event.description}</p>
    
    ${event.registrationRequired ? 
      '<div class="mt-2"><span class="badge badge-warning">Registration Required</span></div>' : 
      ''}
  `;
  
  openModal('eventModal');
};

window.toggleEventBookmark = function(eventId) {
  const isBookmarked = BookmarkManager.toggleBookmark('events', eventId);
  
  // Update all bookmark buttons for this event
  document.querySelectorAll(`[onclick*="toggleEventBookmark(${eventId})"]`).forEach(btn => {
    btn.classList.toggle('bookmarked', isBookmarked);
    btn.title = isBookmarked ? 'Remove from bookmarks' : 'Add to bookmarks';
  });
};

// Continue with other page renderers...
// (I'll continue with the remaining pages in the next parts due to length limits)

// Render Gallery Page
function renderGalleryPage(content, initialFilter = null) {
  if (!galleryData) return;
  
  const years = ['all', '2023-24', '2022-23'];
  const categories = ['all', 'technical', 'cultural', 'sports', 'academic'];
  
  content.innerHTML = `
    <section class="section">
      <div class="container">
        <div class="text-center mb-3">
          <h1>Event Gallery</h1>
          <p>Relive the memorable moments from our events</p>
        </div>
        
        <!-- Filter Tabs -->
        <div class="filters">
          <div style="margin-bottom: 1rem;">
            <strong>Filter by Year:</strong>
            ${years.map(year => `
              <button class="filter-btn ${(!initialFilter && year === 'all') ? 'active' : ''}" 
                      onclick="filterGallery('${year}')">${year === 'all' ? 'All Years' : year}</button>
            `).join('')}
          </div>
          <div>
            <strong>Filter by Category:</strong>
            ${categories.map(category => `
              <button class="filter-btn" onclick="filterGallery('${category}')">
                ${category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            `).join('')}
          </div>
        </div>
        
        <!-- Gallery Grid -->
        <div id="gallery-grid" class="grid grid-4">
          <!-- Gallery items will be populated here -->
        </div>
        
        <!-- Empty State -->
        <div id="gallery-empty-state" class="text-center hidden">
          <h3>No images found</h3>
          <p>Try adjusting your filters to see more images.</p>
        </div>
      </div>
    </section>

    <!-- Gallery Modal -->
    <div id="galleryModal" class="modal">
      <div class="modal-content" style="max-width: 80%; max-height: 80%;">
        <button class="modal-close" onclick="closeModal('galleryModal')">×</button>
        <div id="galleryModalContent"></div>
      </div>
    </div>
  `;
  
  // Initialize gallery
  filterGalleryDisplay('all');
}

// Filter gallery display
function filterGalleryDisplay(filter) {
  if (!galleryData) return;
  
  const filtered = filterGallery(galleryData.gallery, filter);
  displayGallery(filtered);
  updateGalleryFilterButtons(filter);
}

// Display gallery items
function displayGallery(items) {
  const grid = document.getElementById('gallery-grid');
  const emptyState = document.getElementById('gallery-empty-state');
  
  if (!grid) return;
  
  if (items.length === 0) {
    grid.innerHTML = '';
    if (emptyState) emptyState.classList.remove('hidden');
    return;
  }
  
  if (emptyState) emptyState.classList.add('hidden');
  grid.innerHTML = items.map(item => createGalleryItem(item)).join('');
  
  setTimeout(() => {
    initScrollAnimations();
  }, 100);
}

// Update gallery filter buttons
function updateGalleryFilterButtons(activeFilter) {
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.classList.remove('active');
    const btnText = btn.textContent.toLowerCase().replace(' years', '').replace('all ', 'all');
    if (btnText === activeFilter.toLowerCase()) {
      btn.classList.add('active');
    }
  });
}

// Global gallery functions
window.filterGallery = filterGalleryDisplay;

window.openGalleryModal = function(itemId) {
  const item = galleryData.gallery.find(i => i.id === itemId);
  if (!item) return;
  
  const modalContent = document.getElementById('galleryModalContent');
  const isBookmarked = BookmarkManager.isBookmarked('gallery', item.id);
  
  modalContent.innerHTML = `
    <div class="text-center">
      <img src="${item.image}" alt="${item.title}" style="max-width: 100%; max-height: 60vh; object-fit: contain;"
           onerror="this.src='https://via.placeholder.com/600x400?text=${encodeURIComponent(item.title)}'">
      
      <div class="mt-2">
        <div class="d-flex justify-between align-center mb-2">
          <h3>${item.title}</h3>
          <button class="bookmark-btn ${isBookmarked ? 'bookmarked' : ''}" 
                  onclick="toggleGalleryBookmark(${item.id})" 
                  title="${isBookmarked ? 'Remove from bookmarks' : 'Add to bookmarks'}">
            ❤️
          </button>
        </div>
        
        <p><strong>Event:</strong> ${item.event}</p>
        <p><strong>Category:</strong> ${item.category} | <strong>Year:</strong> ${item.year}</p>
        <p>${item.description}</p>
      </div>
    </div>
  `;
  
  openModal('galleryModal');
};

window.toggleGalleryBookmark = function(itemId) {
  const isBookmarked = BookmarkManager.toggleBookmark('gallery', itemId);
  
  // Update all bookmark buttons for this item
  document.querySelectorAll(`[onclick*="toggleGalleryBookmark(${itemId})"]`).forEach(btn => {
    btn.classList.toggle('bookmarked', isBookmarked);
    btn.title = isBookmarked ? 'Remove from bookmarks' : 'Add to bookmarks';
  });
};

// Render Feedback Page
function renderFeedbackPage(content) {
  content.innerHTML = `
    <section class="section">
      <div class="container">
        <div class="text-center mb-3">
          <h1>Feedback</h1>
          <p>We value your opinion! Help us improve our events and services.</p>
        </div>
        
        <div class="grid grid-2">
          <div class="card fade-in-up">
            <div class="card-content">
              <h2>Event Feedback Form</h2>
              <p>Share your thoughts about our events and help us make them even better.</p>
              
              <form id="feedbackForm" class="mt-2">
                <div class="form-group">
                  <label for="name" class="form-label">Full Name *</label>
                  <input type="text" id="name" class="form-control" required>
                </div>
                
                <div class="form-group">
                  <label for="email" class="form-label">Email Address *</label>
                  <input type="email" id="email" class="form-control" required>
                </div>
                
                <div class="form-group">
                  <label for="userType" class="form-label">User Type *</label>
                  <select id="userType" class="form-control form-select" required>
                    <option value="">Select your role</option>
                    <option value="student">Student</option>
                    <option value="faculty">Faculty</option>
                    <option value="staff">Staff</option>
                    <option value="alumni">Alumni</option>
                    <option value="visitor">Visitor</option>
                  </select>
                </div>
                
                <div class="form-group">
                  <label for="eventAttended" class="form-label">Event Attended</label>
                  <select id="eventAttended" class="form-control form-select">
                    <option value="">Select an event</option>
                    <option value="techfest">TechFest 2024</option>
                    <option value="cultural">Cultural Extravaganza</option>
                    <option value="sports">Sports Championship</option>
                    <option value="academic">Academic Excellence Awards</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                
                <div class="form-group">
                  <label class="form-label">Overall Rating *</label>
                  <div class="rating" id="rating">
                    <span class="rating-star" data-rating="1">★</span>
                    <span class="rating-star" data-rating="2">★</span>
                    <span class="rating-star" data-rating="3">★</span>
                    <span class="rating-star" data-rating="4">★</span>
                    <span class="rating-star" data-rating="5">★</span>
                  </div>
                  <input type="hidden" id="ratingValue" required>
                </div>
                
                <div class="form-group">
                  <label for="comments" class="form-label">Comments & Suggestions</label>
                  <textarea id="comments" class="form-control" rows="5" 
                           placeholder="Please share your detailed feedback, suggestions, or any issues you encountered..."></textarea>
                </div>
                
                <div class="form-group">
                  <label>
                    <input type="checkbox" id="subscribe" style="margin-right: 0.5rem;">
                    Subscribe to event notifications
                  </label>
                </div>
                
                <button type="submit" class="btn btn-primary w-full">Submit Feedback</button>
                
                <div id="formMessage" class="mt-2 text-center hidden"></div>
              </form>
            </div>
          </div>
          
          <div class="fade-in-up">
            <div class="card">
              <div class="card-content">
                <h3>Why Your Feedback Matters</h3>
                <ul>
                  <li><strong>Event Improvement:</strong> Your suggestions help us enhance future events</li>
                  <li><strong>Service Quality:</strong> We use feedback to improve our services</li>
                  <li><strong>Student Voice:</strong> Your opinion shapes campus experiences</li>
                  <li><strong>Continuous Growth:</strong> Feedback drives our commitment to excellence</li>
                </ul>
              </div>
            </div>
            
            <div class="card mt-2">
              <div class="card-content">
                <h3>Other Ways to Reach Us</h3>
                <div class="contact-info">
                  <div class="contact-info-item">
                    <strong>Email:</strong> feedback@college.edu
                  </div>
                  <div class="contact-info-item">
                    <strong>Phone:</strong> +91-80-12345678
                  </div>
                  <div class="contact-info-item">
                    <strong>Office:</strong> Student Affairs Office, Admin Block
                  </div>
                </div>
              </div>
            </div>
            
            <div class="card mt-2">
              <div class="card-content">
                <h3>Feedback Statistics</h3>
                <div class="grid grid-2">
                  <div class="text-center">
                    <div class="text-primary" style="font-size: 2rem; font-weight: bold;">4.6/5</div>
                    <div>Average Rating</div>
                  </div>
                  <div class="text-center">
                    <div class="text-primary" style="font-size: 2rem; font-weight: bold;">1,250+</div>
                    <div>Feedback Received</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  `;
  
  // Initialize rating system
  initializeFeedbackForm();
}

// Initialize feedback form interactions
function initializeFeedbackForm() {
  // Rating system
  const ratingStars = document.querySelectorAll('.rating-star');
  const ratingValue = document.getElementById('ratingValue');
  
  ratingStars.forEach((star, index) => {
    star.addEventListener('click', () => {
      const rating = index + 1;
      ratingValue.value = rating;
      
      ratingStars.forEach((s, i) => {
        s.classList.toggle('active', i < rating);
      });
    });
    
    star.addEventListener('mouseover', () => {
      ratingStars.forEach((s, i) => {
        s.style.color = i <= index ? '#fbbf24' : '#d1d5db';
      });
    });
  });
  
  document.querySelector('.rating').addEventListener('mouseleave', () => {
    const currentRating = parseInt(ratingValue.value) || 0;
    ratingStars.forEach((s, i) => {
      s.style.color = i < currentRating ? '#fbbf24' : '#d1d5db';
    });
  });
  
  // Form submission (static - UI only)
  document.getElementById('feedbackForm').addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Simulate form processing
    const messageDiv = document.getElementById('formMessage');
    messageDiv.innerHTML = `
      <div style="padding: 1rem; background: #d1fae5; color: #065f46; border-radius: 0.5rem;">
        <strong>Thank you for your feedback!</strong><br>
        Your response has been recorded. We appreciate your input and will use it to improve our services.
      </div>
    `;
    messageDiv.classList.remove('hidden');
    
    // Reset form after delay
    setTimeout(() => {
      document.getElementById('feedbackForm').reset();
      ratingValue.value = '';
      ratingStars.forEach(s => {
        s.classList.remove('active');
        s.style.color = '#d1d5db';
      });
      messageDiv.classList.add('hidden');
    }, 3000);
  });
}

// Render Contact Page
function renderContactPage(content) {
  if (!contactsData) return;
  
  const college = contactsData.contacts.college;
  
  content.innerHTML = `
    <section class="section">
      <div class="container">
        <div class="text-center mb-3">
          <h1>Contact Us</h1>
          <p>Get in touch with our faculty coordinators and student representatives</p>
        </div>
      </div>
    </section>

    <section class="section bg-light">
      <div class="container">
        <h2 class="text-center mb-3">Faculty Coordinators</h2>
        <div class="grid grid-4">
          ${contactsData.contacts.faculty.map(contact => createContactCard(contact, false)).join('')}
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <h2 class="text-center mb-3">Student Representatives</h2>
        <div class="grid grid-3">
          ${contactsData.contacts.students.map(contact => createContactCard(contact, true)).join('')}
        </div>
      </div>
    </section>

    <section class="section bg-light">
      <div class="container">
        <div class="grid grid-2">
          <div class="fade-in-up">
            <h2>College Information</h2>
            <div class="card">
              <div class="card-content">
                <h3>${college.name}</h3>
                <div class="contact-info">
                  <div class="contact-info-item">
                    📍 ${college.address}
                  </div>
                  <div class="contact-info-item">
                    📞 ${college.phone}
                  </div>
                  <div class="contact-info-item">
                    ✉️ ${college.email}
                  </div>
                  <div class="contact-info-item">
                    🌐 ${college.website}
                  </div>
                </div>
                
                <div class="mt-2">
                  <h4>Office Hours</h4>
                  <p><strong>Monday - Friday:</strong> 9:00 AM - 5:00 PM</p>
                  <p><strong>Saturday:</strong> 9:00 AM - 1:00 PM</p>
                  <p><strong>Sunday:</strong> Closed</p>
                </div>
              </div>
            </div>
          </div>
          
          <div class="fade-in-up">
            <h2>Find Us</h2>
            <div class="map-container">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3888.5815550388536!2d77.59198!3d12.9716!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTLCsDU4JzE3LjgiTiA3N8KwMzUnMzEuMiJF!5e0!3m2!1sen!2sin!4v1620000000000!5m2!1sen!2sin"
                allowfullscreen="" 
                loading="lazy" 
                referrerpolicy="no-referrer-when-downgrade">
              </iframe>
            </div>
          </div>
        </div>
      </div>
    </section>
  `;
}
