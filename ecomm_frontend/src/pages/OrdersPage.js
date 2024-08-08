import React, { useEffect, useState } from "react";
import { Badge, Container, Table } from "react-bootstrap";
import { useSelector } from "react-redux";
import axios from "../axios";
import Loading from "../components/Loading";
import "./OrdersPage.css";
import Pagination from "../components/Pagination";


function OrdersPage() {
  const user = useSelector((state) => state.user);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  //sending get request to get all the previous orders of that user
  useEffect(() => {
    setLoading(true);
    axios
      .get(`/users/${user._id}/orders`)
      .then(({ data }) => {
        setLoading(false);
        setOrders(data);
      })
      .catch((e) => {
        setLoading(false);
        console.log(e);
      });
  }, []);

  if (loading) {
    return <Loading />;
  }

  if (orders.length === 0) {
    return <h1 className="text-center pt-3">No orders yet</h1>;
  }

  //   to display details of each order
  function TableRow({ _id,status, total,date}) {
    return (
        <tr>
            <td>{_id}</td>
              <td>
                <Badge
                  bg={`${status == "processing" ? "warning" : "success"}`}
                  text="white"
                >
                  {status}
                </Badge>
              </td>
              <td>{date}</td>
              {/* for dollar sign */}
              <td>&#8377;{total}</td>
        </tr>
    );
  }
  return (
    <Container>
      <h1 className="text-center">Your orders</h1>
      <Table responsive striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Status</th>
            <th>Date</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          <Pagination data={orders} RenderComponent={TableRow} pageLimit={1} dataLimit={10} tablePagination={true} />
        </tbody>
      </Table>
    </Container>
  );
}

export default OrdersPage;

