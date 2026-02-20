class LottoGenerator extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });

        const template = document.createElement('template');
        template.innerHTML = `
            <style>
                .generator {
                    text-align: center;
                    padding: 2.5rem;
                    border-radius: 20px;
                    background-color: var(--generator-bg);
                    box-shadow: 0 10px 30px var(--shadow-color), 0 6px 10px var(--shadow-color-alt);
                    width: 340px;
                    transition: all 0.3s ease;
                }
                h1 {
                    color: var(--text-color);
                    font-size: 2.2rem;
                    margin-bottom: 2rem;
                    transition: color 0.3s ease;
                }
                .numbers {
                    display: flex;
                    justify-content: center;
                    gap: 12px;
                    margin-bottom: 2.5rem;
                    height: 55px;
                }
                .ball {
                    width: 48px;
                    height: 48px;
                    border-radius: 50%;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    font-size: 1.5rem;
                    color: white;
                    font-weight: bold;
                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
                    animation: popIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                }
                @keyframes popIn {
                    0% { transform: scale(0); opacity: 0; }
                    100% { transform: scale(1); opacity: 1; }
                }
                button {
                    font-family: 'Jua', sans-serif;
                    background-color: var(--button-bg);
                    color: white;
                    border: none;
                    padding: 1.2rem 2.5rem;
                    font-size: 1.3rem;
                    border-radius: 12px;
                    cursor: pointer;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
                    width: 100%;
                }
                button:hover {
                    background-color: var(--button-hover);
                    box-shadow: 0 6px 15px rgba(0, 0, 0, 0.3);
                    transform: translateY(-2px);
                }
                button:active {
                    background-color: var(--button-active);
                    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
                    transform: translateY(0);
                }
            </style>
            <div class="generator">
                <h1>Lotto Numbers</h1>
                <div class="numbers"></div>
                <button id="generateBtn">Generate</button>
            </div>
        `;

        this.shadowRoot.appendChild(template.content.cloneNode(true));
        this.shadowRoot.getElementById('generateBtn').addEventListener('click', () => this.generateNumbers());
    }

    generateNumbers() {
        const numbersContainer = this.shadowRoot.querySelector('.numbers');
        numbersContainer.innerHTML = ''; 

        const numbers = new Set();
        while (numbers.size < 6) {
            const randomNumber = Math.floor(Math.random() * 45) + 1;
            numbers.add(randomNumber);
        }

        const sortedNumbers = Array.from(numbers).sort((a, b) => a - b);

        sortedNumbers.forEach((number, index) => {
            setTimeout(() => {
                const ball = document.createElement('div');
                ball.className = 'ball';
                ball.textContent = number;
                ball.style.backgroundColor = this.getColor(number);
                numbersContainer.appendChild(ball);
            }, index * 100);
        });
    }

    getColor(number) {
        if (number <= 10) return '#f44336';
        if (number <= 20) return '#ff9800';
        if (number <= 30) return '#ffeb3b';
        if (number <= 40) return '#4caf50';
        return '#2196f3';
    }
}

customElements.define('lotto-generator', LottoGenerator);

// Theme Toggle Logic
const themeToggle = document.getElementById('themeToggle');
const body = document.body;

const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
    body.setAttribute('data-theme', savedTheme);
    updateToggleText(savedTheme);
}

themeToggle.addEventListener('click', () => {
    const currentTheme = body.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    body.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateToggleText(newTheme);
});

function updateToggleText(theme) {
    themeToggle.textContent = theme === 'dark' ? '☀️ Light Mode' : '🌙 Dark Mode';
}
