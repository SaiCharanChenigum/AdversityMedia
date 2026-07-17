/* ==========================================
   PORTFOLIO JAVASCRIPT
   Filtering, Load More, and Interactions
   ========================================== */

document.addEventListener('DOMContentLoaded', function() {
    
    // Portfolio filtering functionality
    const filterBtns = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    const loadMoreContainer = document.getElementById('loadMoreContainer');
    
    let visibleItems = 9; // Show 9 items initially
    let currentFilter = 'all';

    // Initialize portfolio
    initializePortfolio();

    // Filter functionality
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            currentFilter = filter;
            
            // Update active button
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // Filter items with animation
            filterPortfolioItems(filter);
            
            // Reset visible items counter
            visibleItems = 9;
            updateLoadMoreButton();
        });
    });

    // Load more functionality
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', function() {
            loadMoreItems();
        });
    }

    // Filter portfolio items function
    function filterPortfolioItems(filter) {
        portfolioItems.forEach((item, index) => {
            const category = item.getAttribute('data-category');
            
            if (filter === 'all' || category === filter) {
                setTimeout(() => {
                    item.style.display = 'block';
                    item.classList.remove('hidden');
                    
                    // Hide items beyond visible limit
                    const visibleFilteredItems = Array.from(portfolioItems)
                        .filter(i => {
                            const cat = i.getAttribute('data-category');
                            return filter === 'all' || cat === filter;
                        })
                        .filter(i => i.style.display !== 'none');
                    
                    if (visibleFilteredItems.indexOf(item) >= visibleItems) {
                        item.classList.add('hidden');
                    }
                }, index * 50);
            } else {
                item.classList.add('hidden');
                setTimeout(() => {
                    item.style.display = 'none';
                }, 300);
            }
        });
    }

    // Load more items function
    function loadMoreItems() {
        const hiddenItems = Array.from(portfolioItems).filter(item => {
            const category = item.getAttribute('data-category');
            const isCurrentCategory = currentFilter === 'all' || category === currentFilter;
            return isCurrentCategory && item.classList.contains('hidden');
        });

        const itemsToShow = hiddenItems.slice(0, 6);
        
        itemsToShow.forEach((item, index) => {
            setTimeout(() => {
                item.classList.remove('hidden');
            }, index * 100);
        });
        
        visibleItems += 6;
        updateLoadMoreButton();

        // Animate load more button
        loadMoreBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Loading...';
        setTimeout(() => {
            loadMoreBtn.innerHTML = 'Load More Projects <i class="fas fa-arrow-down ms-2"></i>';
        }, 800);
    }

    // Update load more button visibility
    function updateLoadMoreButton() {
        const totalFilteredItems = Array.from(portfolioItems).filter(item => {
            const category = item.getAttribute('data-category');
            return currentFilter === 'all' || category === currentFilter;
        }).length;
        
        if (visibleItems >= totalFilteredItems) {
            if (loadMoreContainer) {
                loadMoreContainer.style.display = 'none';
            }
        } else {
            if (loadMoreContainer) {
                loadMoreContainer.style.display = 'block';
            }
        }
    }

    // Initialize portfolio
    function initializePortfolio() {
        // Hide items beyond initial visible count
        portfolioItems.forEach((item, index) => {
            if (index >= visibleItems) {
                item.classList.add('hidden');
            }
        });
        
        updateLoadMoreButton();

        // Add smooth scroll to top when filter changes
        filterBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                setTimeout(() => {
                    document.querySelector('.portfolio-grid').scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }, 100);
            });
        });
    }

    // Portfolio item hover effects
    portfolioItems.forEach(item => {
        const card = item.querySelector('.portfolio-card');
        const image = item.querySelector('.portfolio-image img');
        
        if (card && image) {
            card.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-10px) scale(1.02)';
            });
            
            card.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0) scale(1)';
            });
        }
    });

    console.log('Portfolio functionality initialized successfully!');
});
