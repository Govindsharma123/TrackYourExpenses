import {
  ref,
  get,
  update,
  set,
  remove,
  runTransaction,
  onValue,
} from "firebase/database";
import { database } from '../Firebase';
import {
  deleteObject,
  getDownloadURL,
  ref as ref_storage,
  uploadBytes,
} from "firebase/storage";
import { toast } from "react-toastify";
import { faListUl } from "@fortawesome/free-solid-svg-icons";


export const getData = (path) => {
  return new Promise((resolve) => {
    get(ref(database, path)).then((snapshot) => {
      let data = snapshot.val();
      resolve(data);
    });
  });
};

export const saveData = (path, data) => {
  return new Promise((resolve) => {
    update(ref(database, path), data);
    resolve("success");
  });
};

export const setData = (path, value) => {
  return new Promise((resolve) => {
    set(ref(database, path), value);
    resolve("success");
  });
};
export const RemoveData = (path) => {
  return new Promise((resolve) => {
    remove(ref(database, path));
    resolve("success");
  });
};

export const getLastKey = (path, val) => {
  return new Promise((resolve) => {
    if (!val) {
      get(ref(database, path)).then((snapshot) => {
        let lastKey = 1;
        if (snapshot.val() != null) {
          lastKey += Number(snapshot.val());
        }
        resolve(lastKey);
      });
    } else {
      resolve(val);
    }
  });
};

export const setLastKey = (path, value) => {
  set(ref(database, path), value);
};

// export function uploadFileToStorage(imageUri, filePath) {
//   return new Promise((resolve, reject) => {
//     fetch(imageUri).then((res) => {
//       return res.blob();
//     }).catch((error) => {
//       reject(error.message)
//     }).then((blob) => {
//       uploadBytes(ref_storage(storage, filePath), blob).then((uploadTask) => {
//         resolve(uploadTask.metadata.fullPath);
//       }).catch((error) => {
//         reject(error.message)
//       })
//     }).catch((error) => {
//       reject(error.message)
//     })
//   })
// }
// export const uploadFileToStorage = async (imageUri, filepath) => {
//   return new Promise(async (resolve) => {
//     try {
//       //HERE WE ARE SPLITING THE FILE EXTENSION FROM USING FILE NAME TP CREATE FILE PATH
//       let path = getImageStoragePath() + filepath;
//       //ref_storage METHOD WE ARE USING HERE TO CREATE STROAGE REFERENCE TP UPLOAD FILE
//       let storageref = ref_storage(storage, path);
//       //uploadBytes WE ARE USING HERE TO UPLOAD FILE TO THE STORAGE REFERENCE
//       await uploadBytes(storageref, imageUri);
//       //IN CASE NO ERROR OCCURS DURING FILE UPLOAD,WE WE WILL RESOLVE A FILE CUSTOM FILE NAME WITH FILE EXTENSION
//       resolve(`success`);
//     } catch (error) {
//       //IF ANY ERROR OCCURS THEN WE WILL RESOLVE EMPTY STRING
//       console.warn(error);
//       resolve(error);
//     }
//   });
// };

// created by - kunal
// export const deleteFileFromStorage = (filepath) => {
//   return new Promise(async (resolve) => {
//     try {
//       let path = getImageStoragePath() + filepath;
//       const desertRef = ref_storage(storage, path);

//       // Delete the file
//       await deleteObject(desertRef)

//       resolve('success')
//     } catch (error) {
//       console.log('error in deleteFileFromStorage', error)
//       resolve(error)
//     }
//   })
// }

export const getImageStoragePath = () => {
  let path = `https://firebasestorage.googleapis.com/v0/b/wevois-dev.appspot.com/o/VM%2F`;
  return path;
};
export const getCityImage = (value) => {
  https: return `https://firebasestorage.googleapis.com/v0/b/wevois-dev.appspot.com/o/VM%2Fwevoislabs%2FDefaultCityLogo%2F${value}?alt=media&token=bb50511c-9cab-4bb4-9690-ede56fc724df`;
};
export const updateCounts = (path, increment) => {
  //This function will get and update the count(data) on the given path at the same time:
  /*Logic behind the scene:
    Here We will get path as a param from where we will fetch and update the data.
    We will use firebase runTransaction method here which manages the data in the database with faster speed then firebase set operation
  */
  return new Promise(async (resolve) => {
    const dbRef = ref(database, path);
    runTransaction(dbRef, (currentValue) => {
      // currentValue is the current value in the database
      let newValue = (Number(currentValue) || 0) + Number(increment);
      newValue = newValue > 0 ? newValue : 0; //If it's negative then make it zero
      return newValue; // The value to be written to the database
    })
      .then((result) => {
        // The transaction completed successfully
        resolve(
          {
            success : result.snapshot.val()
          }
        );
      })
      .catch((error) => {
        // Handle errors during the transaction
        resolve(
          {
            failure : error.message
          }
        );
      });
  });
};
export const fetchRealTimeData = (path, setState, userStatus) => {
  if (path) {
    const unsubscribe = onValue(
      ref(database, path),
      (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val();
          // userStatus && console.log("data:", data);
          setState(data);
        } else {
          setState(null);
        }
      },
      (error) => {
        console.error("Error fetching data:", error);
      }
    );
    return unsubscribe;
  } else {
    return "fail";
  }
};

// export const updateComparebleData=(path,newData,compareKey,condition)=> {
//   return new Promise((resolve, reject) => {
//     const dbRef = ref(database,path);

//     runTransaction(dbRef, (currentData) => {
//       if (!currentData) {
//         return newData;
//       }
//       if(condition==='high' && Number(newData[compareKey]) > Number(currentData[compareKey])){
//         return newData;
//       }
//       else if(condition==='low' && Number(newData[compareKey]) < Number(currentData[compareKey])){
//         return newData;
//       }
//       else{
//         return currentData;
//       }
//     }).then((result) => {
//       resolve(common.setResponse( "success","Compared data updated succesfully.", result.snapshot.val())
//       );
//     }).catch((error) => {
//       resolve(common.setResponse("fail", "Compared data update failed!", { error: error }));
//     });
//   });
// }