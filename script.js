const app = {
    // Database
    marketData: [
        { id: 1, name: "Magnezone SV29", price: 29.99, img: "https://images.pokemontcg.io/sm115/SV29_hires.png" },
        { id: 2, name: "Pikachu Promo", price: 85.00, img: "https://images.pokemontcg.io/svp/120_hires.png" },
        { id: 3, name: "Charizard ex", price: 65.00, img: "https://images.pokemontcg.io/sv3/223_hires.png" }
    ],
    portfolio: JSON.parse(localStorage.getItem('hd_vault')) || [],

    init() {
        this.renderMarket();
        this.renderPortfolio();
        this.updateValue();
        this.initChart();
    },

    // Navigation Logic
    tab(id, el) {
        document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
        document.getElementById('scr-' + id).classList.add('active');
        document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
        el.classList.add('active');
        
        if(id === 'ai') this.startCamera();
        else this.stopCamera();
    },

    // AI Camera Logic
    async startCamera() {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
            document.getElementById('video').srcObject = stream;
        } catch(e) {
            alert("Camera Blocked: Use HTTPS or check permissions.");
        }
    },

    stopCamera() {
        const v = document.getElementById('video');
        if(v.srcObject) v.srcObject.getTracks().forEach(t => t.stop());
    },

    startScan() {
        const frame = document.getElementById('v-frame');
        frame.classList.add('scanning');
        setTimeout(() => {
            frame.classList.remove('scanning');
            document.getElementById('ai-res').style.display = 'block';
            document.getElementById('r-c').innerText = "9.7";
            document.getElementById('r-e').innerText = "10.0";
            document.getElementById('r-t').innerText = "PSA 10 PREDICTION";
        }, 3000);
    },

    // Market & Portfolio
    renderMarket() {
        const grid = document.getElementById('marketGrid');
        grid.innerHTML = this.marketData.map(c => `
            <div class="pokemon-card" onclick="app.add(${c.id})">
                <img src="${c.img}">
                <b>${c.name}</b>
                <p style="color:var(--accent); font-weight:900;">$${c.price}</p>
            </div>
        `).join('');
    },

    add(id) {
        const card = this.marketData.find(x => x.id === id);
        this.portfolio.push(card);
        localStorage.setItem('hd_vault', JSON.stringify(this.portfolio));
        this.renderPortfolio();
        this.updateValue();
    },

    renderPortfolio() {
        document.getElementById('portfolioGrid').innerHTML = this.portfolio.map(c => `
            <div class="pokemon-card">
                <img src="${c.img}">
                <b>${c.name}</b>
                <p>$${c.price}</p>
            </div>
        `).join('');
    },

    updateValue() {
        const total = this.portfolio.reduce((s, c) => s + c.price, 0);
        document.getElementById('total-val').innerText = "$" + total.toFixed(2);
    },

    // Map Logic
    showStore(n, h) {
        document.getElementById('st-n').innerText = n;
        document.getElementById('st-s').innerText = "OPEN: " + h;
        document.getElementById('store-ui').style.display = 'block';
    },

    // Charting (1 Year MAX)
    initChart() {
        const ctx = document.getElementById('mainChart').getContext('2d');
        new Chart(ctx, {
            type: 'line',
            data: { labels: [1,2,3,4,5], datasets: [{ data: [10, 40, 25, 70, 100], borderColor: '#3291ff', tension: 0.4, fill: true, backgroundColor: 'rgba(50, 145, 255, 0.1)' }] },
            options: { plugins: { legend: false }, scales: { x: { display: false }, y: { display: false } } }
        });
    }
};

window.onload = () => app.init();
