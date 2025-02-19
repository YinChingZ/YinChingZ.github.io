import * as math from 'mathjs';

document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('button').forEach(button => {
        button.addEventListener('click', function() {
            const operation = this.getAttribute('onclick').replace('performOperation(', '').replace(')', '').replace(/'/g, '');
            performOperation(operation);
        });
    });
});

function performOperation(operation) {
    const input1 = document.getElementById('input1').value;
    const input2 = document.getElementById('input2').value;
    const expression = document.getElementById('expression').value;
    const variable = document.getElementById('variable').value;

    let result;

    switch (operation) {
        case 'add':
            result = add(parseFloat(input1), parseFloat(input2));
            break;
        case 'subtract':
            result = subtract(parseFloat(input1), parseFloat(input2));
            break;
        case 'multiply':
            result = multiply(parseFloat(input1), parseFloat(input2));
            break;
        case 'divide':
            result = divide(parseFloat(input1), parseFloat(input2));
            break;
        case 'differentiate':
            result = differentiate(expression, variable);
            break;
        case 'integrate':
            result = integrate(expression, variable);
            break;
        default:
            console.error('Invalid operation');
            return;
    }

    // Input validation
    if ((operation === 'add' || operation === 'subtract' || operation === 'multiply' || operation === 'divide') && (isNaN(parseFloat(input1)) || isNaN(parseFloat(input2)))) {
        displayError('Invalid input: Please enter valid numbers for the operation.');
        return;
    }

    if ((operation === 'differentiate' || operation === 'integrate') && (expression.trim() === '' || variable.trim() === '')) {
        displayError('Invalid input: Please enter a valid expression and variable for the operation.');
        return;
    }

    document.getElementById('result').innerText = result;
}

function add(a, b) {
    return math.add(a, b);
}

function subtract(a, b) {
    return math.subtract(a, b);
}

function multiply(a, b) {
    return math.multiply(a, b);
}

function divide(a, b) {
    if (b === 0) {
        return "Error: Division by zero";
    }
    return math.divide(a, b);
}

function differentiate(expression, variable) {
    try {
        const expr = math.parse(expression);
        const diffExpr = math.derivative(expr, variable);
        return diffExpr.toString();
    } catch (e) {
        return e.toString();
    }
}

function integrate(expression, variable) {
    try {
        const expr = math.parse(expression);
        const intExpr = math.integrate(expr, variable);
        return intExpr.toString();
    } catch (e) {
        return e.toString();
    }
}

function displayError(message) {
    const resultElement = document.getElementById('result');
    resultElement.innerText = message;
    resultElement.style.color = 'red';
}

function displayLoading(isLoading) {
    const resultElement = document.getElementById('result');
    if (isLoading) {
        resultElement.innerText = 'Loading...';
    } else {
        resultElement.innerText = '';
    }
}
