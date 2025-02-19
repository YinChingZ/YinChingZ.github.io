const display = document.getElementById('current-input');
const resultDisplay = document.getElementById('result');
let currentInput = '';
let result = '';
let operator = '';
let isDecimalAdded = false;

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
    return value === '+' || value === '-' || value === '×' || value === '÷';
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
        }
        currentInput = '';
        operator = '';
        isDecimalAdded = false;
    }
}

function addNumber(value) {
    currentInput += value;
}

function updateDisplay() {
    display.innerText = currentInput;
    resultDisplay.innerText = result;
}
