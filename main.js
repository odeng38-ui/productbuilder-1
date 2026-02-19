class LottoGenerator extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });

        const template = document.createElement('template');
        template.innerHTML = `
            <style>
                .generator {
                    text-align: center;
                    padding: 2rem;
                    border-radius: 15px;
                    background-color: #ffffff;
                    box-shadow: 0 10px 20px rgba(0,0,0,0.1), 0 6px 6px rgba(0,0,0,0.15);
                    width: 320px;
                }
                h1 {
                    color: #333;
                    font-size: 2rem;
                    margin-bottom: 1.5rem;
                }
                .numbers {
                    display: flex;
                    justify-content: center;
                    gap: 10px;
                    margin-bottom: 2rem;
                    height: 50px;
                }
                .ball {
                    width: 45px;
                    height: 45px;
                    border-radius: 50%;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    font-size: 1.5rem;
                    color: white;
                    font-weight: bold;
                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
                }
                button {
                    font-family: 'Jua', sans-serif;
                    background-color: #6a1b9a;
                    color: white;
                    border: none;
                    padding: 1rem 2rem;
                    font-size: 1.2rem;
                    border-radius: 10px;
                    cursor: pointer;
                    transition: background-color 0.3s, box-shadow 0.3s;
                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
                }
                button:hover {
                    background-color: #8e24aa;
                    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3);
                }
                button:active {
                    background-color: #4a148c;
                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
                }
            </style>
            <div class="generator">
                <h1>Lotto Numbers</h1>
                <div class="numbers"></div>
                <button>Generate</button>
            </div>
        `;

        this.shadowRoot.appendChild(template.content.cloneNode(true));

        this.shadowRoot.querySelector('button').addEventListener('click', () => this.generateNumbers());
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

        sortedNumbers.forEach(number => {
            const ball = document.createElement('div');
            ball.className = 'ball';
            ball.textContent = number;
            ball.style.backgroundColor = this.getColor(number);
            numbersContainer.appendChild(ball);
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