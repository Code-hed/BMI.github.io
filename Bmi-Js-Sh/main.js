//Init
const weightInput = document.getElementById('weight')
const heightInput = document.getElementById('height')
const calculateBtn = document.getElementById('calculation')
const resultContainer = document.getElementById('resultContainer')
const bmiValue = document.getElementById('bmiValue')
const bmiStatus = document.getElementById('bmiStatus')
const errorMsg = document.getElementById('errorMsg')
    

function calculateBMI(){
   errorMsg.classList.add('hidden')
   resultContainer.classList.add('hidden')

   let weight = parseFloat(weightInput.value)
   let heightcm = parseFloat(heightInput.value)
let height =  heightcm / 100;
   if(isNaN(weight) || isNaN(height)|| weight <=0|| heightcm <=0){
    errorMsg.textContent="Please enter valid numbers";
    errorMsg.classList.remove('hidden')
    return
   }

   
   let bmi = weight / (height**2);
   bmi =Math.round(bmi *10)/10;

   bmiValue.textContent = bmi;

   let status ='';
   let statusColor = '';
   if(bmi<18.5){
    status = 'skinny'
    statusColor = 'text-yellow-600';
   }else if(bmi >= 18.5 && bmi <25){
    status = 'Normal'
    statusColor = 'text-green-600'
   }else if(bmi>=25 && bmi <30){
    status='overWeight'
    statusColor = 'text-orange-500'
   }else{
    status = 'FAT'
    statusColor = 'text-red-600'
   }
   bmiStatus.textContent = status;
   bmiStatus.className = `text-md mt-2 font-medium ${statusColor}`;


   resultContainer.classList.remove('hidden');
   resultContainer.classList.add('fade-in')

}

calculateBtn.addEventListener('click', calculateBMI);

weightInput.addEventListener('keypress', function(e){
    if(e.key ==='Enter') calculateBMI();
});
heightInput.addEventListener('keypress', function(e){
    if(e.key ==='Enter') calculateBMI();
});
