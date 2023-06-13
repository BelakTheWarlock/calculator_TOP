function add(n1, n2) {
    return n1 + n2;
}

function subtract(n1, n2) {
    return n1 - n2;
}

function multiply(n1, n2) {
    return n1 * n2;
}

function divide(n1, n2) {
    if (n2 == 0) {
        alert("Can not divide by 0");
        return n1; // Divide by 1 instead
    }
    return n1 / n2;
}

function operate(n1, n2, operator) {
    let result = 0;
    switch (operator) {
        case '+': result = add(n1, n2); break;
        case '-': result = subtract(n1, n2); break;
        case '*': result = multiply(n1, n2); break;
        case '/': result = divide(n1, n2); break;
        default:
            alert("Something went wrong");
            break;
    }
    return result;
}

// Defaults
var inputBuffer = [];
var isFirstNumSet = false;
var isSecondNumSet = false;
var hasDecimal = false;
var firstNum = 0;
var secondNum = 0;
var isAwaitingInput = true;
var isEquated = false;
var operator = '+'; // + is the safest operator

const digitInputs = document.querySelectorAll('.digit.input');
const decimalInput = document.querySelector('.decimal.input');
const operInputs = document.querySelectorAll('.oper.input');
const display = document.querySelector('#display');

function pushToInputBuffer(value) {
    inputBuffer.push(value);
}

function parseInputBuffer() {
    let num = inputBuffer.join('');
    if (num.includes('.')) {
        if(inputBuffer[0] == '.') num = `0${num}`;
        num = Number.parseFloat(inputBuffer.join(''));
        inputBuffer = [];
        return num;    
    }
    num = Number.parseInt(inputBuffer.join(''));
    inputBuffer = [];
    return num;
}

function pushToDisplay(value) {
    display.innerText += value;
}

function clearDisplay() {
    display.innerText = '';
}

function setFirstNum(num, boolean = true) {
    firstNum = num;
    isFirstNumSet = boolean;
}

function setSecondNum(num, boolean = true) {
    secondNum = num;
    isSecondNumSet = boolean;
}

digitInputs.forEach(input => {
    input.addEventListener('click', () => {
        if (isFirstNumSet) {
            clearDisplay();
        }
        if (!isAwaitingInput) {
            setFirstNum(0, false);
        }
        display.innerText += input.innerText;
        pushToInputBuffer(input.innerText);
    }); 
});

decimalInput.addEventListener('click', () => {
    if(!hasDecimal) {
        hasDecimal = true;
        pushToInputBuffer('.');
        pushToDisplay('.');
    }
});

operInputs.forEach(input => {
    if (input.innerText != '=') {
        input.addEventListener('click', () => {
            hasDecimal = false;
            isAwaitingInput = true;
            // If I click an operator, the app should be waiting for my input
            if(!isFirstNumSet && !isSecondNumSet) {
                setFirstNum(parseInputBuffer());
                operator = input.innerText;
            } else if(isFirstNumSet && !isSecondNumSet) {
                setSecondNum(parseInputBuffer());
                operator = input.innerText;
            } else if (isFirstNumSet && isSecondNumSet) {
                setFirstNum(operate(firstNum, secondNum, operator));
                pushToDisplay(firstNum);
                setSecondNum(0, false);
            }
        });
    } else {
        // If '=' is clicked, reuse the last operator and second number
        input.addEventListener('click', () => {
            hasDecimal = false;
            if (isFirstNumSet) {
                isAwaitingInput = false;
                setSecondNum(parseInputBuffer());
                setFirstNum(operate(firstNum, secondNum, operator));
                setSecondNum(0, false);
                clearDisplay();
                pushToDisplay(firstNum);
            }
        });
    }
});
