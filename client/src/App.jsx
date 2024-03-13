import React from "react";
import { Route, Routes, BrowserRouter } from "react-router-dom";
import Home from "./pages/Home";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import Profile from "./pages/Profile";
import About from "./pages/About";
import Header from "./components/Header";
import PrivateRoute from "./components/PrivateRoute";
import Listing from "./pages/Listing";

const App = () => {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/about" element={<About />} />

        <Route element={<PrivateRoute />} >
          <Route path="/create-listing" element={<Listing />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
