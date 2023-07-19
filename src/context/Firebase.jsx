import { createContext, useContext, useState, useEffect } from "react";
import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword,
   GoogleAuthProvider, signInWithPopup, onAuthStateChanged  } from "firebase/auth";
import {getFirestore, collection, addDoc, getDocs} from "firebase/firestore";  
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage"; 

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
const firestore = getFirestore(firebaseApp);
const storage = getStorage(firebaseApp); 


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
   createUserWithEmailAndPassword(firebaseAuth, email, password);  // SignupAuth

   const signinUserWithEmailAndPass = (email, password) => 
   signInWithEmailAndPassword(firebaseAuth, email, password);      // Login Auth

   const signinWithGoogle = () => signInWithPopup(firebaseAuth, googleProvider)
   
 

   const handleCreateNewListing = async (name, isbn, price, cover) => {
     const imageRef = ref(storage, `uploads/images/${Date.now()}-${cover.name}`)
     const uploadResult = await uploadBytes(imageRef, cover);
     return await addDoc(collection(firestore, "books"), {
      name,
      isbn,
      price,
      imageURL: uploadResult.ref.fullPath,
      userID: user.uid,
      userEmail: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
     });
   };
   
   const listAllBooks = () => {
    return getDocs(collection(firestore, "books"));
   }

   const getImageURL = (path) => {
    return getDownloadURL(ref(storage, path));
   };

   const isLoggedIn = user ? true : false;

    return (
    <FirebaseContext.Provider value={{signinWithGoogle, signupUserWithEmailAndPassword,
     signinUserWithEmailAndPass, handleCreateNewListing, listAllBooks, 
     getImageURL, isLoggedIn}}>
      {props.children}</FirebaseContext.Provider>
    )
};