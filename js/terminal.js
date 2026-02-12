(function () {
    const toggle = document.createElement('div');
    toggle.className = 'terminal-toggle';
    toggle.innerHTML = '💻';
    toggle.title = 'Open AI Terminal';
    document.body.appendChild(toggle);

    const overlay = document.createElement('div');
    overlay.className = 'terminal-overlay';
    overlay.innerHTML = `
        <div class="terminal-window">
            <div class="terminal-header">
                <div class="terminal-dot red" onclick="document.querySelector('.terminal-overlay').classList.remove('open')"></div>
                <div class="terminal-dot yellow"></div>
                <div class="terminal-dot green"></div>
                <div class="terminal-title">user@zameer-portfolio:~</div>
            </div>
            <div class="terminal-body" id="terminal-body">
                <div class="terminal-line">Welcome to Zameer's Neural Interface v1.0.</div>
                <div class="terminal-line">Type <span class="terminal-highlight">'help'</span> for available commands.</div>
                <div class="terminal-input-line">
                    <span class="terminal-prompt">➜</span>
                    <input type="text" class="terminal-input" id="terminal-input" autocomplete="off" spellcheck="false">
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(overlay);

    const input = document.getElementById('terminal-input');
    const body = document.getElementById('terminal-body');

    // Toggle logic
    toggle.addEventListener('click', () => {
        overlay.classList.add('open');
        input.focus();
    });

    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) overlay.classList.remove('open');
    });

    // Commands
    const commands = {
        help: "Available commands:\n  - about: Who is Zameer?\n  - skills: List technical arsenal\n  - contact: Get contact info\n  - clear: Clear terminal\n  - date: Show current system date",
        about: "Zameer Haider is an Accounts Officer & CAF Aspirant merging financial discipline with AI automation. Based in Lahore.",
        skills: "Active Skills:\n  [+] Financial Accounting\n  [+] ERP Systems\n  [+] Advanced Excel\n  [+] AI Workflow Integration (Claude, Gemini, Qwen)",
        contact: "Email: zameerchattha0@gmail.com\nPhone: +92 323 0714288\nLinkedIn: linkedin.com/in/zameerhaiderchattha",
        date: new Date().toString()
    };

    // Input handling
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const cmd = input.value.trim().toLowerCase();
            const originalCmd = input.value; // Keep original casing for display
            input.value = '';

            // Add previous command to history
            const historyLine = document.createElement('div');
            historyLine.className = 'terminal-line';
            historyLine.innerHTML = `<span class="terminal-prompt">➜</span> ${originalCmd}`;
            body.insertBefore(historyLine, input.parentElement);

            // Process command
            if (cmd === 'clear') {
                // Remove all previous lines except the input
                const lines = body.querySelectorAll('.terminal-line, .terminal-response');
                lines.forEach(line => line.remove());
                // Re-add welcome message (optional, but let's keep it clean)
            } else if (commands[cmd]) {
                const response = document.createElement('div');
                response.className = 'terminal-response';
                typeWriter(response, commands[cmd]);
                body.insertBefore(response, input.parentElement);
            } else if (cmd !== '') {
                const error = document.createElement('div');
                error.className = 'terminal-response';
                error.style.color = '#ff5f56';
                error.textContent = `Command not found: ${cmd}. Type 'help' for assistance.`;
                body.insertBefore(error, input.parentElement);
            }

            // Scroll to bottom
            body.scrollTop = body.scrollHeight;
        }
    });

    // Typewriter effect function
    function typeWriter(element, text, i = 0) {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            // Scroll to bottom as we type
            body.scrollTop = body.scrollHeight;
            setTimeout(() => typeWriter(element, text, i + 1), 15); // Speed of typing
        }
    }
})();
