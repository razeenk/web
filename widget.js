
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
        const index = parseInt(dot.getAttribute('data-index') || '0', 10);
        goToSlide(index);
        resetAutoplay();
      });
    });
    
    // Autoplay functionality
    let autoplayTimer;
    
    function startAutoplay() {
      if (autoplay && testimonials.length > 1) {
        autoplayTimer = setInterval(() => {
          goToSlide(currentIndex + 1);
        }, interval);
      }
    }
    
    function resetAutoplay() {
      if (autoplayTimer) {
        clearInterval(autoplayTimer);
      }
      startAutoplay();
    }
    
    // Start the autoplay
    startAutoplay();
    
    // Add event listeners to pause autoplay on hover
    wrapper.addEventListener('mouseenter', () => {
      if (autoplayTimer) {
        clearInterval(autoplayTimer);
      }
    });
    
    wrapper.addEventListener('mouseleave', () => {
      startAutoplay();
    });
  }

  function parseCSV(csv) {
    const lines = csv.split('\n');
    return lines.map(line => {
      // Handle commas within quotes
      let inQuote = false;
      let currentToken = '';
      const tokens = [];
      
      for (let i = 0; i < line.length; i++) {
        const char = line[i];
        
        if (char === '"') {
          inQuote = !inQuote;
        } else if (char === ',' && !inQuote) {
          tokens.push(currentToken);
          currentToken = '';
        } else {
          currentToken += char;
        }
      }
      
      // Don't forget the last token
      tokens.push(currentToken);
      
      // Clean up the tokens (remove quotes and trim)
      return tokens.map(token => {
        token = token.trim();
        if (token.startsWith('"') && token.endsWith('"')) {
          token = token.substring(1, token.length - 1);
        }
        return token;
      });
    }).filter(row => row.length > 0 && row[0].trim() !== '');
  }

  function createWidgetHTML(style, theme, name, company, text, rating) {
    const themeClasses = {
      light: 'bg-white text-gray-800 border border-gray-200',
      dark: 'bg-gray-900 text-white border border-gray-800',
      colorful: 'bg-gradient-to-r from-violet-500 to-purple-600 text-white',
      blue: 'bg-gradient-to-r from-blue-400 to-blue-600 text-white',
      green: 'bg-gradient-to-r from-green-400 to-green-600 text-white'
    };

    const renderStars = () => {
      return Array(5).fill(0).map((_, i) => 
        `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="${i < rating ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2" class="${i < rating ? 'text-amber-400' : 'text-gray-300'}">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
        </svg>`
      ).join('');
    };

    const avatarInitial = name.substring(0, 1);

    if (style === 'card') {
      return `
        <div class="p-6 rounded-xl shadow-md max-w-sm ${themeClasses[theme] || themeClasses.light}">
          <div class="mb-3">${renderStars()}</div>
          <p class="mb-4 text-sm">${text}</p>
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 rounded-full bg-gradient-to-r from-violet-400 to-purple-500 flex items-center justify-center text-white font-medium">
              ${avatarInitial}
            </div>
            <div>
              <p class="font-medium text-sm">${name}</p>
              <p class="text-xs ${theme === 'dark' ? 'text-gray-400' : theme === 'colorful' || theme === 'blue' || theme === 'green' ? 'text-white/80' : 'text-gray-500'}">
                ${company}
              </p>
            </div>
          </div>
        </div>
      `;
    }

    if (style === 'simple') {
      return `
        <div class="p-4 rounded-lg max-w-sm ${themeClasses[theme] || themeClasses.light}">
          <div class="flex items-center gap-3 mb-3">
            <div class="w-12 h-12 rounded-full bg-gradient-to-r from-violet-400 to-purple-500 flex items-center justify-center text-white font-medium">
              ${avatarInitial}
            </div>
            <div>
              <p class="font-medium text-sm">${name}</p>
              <p class="text-xs ${theme === 'dark' ? 'text-gray-400' : theme === 'colorful' || theme === 'blue' || theme === 'green' ? 'text-white/80' : 'text-gray-500'}">
                ${company}
              </p>
            </div>
          </div>
          <p class="text-sm">${text}</p>
          <div class="mt-2">${renderStars()}</div>
        </div>
      `;
    }

    // Quote style or fallback
    return `
      <div class="p-6 rounded-xl shadow-md max-w-sm ${themeClasses[theme] || themeClasses.light}">
        <div class="mb-4 text-4xl font-serif opacity-50 h-8">❝</div>
        <p class="mb-6 text-sm italic">${text}</p>
        <div class="flex items-center gap-2">
          <div class="w-12 h-12 rounded-full bg-gradient-to-r from-violet-400 to-purple-500 flex items-center justify-center text-white font-medium">
            ${avatarInitial}
          </div>
          <div>
            <p class="font-medium text-sm">${name}</p>
            <p class="text-xs ${theme === 'dark' ? 'text-gray-400' : theme === 'colorful' || theme === 'blue' || theme === 'green' ? 'text-white/80' : 'text-gray-500'}">
              ${company}
            </p>
          </div>
        </div>
      </div>
    `;
  }

  // Initialize widgets on page load
  function initWidgets() {
    const testimonialContainers = document.querySelectorAll('[id="testimonials"]');
    testimonialContainers.forEach(createTestimonialWidget);
  }

  // Run initialization when the script loads
  initWidgets();
})();
