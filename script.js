const inputSlider = document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[data-lengthNumber]");

const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generateButton");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");
const symbols = '~!@#$%^&*()_+{}:;<>,./?\|';

//initially
let password = "";
let passwordLength = 10;
let checkCount = 0;
handleSlider();

//set strength circle color grey
setIndicator("#ccc");

// slider handle krne ka function likhenge
function handleSlider(){    // handleSlider() => password length ko UI par reflect Krwata hai

    inputSlider.value = passwordLength;
    lengthDisplay.innerText = passwordLength;
    //kuchh or add krna chahiye
    const min = inputSlider.min;
    const max = inputSlider.max;
    inputSlider.style.backgroundSize = ((passwordLength - min)*100/(max-min)) + "% 100%";

}

function setIndicator(color){   // strength indicator me input wala color/shadow set krta hai
    indicator.style.backgroundColor = color;
    //shadow homework
    indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;

}

function getRndInteger(min,max){   //min or max ki range me ek random integer find krke deta hai
    return Math.floor(Math.random() * (max - min)) + min;
}

function generateRandomNumber(){
    return getRndInteger(0,9);
}

function generateLowerCase(){
    return String.fromCharCode(getRndInteger(97,123));
}

function generateUpperCase(){
    return String.fromCharCode(getRndInteger(65,91));
}

function generateSymbols(){
    const randNum = getRndInteger(0,symbols.length);
    return symbols.charAt(randNum);
}

// function calcStrength(){
//     let hasUpper = false;
//     let hasLower = false;
//     let hasNum = false;
//     let hasSym = false;

//     if(uppercaseCheck.checked) hasUpper = true;
//     if(lowercaseCheck.checked) hasLower = true;
//     if(numbersCheck.checked) hasNum = true;
//     if(symbolsCheck.checked) hasSym = true;

//     if (hasUpper && hasLower && (hasNum || hasSym) && paswwordLength >= 8){
//         setIndicator("#0f0");
//     }
//     else if( (hasLower || hasUpper) && (hasNum || hasSym) && passwordLength >= 6){
//         setIndicator("#ff0");
//     }
//     else{
//         setIndicator("#f00");
//     }
// }


function calcStrength() {
    let hasUpper = false;
    let hasLower = false;
    let hasNum = false;
    let hasSym = false;
    if (uppercaseCheck.checked) hasUpper = true;
    if (lowercaseCheck.checked) hasLower = true;
    if (numbersCheck.checked) hasNum = true;
    if (symbolsCheck.checked) hasSym = true;
  
    if (hasUpper && hasLower && (hasNum || hasSym) && passwordLength >= 8) {
      setIndicator("#0f0");
    } else if (
      (hasLower || hasUpper) &&
      (hasNum || hasSym) &&
      passwordLength >= 6
    ) {
      setIndicator("#ff0");
    } else {
      setIndicator("#f00");
    }
}

async function copyContent(){
    try{
        await navigator.clipboard.writeText(passwordDisplay.value);    //clipboard ki value ko copy krte hai isse
        copyMsg.innerText = "Copied";
    }
    catch(e){
        copyMsg.innerText = "Failed";
    }

    // to make copy wala span visible
    copyMsg.classList.add("active");
    setTimeout(()=>{
        copyMsg.classList.remove("active");
    },2000);
}

function shufflePassword(array){
    //Fisher Yates Method
    for(let i=array.length-1; i>0; i--){
    //random j finding using math. random()
        const j = Math.floor(Math.random() * (i+1));

        //swapping of ith and jth value
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    let str = "";
    array.forEach((el) => {str += el});
    return str;
}

function handleCheckBoxChange(){
    checkCount = 0;
    allCheckBox.forEach( (checkbox)=>{
        if(checkbox.checked)
            checkCount++;
    });

    //special condition
    if(passwordLength < checkCount){
        passwordLength = checkCount;
        handleSlider();
    }
}

allCheckBox.forEach( (checkbox)=>{
    checkbox.addEventListener('change', handleCheckBoxChange);
})

inputSlider.addEventListener('input', (e)=>{
    passwordLength = e.target.value;
    handleSlider();
})

copyBtn.addEventListener('click',()=>{
    if(passwordDisplay.value)
        copyContent();
    // if(passwordLength > 0)
    //     copyContent();
})

generateBtn.addEventListener('click',()=>{
    //none of the checkbox are selected
    if(checkCount == 0)
    return;

    if(passwordLength < checkCount){
        passwordLength = checkCount;
        handleSlider();
    }

    // let 's start the journey to find new password
    console.log("Starting the Journey");

    //remove old password
    password = "";

    //let's put the stuff sentioned by checkboxes
    
    // it creates some complications that's why we use an array
    // if(uppercaseCheck.checked){
    //     password += generateUpperCase();
    // }
    // if(lowercaseCheck.checked){
    //     password += generateLowerCase();
    // }
    // if(numbersCheck.checked){
    //     password += generateRandomNumber();
    // }
    // if(symbolsCheck.checked){
    //     password += generateSymbols();
    // }

    let funcArr = [];

    if(uppercaseCheck.checked)
        funcArr.push(generateUpperCase);
 
    if(lowercaseCheck.checked)
        funcArr.push(generateLowerCase);

    if(numbersCheck.checked)
        funcArr.push(generateRandomNumber);

    if(symbolsCheck.checked)
        funcArr.push(generateSymbols);

    //compulsory addition
    for(let i=0; i<funcArr.length; i++){
        password += funcArr[i]();
    }
    console.log("COmpulsory adddition done");


    //remaining addition
    for(let i=0; i<passwordLength-funcArr.length; i++){
        let randIndex = getRndInteger(0, funcArr.length);
        password += funcArr[randIndex]();
    }
    console.log("Remaining adddition done");

    //shuffle the Password
    password = shufflePassword(Array.from(password));
    console.log("Shuffling done");

    //show in UI
    passwordDisplay.value = password;
    console.log("UI adddition done");

    //calculate strength
    calcStrength();
});
