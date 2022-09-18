import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import Table from "../../components/table/table.component";
import { getAuthen, postAdmin } from "../../axios/authenfunction";
import API from "../../constans/api";
import TableColumnText from "../../components/table-column-text/table-column-text.component";
import { Modal } from "antd";
import Swal from "sweetalert2";
function CategoryAdmin() {
  const [data, setData] = useState([]);
  const columns = [
    { heading: "ID", value: "id" },
    { heading: "Tên", value: "name" },
    { heading: "Kĩ năng", value: "subCategory" },
  ];

  useEffect(() => {
    getAuthen(API["GET_CATEGORY"])
      .then((response) => {
        console.log(response.data.data);
        setData(
          response.data.data.map((item) => {
            return {
              id: <TableColumnText data={item.id} />,
              name: <TableColumnText data={item.name} />,
              subCategory:
                item.subCategories.length == 0
                  ? "null"
                  : item.subCategories.map((cate) => {
                      return <div>{cate.name}</div>;
                    }),
            };
          })
        );
      })
      .catch();
  }, []);

  const add = async () => {
    const { value: formValues } = await Swal.fire({
      title: "Add new category",
      html: `<div class="add-money">
        <div><label htmlFor="swal-input1">Tên: </label><input id="swal-input1" class="swal2-input"></div>
      </div>`,
      focusConfirm: false,
      preConfirm: () => {
        postAdmin(
          API["POST_CATEGORY"],
          {
            name: document.getElementById("swal-input1").value,
          },
          true
        )
          .then((response) => {
            const item = response.data.data;
            setData([
              ...data,
              {
                id: <TableColumnText data={item.id} />,
                name: <TableColumnText data={item.name} />,
                subCategory: "null",
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
      <Table columns={columns} datas={data} addAcction={add} />
    </div>
  );
}

export default CategoryAdmin;
