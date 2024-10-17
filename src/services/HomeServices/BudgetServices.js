
import { toast } from "react-toastify";
import { getData, saveData } from "../dbServices";


export const saveBudget = (year, month, categoryKey ,budgetAmount) => {
  return new Promise(async(resolve) => {
    // const year = dayjs().format('YYYY');
    // const month = dayjs().format('MM');
    console.log(year, month , 'service')
    const uid = localStorage.getItem('uid');

    if(!uid){
      toast.error('Please login to save expenses');
      resolve(console.log('error in saving expense'));
      return;
    }

    const budget = {
      budget : budgetAmount
    }
    console.log('budget', budget)

    if(categoryKey && budget){
      const path = `Data/${uid}/Budget/${year}/${month}/${categoryKey}`
      saveData(path, budget);

      resolve(budget);
      toast.success('Budget saved successfully');
    }
    else {
      toast.error('error in saving budget');
      resolve(console.log('error in saving budget '));
    }
  })
}

export const getBudget = (year, month) => {
  return new Promise(async(resolve) => {
    const uid = localStorage.getItem('uid');
    const path = `Data/${uid}/Budget/${year}/${month}`;
    // console.log('path', path)

    const snapshot = await getData(path);
    const budgetArray = [];

    if(snapshot){
      // console.log('snapshot', snapshot)
      Object.keys(snapshot).forEach((budgetKey) => {
        budgetArray.push({
          id : budgetKey,
          budget : snapshot[budgetKey].budget
        })
      })
      // console.log('budgetArray', budgetArray)
      resolve(budgetArray)
    }
    else{
      console.log('No category data found');
      resolve([]);
    }
  })
}

export const updateBudget = (year, month, categoryKey, budgetAmount )=> {
  // console.log(budget);
  return new Promise(async(resolve, reject) => {
    try{
      const uid = localStorage.getItem('uid');
      if(!uid){
        toast.error('uid not found');
        return;
      }

      const path = `Data/${uid}/Budget/${year}/${month}/${categoryKey}`

      const snapshot = {
        budget : budgetAmount
      }

      saveData(path, snapshot);

      toast.success('Budget updated successfully');

      resolve(budgetAmount)
    }
    catch(error){
      console.error('Error in updating budget:', error);
      reject(error);
    }
    
  })
}
