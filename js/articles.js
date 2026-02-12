(async function () {
    const articlesContainer = document.getElementById('articles-grid');
    if (!articlesContainer) return;

    try {
        const response = await fetch('articles/manifest.json');
        if (!response.ok) throw new Error('Failed to load manifest');
        const files = await response.json();

        for (const file of files) {
            try {
                const articleRes = await fetch(`articles/${file}`);
                const text = await articleRes.text();
                const card = parseArticle(text);
                articlesContainer.appendChild(card);
            } catch (err) {
                console.error(`Error loading article ${file}:`, err);
            }
        }
    } catch (error) {
        console.error('Error initializing articles:', error);
        articlesContainer.innerHTML = '<p style="color:var(--text-muted)">Articles coming soon...</p>';
    }

    function parseArticle(text) {
        const lines = text.split('\n');
        let title = 'Untitled Article';
        let preview = '';
        let image = '';
        let contentHtml = '';

        // Simple Parser
        // Line 1 starting with # is Title
        // First paragraph is preview
        // Image syntax ![Alt](url)

        lines.forEach(line => {
            const trimmed = line.trim();
            if (trimmed.startsWith('# ')) {
                title = trimmed.substring(2);
            } else if (trimmed.startsWith('![') && trimmed.includes('](') && !image) {
                // Extract image URL: ![Alt](URL)
                const match = trimmed.match(/\!\[(.*?)\]\((.*?)\)/);
                if (match) image = match[2];
            } else if (trimmed.length > 0 && !trimmed.startsWith('#') && !trimmed.startsWith('!') && !preview) {
                preview = trimmed;
            }

            // Convert markdown to HTML for full view (simplified)
            // Bold
            let processedLine = trimmed.replace(/\*(.*?)\*/g, '<strong>$1</strong>');
            // Links
            processedLine = processedLine.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank">$1</a>');

            if (trimmed.startsWith('## ')) {
                contentHtml += `<h3>${trimmed.substring(3)}</h3>`;
            } else if (trimmed.startsWith('![')) {
                const match = trimmed.match(/\!\[(.*?)\]\((.*?)\)/);
                if (match) contentHtml += `<img src="${match[2]}" alt="${match[1]}" class="article-img">`;
            } else if (trimmed.length > 0 && !trimmed.startsWith('#')) {
                contentHtml += `<p>${processedLine}</p>`;
            }
        });

        // Create Card HTML
        const card = document.createElement('article');
        card.className = 'card article-card reveal';
        card.innerHTML = `
            ${image ? `<div class="article-card__image" style="background-image: url('${image}')"></div>` : ''}
            <div class="article-card__content">
                <h3 class="article-card__title">${title}</h3>
                <p class="article-card__preview">${preview.substring(0, 120)}...</p>
                <button class="btn btn--sm btn--outline" style="margin-top: var(--space-md)">Read Article</button>
            </div>
        `;

        // Expand Logic (Simple Modal or Expand)
        card.querySelector('button').addEventListener('click', () => {
            // For now, let's just alert or open a simple modal
            // Ideally, we'd replace the content or open a modal.
            // Let's replace the card content nicely
            const originalContent = card.innerHTML;
            card.classList.add('article-card--expanded');
            card.innerHTML = `
                <div class="article-card__full">
                    <button class="close-article">← Back</button>
                    <h2>${title}</h2>
                    <div class="article-body">${contentHtml}</div>
                </div>
             `;
            card.querySelector('.close-article').addEventListener('click', (e) => {
                e.stopPropagation();
                card.classList.remove('article-card--expanded');
                card.innerHTML = originalContent;
                // Re-attach event listener (recursion, simple way)
                // A better way would be functions, but this is a simple drop-in script
                // let's just reload the page for simplicity or implement a proper modal next time.
                // Actually, let's just use the toggle logic I just wrote. 
                // Re-attaching the click listener for 'Read Article' is needed.
                // For retention, a Modal is cleaner.
                location.reload(); // Lazy fix for "Back" to reset state perfectly without complex DOM tracking in this script
            });
        });

        return card;
    }
})();
