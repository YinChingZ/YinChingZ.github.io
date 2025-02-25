const display = document.getElementById('current-input');
const resultDisplay = document.getElementById('result');
const historyDisplay = document.getElementById('history');
let currentInput = '';
let result = '';
let operator = '';
let isDecimalAdded = false;
let history = [];

const buttons = document.querySelectorAll('.btn');
buttons.forEach(button => {
    button.addEventListener('click', () => {
        const value = button.innerText;
        handleInput(value);
    });
});

document.addEventListener('keydown', (event) => {
    const key = event.key;
    if (isValidKey(key)) {
        handleInput(key);
    }
});

function handleInput(value) {
    if (isOperator(value)) {
        handleOperator(value);
    } else if (value === 'C') {
        clearInput();
    } else if (value === '←') {
        backspace();
    } else if (value === '.') {
        addDecimal();
    } else if (value === '=') {
        calculateResult();
    } else if (value === '√') {
        calculateSquareRoot();
    } else if (value === '%') {
        calculatePercentage();
    } else if (value === '^') {
        handlePowerOperator();
    } else if (isNumber(value)) {
        addNumber(value);
    }
    updateDisplay();
}

function isValidKey(key) {
    return isNumber(key) || isOperator(key) || key === 'Enter' || key === 'Backspace' || key === 'Escape' || key === '.';
}

function isNumber(value) {
    return !isNaN(value);
}

function isOperator(value) {
    return value === '+' || value === '-' || value === '×' || value === '÷' || value === '^' || value === '%';
}

function handleOperator(value) {
    if (currentInput === '' && result !== '') {
        currentInput = result;
        result = '';
    }
    if (currentInput !== '') {
        if (operator !== '') {
            calculateResult();
        }
        operator = value;
        currentInput += ` ${value} `;
        isDecimalAdded = false;
    }
}

function handlePowerOperator() {
    if (currentInput === '' && result !== '') {
        currentInput = result;
        result = '';
    }
    if (currentInput !== '') {
        if (operator !== '') {
            calculateResult();
        }
        operator = '^';
        currentInput += ` ^ `;
        isDecimalAdded = false;
    }
}

function clearInput() {
    currentInput = '';
    result = '';
    operator = '';
    isDecimalAdded = false;
}

function backspace() {
    if (currentInput !== '') {
        const lastChar = currentInput.slice(-1);
        if (lastChar === ' ') {
            currentInput = currentInput.slice(0, -3);
            operator = '';
        } else {
            currentInput = currentInput.slice(0, -1);
        }
    }
}

function addDecimal() {
    if (!isDecimalAdded) {
        currentInput += '.';
        isDecimalAdded = true;
    }
}

function calculateResult() {
    const [operand1, operator, operand2] = currentInput.split(' ');
    if (operand1 && operator && operand2) {
        const num1 = parseFloat(operand1);
        const num2 = parseFloat(operand2);
        switch (operator) {
            case '+':
                result = num1 + num2;
                break;
            case '-':
                result = num1 - num2;
                break;
            case '×':
                result = num1 * num2;
                break;
            case '÷':
                result = num1 / num2;
                break;
            case '^':
                result = Math.pow(num1, num2);
                break;
            case '%':
                result = num1 % num2;
                break;
        }
        currentInput = '';
        operator = '';
        isDecimalAdded = false;
        updateHistory(operand1, operator, operand2, result);
        triggerResultAnimation();
    }
}

function calculateSquareRoot() {
    if (currentInput !== '') {
        const num = parseFloat(currentInput);
        result = Math.sqrt(num);
        currentInput = '';
        operator = '';
        isDecimalAdded = false;
        updateHistory(num, '√', '', result);
        triggerResultAnimation();
    }
}

function calculatePercentage() {
    if (currentInput !== '') {
        const num = parseFloat(currentInput);
        result = num / 100;
        currentInput = '';
        operator = '';
        isDecimalAdded = false;
        updateHistory(num, '%', '', result);
        triggerResultAnimation();
    }
}

function addNumber(value) {
    currentInput += value;
}

function updateDisplay() {
    display.innerText = currentInput;
    resultDisplay.innerText = result;
}

function updateHistory(operand1, operator, operand2, result) {
    const historyEntry = `${operand1} ${operator} ${operand2} = ${result}`;
    history.push(historyEntry);
    historyDisplay.innerHTML = history.join('<br>');
}

function triggerResultAnimation() {
    resultDisplay.classList.remove('show');
    void resultDisplay.offsetWidth; // Trigger reflow
    resultDisplay.classList.add('show');
    resultDisplay.classList.add('highlight');
    setTimeout(() => {
        resultDisplay.classList.remove('highlight');
    }, 500);
}
