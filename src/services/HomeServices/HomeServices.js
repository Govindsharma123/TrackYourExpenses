import dayjs from "dayjs";
import { getData, getLastKey, RemoveData, saveData } from "../dbServices"
import { toast } from "react-toastify";



 


export const saveExpense = (newExpense) => {
  return new Promise(async (resolve) => {
    const year = dayjs(newExpense.date).format('YYYY');
    const month = dayjs(newExpense.date).format('MMM');
    const date = dayjs(newExpense.date).format('YYYY-MM-DD');
    
    const uid = localStorage.getItem('uid');
    const lastKey = await getLastKey(`Data/${uid}/Expense/${year}/${month}/${date}/lastKey`, "");

    if(!uid){
      toast.error('Please login to save expenses');
      resolve(console.log('error in saving expense'));
      return;
    }
    console.log(uid)
    // console.log('lastKey', lastKey);
    if (newExpense && uid != null){
      const path = `Data/${uid}/Expense/${year}/${month}/${date}/${lastKey}`;
      console.log('path', path)
      saveData(path,newExpense);
      saveData(`Data/${uid}/Expense/${year}/${month}/${date}`, {lastKey});


      console.log('data saved successfully')
      resolve(newExpense);
    } 
    else{
      toast.error('error in saving expense');
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
              // console.log(expenseKey)
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
    const uid = localStorage.getItem('uid');
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
   
    const uid = localStorage.getItem('uid');

        // To prevent simultaneous clicks, we disable the save operation while in progress
        if (!uid || !newCategory) {
          toast.error('Invalid user or category');
          resolve(null);
          return;
        }
    
        const existingCategories = await getAllCategories();
      // Function to normalize strings: convert to lowercase and trim spaces
      const normalizeCategory = (category) => {
        return category.toLowerCase().trim();
      };

      // Check if the category already exists in the list
      const isCategoryExists = existingCategories.some((category) => {
        return (
          typeof category === 'string' &&
          normalizeCategory(category) === normalizeCategory(newCategory)
        );
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

    // toast.success('category added successfully')
    resolve(newCategory);
   }
   else{
    toast.error('category not saved');
    resolve(console.log('error in saving category'));
   }

  }
)}

export const updateExpense = ( id, expense)=> {
  // console.log(expense);
  return new Promise(async(resolve, reject) => {
    try{
      const year = dayjs(expense.date).format('YYYY');
      const month = dayjs(expense.date).format('MMM');
      const date = dayjs(expense.date).format('YYYY-MM-DD');
      const uid = localStorage.getItem('uid');

      if(!uid){
        toast.error('uid not found');
        return;
      }

     

      const path = `Data/${uid}/Expense/${year}/${month}/${date}/${id}`
      // console.log(path)
      const snapshot = {
        category: expense.category,
        amount: expense.amount,
        detail: expense.detail,
        date: expense.date,
        modeOfExpense: expense.modeOfExpense,
      }

      console.log('snapshot', snapshot)

      await saveData(path, snapshot);
      // toast.success('expense updated successfully')
      resolve(expense);
    }
    catch(error){
      console.error('Error in updating expense:', error);
      reject(error);
    }
    
  })
}

export const deleteExpense = async(id, expense) => {
  console.log(expense)
  return new Promise((resolve, reject) => {
    const uid = localStorage.getItem('uid');
    if(!uid){
      toast.error('user not found');
      reject("User not logged in");
      return;
    }

    const year = dayjs(expense.date).format('YYYY');
    const month = dayjs(expense.date).format('MMM');
    const date = dayjs(expense.date).format('YYYY-MM-DD');

    const path = `Data/${uid}/Expense/${year}/${month}/${date}/${id}`;

    try {
      const result = RemoveData(path); // Using the RemoveData service
      console.log('Expense deleted successfully:', result);
      resolve(result);
    } catch (error) {
      console.error('Error deleting expense:', error);
      reject(error);
    }
  //  else {
  //   reject("Expense key not found");
  // }
})
}

