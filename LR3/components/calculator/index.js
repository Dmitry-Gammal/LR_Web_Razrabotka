export class CalculatorComponent {
    constructor(parent) {
        this.parent = parent;
        this.currentValue = "0";
        this.firstOperand = null;
        this.operator = null;
        this.waitForSecond = false;
        this.maxDigits = 12;
    }

    getHTML() {
        return `
            <section class="tab-content active">
                <div class="calculator d-inline-block text-center">
                    <div id="result" class="result">0</div>
                    <div>
                        <div>
                            <button id="btn_op_clear" class="my-btn secondary">C</button>
                            <button id="btn_op_sign" class="my-btn secondary">+/-</button>
                            <button id="btn_op_percent" class="my-btn secondary">%</button>
                            <button id="btn_op_plus" class="my-btn primary">+</button>
                            <button id="btn_op_square" class="my-btn primary">x²</button>
                        </div>
                        <div>
                            <button id="btn_digit_7" class="my-btn">7</button>
                            <button id="btn_digit_8" class="my-btn">8</button>
                            <button id="btn_digit_9" class="my-btn">9</button>
                            <button id="btn_op_div" class="my-btn primary">/</button>
                        </div>
                        <div>
                            <button id="btn_digit_4" class="my-btn">4</button>
                            <button id="btn_digit_5" class="my-btn">5</button>
                            <button id="btn_digit_6" class="my-btn">6</button>
                            <button id="btn_op_mult" class="my-btn primary">x</button>
                        </div>
                        <div>
                            <button id="btn_digit_1" class="my-btn">1</button>
                            <button id="btn_digit_2" class="my-btn">2</button>
                            <button id="btn_digit_3" class="my-btn">3</button>
                            <button id="btn_op_minus" class="my-btn primary">-</button>
                        </div>
                        <div>
                            <button id="btn_digit_0" class="my-btn">0</button>
                            <button id="btn_digit_dot" class="my-btn">.</button>
                            <button id="btn_op_equal" class="my-btn primary execute">=</button>
                        </div>
                    </div>
                </div>
            </section>
            <footer class="footer">ЛР выполнена Гаммалом Дмитрием Михайловичем</footer>
        `;
    }

    updateScreen() {
        let display = this.currentValue;
        if (display.length > this.maxDigits + 2) {
            display = `…${display.slice(-(this.maxDigits + 1))}`;
        }
        document.getElementById("result").textContent = display;
    }

    inputDigit(digit) {
        if (this.waitForSecond) {
            this.currentValue = digit;
            this.waitForSecond = false;
        } else {
            const digitsOnly = this.currentValue.replace(/[^0-9]/g, "");
            if (digitsOnly.length >= this.maxDigits) return;
            this.currentValue = this.currentValue === "0" ? digit : this.currentValue + digit;
        }
        this.updateScreen();
    }

    inputDot() {
        if (this.waitForSecond) {
            this.currentValue = "0.";
            this.waitForSecond = false;
        } else if (!this.currentValue.includes(".")) {
            const digitsOnly = this.currentValue.replace(/[^0-9]/g, "");
            if (digitsOnly.length >= this.maxDigits) return;
            this.currentValue += ".";
        }
        this.updateScreen();
    }

    clearAll() {
        this.currentValue = "0";
        this.firstOperand = null;
        this.operator = null;
        this.waitForSecond = false;
        this.updateScreen();
    }

    calculate(first, second, operator) {
        switch (operator) {
            case "+": return first + second;
            case "-": return first - second;
            case "x": return first * second;
            case "/": return second === 0 ? "Ошибка" : Number((first / second).toFixed(10));
            default: return second;
        }
    }

    handleOperator(operator) {
        const number = parseFloat(this.currentValue);
        if (this.operator && !this.waitForSecond) {
            const result = this.calculate(this.firstOperand, number, this.operator);
            this.currentValue = result.toString();
            this.firstOperand = result;
        } else {
            this.firstOperand = number;
        }
        this.operator = operator;
        this.waitForSecond = true;
        this.updateScreen();
    }

    handleEqual() {
        if (this.operator === null) return;
        const number = parseFloat(this.currentValue);
        const result = this.calculate(this.firstOperand, number, this.operator);
        this.currentValue = result.toString();
        this.firstOperand = null;
        this.operator = null;
        this.waitForSecond = false;
        this.updateScreen();
    }

    handleButton(button) {
        const id = button.id;
        if (id.startsWith("btn_digit_")) {
            if (button.textContent === ".") {
                this.inputDot();
            } else {
                this.inputDigit(button.textContent);
            }
        } else if (id === "btn_op_clear") {
            this.clearAll();
        } else if (id === "btn_op_sign") {
            this.currentValue = (parseFloat(this.currentValue) * -1).toString();
            this.updateScreen();
        } else if (id === "btn_op_percent") {
            this.currentValue = (parseFloat(this.currentValue) / 100).toString();
            this.updateScreen();
        } else if (id === "btn_op_square") {
            const number = parseFloat(this.currentValue);
            this.currentValue = (number * number).toString();
            this.updateScreen();
        } else if (id === "btn_op_equal") {
            this.handleEqual();
        } else if (["btn_op_plus", "btn_op_minus", "btn_op_mult", "btn_op_div"].includes(id)) {
            this.handleOperator(button.textContent);
        }
    }

    render() {
        this.parent.insertAdjacentHTML("beforeend", this.getHTML());
        document.querySelectorAll(".my-btn").forEach((button) => {
            button.addEventListener("click", () => this.handleButton(button));
        });
        this.updateScreen();
    }
}
