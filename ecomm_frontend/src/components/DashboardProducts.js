import React from "react";
import { Table, Button } from "react-bootstrap";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useDeleteProductMutation } from "../services/appApi";
import Pagination from "./Pagination";
import "./DashboardProducts.css";

function DashboardProducts() {
  const products = useSelector((state) => state.products);
  const user = useSelector((state) => state.user);

  // removing the product
  const [deletProduct, { isLoading, isSuccess }] = useDeleteProductMutation();
  //function for removing the product
  function handleDeleteProduct(id) {
    if (window.confirm("Are you sure?"))
      deletProduct({ product_id: id, user_id: user._id });
  }

  ///to render details of each product in a table row
  function TableRow({ pictures, _id, name, price }) {
    return (
      <tr>
        <td>
          <img src={pictures[0].url} className="dashboard-product-preview" />
        </td>
        <td>{_id}</td>
        <td>{name}</td>
        <td>{price}</td>
        <td>
          <Button
            onClick={() => handleDeleteProduct(_id, user._id)}
            disabled={isLoading}
          >
            Delete
          </Button>
          <Link to={`/product/${_id}/edit`} className="btn btn-warning">
            Edit
          </Link>
        </td>
      </tr>
    );
  }
  return (
    <Table striped bordered hover responsive>
      <thead>
        <tr>
          <th></th>
          <th>Product ID</th>
          <th>Product Name</th>
          <th>Product Price</th>
        </tr>
      </thead>
      <tbody>    
        <Pagination
          data={products}
          RenderComponent={TableRow}
          pageLimit={1}
          dataLimit={5} // to render 5 products on each page
          tablePagination={true}
        />
      </tbody>
    </Table>
  );
}

export default DashboardProducts;
