// Teachable Machine URL
const URL = "https://teachablemachine.withgoogle.com/models/OSrmO5xPY/";

let model, labelContainer, maxPredictions;

// Load the image model
async function init() {
    const modelURL = URL + "model.json";
    const metadataURL = URL + "metadata.json";

    model = await tmImage.load(modelURL, metadataURL);
    maxPredictions = model.getTotalClasses();
}

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

// Image Upload and Prediction Logic
const uploadArea = document.getElementById('upload-area');
const imageUpload = document.getElementById('image-upload');
const imagePreview = document.getElementById('image-preview');
const uploadText = document.querySelector('.upload-text');
const loading = document.getElementById('loading');
const resultArea = document.getElementById('result-area');
const labelContainerElement = document.getElementById('label-container');
const resultTitle = document.getElementById('result-title');

uploadArea.addEventListener('click', () => imageUpload.click());

imageUpload.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = async (event) => {
            imagePreview.src = event.target.result;
            imagePreview.style.display = 'block';
            uploadText.style.display = 'none';
            
            await predict();
        };
        reader.readAsDataURL(file);
    }
});

async function predict() {
    if (!model) {
        loading.style.display = 'block';
        await init();
    }
    
    loading.style.display = 'block';
    resultArea.style.display = 'none';
    
    const prediction = await model.predict(imagePreview);
    
    loading.style.display = 'none';
    resultArea.style.display = 'block';
    labelContainerElement.innerHTML = '';
    
    prediction.sort((a, b) => b.probability - a.probability);
    
    const topResult = prediction[0].className;
    resultTitle.textContent = `당신은 '${topResult}' 상입니다!`;
    
    prediction.forEach(p => {
        const percentage = (p.probability * 100).toFixed(0);
        const barHtml = `
            <div class="bar-container">
                <div class="label-title">
                    <span>${p.className}</span>
                    <span>${percentage}%</span>
                </div>
                <div class="bar-bg">
                    <div class="bar-fill" style="width: ${percentage}%"></div>
                </div>
            </div>
        `;
        labelContainerElement.innerHTML += barHtml;
    });
}

// Drag and Drop
uploadArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadArea.style.borderColor = 'var(--text-color)';
});

uploadArea.addEventListener('dragleave', () => {
    uploadArea.style.borderColor = 'var(--button-bg)';
});

uploadArea.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadArea.style.borderColor = 'var(--button-bg)';
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = async (event) => {
            imagePreview.src = event.target.result;
            imagePreview.style.display = 'block';
            uploadText.style.display = 'none';
            await predict();
        };
        reader.readAsDataURL(file);
    }
});
