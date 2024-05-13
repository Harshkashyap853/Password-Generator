//cmake
//c make tools
const inputSlider = document.querySelector("[data-length-slider]");
const lengthDisplay = document.querySelector("[data-lengthnumber]");

const passwordDispaly = document.querySelector("[data-passworddisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copymessage]");

const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numberCheck = document.querySelector("#Numbers");
const symbolsCheck = document.querySelector("#symbol");

const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector("#generateButton");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");


let password="";
let passwordLength = 10;
let checkCount = 0;
let symbols ='$~`#@$%^&*(){}|][\/?><:"';
//ste strength circle color to grey
setIndicator("#ccc")

handleSlider();
//set password length according to slider
function handleSlider(){
      inputSlider.value= passwordLength;
      lengthDisplay.innerText = passwordLength;
      const min = inputSlider.min;
      const max = inputSlider.max;
      inputSlider.style.backgroundSize = ( (passwordLength-min)*100/(max-min))+ "% 100%";
}

function setIndicator(color){
      indicator.style.backgroundColor = color;
      //shadow 
      indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;
}

function getRndInteger(min, max) {
      return Math.floor(Math.random()*(max-min))+min;
}

function generateRandomNumber(){
      return getRndInteger(0,9);
}

function generateLowerCase() {
      return String.fromCharCode(getRndInteger(97,123));     
}

function generateUpperCase() {
      return String.fromCharCode(getRndInteger(65,91));     
}

function generateSymbol(){
      const randNum= getRndInteger(0,symbols.length);
      return symbols.charAt(randNum);
}

function calsStrength(){
      let hasUpper =false;
      let hasLower =false;
      let hasNum =false;
      let hasSym =false;
      if (uppercaseCheck.checked) { hasUpper =true; }
      if (lowercaseCheck.checked) { hasLower =true; }
      if (numberCheck.checked) { hasNum =true; }
      if (symbolsCheck.checked) { hasSym =true; }

      if (hasUpper && hasLower && (hasNum || hasSym) && passwordLength >=8) {
            setIndicator("#0f0");
      }
      else if((hasLower||hasUpper)&&(hasNum||hasSym)&&passwordLength>=6){
            setIndicator("#ff0");
      }
      else{
            setIndicator("#f00");
      }
}

async function copycontent(){
      try {
            await navigator.clipboard.writeText(passwordDispaly.value);
            copyMsg.innerText="Copied" ;
      } catch (e) {
            copyMsg.innerText ="Failed";
      }
      copyMsg.classList.add("active");

      setTimeout(() => {
            copyMsg.classList.remove("active");
      }, 2000);
}
function shufflePassword(array){
      //fisher yates method
      for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            const temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }
        let str = "";
        array.forEach((el) => (str += el));
        return str;
}

function handleCheckBoxChange(){
      checkCount= 0;
      allCheckBox.forEach( (checkbox) =>{
            if (checkbox.checked) {
                  checkCount++;
            }
      });

      //special condition
      if(passwordLength<checkCount)
      {
            passwordLength=checkCount;
            handleSlider();
      }
}


allCheckBox.forEach( (checkbox) =>{
      checkbox.addEventListener('change',handleCheckBoxChange);
})

inputSlider.addEventListener('input', (e) =>{
      passwordLength= e.target.value;
      handleSlider();
});

copyBtn.addEventListener('click',() =>{
      if(passwordDispaly.value){
      copycontent();
      }
});

generateBtn.addEventListener('click', () => {
         //none of the checkbox are selected
         if(checkCount ==0) 
               return;

         if(passwordLength < checkCount)
         {
            passwordLength=checkCount;
            handleSlider();
         }

         //let's start the journey to find new password
         console.log("code started");
         //remove old password
         password="";

         //let's put the stuff mentioned in checkboxes
         //less better way
      //    if(uppercaseCheck.Checked)
      //    {
      //       password +=generateUpperCase();
      //    }
      //    if(lowercaseCheck.Checked)
      //    {
      //       password +=generateLowerCase();
      //    }
      //    if(numberCheck.Checked)
      //    {
      //       password +=generateRandomNumber();
      //    }
      //    if(symbolsCheck.Checked)
      //    {
      //       password +=generateSymbol();
      //    }
      let funArr= [];

      if (uppercaseCheck.checked) {
            funArr.push(generateUpperCase);
      }
      if (lowercaseCheck.checked) {
            funArr.push(generateLowerCase);
      }
      if (numberCheck.checked) {
            funArr.push(generateRandomNumber);
      }
      if (symbolsCheck.checked) {
            funArr.push(generateSymbol);
      }

      //compulsory addition
      for(let i=0;i<funArr.length;i++)
      {
            password+=funArr[i]();
      }
      console.log("compulsory addition")

      //remaining addition
      for(let i=0;i<passwordLength-funArr.length;i++)
      {
            let randIndex =getRndInteger(0,funArr.length);
            console.log("rand index" +randIndex);
            password+=funArr[randIndex]();
      }

      //shuffle the password
      password =shufflePassword(Array.from(password));
      console.log("shuffle done");

      //show
      passwordDispaly.value = password;
      console.log('ui updated');

      //to show strength
      calsStrength();

});