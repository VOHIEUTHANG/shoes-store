export default function convertFromStringToNumber(stringNumber) {
   const removeUnit = stringNumber.slice(0, stringNumber.length - 4);
   let numberArray = removeUnit.split('.');
   numberArray = numberArray.join('');
   return Number(numberArray);
}
