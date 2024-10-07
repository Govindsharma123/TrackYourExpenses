import dayjs from "dayjs";
import { getData, getLastKey, saveData } from "../dbServices"

 const uid = localStorage.getItem('uid');
 


export const saveExpense = (newExpense) => {
  return new Promise(async (resolve) => {
    const year = dayjs(newExpense.date).format('YYYY');
    const month = dayjs(newExpense.date).format('MMM');
    const date = dayjs(newExpense.date).format('YYYY-MM-DD');
    const lastKey = await getLastKey(`Data/${uid}/Expense/${year}/${month}/${date}/lastKey`, "");
    // console.log('lastKey', lastKey);
    if (newExpense){
      const path = `Data/${uid}/Expense/${year}/${month}/${date}/${lastKey}`;
      saveData(path,newExpense);
      saveData(`Data/${uid}/Expense/${year}/${month}/${date}`, {lastKey});


      console.log('data saved successfully')
      resolve(newExpense);
    } 
    else{
      resolve(console.log('error in saving expense'));
    }
  }
)}

export const getExpenseList = async(uid) => {
  return new Promise(async(resolve, reject) => {
    const year = dayjs().format('YYYY');
    const month = dayjs().format('MMM');
    const date = dayjs().format('YYYY-MM-DD');
    try{
      const path = `Data/${uid}/Expense/${year}/${month}/${date}`;
      const snapshot = await getData(path);

      const expenseArray = [];

      if(snapshot){
        
        Object.keys(snapshot).forEach((key) => {
          if(key !== 'lastKey'){
            expenseArray.push( {
            
              id : key,
             ...snapshot[key]
            })
          }
      })
      // console.log('hlo')
        resolve(expenseArray);
      }
      else{
        resolve(console.log('No expense data found'));
      }
    }
    catch(error){
      reject(console.log(error));
    }
  })
}