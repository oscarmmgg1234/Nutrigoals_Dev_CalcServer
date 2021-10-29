const express = require('express');

const app = express();
const port = 5003;

function BMRImperial(formula, gender, weight, height, years){
	
    let result = 0;
  switch(formula){
      case 'Harris-Benedict':{
          if(gender === 'male'){

        
		  result = 66 + (6.2 * weight) + (12.7 * height) - (6.76 * years)
              
		  return result;
          }
          else{
               result = 665 + (4.35 * weight) + (4.7 * height) - (4.7 * years)
               return result;
          }
      }
      case 'Mifflin St Jeor':{
        if(gender === 'male'){
            result = 5 + ((10 * weight) * 2.20462) + (height / 0.393701)  - (5 * years);
            return result;
        }
        else {
            result = ((10 * weight) * 2.20462) + ( height / 0.393701)  - (5 * years) - 161;
            return result;
        }
        
    }
      default: {
          
      }
  }  
}
function BMRMetric(formula, gender, weight, height, years){
    let result = 0;
    switch(formula){
        case 'Harris-Benedict':{
            if(gender === 'male'){
                result = 88.362 + (13.397 * (0.453592 *  weight)) + (4.799 * (2.54 * height)) - (5.677 * years);
                return result;
            }
            else {
                result = 447.593 + (9.247 * (0.453592 *  weight)) + (3.098 * (2.54 * height)) - (4.330 * years);
                return result;
            }
        }
        case 'Mifflin St Jeor':{
            if(gender === 'male'){
                result = 5 + (10 * (0.45392 *  weight)) +  (2.54 *  height) - (5 * years);
                return result;
            }
            else{
                result =  (10 *(0.45392 *  weight)) + (2.54 *  height) - (5 * years) - 161;
                return result;
            }
            
        }
        }
    }  
  

function MacroCalculation(cal, m){
let Macro = cal * (m / 100);
	
	return Macro;
}



function BMR(format, formula, gender, weight, height, years){
    //format === true ? imperial : metric //default => imperial
    console.log('step 1');
	switch (format){
        case 'imperial': {
            return BMRImperial(formula, gender, weight, height,years)
            
        }
        case 'metric': {
            return BMRMetric(formula, gender, weight, height,years)
            
        }
        default: {
            return BMRImperial(formula, gender, weight, height,years)
        }
    }
}


function BFcalc(format, formula, height, weight, waist, neck, gender, age){

	switch(format){
	case 'metric':{
	return BFmetric(formula, height, weight, waist, neck, gender, age);
	}
	case 'imperial': {
	return BFimperial(formula, height, weight, waist, neck, gender, age);
	}
	default:{
	return BFimperial(formula, height, weight, waist, neck, gender, age);
	}

	}
}

function BFmetric(f, h, w, wa, ne, gen, age){
let result = 0;
	switch(f){
	case 'US-Navy Method':{
		
		if(gen === 'male'){
			console.log('in')
		result = (495 / (1.0324 - 0.19077 * Math.log10(wa - ne) + 0.15456 * Math.log10(h))) - 450;
			return result;
		}
		else{
			result = (495 / (1.29579 - 0.35004 * Math.log10(wa - ne) +  0.22100 * Math.log10(h))) - 450;
			return result;
		}
	}

	case 'BMI Method':{
		if(gen === 'male'){

		result = 1.20 * (w / Math.pow((h / 100), 2)) + 0.23 * age - 16.2; 
			return result;
		}
		else {
		result =1.20 * (w / Math.pow((h / 100), 2)) + 0.23 * age - 16.2;
			return result;
		}
	}
}}



function BFimperial(f, h, w, wa, ne, gen, age){
let result = 0;
        switch(f){
        case 'US-Navy Method':{

                if(gen === 'male'){
                result = 86.010 * Math.log10(wa - ne) - 70.041 * Math.log10(h) + 36.76;
                        return result;
                }
                else{
                        result = 163.205 * Math.log10(wa-ne) - 97.684 *( Math.log10(h)) - 78.387;
                        return result;
                }
        }

        case 'BMI Method':{
                if(gen === 'male'){

                result = 1.20 * (703 * (w / Math.pow(h, 2))) + 0.23 * age - 16.2;
                        return result;
                }
                else {
                result =1.20 * (703 * (w / Math.pow(h, 2))) + 0.23 * age - 5.4;
                        return result;
                }
        }
}
}


app.listen(port, ()=>console.log(`Listening on port: ${port}`));

app.get('/BMR', (req,res)=>{
    let format = req.header('format');
    let formula = req.header('formula');
    let gender = req.header('gender');
    let weight = req.header('weight');
    let height = req.header('height');
    let age = req.header('age');
	let result = BMR(format,formula,gender,weight,height,age);
	res.send({value: result});

}

)

app.get('/Macro', (req,res)=>{

	let totalCalc = req.header('calories');
	let psP = req.header('proteinP');
	let fsP = req.header('fatP');
	let csP = req.header('carbP');

	let p = MacroCalculation(parseFloat(totalCalc), psP);
	let f = MacroCalculation(parseFloat(totalCalc), fsP);
	let c = MacroCalculation(parseFloat(totalCalc), csP);

	res.send({data: [p, f, c]});
})

app.get('/BodyFatCalculator', (req,res)=>{

   const f = req.header('format');
        const w = req.header('weight');
        const h = req.header('height');
        const wa = req.header('waist');
	const ne = req.header('neck');
	const age = req.header('age');
	const g = req.header('gender');
	const fo = req.header('formula');
	const result = BFcalc(f, fo, parseFloat(h), parseFloat(w), parseFloat(wa), parseFloat(ne), g, parseFloat(age));
	console.log(result);
	res.send({data: result});


})

