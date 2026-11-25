import {ProductCardComponent} from "../../components/product-card/index.js";
import {HeaderComponent} from "../../components/header/index.js";
import {ProductPage} from "../product/index.js";
import {CalculatorPage} from "../calculator/index.js";
import {newsCollection} from "../../data/news.js";

export class MainPage {
    constructor(parent) {
        this.parent = parent;
    }

    get pageRoot() {
        return document.getElementById("main-page");
    }

    getHTML() {
        const firstNews = newsCollection[0];
        const title = firstNews?.title ?? "Новости McLaren Racing";
        const text = firstNews?.text ?? "Все новости команды McLaren в одном месте.";
        const image = firstNews?.src ?? "";

        return `
            <section class="tab-content active">
                <div class="hero">
                    <img src="${image}" alt="McLaren Racing">
                    <div class="hero-overlay">
                        <p class="hero-label">
                            <span class="label-mark">🏁</span> MCLAREN <span class="orange">NEWS</span>
                        </p>
                        <h1 class="hero-title">
                            НОВОСТИ КОМАНДЫ<br>
                            <span class="muted">McLAREN RACING</span> <span class="arrow">↗</span>
                        </h1>
                        <p class="hero-subtext">${title}. ${text}</p>
                    </div>
                    <div class="hero-arrows">
                        <button class="arrow-btn" type="button" aria-label="Предыдущая новость">‹</button>
                        <button class="arrow-btn orange-btn" type="button" aria-label="Следующая новость">›</button>
                    </div>
                </div>

                <div class="news-tools d-flex align-items-center justify-content-end">
                    <input id="news-search" type="search" placeholder="Поиск новостей" aria-label="Поиск новостей">
                    <select id="news-category" aria-label="Фильтр по категории">
                        <option value="">Все категории</option>
                        <option value="Команда">Команда</option>
                        <option value="Пилоты">Пилоты</option>
                        <option value="Чемпионат">Чемпионат</option>
                    </select>
                    <button id="copy-first-card" class="copy-card-button" type="button">
                        + Добавить копию первой карточки
                    </button>
                </div>

                <div id="main-page" class="news-grid"></div>

                <div class="bottom-row">
                    <div class="drivers">
                        <h3 class="section-title">Выбери любимого пилота</h3>
                        <div class="driver-photos">
                            <div class="driver" data-driver="piastri">
                                <img src="https://i.pinimg.com/736x/6c/82/40/6c824023cdb0a79410c023257b0f82da.jpg" alt="Оскар Пиастри">
                                <p>Оскар Пиастри <span class="num">#81</span></p>
                            </div>
                            <div class="driver" data-driver="norris">
                                <img src="https://photobooth.cdn.sports.ru/preset/wysiwyg/1/5c/64357747048258a95f861ad62c4e7.jpeg?f=webp&q=90&s=2x&w=730" alt="Ландо Норрис">
                                <p>Ландо Норрис <span class="num">#4</span></p>
                            </div>
                        </div>
                        <div class="vote-result" id="vote-result">
                            <p class="vote-title">Распределение голосов</p>
                            <div class="vote-bar">
                                <div class="vote-left"><span>Пиастри</span><span class="percent">50%</span></div>
                                <div class="vote-right"><span class="percent">50%</span><span>Норрис</span></div>
                            </div>
                        </div>
                    </div>
                    <div class="next-gp">
                        <p class="gp-label">Следующий этап</p>
                        <p class="gp-dates">23–25<br>ОКТЯБРЯ</p>
                        <p class="gp-name">United States<br>Grand Prix</p>
                        <p class="gp-location">US Circuit of the Americas, Остин</p>
                        <div class="stripes small"></div>
                    </div>
                </div>
            </section>
            <footer class="footer">ЛР выполнена Гаммалом Дмитрием Михайловичем</footer>
        `;
    }

    clickCard(event) {
        const cardId = Number(event.currentTarget.dataset.id);
        new ProductPage(this.parent, cardId).render();
    }

    copyFirstCard() {
        const first = newsCollection[0];
        if (!first) {
            return;
        }

        const id = newsCollection.reduce((max, item) => Math.max(max, item.id), 0) + 1;
        newsCollection.push({...first, id, title: `${first.title} (копия)`});
        this.renderCards();
    }

    deleteCard(event) {
        const cardId = Number(event.currentTarget.dataset.id);
        const index = newsCollection.findIndex((item) => item.id === cardId);
        if (index !== -1) {
            newsCollection.splice(index, 1);
            this.renderCards();
        }
    }

    renderCards() {
        this.pageRoot.innerHTML = "";
        const search = document.getElementById("news-search").value.trim().toLowerCase();
        const category = document.getElementById("news-category").value;
        const filtered = newsCollection.filter((item) => {
            const matchesSearch = `${item.title} ${item.text} ${item.category}`.toLowerCase().includes(search);
            return matchesSearch && (!category || item.category === category);
        });

        if (filtered.length === 0) {
            this.pageRoot.insertAdjacentHTML("beforeend", '<div class="empty-news">Новости не найдены</div>');
            return;
        }

        filtered.forEach((item) => {
            new ProductCardComponent(this.pageRoot).render(
                item,
                this.clickCard.bind(this),
                this.deleteCard.bind(this),
            );
        });
    }

    addListeners() {
        document.getElementById("copy-first-card")
            .addEventListener("click", this.copyFirstCard.bind(this));
        document.getElementById("news-search")
            .addEventListener("input", this.renderCards.bind(this));
        document.getElementById("news-category")
            .addEventListener("change", this.renderCards.bind(this));
        document.querySelectorAll(".driver").forEach((driver) => {
            driver.addEventListener("click", () => {
                document.querySelectorAll(".driver").forEach((item) => item.classList.remove("selected"));
                driver.classList.add("selected");
                document.getElementById("vote-result").classList.add("visible");
            });
        });
    }

    render() {
        this.parent.innerHTML = "";
        new HeaderComponent(this.parent).render({
            onHome: this.render.bind(this),
            onCalculator: () => new CalculatorPage(this.parent).render(),
            currentPage: "home",
        });
        this.parent.insertAdjacentHTML("beforeend", this.getHTML());
        this.addListeners();
        this.renderCards();
    }
}
