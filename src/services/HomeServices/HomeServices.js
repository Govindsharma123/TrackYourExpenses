import dayjs from "dayjs";
import { getData, getLastKey, saveData } from "../dbServices"
import { toast } from "react-toastify";

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
      const path = `Data/${uid}/Expense/${year}/${month}`;
      const snapshot = await getData(path);

      const expenseArray = [];

      if(snapshot){
        
        Object.keys(snapshot).forEach((dateKey) => {
          if(dateKey !== 'lastKey'){
            Object.keys(snapshot[dateKey]).forEach((expenseKey) => {
              if (expenseKey !== 'lastKey') {
                expenseArray.push({
                  id: expenseKey,
                  ...snapshot[dateKey][expenseKey],
                });
              }
            });
          }
        });
      // console.log('hlo')
        resolve(expenseArray);
      }
      else{
        console.log('No expense data found');
        resolve([]);
      }
    }
    catch(error){
      console.error('Error in fetching expense data:', error);
      reject(error);
    }
  })
}

export const getAllCategories = () => {
  return new Promise(async(resolve) => {
    const categoryPath = `Data/${uid}/Category`;
    const snapshot = await getData(categoryPath);
    // console.log(snapshot)
    const categoryArray = [];

    if(snapshot){
      Object.keys(snapshot).forEach((key) => {
        if(key!== 'lastKey'){
          categoryArray.push(snapshot[key])
        }
      })
      resolve(categoryArray);
    }
    else{
      console.log('No category data found');
      resolve([]);
    }
  })
}

export const saveNewCategory = (newCategory) => {
  return new Promise(async(resolve) => {
    const existingCategories = await getAllCategories();

    //check
    const isCategoryExists = existingCategories.some((category) => {
      if (typeof category === 'string') {
        return category.toLowerCase() === newCategory.toLowerCase();
      }
          
      return false; // In case the category is not a string, ignore it
    });

    if(isCategoryExists) {
      toast.error('Category already exists');
      resolve(null); // return false to indicate category already exists
      return;
    }

    const lastKey = await getLastKey(`Data/${uid}/Category/lastKey`, "");
   if(newCategory){
    const path = `Data/${uid}/Category/${lastKey}`
    saveData(path, newCategory);
    saveData(`Data/${uid}/Category`, {lastKey});

    toast.success('category added successfully')
    resolve(newCategory);
   }
   else{
    toast.error('category not saved');
    resolve(console.log('error in saving category'));
   }

  }
)}

