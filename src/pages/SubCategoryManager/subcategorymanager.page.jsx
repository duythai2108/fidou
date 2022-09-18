import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { getAdmin, postAdmin } from "../../axios/authenfunction";
import TableColumnText from "../../components/table-column-text/table-column-text.component";
import Table from "../../components/table/table.component";
import API from "../../constans/api";

function SubCategoryManager() {
  const [data, setData] = useState([]);
  const [category, setCategory] = useState([]);
  const columns = [
    { heading: "ID", value: "id" },
    { heading: "Tên", value: "name" },
    { heading: "Dịch vụ", value: "categoryId" },
  ];

  useEffect(() => {
    getAdmin(API["GET_CATEGORY"], true)
      .then((response) => {
        setCategory(response.data.data);
        // localStorage.setItem("category", JSON.stringify(response.data.data));
      })
      .catch();
    getAdmin(API["GET_SUBCATEGORY"], true)
      .then((response) => {
        let newList = response.data.data.map((item) => {
          return {
            id: <TableColumnText data={item.id} />,
            name: <TableColumnText data={item.name} />,
            categoryId: <TableColumnText data={item.categoryId} />,
          };
        });

        setData(newList);
      })
      .catch();
  }, []);

  const add = async () => {
    // const categories = JSON.parse(localStorage.getItem("category"));
    // console.log(categories);
    const { value: formValues } = await Swal.fire({
      title: "Thêm mới kĩ năng",
      html: `<div class="add-money">
      <div><label htmlFor="swal-input1">Tên: </label><input id="swal-input1" class="swal2-input"></div>
      <div><label htmlFor="swal-input2">Tên: </label>
        <select id="swal-input2" class="swal2-input">
            ${category.map((item) => {
              return `<option value=${item.id}>${item.name}</option>`;
            })}
        </select>
      </div>
      </div>`,
      focusConfirm: false,
      preConfirm: () => {
        postAdmin(
          API["GET_SUBCATEGORY"],
          {
            name: document.getElementById("swal-input1").value,
            categoryId: document.getElementById("swal-input2").value,
          },
          true
        )
          .then((response) => {
            console.log(response.data.data);
            const item = response.data.data;
            setData([
              ...data,
              {
                id: <TableColumnText data={item.id} />,
                name: <TableColumnText data={item.name} />,
                categoryId: <TableColumnText data={item.categoryId} />,
              },
            ]);
          })
          .catch((error) => {
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: "Something went wrong!",
            });
          });
      },
    });

    // if (formValues) {
    //   Swal.fire(JSON.stringify(formValues));
    // }
  };

  return (
    <div>
      {" "}
      <Table columns={columns} datas={data} addAcction={add} />
    </div>
  );
}

export default SubCategoryManager;
