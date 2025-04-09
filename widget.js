// WidgetWhisper Testimonial Embed Script
(function() {
  function createTestimonialWidget(element) {
    // Extract configuration from data attributes
    const style = element.getAttribute('data-style') || 'card';
    const theme = element.getAttribute('data-theme') || 'light';
    const name = element.getAttribute('data-name') || '';
    const company = element.getAttribute('data-company') || '';
    const text = element.getAttribute('data-text') || '';
    const rating = parseInt(element.getAttribute('data-rating') || '5', 10);
    const sheetUrl = element.getAttribute('data-sheet-url');
    const orientation = element.getAttribute('data-orientation') || 'horizontal';
    const autoplay = element.getAttribute('data-autoplay') !== 'false';
    const interval = parseInt(element.getAttribute('data-interval') || '5000', 10);

    // If sheet URL is provided, fetch data from Google Sheets
    if (sheetUrl) {
      fetchGoogleSheetData(sheetUrl, element, style, theme, orientation, autoplay, interval);
      return;
    }

    // Create widget container
    const widget = document.createElement('div');
    widget.innerHTML = createWidgetHTML(style, theme, name, company, text, rating);
    element.appendChild(widget);
  }

  function fetchGoogleSheetData(sheetUrl, container, style, theme, orientation, autoplay, interval) {
    // Convert Google Sheets URL to CSV export URL
    const csvUrl = sheetUrl.replace(/\/edit.*$/, '/export?format=csv');

    fetch(csvUrl)
      .then(response => response.text())
      .then(csvData => {
        const rows = parseCSV(csvData);
        if (rows.length > 1) {
          // Skip header row
          const testimonials = rows.slice(1).map(row => {
            const [name, company, text, rating] = row;
            return { name, company, text, rating: parseInt(rating, 10) || 5 };
          });
          
          renderMultipleTestimonials(container, testimonials, style, theme, orientation, autoplay, interval);
        }
      })
      .catch(error => {
        console.error('Error fetching testimonial data:', error);
        container.innerHTML = `<div class="error">Error loading testimonials: ${error.message}</div>`;
      });
  }

  function renderMultipleTestimonials(container, testimonials, style, theme, orientation, autoplay, interval) {
    if (testimonials.length === 0) return;

    // Create wrapper for the carousel
    const wrapper = document.createElement('div');
    wrapper.className = 'ww-testimonial-carousel';
    wrapper.style.position = 'relative';
    wrapper.style.overflow = 'hidden';
    wrapper.style.width = '100%';
    wrapper.style.maxWidth = '100%';
    
    // Create track for the testimonials
    const track = document.createElement('div');
    track.className = 'ww-testimonial-track';
    track.style.display = 'flex';
    track.style.transition = 'transform 0.5s ease';
    
    if (orientation === 'vertical') {
      track.style.flexDirection = 'column';
      wrapper.style.height = '350px';
    } else {
      wrapper.style.height = 'auto';
    }

    // Add testimonials to the track
    testimonials.forEach((testimonial, index) => {
      const slide = document.createElement('div');
      slide.className = 'ww-testimonial-slide';
      slide.style.flex = '0 0 100%';
      slide.style.padding = orientation === 'vertical' ? '10px 0' : '0 10px';
      slide.style.boxSizing = 'border-box';
      
      slide.innerHTML = createWidgetHTML(
        style, 
        theme, 
        testimonial.name, 
        testimonial.company, 
        testimonial.text, 
        testimonial.rating
      );
      track.appendChild(slide);
    });
    
    wrapper.appendChild(track);
    
    // Add navigation buttons
    const prevButton = document.createElement('button');
    prevButton.className = 'ww-prev-btn';
    prevButton.innerHTML = orientation === 'vertical' 
      ? '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m18 15-6-6-6 6"/></svg>'
      : '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>';
    prevButton.style.position = 'absolute';
    prevButton.style.zIndex = '2';
    prevButton.style.background = 'white';
    prevButton.style.border = 'none';
    prevButton.style.borderRadius = '50%';
    prevButton.style.width = '40px';
    prevButton.style.height = '40px';
    prevButton.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
    prevButton.style.cursor = 'pointer';
    prevButton.style.display = 'flex';
    prevButton.style.alignItems = 'center';
    prevButton.style.justifyContent = 'center';
    
    const nextButton = document.createElement('button');
    nextButton.className = 'ww-next-btn';
    nextButton.innerHTML = orientation === 'vertical'
      ? '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>'
      : '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>';
    nextButton.style.position = 'absolute';
    nextButton.style.zIndex = '2';
    nextButton.style.background = 'white';
    nextButton.style.border = 'none';
    nextButton.style.borderRadius = '50%';
    nextButton.style.width = '40px';
    nextButton.style.height = '40px';
    nextButton.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
    nextButton.style.cursor = 'pointer';
    nextButton.style.display = 'flex';
    nextButton.style.alignItems = 'center';
    nextButton.style.justifyContent = 'center';
    
    // Position buttons based on orientation
    if (orientation === 'vertical') {
      prevButton.style.top = '0';
      prevButton.style.left = '50%';
      prevButton.style.transform = 'translateX(-50%)';
      
      nextButton.style.bottom = '0';
      nextButton.style.left = '50%';
      nextButton.style.transform = 'translateX(-50%)';
    } else {
      prevButton.style.top = '50%';
      prevButton.style.left = '0';
      prevButton.style.transform = 'translateY(-50%)';
      
      nextButton.style.top = '50%';
      nextButton.style.right = '0';
      nextButton.style.transform = 'translateY(-50%)';
    }
    
    wrapper.appendChild(prevButton);
    wrapper.appendChild(nextButton);
    
    // Add dots navigation
    const dotsContainer = document.createElement('div');
    dotsContainer.className = 'ww-dots-container';
    dotsContainer.style.display = 'flex';
    dotsContainer.style.justifyContent = 'center';
    dotsContainer.style.marginTop = '15px';
    
    testimonials.forEach((_, index) => {
      const dot = document.createElement('span');
      dot.className = 'ww-dot';
      dot.setAttribute('data-index', index.toString());
      dot.style.width = '8px';
      dot.style.height = '8px';
      dot.style.borderRadius = '50%';
      dot.style.background = index === 0 ? '#8B5CF6' : '#CBD5E0';
      dot.style.margin = '0 4px';
      dot.style.cursor = 'pointer';
      dot.style.transition = 'background-color 0.3s ease';
      dotsContainer.appendChild(dot);
    });
    
    // Append everything to the container
    container.appendChild(wrapper);
    container.appendChild(dotsContainer);
    
    // Set up carousel functionality
    let currentIndex = 0;
    const totalSlides = testimonials.length;
    
    function goToSlide(index) {
      if (index < 0) {
        index = totalSlides - 1;
      } else if (index >= totalSlides) {
        index = 0;
      }
      currentIndex = index;
      
      const translateValue = orientation === 'vertical' 
        ? `translateY(-${index * 100}%)`
        : `translateX(-${index * 100}%)`;
      
      track.style.transform = translateValue;
      
      // Update dots
      document.querySelectorAll('.ww-dot').forEach((dot, i) => {
        dot.style.background = i === currentIndex ? '#8B5CF6' : '#CBD5E0';
      });
    }
    
    prevButton.addEventListener('click', () => {
      goToSlide(currentIndex - 1);
      resetAutoplay();
    });
    
    nextButton.addEventListener('click', () => {
      goToSlide(currentIndex + 1);
      resetAutoplay();
    });
    
    // Set up dot navigation
    document.querySelectorAll('.ww-dot').forEach(dot => {
      dot.addEventListener('click', () => {
        const index = parseInt
