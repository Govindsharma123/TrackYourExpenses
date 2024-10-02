import dayjs from "dayjs";
import { getLastKey, saveData } from "../dbServices"

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
    }
  
    else{
      resolve(console.log('error in saving expense'));
    }
    
  }
)
}