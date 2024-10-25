import dayjs from "dayjs"
import { fetchRealTimeData, getData, getLastKey, saveData, updateCounts } from "../dbServices"
import { toast } from "react-toastify"

export const saveIncome = (newIncome, year, month) => {
  return new Promise(async(resolve) => { 
  
  const uid = localStorage.getItem('uid')

    if(!uid){
      toast.error('uid not found')
      return
    }
    const lastKey =  await getLastKey(`Data/${uid}/Income/${year}/${month}/lastKey`, "");

    if(newIncome){
      const path = `Data/${uid}/Income/${year}/${month}/${lastKey}`
      saveData(path, newIncome);
      saveData(`Data/${uid}/Income/${year}/${month}`, {lastKey});
      console.log(newIncome)
      const path2 = `Data/${uid}/Summary/MonthlySummary/${year}/${month}/income`
      updateCounts(path2, newIncome.Amount);

      resolve(newIncome);
    }
    else{
      toast.error('error in saving income')
      resolve(console.log('error in saving income'))
    }
  })
}

export const getAllIncome = async(year, month) => {
  return new Promise(async(resolve) => {
    // const year = localStorage.getItem('selectedYear');
    // const month = localStorage.getItem('selectedMonth')
    const uid = localStorage.getItem('uid')

    if(!uid){
      toast.error('uid not found')
      return
    }
   try{
    const path = `Data/${uid}/Income/${year}/${month}`
    const snapshot = await getData(path);
    const incomeArray = []

    if(snapshot){

      Object.keys(snapshot).forEach((key) => {
        if(key !== 'lastKey'){
          incomeArray.push({
            id: key,
            ...snapshot[key],
          })  
        }
      })
      resolve(incomeArray);
      // console.log(incomeArray)
    }
    else{
      console.log('No income data found');
      resolve([]);
    }
  }
  catch(error){
    console.error('Error in fetching income data:', error);
    resolve([]);
  }
}) 
}

export const getTotalIncome = (setState, year, month) => {
  // const year = localStorage.getItem('selectedYear');
  // const month = localStorage.getItem('selectedMonth')
  const uid = localStorage.getItem('uid');
  if(!uid){
    toast.error('uid not found');
    return;
  }
  // console.log('setState', setState);
  const path = `Data/${uid}/Summary/MonthlySummary/${year}/${month}/income`;

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
}