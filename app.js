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

    let url = '';
    let data = {};

    switch (operation) {
        case 'add':
        case 'subtract':
        case 'multiply':
        case 'divide':
            url = `/${operation}`;
            data = { a: parseFloat(input1), b: parseFloat(input2) };
            break;
        case 'differentiate':
        case 'integrate':
            url = `/${operation}`;
            data = { expression: expression, variable: variable };
            break;
        default:
            console.error('Invalid operation');
            return;
    }

    // Input validation
    if ((operation === 'add' || operation === 'subtract' || operation === 'multiply' || operation === 'divide') && (isNaN(data.a) || isNaN(data.b))) {
        displayError('Invalid input: Please enter valid numbers for the operation.');
        return;
    }

    if ((operation === 'differentiate' || operation === 'integrate') && (expression.trim() === '' || variable.trim() === '')) {
        displayError('Invalid input: Please enter a valid expression and variable for the operation.');
        return;
    }

    // Display loading indicator
    displayLoading(true);

    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(result => {
        document.getElementById('result').innerText = result.result;
        // Hide loading indicator
        displayLoading(false);
    })
    .catch(error => {
        console.error('Error:', error);
        displayError('An error occurred while processing the request.');
        // Hide loading indicator
        displayLoading(false);
    });
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
