// получаем элементы
const result = document.getElementById('result');
const buttons = document.querySelectorAll('.my-btn');

// состояние калькулятора
let currentValue = '0';
let firstOperand = null;
let operator = null;
let waitForSecond = false;

// максимум знаков в числе
const MAX_DIGITS = 12;

// обновить экран
function updateScreen() {
  let display = currentValue;

  // если строка длиннее — обрезаем с «…» в начале
  if (display.length > MAX_DIGITS + 2) {
    display = '…' + display.slice(-(MAX_DIGITS + 1));
  }

  result.textContent = display;
}

// ввод цифры
function inputDigit(digit) {
  if (waitForSecond) {
    currentValue = digit;
    waitForSecond = false;
  } else {
    const digitsOnly = currentValue.replace(/[^0-9]/g, '');
    if (digitsOnly.length >= MAX_DIGITS) return;
    currentValue = currentValue === '0' ? digit : currentValue + digit;
  }
  updateScreen();
}

// ввод точки
function inputDot() {
  if (waitForSecond) {
    currentValue = '0.';
    waitForSecond = false;
  } else if (!currentValue.includes('.')) {
    const digitsOnly = currentValue.replace(/[^0-9]/g, '');
    if (digitsOnly.length >= MAX_DIGITS) return;
    currentValue += '.';
  }
  updateScreen();
}

// сброс
function clearAll() {
  currentValue = '0';
  firstOperand = null;
  operator = null;
  waitForSecond = false;
  updateScreen();
}

// смена знака
function toggleSign() {
  currentValue = (parseFloat(currentValue) * -1).toString();
  updateScreen();
}

// процент
function percent() {
  currentValue = (parseFloat(currentValue) / 100).toString();
  updateScreen();
}

// возведение в квадрат
function square() {
  const num = parseFloat(currentValue);
  currentValue = (num * num).toString();
  updateScreen();
}

// вычисление
function calculate(a, b, op) {
  switch (op) {
    case '+': return a + b;
    case '-': return a - b;
    case 'x': return a * b;
    case '/': return b === 0 ? 'Ошибка' : (a / b).toFixed(10);
    default:  return b;
  }
}

// обработка оператора
function handleOperator(op) {
  const num = parseFloat(currentValue);

  if (operator && !waitForSecond) {
    const resultValue = calculate(firstOperand, num, operator);
    currentValue = resultValue.toString();
    firstOperand = resultValue;
  } else {
    firstOperand = num;
  }

  operator = op;
  waitForSecond = true;
  updateScreen();
}

// равно
function handleEqual() {
  if (operator === null) return;

  const num = parseFloat(currentValue);
  const resultValue = calculate(firstOperand, num, operator);

  currentValue = resultValue.toString();
  firstOperand = null;
  operator = null;
  waitForSecond = false;
  updateScreen();
}

// навешиваем обработчики
buttons.forEach(btn => {
  btn.addEventListener('click', () => {
    const id = btn.id;

    if (id.startsWith('btn_digit_')) {
      const digit = btn.textContent;
      if (digit === '.') {
        inputDot();
      } else {
        inputDigit(digit);
      }
    } else if (id === 'btn_op_clear') {
      clearAll();
    } else if (id === 'btn_op_sign') {
      toggleSign();
    } else if (id === 'btn_op_percent') {
      percent();
    } else if (id === 'btn_op_square') {
      square();
    } else if (id === 'btn_op_equal') {
      handleEqual();
    } else if (
      id === 'btn_op_plus' ||
      id === 'btn_op_minus' ||
      id === 'btn_op_mult' ||
      id === 'btn_op_div'
    ) {
      handleOperator(btn.textContent);
    }
  });
});

// начальное состояние
updateScreen();