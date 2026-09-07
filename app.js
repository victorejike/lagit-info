// LegitInfo Prototype Application Logic

document.addEventListener('DOMContentLoaded', () => {
  initTabNavigation();
  initPostReactions();
  initCommentAccordions();
  initCommentComposer();
  initPostModal();
  initNewsCategories();
  initIndividualCommentReactions();
});

// Toast Helper
function showToast(message, icon = '✓') {
  const toast = document.getElementById('toast-banner');
  const toastText = document.getElementById('toast-text');
  const toastIcon = document.getElementById('toast-icon');
  
  if (!toast) return;
  
  toastIcon.textContent = icon;
  toastText.textContent = message;
  toast.classList.add('show');
  
  clearTimeout(window.toastTimer);
  window.toastTimer = setTimeout(() => {
    toast.classList.remove('show');
  }, 2800);
}

// 1. Tab Navigation (Posts vs News with Sliding Pill & Smooth Transitions)
function initTabNavigation() {
  const postsTab = document.getElementById('tab-posts');
  const newsTab = document.getElementById('tab-news');
  const indicator = document.getElementById('tab-indicator');
  const postsView = document.getElementById('posts-view');
  const newsView = document.getElementById('news-view');
  
  let currentTab = 'posts';
  
  function updateIndicator(tab) {
    if (tab === 'posts') {
      indicator.style.transform = 'translateX(0)';
      postsTab.classList.add('active');
      newsTab.classList.remove('active');
    } else {
      indicator.style.transform = 'translateX(100%)';
      newsTab.classList.add('active');
      postsTab.classList.remove('active');
    }
  }
  
  function switchPage(target) {
    if (target === currentTab) return;
    
    if (target === 'news') {
      // Transition from Posts to News
      postsView.className = 'page-view page-exit-to-left';
      setTimeout(() => {
        postsView.classList.add('hidden');
        postsView.classList.remove('page-exit-to-left');
        
        newsView.classList.remove('hidden');
        newsView.className = 'page-view page-enter-from-right';
      }, 200);
      
      updateIndicator('news');
      currentTab = 'news';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      // Transition from News to Posts
      newsView.className = 'page-view page-exit-to-right';
      setTimeout(() => {
        newsView.classList.add('hidden');
        newsView.classList.remove('page-exit-to-right');
        
        postsView.classList.remove('hidden');
        postsView.className = 'page-view page-enter-from-left';
      }, 200);
      
      updateIndicator('posts');
      currentTab = 'posts';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }
  
  postsTab.addEventListener('click', () => switchPage('posts'));
  newsTab.addEventListener('click', () => switchPage('news'));
  
  // Set initial indicator position
  updateIndicator('posts');
  // Hash route support (#posts or #news)
  if (window.location.hash === '#news') {
    switchPage('news');
  }
  window.addEventListener('hashchange', () => {
    if (window.location.hash === '#news') switchPage('news');
    else switchPage('posts');
  });

}

// 2. Post Engagement & Reaction Toggle (Heart/Like)
function initPostReactions() {
  const reactionBtn = document.getElementById('main-post-reactions');
  const reactionCount = document.getElementById('main-reaction-count');
  const shareBtn = document.getElementById('main-share-btn');
  const commentsStatBtn = document.getElementById('main-comments-stat');
  
  let isLiked = false;
  let baseCount = 245;
  
  if (reactionBtn && reactionCount) {
    reactionBtn.addEventListener('click', () => {
      isLiked = !isLiked;
      
      const stack = reactionBtn.querySelector('.reaction-icons-stack');
      stack.classList.remove('pop-bounce');
      void stack.offsetWidth; // trigger reflow
      stack.classList.add('pop-bounce');
      
      if (isLiked) {
        reactionCount.textContent = (baseCount + 1).toString();
        reactionCount.classList.add('active-liked');
        showToast('You liked Victor\'s post', '❤️');
      } else {
        reactionCount.textContent = baseCount.toString();
        reactionCount.classList.remove('active-liked');
        showToast('Reaction removed', '↺');
      }
    });
  }
  
  if (shareBtn) {
    shareBtn.addEventListener('click', () => {
      navigator.clipboard?.writeText(window.location.href);
      showToast('Post link copied to clipboard!', '🔗');
    });
  }
  
  if (commentsStatBtn) {
    commentsStatBtn.addEventListener('click', () => {
      document.querySelector('.comments-container-card')?.scrollIntoView({ behavior: 'smooth' });
    });
  }
}

// 3. Comments Accordions ("View more" and "Show less")
function initCommentAccordions() {
  const agreedBtn = document.getElementById('agreed-view-more-btn');
  const agreedDrawer = document.getElementById('agreed-extra-drawer');
  
  const disagreedBtn = document.getElementById('disagreed-view-more-btn');
  const disagreedDrawer = document.getElementById('disagreed-extra-drawer');
  
  if (agreedBtn && agreedDrawer) {
    agreedBtn.addEventListener('click', () => {
      const isExpanded = agreedDrawer.classList.contains('expanded');
      if (isExpanded) {
        agreedDrawer.classList.remove('expanded');
        agreedBtn.innerHTML = `View more (21) <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"></polyline></svg>`;
      } else {
        agreedDrawer.classList.add('expanded');
        agreedBtn.innerHTML = `Show less <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="18 15 12 9 6 15"></polyline></svg>`;
      }
    });
  }
  
  if (disagreedBtn && disagreedDrawer) {
    disagreedBtn.addEventListener('click', () => {
      const isExpanded = disagreedDrawer.classList.contains('expanded');
      if (isExpanded) {
        disagreedDrawer.classList.remove('expanded');
        disagreedBtn.innerHTML = `View more (5) <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"></polyline></svg>`;
      } else {
        disagreedDrawer.classList.add('expanded');
        disagreedBtn.innerHTML = `Show less <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="18 15 12 9 6 15"></polyline></svg>`;
      }
    });
  }
}

// 4. Comment Stance Selection & Real-Time Insertion
let currentStance = 'agree';
let agreedCount = 24;
let disagreedCount = 8;

function updateConsensusBar() {
  const total = agreedCount + disagreedCount;
  const agreedPct = Math.round((agreedCount / total) * 100);
  const disagreedPct = 100 - agreedPct;
  
  const fill = document.getElementById('consensus-bar-fill');
  const agreedLabel = document.getElementById('consensus-agreed-pct');
  const disagreedLabel = document.getElementById('consensus-disagreed-pct');
  const headerCount = document.getElementById('header-comments-count');
  
  if (fill) fill.style.width = `${agreedPct}%`;
  if (agreedLabel) agreedLabel.textContent = `${agreedPct}% Agreed`;
  if (disagreedLabel) disagreedLabel.textContent = `${disagreedPct}% Disagreed`;
  if (headerCount) headerCount.textContent = `Comments (${total})`;
}

function initCommentComposer() {
  const agreeBtn = document.getElementById('stance-btn-agree');
  const disagreeBtn = document.getElementById('stance-btn-disagree');
  const composerInput = document.getElementById('composer-comment-input');
  const sendBtn = document.getElementById('send-comment-btn');
  const emojiBtn = document.getElementById('emoji-trigger-btn');
  
  if (agreeBtn && disagreeBtn) {
    agreeBtn.addEventListener('click', () => {
      currentStance = 'agree';
      agreeBtn.classList.add('active-agree');
      disagreeBtn.classList.remove('active-disagree');
    });
    
    disagreeBtn.addEventListener('click', () => {
      currentStance = 'disagree';
      disagreeBtn.classList.add('active-disagree');
      agreeBtn.classList.remove('active-agree');
    });
  }
  
  function submitComment() {
    const text = composerInput.value.trim();
    if (!text) {
      composerInput.focus();
      return;
    }
    
    const isAgree = currentStance === 'agree';
    const targetList = document.getElementById(isAgree ? 'agreed-list' : 'disagreed-list');
    const counterElem = document.getElementById(isAgree ? 'agreed-header-counter' : 'disagreed-header-counter');
    
    // Create new comment element
    const commentEl = document.createElement('div');
    commentEl.className = 'comment-item newly-added-comment';
    
    const reactionBadgeClass = isAgree ? 'agreed-reaction-badge' : 'disagreed-reaction-badge';
    const reactionIcon = isAgree ? '👍' : '👎';
    
    commentEl.innerHTML = `
      <img src="assets/avatar_victor.png" alt="Victor" class="comment-avatar">
      <div class="comment-body">
        <div class="comment-author-row">
          <span class="comment-author-name">Victor Ejike</span>
          <span class="comment-reaction-badge ${reactionBadgeClass}">
            <span>${reactionIcon}</span>
            <span class="comment-count-val">1</span>
          </span>
        </div>
        <div class="comment-text">${escapeHtml(text)}</div>
        <div class="comment-timestamp">Just now • Verified Stance</div>
      </div>
    `;
    
    // Prepend to list
    targetList.insertBefore(commentEl, targetList.firstChild);
    
    // Update counts
    if (isAgree) {
      agreedCount++;
      if (counterElem) counterElem.textContent = agreedCount;
      const colTitle = document.getElementById('agreed-col-title');
      if (colTitle) colTitle.textContent = `Agreed (${agreedCount})`;
      showToast('Your perspective added to Agreed!', '✓');
    } else {
      disagreedCount++;
      if (counterElem) counterElem.textContent = disagreedCount;
      const colTitle = document.getElementById('disagreed-col-title');
      if (colTitle) colTitle.textContent = `Disagreed (${disagreedCount})`;
      showToast('Your counter-perspective added to Disagreed!', '✕');
    }
    
    updateConsensusBar();
    composerInput.value = '';
    
    // Enable reactions on the new element
    initReactionForElement(commentEl.querySelector('.comment-reaction-badge'));
  }
  
  if (sendBtn) {
    sendBtn.addEventListener('click', submitComment);
  }
  
  if (composerInput) {
    composerInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        submitComment();
      }
    });
  }
  
  if (emojiBtn) {
    const emojis = ['🚀', '💡', '🔥', '👏', '🤖', '💯', '🤔', '👀'];
    emojiBtn.addEventListener('click', () => {
      const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
      composerInput.value += ` ${randomEmoji}`;
      composerInput.focus();
    });
  }
}

// 5. Individual Comment Reactions (👍 and 👎)
function initIndividualCommentReactions() {
  document.querySelectorAll('.comment-reaction-badge').forEach(initReactionForElement);
}

function initReactionForElement(badge) {
  if (!badge) return;
  let clicked = false;
  badge.addEventListener('click', (e) => {
    e.stopPropagation();
    const countSpan = badge.querySelector('.comment-count-val');
    if (!countSpan) return;
    
    let count = parseInt(countSpan.textContent, 10) || 0;
    if (!clicked) {
      count++;
      clicked = true;
      badge.style.transform = 'scale(1.2)';
      setTimeout(() => badge.style.transform = '', 200);
    } else {
      count--;
      clicked = false;
    }
    countSpan.textContent = count;
  });
}

// 6. Post Creation Modal
function initPostModal() {
  const openBtn = document.getElementById('open-create-post-modal');
  const modal = document.getElementById('create-post-modal');
  const closeBtn = document.getElementById('close-post-modal');
  const submitPostBtn = document.getElementById('submit-post-btn');
  const postTextarea = document.getElementById('new-post-textarea');
  const feedContainer = document.getElementById('feed-container');
  
  if (openBtn && modal) {
    openBtn.addEventListener('click', () => {
      modal.classList.add('open');
      postTextarea?.focus();
    });
  }
  
  if (closeBtn && modal) {
    closeBtn.addEventListener('click', () => modal.classList.remove('open'));
  }
  
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.classList.remove('open');
    });
  }
  
  if (submitPostBtn && postTextarea && feedContainer) {
    submitPostBtn.addEventListener('click', () => {
      const text = postTextarea.value.trim();
      if (!text) return;
      
      const newCard = document.createElement('div');
      newCard.className = 'feed-card newly-added-comment';
      newCard.innerHTML = `
        <div class="card-header">
          <div class="author-info">
            <div class="author-avatar-wrap">
              <img src="assets/avatar_victor.png" alt="Victor Ejike" class="author-avatar">
            </div>
            <div class="author-meta">
              <div class="author-name-row">
                <span class="author-name">Victor Ejike</span>
                <svg class="verified-icon" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
              </div>
              <div class="post-meta-sub">
                <span>Just now</span>
                <span class="meta-dot">•</span>
                <span>Public</span>
              </div>
            </div>
          </div>
        </div>
        <div class="card-content">
          <p class="post-text">${escapeHtml(text)}</p>
          <div class="post-hashtags">
            <span class="hashtag">#LegitInfo</span>
            <span class="hashtag">#Verified</span>
          </div>
        </div>
        <div class="card-engagement-bar">
          <div class="reaction-group">
            <span class="reaction-count">1 reaction</span>
          </div>
          <div class="engagement-actions-right">
            <div class="stat-item"><span>0 comments</span></div>
          </div>
        </div>
      `;
      
      feedContainer.insertBefore(newCard, feedContainer.children[1]); // after composer prompt
      postTextarea.value = '';
      modal.classList.remove('open');
      showToast('Post published to LegitInfo feed!', '🚀');
    });
  }
}

// 7. News Categories Filter
function initNewsCategories() {
  const chips = document.querySelectorAll('.category-chip');
  const newsCards = document.querySelectorAll('.news-card-item');
  
  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      chips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      
      const filter = chip.dataset.category;
      newsCards.forEach(card => {
        const cardCategory = card.dataset.category;
        if (filter === 'all' || cardCategory === filter) {
          card.style.display = 'block';
          card.style.animation = 'commentSlideIn 0.3s ease';
        } else {
          card.style.display = 'none';
        }
      });
      
      showToast(`Showing: ${chip.textContent}`, '📰');
    });
  });
  
  // Fact check detail buttons
  document.querySelectorAll('.factcheck-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      showToast('Opening verified primary citations dossier...', '🔍');
    });
  });
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}
