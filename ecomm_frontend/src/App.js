import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navigation from "./components/Navigation";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import { useDispatch, useSelector } from "react-redux";
import NewProduct from "./pages/NewProduct";
import ProductPage from "./pages/ProductPage";
import CategoryPage from "./pages/CategoryPage";
import ScrollToTop from "./components/ScrollToTop";
import CartPage from "./pages/CartPage";
import OrdersPage from "./pages/OrdersPage";
import AdminDashboard from "./pages/AdminDashboard";
import EditProductPage from "./pages/EditProductPage";
import { useEffect } from "react";
import { io } from "socket.io-client";
import { addNotification } from "./features/userSlice";

function App() {
  //will use for conditional rendering
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();

  //for showing notifications
  useEffect(() => {
    //connecting to our backend
    const socket = io("ws://localhost:8080");
    //listening to a event - 'notification'
    //msgObj will be storing the notification object received from backend (related to order shipped marked by admin)
    socket.off("notification").on("notification", (msgObj, user_id) => {
      // if the notification is for that specific user 
      if (user_id === user._id) {
        dispatch(addNotification(msgObj));
      }
    });

    //listening to a event - 'new-order'
    //msgObj will be storing the notification object received from backend (related to placement of order by any user)
    socket.off("new-order").on("new-order", (msgObj) => {
      if (user.isAdmin) {
        dispatch(addNotification(msgObj));
      }
    });
  }, []);

  return (
    <div className="App">
      <BrowserRouter>
        {/* to scroll to top everytime a new page is loaded */}
        <ScrollToTop />
        {/* navbar */}
        <Navigation />
        <Routes>
          <Route index element={<Home />} />
          {!user && (
            <>
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
            </>
          )}

          {user && (
            <>
              <Route path="/cart" element={<CartPage />} />
              <Route path="/orders" element={<OrdersPage />} />
            </>
          )}
          {user && user.isAdmin && (
            <>
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/new-product" element={<NewProduct />} />
              <Route path="/product/:id/edit" element={<EditProductPage />} />
            </>
          )}
          <Route path="/product/:id" element={<ProductPage />} />
          <Route path="/category/:category" element={<CategoryPage />} />
          {/* if any other route redirect to homepage */}
          <Route path="*" element={<Home />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;

//Redux toolkit is a way to use Redux in our application
