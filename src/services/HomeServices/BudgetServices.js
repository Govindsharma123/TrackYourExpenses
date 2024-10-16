import dayjs from "dayjs"
import { toast } from "react-toastify";
import { saveData } from "../dbServices";


export const saveBudget = (year, month, categoryKey ,budgetAmount) => {
  return new Promise(async(resolve) => {
    const year = dayjs().format('YYYY');
    const month = dayjs().format('MM');

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