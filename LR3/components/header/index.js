export class HeaderComponent {
    constructor(parent) {
        this.parent = parent;
    }

    getHTML() {
        return `
            <header class="site-header d-flex align-items-center justify-content-between">
                <div class="logo">
                    <span class="logo-mark">MCLAREN</span>
                    <span class="logo-sub">RACING</span>
                </div>
                <nav class="main-nav d-flex">
                    <button id="home-button" class="nav-link" type="button">Домой</button>
                    <button id="calculator-button" class="nav-link" type="button">Калькулятор</button>
                    <a href="https://github.com/Dmitry-Gammal/LR_Web_Razrabotka"
                       target="_blank" rel="noopener noreferrer"
                       class="nav-link nav-link-repo">Репозиторий</a>
                </nav>
                <a href="#" class="racing-club">Racing Club</a>
            </header>
        `;
    }

    render({onHome, onCalculator, currentPage}) {
        this.parent.insertAdjacentHTML("beforeend", this.getHTML());
        const homeButton = document.getElementById("home-button");
        const calculatorButton = document.getElementById("calculator-button");
        homeButton.classList.toggle("active", currentPage === "home");
        calculatorButton.classList.toggle("active", currentPage === "calculator");
        homeButton.addEventListener("click", onHome);
        calculatorButton.addEventListener("click", onCalculator);
    }
}
