import React, { useEffect, useState } from "react";
import { Badge, Button, Modal, Table } from "react-bootstrap";
import { useSelector } from "react-redux";
import axios from "../axios";
import Loading from "./Loading";
import Pagination from "./Pagination";


function OrdersAdminPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const products = useSelector((state) => state.products);
  const [orderToShow, setOrderToShow] = useState([]);
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);

  //sending patch or update request request using axios
  //to update the order document with this orderId
  function markShipped(orderId, ownerId) {
    axios
      .patch(`/orders/${orderId}/mark-shipped`, { ownerId })
      //getting all orders back after updation
      .then(({ data }) => setOrders(data))
      .catch((e) => console.log(e));
  }

  //filtering those products which exists in that particular order
  function showOrder(productsObj) {
    let productsToShow = products.filter((product) => productsObj[product._id]);
    productsToShow = productsToShow.map((product) => {
      const productCopy = { ...product };
      //since productsObj[product._id] store the count of that product 
      //in that order
      productCopy.count = productsObj[product._id];
      delete productCopy.description;
      return productCopy;
    });
    console.log(productsToShow);
    setShow(true);
    setOrderToShow(productsToShow);
  }

  //getting all orders of all users from backend using axios
  useEffect(() => {
    setLoading(true);
    axios
      .get("/orders")
      .then(({ data }) => {
        setLoading(false);
        setOrders(data);
      })
      .catch((e) => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <Loading />;
  }

  if (orders.length === 0) {
    return <h1 className="text-center pt-4">No orders yet</h1>;
  }

//   to display details of each order
  function TableRow({ _id, count, owner, total, status, products, address }) {
    return (
        <tr>
            <td>{_id}</td>
            {/* ? is used to access reference object(owner i.e user) using its id stored in order object */}
            <td>{owner?.name}</td>
            {/* total count of products in that order*/}
            <td>{count}</td>
            {/* total price of products in that order */}
            <td>{total}</td>
            <td>{address}</td>
            <td>
                {/* conditional rendering of button depending on order status */}
                {status === "processing" ? (
                    <Button size="sm" onClick={() => markShipped(_id, owner?._id)}>
                        Mark as shipped
                    </Button>
                ) : (
                    <Badge bg="success">Shipped</Badge>
                )}
            </td>
            <td>
                <span style={{ cursor: "pointer" }} onClick={() => showOrder(products)}>
                    View order <i className="fa fa-eye"></i>
                </span>
            </td>
        </tr>
    );
  }
  return (
    <>
      <Table responsive striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Client Name</th>
            <th>Items</th>
            <th>Order Total</th>
            <th>Address</th>
          </tr>
        </thead>
        <tbody>
        <Pagination data={orders} RenderComponent={TableRow} pageLimit={1} dataLimit={10} tablePagination={true} />
        </tbody>
      </Table>

    {/* to show order details(product details) of any order */}
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Order details</Modal.Title>
        </Modal.Header>
        {orderToShow.map((order) => (
          <div className="order-details__container d-flex justify-content-around py-2">
            <img
              src={order.pictures[0].url}
              style={{ maxWidth: 100, height: 100, objectFit: "cover" }}
            />
            <p>
              <span>{order.count} x </span> {order.name}
            </p>
            <p>Price: ${Number(order.price) * order.count}</p>
          </div>
        ))}
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default OrdersAdminPage;
