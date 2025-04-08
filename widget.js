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

    // If sheet URL is provided, fetch data from Google Sheets
    if (sheetUrl) {
      fetchGoogleSheetData(sheetUrl, element);
      return;
    }

    // Create widget container
    const widget = document.createElement('div');
    widget.innerHTML = createWidgetHTML(style, theme, name, company, text, rating);
    element.appendChild(widget);
  }

  function fetchGoogleSheetData(sheetUrl, container) {
    // Convert Google Sheets URL to CSV export URL
    const csvUrl = sheetUrl.replace('/edit?usp=sharing', '/export?format=csv');

    fetch(csvUrl)
      .then(response => response.text())
      .then(csvData => {
        const rows = parseCSV(csvData);
        if (rows.length > 0) {
          // Assume first row has headers, take first data row
          const firstTestimonial = rows[1];
          const [name, company, text, rating] = firstTestimonial;
          
          const widget = document.createElement('div');
          widget.innerHTML = createWidgetHTML(
            container.getAttribute('data-style') || 'card', 
            'light', 
            name, 
            company, 
            text, 
            parseInt(rating, 10)
          );
          container.appendChild(widget);
        }
      })
      .catch(error => {
        console.error('Error fetching testimonial data:', error);
      });
  }

  function parseCSV(csv) {
    const lines = csv.split('\n');
    return lines.map(line => line.split(',').map(cell => cell.trim()));
  }

  function createWidgetHTML(style, theme, name, company, text, rating) {
    const themeClasses = {
      light: 'bg-white text-gray-800 border border-gray-200',
      dark: 'bg-gray-900 text-white border border-gray-800',
      colorful: 'bg-gradient-to-r from-violet-500 to-purple-600 text-white'
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
        <div class="p-6 rounded-xl shadow-md max-w-sm ${themeClasses[theme]}">
          <div class="mb-3">${renderStars()}</div>
          <p class="mb-4 text-sm">${text}</p>
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 rounded-full bg-gradient-to-r from-violet-400 to-purple-500 flex items-center justify-center text-white font-medium">
              ${avatarInitial}
            </div>
            <div>
              <p class="font-medium text-sm">${name}</p>
              <p class="text-xs ${theme === 'dark' ? 'text-gray-400' : theme === 'colorful' ? 'text-white/80' : 'text-gray-500'}">
                ${company}
              </p>
            </div>
          </div>
        </div>
      `;
    }

    if (style === 'simple') {
      return `
        <div class="p-4 rounded-lg max-w-sm ${themeClasses[theme]}">
          <div class="flex items-center gap-3 mb-3">
            <div class="w-12 h-12 rounded-full bg-gradient-to-r from-violet-400 to-purple-500 flex items-center justify-center text-white font-medium">
              ${avatarInitial}
            </div>
            <div>
              <p class="font-medium text-sm">${name}</p>
              <p class="text-xs ${theme === 'dark' ? 'text-gray-400' : theme === 'colorful' ? 'text-white/80' : 'text-gray-500'}">
                ${company}
              </p>
            </div>
          </div>
          <p class="text-sm">${text}</p>
          <div class="mt-2">${renderStars()}</div>
        </div>
      `;
    }

    // Quote style
    return `
      <div class="p-6 rounded-xl shadow-md max-w-sm ${themeClasses[theme]}">
        <div class="mb-4 text-4xl font-serif opacity-50 h-8">❝</div>
        <p class="mb-6 text-sm italic">${text}</p>
        <div class="flex items-center gap-2">
          <div class="w-12 h-12 rounded-full bg-gradient-to-r from-violet-400 to-purple-500 flex items-center justify-center text-white font-medium">
            ${avatarInitial}
          </div>
          <div>
            <p class="font-medium text-sm">${name}</p>
            <p class="text-xs ${theme === 'dark' ? 'text-gray-400' : theme === 'colorful' ? 'text-white/80' : 'text-gray-500'}">
              ${company}
            </p>
          </div>
        </div>
      </div>
    `;
  }

  // Initialize widgets on page load
  function initWidgets() {
    const testimonialContainers = document.querySelectorAll('#testimonials');
    testimonialContainers.forEach(createTestimonialWidget);
  }

  // Run initialization when the script loads
  initWidgets();
})();
