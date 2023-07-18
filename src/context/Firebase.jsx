import { createContext, useContext, useState, useEffect } from "react";
import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword,
   GoogleAuthProvider, signInWithPopup, onAuthStateChanged  } from "firebase/auth";

const FirebaseContext = createContext(null);

const firebaseConfig = {
    apiKey: "AIzaSyAhMYLOAC2PmbkmITIvfjXT8f6nT4keIs4",
    authDomain: "bookify-a2465.firebaseapp.com",
    projectId: "bookify-a2465",
    storageBucket: "bookify-a2465.appspot.com",
    messagingSenderId: "301770982550",
    appId: "1:301770982550:web:aec69d3f6cadb24efeeeb7"
  };

export const useFirebase = () => useContext(FirebaseContext);

const firebaseApp = initializeApp(firebaseConfig);
const firebaseAuth = getAuth(firebaseApp);

const googleProvider = new GoogleAuthProvider();

export const  FirebaseProvider = (props) => {
 const [user, setUser] =useState(null);

 useEffect(() => {
    onAuthStateChanged(firebaseAuth, (user) => {
      if (user) setUser(user);
      else setUser(null);
    })
 }, [])

 const signupUserWithEmailAndPassword = (email, password) => 
   createUserWithEmailAndPassword(firebaseAuth, email, password);  // LoginAuth

   const signinUserWithEmailAndPass = (email, password) => 
   signInWithEmailAndPassword(firebaseAuth, email, password);

   const signinWithGoogle = () => signInWithPopup(firebaseAuth, googleProvider)

   const isLoggedIn = user ? true : false;

    return (
    <FirebaseContext.Provider value={{signinWithGoogle, signupUserWithEmailAndPassword,
     signinUserWithEmailAndPass, isLoggedIn}}>
      {props.children}</FirebaseContext.Provider>
    )
};