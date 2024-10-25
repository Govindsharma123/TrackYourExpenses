import dayjs from "dayjs";
import { fetchRealTimeData, getData, getLastKey, RemoveData, saveData, updateCounts } from "../dbServices"
import { toast } from "react-toastify";


export const saveExpense = (newExpense) => {
  return new Promise(async (resolve) => {
    const year = dayjs(newExpense.date).format('YYYY');
    const month = dayjs(newExpense.date).format('MMM');
    const date = dayjs(newExpense.date).format('YYYY-MM-DD');
    
    const uid = localStorage.getItem('uid');
    const lastKey = await getLastKey(`Data/${uid}/Expense/lastKey`, "");
    console.log(lastKey)

    if(!uid){
      toast.error('Please login to save expenses');
      resolve(console.log('error in saving expense'));
      return;
    }
   
    if (newExpense && uid != null){
      const path = `Data/${uid}/Expense/${year}/${month}/${date}/${lastKey}`;
      console.log('path', path)
      saveData(path,newExpense);
      saveData(`Data/${uid}/Expense`, {lastKey});

      //TOTAL EXPENSe badha diya from amount which is saved
      const path2 = `Data/${uid}/Summary/MonthlySummary/${year}/${month}/expense`
      updateCounts(path2, newExpense.amount);


      console.log('data saved successfully')
      newExpense.id = lastKey;
      resolve(newExpense);
    } 
    else{
      toast.error('error in saving expense');
      resolve(console.log('error in saving expense'));
    }
  }
)}

export const getExpenseList = async(uid, year, month) => {
 
  return new Promise(async(resolve, reject) => {
    // const year = localStorage.getItem('selectedYear')
    // const month = localStorage.getItem('selectedMonth')
    // const date = dayjs().format('YYYY-MM-DD');
    try{
      const path = `Data/${uid}/Expense/${year}/${month}`;
      const snapshot = await getData(path);

      const expenseArray = [];

      if(snapshot){
        // console.log(snapshot)
        Object.keys(snapshot).forEach((dateKey) => {
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
        );
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
          let name = snapshot[key].name
          categoryArray.push({id:key,name})
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
  console.log(expense);
  return new Promise(async(resolve, reject) => {
    try{
      //new dates in case of date is updated
      const year = dayjs(expense.date).format('YYYY');
      const month = dayjs(expense.date).format('MMM');
      const date = dayjs(expense.date).format('YYYY-MM-DD');
      const uid = localStorage.getItem('uid');

      if(!uid){
        toast.error('uid not found');
        return;
      }

      const prevExpensePath = `Data/${uid}/Expense/${year}/${month}/${date}/${id}`;
      console.log('prevExpensePath', prevExpensePath);
      const prevExpenseSnapshot = await getData(prevExpensePath);

      if (!prevExpenseSnapshot) {
        toast.error('Expense not found1');
        reject('Expense not found');
        return;
      }

      const prevAmount = prevExpenseSnapshot.amount || 0;
      const prevYear = dayjs(prevExpenseSnapshot.date).format('YYYY');
      const prevMonth = dayjs(prevExpenseSnapshot.date).format('MMM');

      // Subtract the previous amount from the old month's total
      const prevSummaryPath = `Data/${uid}/Summary/MonthlySummary/${prevYear}/${prevMonth}/expense`;
      await updateCounts(prevSummaryPath, -prevAmount); // Subtract previous amount

      // Remove the previous expense if the date has changed
      if (prevExpenseSnapshot.date !== expense.date) {
        await RemoveData(prevExpensePath); // Remove the expense from the previous date
      }

      

      const updatedExpensePath = `Data/${uid}/Expense/${year}/${month}/${date}/${id}`;


      // console.log(path)
      const snapshot = {
        category: expense.category,
        amount: expense.amount,
        detail: expense.detail,
        date: expense.date,
        modeOfExpense: expense.modeOfExpense,
      }

      console.log('snapshot', snapshot)

      await saveData(updatedExpensePath, snapshot);

      // Add the new amount to the new month's total
      const newSummaryPath = `Data/${uid}/Summary/MonthlySummary/${year}/${month}/expense`;
      await updateCounts(newSummaryPath, snapshot.amount); // Add the updated amount

      // toast.success('expense updated successfully')
      resolve(snapshot);
    }
    catch(error){
      console.error('Error in updating expense:', error);
      reject(error);
    }
    
  })
}

export const deleteExpense = async(id, expense) => {
  console.log(expense)
  return new Promise(async(resolve, reject) => {
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

      // Subtract the expense amount before deleting
      const summaryPath = `Data/${uid}/Summary/MonthlySummary/${year}/${month}/expense`;
      await updateCounts(summaryPath, -expense.amount); // Subtract amount from total
      
      // Delete the expense from the database
      const result = await RemoveData(path); // Using the RemoveData service
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


export const getTotalExpense = (setState, year, month) => {
    // const year = localStorage.getItem('selectedYear');
    // const month = localStorage.getItem('selectedMonth');
    const uid = localStorage.getItem('uid');
    if(!uid){
      toast.error('uid not found');
      return;
    }
    // console.log('setState', setState);
    const path = `Data/${uid}/Summary/MonthlySummary/${year}/${month}/expense`;

    return fetchRealTimeData(path, (data) => {
      console.log(data)
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