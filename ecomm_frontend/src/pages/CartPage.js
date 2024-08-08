import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import React from "react";
import { useSelector } from "react-redux";
import { Alert, Col, Container, Row, Table } from "react-bootstrap";
import { useIncreaseCartProductMutation, useDecreaseCartProductMutation, useRemoveFromCartMutation } from "../services/appApi";
import CheckoutForm from "../components/CheckoutForm";

import "./CartPage.css";

//passing publishable key (under developers->API keys)
const stripePromise = loadStripe("pk_test_51PkXTqP4CeCitR8u8X5WSgWjKFGjnJkOJ7y8zDF4U7gXhzaTdR5prcJtJPZJy5YWN28JvEOZkWv4pyJTkdj6rikO00nWyCRovW");

function CartPage() {
  const user = useSelector((state) => state.user);
  const products = useSelector((state) => state.products);
  const userCartObj = user.cart;
  //way to show the cart objects
  //copying all products whose product id is stored in cart
  let cart = products.filter((product) => userCartObj[product._id] != null);
  const [increaseCart] = useIncreaseCartProductMutation();
  const [decreaseCart] = useDecreaseCartProductMutation();
  const [removeFromCart, { isLoading }] = useRemoveFromCartMutation();

  function handleDecrease(product) {
    const quantity = user.cart[product.productId];
    // if (quantity <= 0) return alert("Can't proceed");
    if(quantity==1){
        removeFromCart({
            productId: product.productId,
            price: product.price,
            userId: product.userId,
          })
    }
    else
    decreaseCart(product);
   }
  return (
    <Container style={{ minHeight: "95vh" }} className="cart-container">
      <Row>
        <Col>
          <h1 className="pt-2 h3">Shopping cart</h1>
          {cart.length == 0 ? (
            <Alert variant="info">
              Shopping cart is empty. Add products to your cart
            </Alert>
          ) : (
            <Elements stripe={stripePromise}>
              <CheckoutForm />
            </Elements>
          )}
        </Col>
        {cart.length > 0 && (
          <Col md={5}>
            <>
              <Table responsive="sm" className="cart-table">
                <thead>
                  <tr>
                    {/* non breaking space */}
                    <th>&nbsp;</th>
                    <th>Product</th>
                    <th>Price</th>
                    <th>Quantity</th>
                    <th>Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {/* loop through cart products */}
                  {cart.map((item) => (
                    <tr>
                      <td>&nbsp;</td>
                      {/* icon to remove product from cart */}
                      <td>
                        {!isLoading && (
                          <i
                            className="fa fa-times"
                            style={{ marginRight: 10, cursor: "pointer" }}
                            onClick={() =>
                              removeFromCart({
                                productId: item._id,
                                price: item.price,
                                userId: user._id,
                              })
                            }
                          ></i>
                        )} 
                        <img
                          src={item.pictures[0].url}
                          style={{
                            width: 100,
                            height: 100,
                            objectFit: "cover",
                          }}
                        />
                      </td>
                      <td>${item.price}</td>
                      <td>
                        <span className="quantity-indicator">
                            {/* icon to decrease quantity */}
                          <i
                            className="fa fa-minus-circle"
                            onClick={() =>
                              handleDecrease({
                                productId: item._id,
                                price: item.price,
                                userId: user._id,
                              })
                            }
                          ></i>
                          {/* product quantity  in cart*/}
                          <span>{user.cart[item._id]}</span>
                          {/* icon to increase quantity */}
                          <i
                            className="fa fa-plus-circle"
                            onClick={() =>
                              increaseCart({
                                productId: item._id,
                                price: item.price,
                                userId: user._id,
                              })
                            }
                          ></i>
                        </span>
                      </td>
                      <td>${item.price * user.cart[item._id]}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
              <div>
                <h3 className="h4 pt-4">Total: ${user.cart.total}</h3>
              </div>
            </>
          </Col>
        )} 
      </Row>
    </Container>
  );
}

export default CartPage;
