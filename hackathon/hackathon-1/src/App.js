
import './App.css';
import { initializeApp } from "firebase/app";
import { useContext, useEffect } from 'react';
import { getAuth, onAuthStateChanged } from "firebase/auth"
import { GlobalContext } from './Context/Context';
import { addDoc, doc,  getFirestore, serverTimestamp, setDoc,  } from 'firebase/firestore';
import CustomRoutes from './Component/CustomRoutes';

function App() {
  const{state, dispatch}= useContext(GlobalContext);
  const firebaseConfig = {
    apiKey: "AIzaSyAYVhvxLJ3i2EbZh71e5qFOD6ykRFsF8Hw",
    authDomain: "hackathon-1-ee8e9.firebaseapp.com",
    projectId: "hackathon-1-ee8e9",
    storageBucket: "hackathon-1-ee8e9.firebasestorage.app",
  messagingSenderId: "945032676042",
  appId: "1:945032676042:web:a4ea06d4f8d657c4e62a33"
};
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const addUser = async (userData) => {
  try {
    console.log("userDAta", userData)
    await setDoc(doc(db, "users", userData.id), userData);
  } catch (error) {
    console.error("Error adding user: ", error);
  }
};

useEffect(()=>{
  const auth = getAuth();
onAuthStateChanged(auth, (user) => {
  if (user) {
    if(user.email == "ubaidullahsiddique142005@gmail.com"){
      dispatch({type : "ADMIN_LOGIN" , payload : user})
      console.log("userEmail", user.email)
    }
    else if(user.email == "ubaidque14@gmail.com"){
      dispatch({type : "MANEGER_LOGIN" , payload : user})
      console.log("userEmail", user.email)
      addUser({
                id: user.uid,
                name: user.displayName || '',
                email: user.email,
                role: 'event_manager',
                joinDate : serverTimestamp() 
              });
    }
    else{
      console.log("userEmail", user.email)
      dispatch({type: "USER_LOGIN" ,payload : user})
      addUser({
  id: user.uid,
  name: user.displayName || '',
  email: user.email,
  role: 'user',
   joinDate : serverTimestamp() 
});


    }
    const uid = user.uid;
    // ...
  } else {
    // User is signed out
    // 
    // ...
      dispatch({type: "USER_LOGOUT"})
  }
});

},[])
console.log(state)
// Initialize Firebase


return(
  <>
  <CustomRoutes/>
  </>
)
}

export default App;
