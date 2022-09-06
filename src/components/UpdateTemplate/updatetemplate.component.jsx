import React, { useContext } from "react";
import Swal from "sweetalert2";
import { AccountContext } from "../../context/AccountProvider";
import { uploadFile } from "../../Firebase/service";
import Row from "../Row/row.component";
import "./updatetemplate.style.scss";
function UpdateTemplate({
  children,
  saveFunction,
  imgField,
  fields,
  fieldsDispatch,
}) {
  const accountContext = useContext(AccountContext);
  let { data } = accountContext;

  const handleChangeAvatar = async () => {
    const { value: file } = await Swal.fire({
      title: "Chọn ảnh đại diện",
      input: "file",
      inputAttributes: {
        accept: "image/*",
        "aria-label": "Chọn file ảnh",
      },
    });

    if (file) {
      console.log(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        Swal.fire({
          title: "Hình bạn vừa chọn",
          imageUrl: e.target.result,
          imageAlt: "The uploaded picture",
          showCancelButton: true,
          confirmButtonText: "Cập nhật",
        }).then(async (result) => {
          console.log(file);
          if (result.isConfirmed) {
            const url = await uploadFile(
              file,
              file.name + new Date().toDateString(),
              "image/jpeg"
            );
            fieldsDispatch({
              type: "CHANGE_FIELD",
              payload: {
                field: imgField,
                value: url,
              },
            });
          }
        });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="updatetemplate">
      <div className="left">
        <div className="info">
          <div className="img">
            <img src={fields[imgField]} alt="" />
          </div>
          <p onClick={handleChangeAvatar}>Cập nhật ảnh đại diện</p>
          <h5>
            <span>Email:</span> <strong>{data.account?.email}</strong>
          </h5>
          <h5>
            <span>Điện thoại:</span>{" "}
            <strong>{data.account?.phoneNumber}</strong>
          </h5>
          <h5>
            <span>Làm việc với chức danh:</span>{" "}
            <strong>
              {data.account?.role == 1 ? "Doanh nghiệp" : "Ứng viên"}
            </strong>
          </h5>
        </div>
      </div>
      <div className="right">
        <h4>Giới thiệu về bạn</h4>
        <h6>Dữ liệu sẽ công khai trên trang thông tin.</h6>
        {children}

        <Row justifyContent={"end"}>
          <button className="button" onClick={saveFunction}>
            Cập nhật
          </button>
        </Row>
      </div>
    </div>
  );
}

export default UpdateTemplate;
