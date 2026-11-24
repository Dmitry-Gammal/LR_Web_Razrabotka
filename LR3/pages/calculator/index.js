import {CalculatorComponent} from "../../components/calculator/index.js";
import {HeaderComponent} from "../../components/header/index.js";
import {MainPage} from "../main/index.js";

export class CalculatorPage {
    constructor(parent) {
        this.parent = parent;
    }

    render() {
        this.parent.innerHTML = "";
        new HeaderComponent(this.parent).render({
            onHome: () => new MainPage(this.parent).render(),
            onCalculator: this.render.bind(this),
            currentPage: "calculator",
        });
        new CalculatorComponent(this.parent).render();
    }
}
