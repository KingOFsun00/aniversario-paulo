// Rolagem suave para a seta de "scroll-down"
document.querySelector('.scroll-down').addEventListener('click', function() {
    window.scrollTo({
        top: document.getElementById('globe-container').offsetTop,
        behavior: 'smooth'
    });
});

// ===== GLOBO 3D COM THREE.JS ===== //
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true }); // Alpha: true para fundo transparente
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('globe-container').appendChild(renderer.domElement);

// Ajusta a posição inicial da câmera
camera.position.z = 10;

// Adiciona uma fonte de luz para melhor visibilidade
const ambientLight = new THREE.AmbientLight(0x404040); // Luz branca suave
scene.add(ambientLight);
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(5, 5, 5).normalize();
scene.add(directionalLight);

// Cria o globo com texturas atualizadas, se possível, ou usa as fornecidas
const globeGeometry = new THREE.SphereGeometry(5, 64, 64);
const globeTextureLoader = new THREE.TextureLoader();
const globeMaterial = new THREE.MeshPhongMaterial({ // Usa MeshPhongMaterial para efeitos de iluminação
    map: globeTextureLoader.load('https://threejs.org/examples/textures/planets/earth_atmos_2048.jpg'),
    specularMap: globeTextureLoader.load('https://threejs.org/examples/textures/planets/earth_specular_2048.jpg'), // Adiciona mapa especular para brilho
    bumpMap: globeTextureLoader.load('https://threejs.org/examples/textures/planets/earth_normal_2048.jpg'), // Adiciona mapa de relevo para detalhes da superfície
    bumpScale: 0.1
});
const globe = new THREE.Mesh(globeGeometry, globeMaterial);
scene.add(globe);

// Controles de Órbita para interação do usuário
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; // Zoom/rotação suave
controls.dampingFactor = 0.05;
controls.minDistance = 8;
controls.maxDistance = 20;

// Redimensionamento responsivo do globo
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Loop de animação
function animateGlobe() {
    requestAnimationFrame(animateGlobe);
    globe.rotation.y += 0.001; // Rotação sutil contínua
    controls.update();
    renderer.render(scene, camera);
}
animateGlobe();

// ===== INTERATIVIDADE DOS MARCADORES DO MAPA ===== //
const countryMarkers = document.querySelectorAll('.country-marker');
const countryInfoBoxes = document.querySelectorAll('.country-info');

countryMarkers.forEach(marker => {
    marker.addEventListener('click', function() {
        const country = this.dataset.country;
        const infoBox = document.getElementById(`${country}-info`);

        // Esconde todas as outras caixas de informação
        countryInfoBoxes.forEach(box => {
            if (box.id !== `${country}-info`) {
                box.style.display = 'none';
            }
        });

        // Alterna a exibição para a caixa de informação clicada
        if (infoBox.style.display === 'block') {
            infoBox.style.display = 'none';
        } else {
            infoBox.style.display = 'block';
            // Posiciona a caixa de informação em relação ao marcador
            const markerRect = this.getBoundingClientRect();
            const mapRect = this.closest('.map-container').getBoundingClientRect();

            infoBox.style.left = `${markerRect.left - mapRect.left + (markerRect.width / 2)}px`;
            infoBox.style.top = `${markerRect.top - mapRect.top - infoBox.offsetHeight - 10}px`; // Acima do marcador
        }
    });
});

// Esconde as caixas de informação ao clicar fora
document.addEventListener('click', function(event) {
    const isClickInsideMap = event.target.closest('.map-container');
    if (!isClickInsideMap) {
        countryInfoBoxes.forEach(box => {
            box.style.display = 'none';
        });
    }
});

// ===== QUIZ FILOSÓFICO ===== //
const quizQuestions = [
    {
        question: "Imagine que você é o comandante de uma frota naval. Uma nação vizinha, com quem você tem uma história de tensões, está enviando navios para águas que sua nação considera soberanas. Como você abordaria essa situação crítica?",
        options: [
            { text: "Prepararia uma emboscada estratégica, visando desmoralizar o adversário com uma demonstração de força decisiva e rápida, garantindo que o custo da agressão seja insuportável.", philosopher: "Sun Tzu", quote: "『A suprema arte da guerra é subjugar o inimigo sem lutar.』" },
            { text: "Iniciaria imediatamente canais de comunicação diplomática, propondo um diálogo aberto e respeitoso para compreender as motivações do outro lado e buscar um acordo mútuo que preserve a paz e a honra de ambas as partes.", philosopher: "Confúcio", quote: "『O homem nobre é justo em seus atos e humilde em suas palavras.』" },
            { text: "Convocaria uma equipe de analistas para coletar todos os dados disponíveis sobre os movimentos dos navios, seus padrões históricos e as possíveis intenções, a fim de formular a resposta mais racional e eficaz baseada em evidências, não em emoções.", philosopher: "Aristóteles", quote: "『A raiz da educação é amarga, mas seus frutos são doces.』" }
        ]
    },
    {
        question: "Ao navegar pelos mares da vida, você se depara com uma crise pessoal profunda, um momento de incerteza onde seus valores são testados. Qual bússola filosófica guiaria sua travessia para encontrar significado e força para continuar?",
        options: [
            { text: "Encararia a adversidade como uma oportunidade para superar meus próprios limites, transformando o sofrimento em uma fonte de crescimento e autoafirmação, entendendo que a dor forja o caráter e revela meu verdadeiro propósito.", philosopher: "Nietzsche", quote: "『Aquilo que não me mata, só me fortalece.』" },
            { text: "Buscaria a quietude interior e a conexão com o divino, meditando sobre a transitoriedade da vida e a beleza inerente ao universo, confiando que há uma ordem maior e que o amor e a compaixão são as verdadeiras respostas.", philosopher: "Rumi", quote: "『Eleve suas palavras, não sua voz. É a chuva que faz as flores crescerem, não o trovão.』" },
            { text: "Exploraria as camadas mais profundas da minha consciência, confrontando minhas falhas e contradições, questionando as motivações humanas universais e a natureza do bem e do mal para encontrar redenção e um caminho moralmente íntegro.", philosopher: "Dostoiévski", quote: "『Acima de tudo, não minta para si mesmo.』" }
        ]
    }
];

let currentQuestionIndex = 0;
let quizResults = {}; // Para armazenar os filósofos escolhidos

const quizDiv = document.getElementById('quiz');
const quizResultDiv = document.getElementById('quiz-result');
const resultPhilosopherSpan = document.getElementById('result-philosopher');
const resultQuoteP = document.getElementById('result-quote');

function loadQuestion() {
    if (currentQuestionIndex < quizQuestions.length) {
        const qData = quizQuestions[currentQuestionIndex];
        let questionHtml = `<div class="quiz-question" id="q${currentQuestionIndex + 1}">
                                <p>${qData.question}</p>
                                <div class="quiz-options">`;
        qData.options.forEach((option, index) => {
            questionHtml += `<button data-philosopher="${option.philosopher}" data-quote="${option.quote}">${option.text}</button>`;
        });
        questionHtml += `</div></div>`;
        quizDiv.innerHTML = questionHtml;

        document.querySelectorAll('.quiz-options button').forEach(button => {
            button.addEventListener('click', handleAnswer);
        });
    } else {
        showResults();
    }
}

function handleAnswer(event) {
    const chosenPhilosopher = event.target.dataset.philosopher;
    const chosenQuote = event.target.dataset.quote;

    quizResults[chosenPhilosopher] = (quizResults[chosenPhilosopher] || 0) + 1; // Incrementa a contagem para o filósofo escolhido

    currentQuestionIndex++;
    loadQuestion();
}

function showResults() {
    let topPhilosopher = '';
    let maxCount = 0;

    for (const philosopher in quizResults) {
        if (quizResults[philosopher] > maxCount) {
            maxCount = quizResults[philosopher];
            topPhilosopher = philosopher;
        }
    }

    // Se houver um empate, escolhe aleatoriamente um dos filósofos empatados
    const tiedPhilosophers = Object.keys(quizResults).filter(key => quizResults[key] === maxCount);
    topPhilosopher = tiedPhilosophers[Math.floor(Math.random() * tiedPhilosophers.length)];

    // Encontra a citação para o filósofo determinado
    let finalQuote = "Sua sabedoria guia seus caminhos.";
    quizQuestions.forEach(q => {
        q.options.forEach(opt => {
            if (opt.philosopher === topPhilosopher) {
                finalQuote = opt.quote;
            }
        });
    });

    resultPhilosopherSpan.textContent = topPhilosopher;
    resultQuoteP.textContent = finalQuote;
    quizDiv.style.display = 'none';
    quizResultDiv.style.display = 'block';
}

function resetQuiz() {
    currentQuestionIndex = 0;
    quizResults = {};
    quizDiv.style.display = 'block';
    quizResultDiv.style.display = 'none';
    loadQuestion();
}

// Inicializa o quiz
loadQuestion();