
import { toast } from "react-toastify";
import { fetchRealTimeData, getData, saveData, updateCounts } from "../dbServices";
import dayjs from "dayjs";


export const saveBudget = (year, month, categoryKey ,budgetAmount) => {
  return new Promise(async(resolve) => {
    const year = dayjs().format('YYYY');
    const month = dayjs().format('MMM');
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
    // console.log('budget', budget)

    if(categoryKey && budget){
      const path = `Data/${uid}/Budget/${year}/${month}/${categoryKey}`
      saveData(path, budget);

      const path2 = `Data/${uid}/Summary/MonthlySummary/${year}/${month}/budget`
      updateCounts(path2, budget.budget);

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
    // const year = dayjs().format("yyyy");
    // const month = dayjs().format("MMM");

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
      const prevSnapShot = await getData(path);

      if (!prevSnapShot) {
        toast.error('Expense not found');
        reject('Expense not found');
        return;
      }

      const prevAmount = prevSnapShot.budget || 0;

      // Subtract the previous amount from the total
      const summaryPath = `Data/${uid}/Summary/MonthlySummary/${year}/${month}/budget`;
      await updateCounts(summaryPath, -prevAmount); // Subtract previous amount

      const snapshot = {
        budget : budgetAmount
      }

      saveData(path, snapshot);

      updateCounts(summaryPath, snapshot.budget)

      toast.success('Budget updated successfully');

      resolve(budgetAmount)
    }
    catch(error){
      console.error('Error in updating budget:', error);
      reject(error);
    }
    
  })
}

export const getTotalBudget = (setState, year, month) => {
  // const year = localStorage.getItem('selectedYear');
  // const month = localStorage.getItem('selectedMonth');
  const uid = localStorage.getItem('uid');
  if(!uid){
    toast.error('uid not found');
    return;
  }
  // console.log('setState', setState);
  const path = `Data/${uid}/Summary/MonthlySummary/${year}/${month}/budget`;

  return fetchRealTimeData(path, (data) => {
    // console.log(data)
    if (data) {
      // const expense = data || '0'; 
      setState(data);
    } else {
      setState(0);
      // toast.error('No expense data found');
      // reject('No expense data found');
    }
  });
};