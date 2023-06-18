import React, { useState } from "react";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, db, storage } from "../firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate, Link } from "react-router-dom";

const Register = () => {
  const [err, setErr] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const displayName = e.target[0].value;
    const email = e.target[1].value;
    const password = e.target[2].value;
    const file = e.target[3].files[0];

    try {
      // Create user
      const res = await createUserWithEmailAndPassword(auth, email, password);

      const date = new Date().getTime();
      const storageRef = ref(storage, `${displayName}${date}`);

      console.log("Uploading file to Firebase Storage...");
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          // Handle progress or other events if needed
        },
        (error) => {
          console.error("Error occurred during file upload:", error);
          setErr(true);
        },
        async () => {
          console.log("File upload completed!");

          console.log("Getting download URL...");
          const downloadURL = await getDownloadURL(storageRef);
          console.log("Download URL obtained:", downloadURL);

          // Update profile
          console.log("Updating user profile...");
          await updateProfile(res.user, {
            displayName,
            photoURL: downloadURL,
          });
          console.log("User profile updated!");

          // Create user on Firestore
          console.log("Creating user in Firestore...");
          await setDoc(doc(db, "users", res.user.uid), {
            uid: res.user.uid,
            displayName,
            email,
            photoURL: downloadURL,
          });
          console.log("User created in Firestore!");

          // Create empty user chats on Firestore
          console.log("Creating empty user chats...");
          await setDoc(doc(db, "userChats", res.user.uid), {});
          console.log("Empty user chats created!");

          navigate("/");
        }
      );
    } catch (err) {
      console.error("Error occurred:", err);
      setErr(true);
    }
  };

  return (
    <div className="formContainer">
      <div className="formWrapper">
        <span className="logo">JOSHI-CHAT</span>
        <span className="title">Register</span>
        <form onSubmit={handleSubmit}>
          <input type="text" placeholder="display name" />
          <input type="email" placeholder="email" />
          <input type="password" placeholder="password" />
          <input style={{ display: "none" }} type="file" id="file" />
          <label htmlFor="file">
            <img src="https://images.unsplash.com/photo-1684183619810-df64a76e365f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHx0b3BpYy1mZWVkfDF8TXI0OUV2aDVTa3N8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=60" style={{ height: "25px" }} alt="" />
            <span>Add an avatar</span>
          </label>
          <button>Sign up</button>
          {err && <span>Something went wrong</span>}
        </form>
        <p>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
