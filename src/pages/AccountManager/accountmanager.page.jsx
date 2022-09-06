import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import {
  deleteAdmin,
  deleteAuthen,
  getAdmin,
  putAdmin,
} from "../../axios/authenfunction";
import ImageComponent from "../../components/ImageComponent/img.component";
import TableColumnText from "../../components/table-column-text/table-column-text.component";
import Table from "../../components/table/table.component";
import API from "../../constans/api";
import { ACCOUNT_STATUS, ROLE_ENUM } from "../../constans/enum";
import "./accountmanager.style.scss";

function AccountManager() {
  const [data, setData] = useState([]);
  const [list, setList] = useState([]);
  const [isUpdate, setIsUpdate] = useState(true);
  const columns = [
    // { heading: "ID", value: "id" },
    { heading: "Avatar", value: "avt" },
    { heading: "Email", value: "email" },
    { heading: "Role", value: "role" },
    { heading: "Status", value: "status" },
    { heading: "Action", value: "action" },
  ];

  const handleDelete = (id, email) => {
    Swal.fire({
      title: `Bạn có muốn xóa tài khoản ${email}?`,
      showCancelButton: true,
      confirmButtonText: "Xóa",
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        deleteAdmin(API["DELETE_ACCOUNT"] + `?id=${id}`, true)
          .then((response) => {
            Swal.fire(
              "Thông báo!",
              `Xóa tài khoản ${email} thành công!`,
              "success"
            );
            setIsUpdate(true);
          })
          .catch();
      } else if (result.isDenied) {
      }
    });
  };

  const handleBlock = (id, email) => {
    Swal.fire({
      title: `Bạn có muốn chặn tài khoản ${email}?`,
      showCancelButton: true,
      confirmButtonText: "Chặn",
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        putAdmin(API["BLOCK_ACCOUNT"] + `?id=${id}`, {}, true)
          .then((response) => {
            Swal.fire(
              "Thông báo!",
              `Chặn tài khoản ${email} thành công!`,
              "success"
            );
            setIsUpdate(true);
          })
          .catch();
      } else if (result.isDenied) {
      }
    });
  };

  const handleActive = (id, email) => {
    Swal.fire({
      title: `Bạn có muốn bỏ chặn tài khoản ${email}?`,
      showCancelButton: true,
      confirmButtonText: "Bỏ chặn",
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        putAdmin(
          API["UNBLOCK_ACCOUNT"] + `${id}`,
          {
            accountId: id,
            status: 1,
          },
          true
        )
          .then((response) => {
            Swal.fire(
              "Thông báo!",
              `Bỏ chặn tài khoản ${email} thành công!`,
              "success"
            );
            setIsUpdate(true);
          })
          .catch();
      } else if (result.isDenied) {
      }
    });
  };

  const setHTML = (data) => {
    const newList = data.map((item) => {
      return {
        id: <TableColumnText data={item.id} />,
        email: <TableColumnText data={item.email} />,
        role: <TableColumnText data={ROLE_ENUM[item.role]} />,
        status: <TableColumnText data={ACCOUNT_STATUS[item.status]} />,
        avt: <ImageComponent src={item.avatarUrl || item.logoUrl} />,
        action: (
          <div className="table-action">
            {item.status != 3 ? (
              <button
                className="button delete"
                onClick={() => {
                  handleDelete(item.id, item.email);
                }}
              >
                Delete
              </button>
            ) : (
              <></>
            )}
            {item.status != 2 && item.status != 3 ? (
              <button
                className="button block"
                onClick={() => {
                  handleBlock(item.id, item.email);
                }}
              >
                Block
              </button>
            ) : (
              <></>
            )}

            {item.status == 2 && item.status != 3 ? (
              <button
                className="button active"
                onClick={() => {
                  handleActive(item.id, item.email);
                }}
              >
                Active
              </button>
            ) : (
              <></>
            )}
          </div>
        ),
      };
    });
    setData(newList);
  };

  useEffect(() => {
    if (isUpdate) {
      getAdmin(API["GET_ALL_ACCOUNT"], true)
        .then((response) => {
          setList(response.data.data);
          setHTML(response.data.data);
        })
        .catch();
      setIsUpdate(false);
    }
  }, [isUpdate]);

  return (
    <div>
      <Table columns={columns} datas={data} />
    </div>
  );
}

export default AccountManager;
