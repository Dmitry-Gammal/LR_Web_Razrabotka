import {ProductComponent} from "../../components/product/index.js";
import {HeaderComponent} from "../../components/header/index.js";
import {CalculatorPage} from "../calculator/index.js";
import {MainPage} from "../main/index.js";
import {newsCollection} from "../../data/news.js";

export class ProductPage {
    constructor(parent, id) {
        this.parent = parent;
        this.id = Number(id);
    }

    getData() {
        return newsCollection.find((item) => item.id === this.id);
    }

    clickHome() {
        new MainPage(this.parent).render();
    }

    deleteCard() {
        const index = newsCollection.findIndex((item) => item.id === this.id);
        if (index !== -1) {
            newsCollection.splice(index, 1);
        }
        this.clickHome();
    }

    render() {
        const data = this.getData();
        if (!data) {
            this.clickHome();
            return;
        }

        this.parent.innerHTML = "";
        new HeaderComponent(this.parent).render({
            onHome: this.clickHome.bind(this),
            onCalculator: () => new CalculatorPage(this.parent).render(),
            currentPage: "home",
        });
        this.parent.insertAdjacentHTML("beforeend", '<main class="detail-view" id="product-page"></main>');
        new ProductComponent(document.getElementById("product-page")).render(data);
        this.parent.insertAdjacentHTML("beforeend", '<footer class="footer">ЛР выполнена Гаммалом Дмитрием Михайловичем</footer>');

        document.getElementById("back-to-news")
            .addEventListener("click", this.clickHome.bind(this));
        document.getElementById("delete-detail-card")
            .addEventListener("click", this.deleteCard.bind(this));
    }
}
