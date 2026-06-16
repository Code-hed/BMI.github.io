//---------------Global Varia---------

let isMetric = true;
let currentBmi = 0;
let currentStatus = '';
let currentHealthyRange='';
let currentBodyFat = '';


//---------------DOM-------------
const weightInput = document.getElementById('weight')
const heightInput = document.getElementById('height')
const ageInput =document.getElementById('age')
const genderSelect = document.getElementById('gender')
const calcBtn = document.getElementById('calcBtn')
const unitToggle = document.getElementById('unitToggle')
const unitLabel = document.getElementById('unitLabel')
const weightUnitSpan = document.getElementById('weightUnit')
const heightUnitSpan = document.getElementById('heightUnit')
const resultContainer = document.getElementById('resultContainer')
const bmiValueSpan = document.getElementById('bmiValue')
const bmiStatusSpan = document.getElementById('bmiStatus')
const healthyRangeSpan = document.getElementById('healthyRange')
const bodyFatSpan = document.getElementById('bodyFat')
const errorDiv = document.getElementById('errorMsg')
const bmiMarker = document.getElementById('bmiMarker')
const shareBtn = document.getElementById('shareBtn')
const saveHistoryBtn = document.getElementById('saveHistoryBtn')
const clearHistoryBtn = document.getElementById('clearHistoryBtn')
const historyListDiv = document.getElementById('historyList')
    



//------------------History Function-------------------

let history = []

function loadHistory(){
    const stored = localStorage.getItem('bmiHistory')
    if(stored){
        history = JSON.parse(stored);
    }else{
        history = []
    }
    renderHistory();
}
function saveHistoryToLocal(){
    localStorage.setItem('bmiHistory', JSON.stringify(history.slice(0,10)));
    renderHistory();
}

function addToHistory(bmi,status,weight,height,unitSystem){
    const now = new Date();
    const dateStr = now.toLocaleDateString() + ' ' + now.toLocaleTimeString([],{hour:'2-digit', minute:'2-digit'})
    history.unshift({date:dateStr , bmi:bmi , status:status , weight:weight , height:height , unit:unitSystem})
    if(history.length > 10) history.pop();
    saveHistoryToLocal();
}

function clearHistory(){
    history = [];
    saveHistoryToLocal();
}

function renderHistory(){
    if(!historyListDiv) return;
    if(history.length === 0){
        historyListDiv.innerHTML = '<p class="text-sm text-center text-gray-400 dark:text-gray-500"> No history Yet</p>';
        return;
    }
    historyListDiv.innerHTML = history.map(item =>`
        <div class="history-item p-2 rounded-lg bg-gray-100 dark:bg-gray-800 flex justify-between items-center">
        <div>
            <span class="font-bold text-gray-800 dark:text-white">${item.bmi}</span>
            <span class="text-xs text-gray-500 dark:text-gray-400">(${item.status})</span>
            <div class="text-xs text-gray-400">${item.weight}${item.unit==='metric'?'kg':'lbs'}/ ${item.height}${item.unit==='metric'?'cm':'in'}</div>
        </div>
        <div class="text-xs text-gray-400">${item.date}</div>
        </div>
        `).join('');
}

//--------------------------Unit Conversion----------------

function toggleUnits(){
    if(!weightInput.value || !heightInput.value){
        isMetric = !isMetric;
        updateUnitsLabels();
        return;
    }
    let weightVal = parseFloat(weightInput.value);
    let heightVal = parseFloat(heightInput.value);
    if(isNaN(weightVal) || isNaN(heightVal)){
        isMetric = !isMetric;
        updateUnitsLabels();
        return;
    }
    if(isMetric){
        let newWeight = (weightVal * 2.20462).toFixed(1)

        let newHeight = (heightVal * 0.393701).toFixed(1)

        weightInput.value = newWeight;
        heightInput.value = newHeight;
    }else{
        let newWeight = (weightVal / 2.20462).toFixed(1);
        let newHeight = (heightVal / 0.393701).toFixed(1);
        weightInput.value = newWeight;
        heightInput.value = newHeight;
    }
    isMetric = !isMetric;
    updateUnitsLabels();

    resultContainer.classList.add('hidden');
    errorDiv.classList.add('hidden')
}

function updateUnitsLabels(){
    if(isMetric){
        unitLabel.textContent = 'Metric';
        weightUnitSpan.textContent = 'kg';
        heightUnitSpan.textContent = 'cm';
        weightInput.placeholder = '70';
        heightInput.placeholder = '175';
    }else{
        unitLabel.textContent = 'Imperial';
        weightUnitSpan.textContent = 'lbs';
        heightUnitSpan.textContent = 'in';
        weightInput.placeholder = '154';
        heightInput.placeholder = '69';
    }
}
//-------------------------body Fat estimation-------

function estimateBodyFat(bmi,age,gender){
    let genderFactor = (gender === 'male') ? 1 : 0 ;
    let bodyFat = (1.20 * bmi) + (0.23 * age) - (10.8 * genderFactor) - 5.4;
    bodyFat = Math.min(Math.max(bodyFat,5),5.);
    return bodyFat.toFixed(1)
}

//----------------------healthy weight Range-------

function getHealthyWeightRange(heightMeters){
    let low = (18.5 * heightMeters * heightMeters).toFixed(1);

    let high = (24.9 * heightMeters * heightMeters).toFixed(1);

    return `${low} kg - ${high} Kg` 

}


//--------------------------Bmi CAlculation Core-------

function calculateBmi(){
    errorDiv.classList.add('hidden');
    resultContainer.classList.add('hidden');

    let weight = parseFloat(weightInput.value);
    let height = parseFloat(heightInput.value);
    let age = parseInt(ageInput.value);
    let gender = genderSelect.value;

    //valid
    if(isNaN(weight) || isNaN(height) || weight <= 0  || height <= 0){
        errorDiv.textContent = `Please Enter  A Valid Numbers`;
        errorDiv.classList.remove('hidden');
        return;

    }
    if(isNaN(age) || age < 1 || age > 120){
        errorDiv.textContent = `Please Enter A Valid Age(1-120)`;
        errorDiv.classList.remove('hidden');
        return;
    }

    //convert to metric

    let weightKg = weight;
    let heightM = height;

    if(!isMetric){

        weightKg = weight / 2.20462;

        let heightInches = height;
        heightM = heightInches * 0.0254;
    }else{
        heightM = height / 100;
    }

    if(weightKg <= 0 || heightM <= 0 ){
        errorDiv.textContent = `Invalid Dimensions`;
        errorDiv.classList.remove('hidden');
        return;
    }
    let bmi = weightKg / (heightM ** 2);
    bmi = Math.round((bmi * 10) / 10);
    currentBmi = bmi ;

    let status = '';
    let statusColor = '';
    if(bmi < 18.5){
        status = 'underweight';
        statusColor = '#3b82f6';
    }else if(bmi > 18.5 && bmi < 25){
        status = 'Noraml Weight';
        statusColor = '#22c55e';
    }else if(bmi > 25 && bmi < 30){
        status = 'OverWeight';
        statusColor = '#eab308';
    }else{
        status = 'Obese';
        statusColor = '#ef4444'
    }
    currentStatus = status;
    

    // Healthy  RAnge

    let healthyRange = getHealthyWeightRange(heightM);
    currentHealthyRange = healthyRange;

    //BodyFAt Estimate 

    let bodyFat = estimateBodyFat(bmi, age , gender);
    currentBodyFat = bodyFat;

    // Update Ui 

    bmiValueSpan.textContent = bmi ;
    bmiStatusSpan.textContent = status;
    bmiStatusSpan.style.color = statusColor;
    healthyRangeSpan.textContent = healthyRange;
    bodyFatSpan.textContent = currentBodyFat;

    //Update  Progress Marker Posistin

    let markerPercent = ((bmi - 10 ) / 30 ) * 100 ;
    markerPercent = Math.min(Math.max(markerPercent, 0 ),100);
    bmiMarker.style.left = `${markerPercent}%`;

    resultContainer.classList.remove('hidden');
    resultContainer.classList.add('fade-in')

}

async function shareResult(){
    const shareText = `My BMI: ${currentBmi} (${currentStatus}). Healthy Weight Range: ${currentHealthyRange}. EST. Body Fat: ${currentBodyFat}`;
    if(navigator.share){
        try{
            await navigator.share({
                title:'Bmi REsult',
                text:shareText,
            })
        }catch(err){
            if(err.name !== 'AbortError'){
                fallbackCopy(shareText);
            }
        }
    }else{
        fallbackCopy(shareText);
    }
}
function fallbackCopy(text){
    navigator.clipboard.writeText(text).then(() =>{
        alert('resulate copied to clipboard!');
    }).catch(() => {
        alert('Could not copy!')
    })
}

//--------------------------SAve to History -------------

function saveCurrentToHistory(){
    if(currentBmi === 0){
        errorDiv.textContent = 'Please calculate bmi First';
        errorDiv.classList.remove('hidden');
        setTimeout(() => {
            errorDiv.classList.add('hidden')
        }, 2000)
        return;
    }
    let weightDisplay  = weightInput.value;
    let heightDisplay  = heightInput.value;
    let unitSystem = isMetric ? 'metric' : 'imperial';

    addToHistory(currentBmi,currentStatus,weightDisplay,heightDisplay,unitSystem);
    //showsucess Msg

    const originalMsg = errorDiv.textContent;
    errorDiv.textContent = 'Saved to HIstory!';
    errorDiv.classList.remove('hidden');
    errorDiv.style.color = 'green';

    setTimeout(() => {
        errorDiv.classList.add('hidden');
        errorDiv.style.color = '';
        errorDiv.textContent = originalMsg;

    },1500)

}

//---------------------EVENT LISTENERS------------

calcBtn.addEventListener('click' , calculateBmi);
unitToggle.addEventListener('click' , toggleUnits);
shareBtn.addEventListener('click' , shareResult);
saveHistoryBtn.addEventListener('click' , saveCurrentToHistory);
clearHistoryBtn.addEventListener('click' , () =>{
    if(confirm('clear All History?')){
        clearHistory();
    }
});


// INIT

updateUnitsLabels();
loadHistory();
