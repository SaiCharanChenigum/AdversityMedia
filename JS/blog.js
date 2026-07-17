// Select all blog cards
const blogCards = document.querySelectorAll('.blog-card');

blogCards.forEach(card => {
  const readMoreBtn = card.querySelector('.readmore-btn');
  const hiddenSection = card.querySelector('.hidden-section');

  // Create Read Less button inside hidden section if it doesn't exist
  let readLessBtn = hiddenSection.querySelector('.readless-btn');
  if (!readLessBtn) {
    readLessBtn = document.createElement('button');
    readLessBtn.textContent = 'Read Less';
    readLessBtn.className = 'readless-btn';
    // Styling
    readLessBtn.style.background = 'linear-gradient(90deg, #2b57ff 0%, #764ba2 100%)'; // primary gradient
readLessBtn.style.color = '#fff'; // white text
readLessBtn.style.border = 'none'; // remove border to match gradient

    readLessBtn.style.padding = '0.5rem 1.2rem';
    readLessBtn.style.borderRadius = '30px';
    readLessBtn.style.fontWeight = '600';
    readLessBtn.style.cursor = 'pointer';
    readLessBtn.style.marginTop = '1rem';
    readLessBtn.style.display = 'none'; // initially hidden
    readLessBtn.style.transition = 'all 0.3s ease';
    readLessBtn.addEventListener('mouseover', () => {
      readLessBtn.style.transform = 'translateY(-3px)';
      readLessBtn.style.boxShadow = '0 4px 10px rgba(0,0,0,0.1)';
    });
    readLessBtn.addEventListener('mouseout', () => {
      readLessBtn.style.transform = 'translateY(0)';
      readLessBtn.style.boxShadow = 'none';
    });
    hiddenSection.appendChild(readLessBtn);
  }

  // Hide section initially
  hiddenSection.style.display = 'none';
  hiddenSection.style.opacity = 0;
  hiddenSection.style.transition = 'all 0.4s ease, height 0.4s ease';

  // Read More click
  readMoreBtn.addEventListener('click', () => {
    hiddenSection.style.display = 'block';
    requestAnimationFrame(() => {
      hiddenSection.style.opacity = 1;
      hiddenSection.style.height = hiddenSection.scrollHeight + 'px';
    });
    readMoreBtn.style.display = 'none';
    readLessBtn.style.display = 'inline-block';
    // Optional: scroll into view
    hiddenSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  // Read Less click
  readLessBtn.addEventListener('click', () => {
    hiddenSection.style.opacity = 0;
    hiddenSection.style.height = 0;
    hiddenSection.addEventListener('transitionend', function handler() {
      hiddenSection.style.display = 'none';
      hiddenSection.removeEventListener('transitionend', handler);
    });
    readLessBtn.style.display = 'none';
    readMoreBtn.style.display = 'inline-block';
  });

  // Optional: hover animation for Read More
  readMoreBtn.style.transition = 'all 0.3s ease';
  readMoreBtn.addEventListener('mouseover', () => {
    readMoreBtn.style.transform = 'translateY(-3px)';
    readMoreBtn.style.boxShadow = '0 4px 10px rgba(0,0,0,0.1)';
  });
  readMoreBtn.addEventListener('mouseout', () => {
    readMoreBtn.style.transform = 'translateY(0)';
    readMoreBtn.style.boxShadow = 'none';
  });
});
