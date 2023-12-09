const inputSlider = document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[data-lengthNumber]");
const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector('#lowercase');
const symbolsCheck = document.querySelector('#symbols');
const numbersCheck = document.querySelector('#numbers');
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector('.generateButton');
const allCheckBox = document.querySelectorAll("input[type=checkbox]");

// Symbols
// 30 SYMBOLS
const symbols = '~`!@#$%^&*()_-+={[}]|:;"<,>.?/';


let password = "";
let passwordLength = 10;
let checkCount = 0;
handleSlider();

setIndicator("#ccc");

// Set Password length
function handleSlider(){
    inputSlider.value = passwordLength;
    lengthDisplay.innerText = passwordLength;
    const min = inputSlider.min;
    const max = inputSlider.max;
    inputSlider.style.backgroundSize = ( (passwordLength-min) *100 / (max - min)) + "% 100%";
}

function setIndicator(color){
    indicator.style.backgroundColor = color;
    indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;
}

function getRandomInteger(min, max){
    return Math.floor(Math.random() * (max-min)) + min;
}
function generateRandomNumber(){
    return getRandomInteger(0, 9);
}

function generateLowercase(){
    return String.fromCharCode(getRandomInteger(97, 123));
}

function generateUppercase(){
    return String.fromCharCode(getRandomInteger(65, 91));
}

function generateSymbol(){
    const rndNum = getRandomInteger(0, symbols.length);
    return symbols.charAt(rndNum);
}

function calcStrength(){
    let hasUpper = false;
    let hasLower = false;
    let hasSym = false;
    let hasNum = false;

    if(uppercaseCheck.checked){
        hasUpper = true;
    }
    if(lowercaseCheck.checked){
        hasLower = true;
    }
    if(symbolsCheck.checked){
        hasSym = true;
    }
    if(numbersCheck.checked){
        hasNum = true;
    }

    if(hasUpper && hasLower &&(hasNum || hasSym) && passwordLength >=8){
        setIndicator("#0f0");
    }else if(
        (hasLower || hasUpper) && 
        (hasNum || hasSym) &&
        passwordLength >= 6
    ){
        setIndicator("#ff0");
    }
    else{
        setIndicator("#f00");
    }
}

async function copyContent(){
    try{
            await navigator.clipboard.writeText(passwordDisplay.value);
            copyMsg.textContent = "copied";
    }catch(e){
        copyMsg.textContent = "Failed";
    }
    copyMsg.classList.add("active");

    setTimeout(function(){
        copyMsg.classList.remove("active");
    }, 2000);
}
inputSlider.addEventListener('input', function(e){
    passwordLength = e.target.value;
    handleSlider();
})

function handleCheckBoxChange(){
    checkCount = 0;
    allCheckBox.forEach(function(checkbox){
        if(checkbox.checked){
            checkCount++;
        }
    });

    // Special Condition
    if(passwordLength < checkCount){
        passwordLength = checkCount;
        handleSlider();
    }
}

allCheckBox.forEach(function(checkbox){
    checkbox.addEventListener('change', handleCheckBoxChange);
})

copyBtn.addEventListener('click', function(){
    if(password.length >0){
        copyContent();
    }
})


// Shuffle using "FISHER YATES" METHOD
function shufflePassword(array){
    for(let i = array.length-1; i>0; i--){
        const j = Math.floor(Math.random() * (i+1));
        const temp = array[i];
        array[i] = array[j];
        array[i] = temp;
    }
    let str = "";
    array.forEach(function(el){
        str += el;
    });
    return str;
}


// Generate Btn
generateBtn.addEventListener('click', function(){
    if(checkCount == 0){
        return;
    }
    if(passwordLength< checkCount){
        passwordLength = checkCount;
        handleSlider();
    }

    // New Password
    password = "";

    let funcArr = [];
    if(uppercaseCheck.checked){
        funcArr.push(generateUppercase);
    }
    if(lowercaseCheck.checked){
        funcArr.push(generateLowercase);
    }
    if(numbersCheck.checked){
        funcArr.push(generateRandomNumber);
    }
    if(symbolsCheck.checked){
        funcArr.push(generateSymbol);
    }

    // Compulsory Addition

    for(let i = 0; i<funcArr.length; i++){
        password += funcArr[i]();
    }

    // Remaining addition
    for(let i = 0; i <passwordLength-funcArr.length; i++){
        let randomIndex = getRandomInteger(0, funcArr.length);
        password += funcArr[randomIndex]();
    }

    // Shuffle the password

    password = shufflePassword(Array.from(password));

    // Show on UI

    passwordDisplay.value = password;

    // Strength
    calcStrength();
});