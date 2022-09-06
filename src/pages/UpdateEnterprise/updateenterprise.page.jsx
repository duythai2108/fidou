import React, {
  useContext,
  useEffect,
  useReducer,
  useRef,
  useState,
} from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { types } from "util";
import { getAuthen, putAuthen, postAuthen } from "../../axios/authenfunction";
import Row from "../../components/Row/row.component";
import UpdateTemplate from "../../components/UpdateTemplate/updatetemplate.component";
import API from "../../constans/api";
import { AccountContext } from "../../context/AccountProvider";
import { checkEmail, checkSocial } from "../../Utils/validation";
import "./updateenterprise.style.scss";

const fieldReducer = (state, action) => {
  switch (action.type) {
    case "CHANGE_FIELD":
      state[action.payload.field] = action.payload.value;
      return {
        ...state,
      };
    case "SET_DATA":
      return {
        ...state,
        id: action.payload.id,
        description: action.payload.description,
        name: action.payload.name,
        logoUrl: action.payload.logoUrl,
        phoneContact: action.payload.phoneContact,
        emailContact: action.payload.emailContact,
        facebookUrl: action.payload.facebookUrl,
        twitterUrl: action.payload.twitterUrl,
        instagramUrl: action.payload.instagramUrl,
        linkedinUrl: action.payload.linkedinUrl,
        provinceCode: action.payload.provinceCode,
        districtCode: action.payload.districtCode,
        wardCode: action.payload.wardCode,
        address: action.payload.address,
        website: action.payload.website,
      };
    default:
      return state;
  }
};
function UpdateEnterprise() {
  let { id } = useParams();

  const accountContext = useContext(AccountContext);
  let { data, dispatch } = accountContext;

  let [prepareData, setPrepareData] = useState({
    provices: [],
    district: [],
    wards: [],
  });

  let [fields, fieldsDispatch] = useReducer(fieldReducer, {
    id: null,
    description: null,
    name: null,
    logoUrl: null,
    phoneContact: null,
    emailContact: null,
    facebookUrl: null,
    twitterUrl: null,
    instagramUrl: null,
    linkedinUrl: null,
    provinceCode: null,
    districtCode: null,
    wardCode: null,
    address: null,
    website: null,
  });

  // useEffect(() => {
  //   console.log(data);
  // }, [data]);

  const updateProfile = (e) => {
    e.preventDefault();

    // console.log(fields);

    for (const [key, value] of Object.entries(fields)) {
      if (!value && key != "id") {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Vui lòng điền đầy đủ tất cả thông tin!",
        });
        console.log(key);
        return;
      }
    }

    if (!checkEmail(fields.emailContact)) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Email chưa đúng  định dạng!",
      });
      return;
    }

    // if(!fields?.name?.match(/^([a-zA-Z]+\s)*[a-zA-Z]+$/)){
    //   Swal.fire({
    //     icon: "error",
    //     title: "Oops...",
    //     text: "Tên không được chứa kí tự đặc biệt hoặc số!",
    //   });
    //   return;
    // }

    if(!fields?.website?.match(/^(http:\/\/|https:\/\/)?(www.)?([a-zA-Z0-9]+).[a-zA-Z0-9]*.[‌​a-z]{3}\.([a-z]+)?$/)){
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Website không hợp lệ!",
      });
      return;
    }

    // if(!checkSocial(fields.facebookUrl)){
    //   Swal.fire({
    //     icon: "error",
    //     title: "Oops...",
    //     text: "Facebook không hợp lệ!",
    //   });
    //   return;
    // }

    // if(!checkSocial(fields.instagramUrl)){
    //   Swal.fire({
    //     icon: "error",
    //     title: "Oops...",
    //     text: "Instagram không hợp lệ!",
    //   });
    //   return;
    // }

    // if(!checkSocial(fields.twitterUrl)){
    //   Swal.fire({
    //     icon: "error",
    //     title: "Oops...",
    //     text: "Twitter không hợp lệ!",
    //   });
    //   return;
    // }

    // if(!checkSocial(fields.linkedinUrl)){
    //   Swal.fire({
    //     icon: "error",
    //     title: "Oops...",
    //     text: "Linked In không hợp lệ!",
    //   });
    //   return;
    // }

    if (data.information) {
      putAuthen(API["POST_ENTERPRISE_INFO"], fields, true)
        .then((response) => {
          // const provice = response.data.data.province;
          // const provices = prepareData.provices.filter(
          //   (item) => item.name == provice
          // );
          // response.data.data.provinceCode = provices[0].code;

          dispatch({
            type: "SET_INFOMATION",
            payload: response.data.data,
          });
          Swal.fire(
            "Thông báo",
            "Bạn đã cập nhật thông tin thành công!",
            "success"
          );
        })
        .catch((error) => {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Vui lòng điền đầy đủ tất cả thông tin!",
          });
        });
    } else {
      postAuthen(API["POST_ENTERPRISE_INFO"], fields, true)
        .then((response) => {
          dispatch({
            type: "SET_INFOMATION",
            payload: response.data.data,
          });
          Swal.fire(
            "Thông báo",
            "Bạn đã cập nhật thông tin thành công!",
            "success"
          );
        })
        .catch((error) => {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Vui lòng điền đầy đủ tất cả thông tin!",
          });
        });
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (data.account) {
      getAuthen(API['GET_ENTERPRISE_INFO']+`${data.account.id}`)
      .then(response=>{
        fieldsDispatch({
          type: "SET_DATA",
          payload: response.data.data,
        });
      })
      .catch()
      
    }
  }, [data]);

  // useEffect(() => {
  //   console.log(prepareData);
  // }, [prepareData]);

  useEffect(() => {
    console.log("run");
    async function fetchData() {
      const [proviceRequest, districtRequest, wardRequest] = await Promise.all([
        getAuthen(API["GET_PROVICES"]),
        getAuthen(API["GET_DISTRIC"]),
        getAuthen(API["GET_WARD"]),
        // getAuthen(API["GET_ENTERPRISE_INFO"] + `${account.id}`),
      ]);

      prepareData.provices = proviceRequest.data.data;
      prepareData.district = districtRequest.data.data;
      prepareData.wards = wardRequest.data.data;
      setPrepareData({ ...prepareData });
    }
    // if (prepareData.district.length == 0) {
    fetchData();
    // }
  }, []);

  return (
    <div className="updateenterprise">
      <UpdateTemplate
        saveFunction={updateProfile}
        fieldsDispatch={fieldsDispatch}
        fields={fields}
        imgField={"logoUrl"}
      >
        <div className="box">
          <Row justifyContent={"center"}>
            <h3>Thông tin</h3>
          </Row>
          <Row justifyContent={"between"}>
            <div className="item">
              <label htmlFor="">Tên công ty: </label>
              <input
                type="text"
                value={fields.name}
                onChange={(e) => {
                  fieldsDispatch({
                    type: "CHANGE_FIELD",
                    payload: {
                      field: "name",
                      value: e.target.value,
                    },
                  });
                }}
              />
            </div>
            <div className="item">
              <label htmlFor="">Website: </label>
              <input
                type="text"
                value={fields.website}
                onChange={(e) => {
                  fieldsDispatch({
                    type: "CHANGE_FIELD",
                    payload: {
                      field: "website",
                      value: e.target.value,
                    },
                  });
                }}
              />
            </div>
          </Row>
          <Row justifyContent={"between"}>
            <div className="item">
              <label htmlFor="">Số điện thoại: </label>
              <input
                type="text"
                value={fields.phoneContact}
                onChange={(e) => {
                  fieldsDispatch({
                    type: "CHANGE_FIELD",
                    payload: {
                      field: "phoneContact",
                      value: e.target.value,
                    },
                  });
                }}
              />
            </div>
            <div className="item">
              <label htmlFor="">Email liên hệ: </label>
              <input
                type="text"
                value={fields.emailContact}
                onChange={(e) => {
                  fieldsDispatch({
                    type: "CHANGE_FIELD",
                    payload: {
                      field: "emailContact",
                      value: e.target.value,
                    },
                  });
                }}
              />
            </div>
          </Row>
          <Row>
            <div className="item full">
              <label htmlFor="">Mô tả: </label>
              <textarea
                name=""
                id=""
                cols="10"
                rows="5"
                value={fields.description}
                onChange={(e) => {
                  fieldsDispatch({
                    type: "CHANGE_FIELD",
                    payload: {
                      field: "description",
                      value: e.target.value,
                    },
                  });
                }}
              ></textarea>
            </div>
          </Row>
        </div>
        <div className="box">
          <Row justifyContent={"center"}>
            <h3>Địa chỉ</h3>
          </Row>
          <Row justifyContent={"between"}>
            <div className="item">
              <label htmlFor="">Address </label>
              <input
                type="text"
                value={fields.address}
                onChange={(e) => {
                  fieldsDispatch({
                    type: "CHANGE_FIELD",
                    payload: {
                      field: "address",
                      value: e.target.value,
                    },
                  });
                }}
              />
            </div>
            <div className="item">
              <label htmlFor="">Thành phố </label>
              <select
                name=""
                id=""
                value={fields.provinceCode}
                onChange={(e) => {
                  fieldsDispatch({
                    type: "CHANGE_FIELD",
                    payload: {
                      field: "provinceCode",
                      value: e.target.value,
                    },
                  });
                }}
              >
                {/* {console.log("prepareData: " + prepareData[0]?.length)} */}
                <option disabled selected value>
                  -- Chọn --
                </option>

                {prepareData.provices?.map((item, index) => {
                  return (
                    <option
                      value={item.code}
                      key={index}
                      selected={fields.provice == item.code}
                    >
                      {item.name}
                    </option>
                  );
                })}
              </select>
            </div>
          </Row>
          <Row justifyContent={"between"}>
            <div className="item">
              <label htmlFor="">Quận </label>
              <select
                name=""
                id=""
                value={fields.districtCode}
                onChange={(e) => {
                  fieldsDispatch({
                    type: "CHANGE_FIELD",
                    payload: {
                      field: "districtCode",
                      value: e.target.value,
                    },
                  });
                }}
              >
                <option disabled selected value>
                  -- Chọn --
                </option>
                {!fields.provinceCode ? <option disabled >Vui lòng chọn thành phố</option> : prepareData.district?.filter(item=>item.provinceCode == fields.provinceCode)
                .map((item, index) => {
                  console.log('district');
                  return (
                    <option
                      value={item.code}
                      key={index}
                      selected={fields.districtCode == item.code}
                    >
                      {item.name}
                    </option>
                  );
                })}
              </select>
            </div>
            <div className="item">
              <label htmlFor="">Phường </label>
              <select
                name=""
                id=""
                value={fields.wardCode}
                onChange={(e) => {
                  fieldsDispatch({
                    type: "CHANGE_FIELD",
                    payload: {
                      field: "wardCode",
                      value: e.target.value,
                    },
                  });
                }}
              >
                <option disabled selected value>
                  -- Chọn --
                </option>
                {console.log('district: '+fields.districtCode)}
                {!fields.districtCode ? <option disabled >Vui lòng chọn thành phố</option> :prepareData.wards?.filter(item=>item.districtCode = fields.districtCode).map((item, index) => {
                  return (
                    <option
                      value={item.code}
                      key={index}
                      selected={fields.wardCode == item.code}
                    >
                      {item.name}
                    </option>
                  );
                })}
              </select>
            </div>
          </Row>
        </div>
        <div className="box">
          <Row justifyContent={"center"}>
            <h3>Mạng xã hội</h3>
          </Row>
          <Row justifyContent={"between"}>
            <div className="item">
              <label htmlFor="">Facebook: </label>
              <input
                type="text"
                value={fields.facebookUrl}
                onChange={(e) => {
                  fieldsDispatch({
                    type: "CHANGE_FIELD",
                    payload: {
                      field: "facebookUrl",
                      value: e.target.value,
                    },
                  });
                }}
              />
            </div>
            <div className="item">
              <label htmlFor="">Instagram: </label>
              <input
                type="text"
                value={fields.instagramUrl}
                onChange={(e) => {
                  fieldsDispatch({
                    type: "CHANGE_FIELD",
                    payload: {
                      field: "instagramUrl",
                      value: e.target.value,
                    },
                  });
                }}
              />
            </div>
          </Row>
          <Row justifyContent={"between"}>
            <div className="item">
              <label htmlFor="">Linked In: </label>
              <input
                type="text"
                value={fields.linkedinUrl}
                onChange={(e) => {
                  fieldsDispatch({
                    type: "CHANGE_FIELD",
                    payload: {
                      field: "linkedinUrl",
                      value: e.target.value,
                    },
                  });
                }}
              />
            </div>
            <div className="item">
              <label htmlFor="">Twitter: </label>
              <input
                type="text"
                value={fields.twitterUrl}
                onChange={(e) => {
                  fieldsDispatch({
                    type: "CHANGE_FIELD",
                    payload: {
                      field: "twitterUrl",
                      value: e.target.value,
                    },
                  });
                }}
              />
            </div>
          </Row>
        </div>
      </UpdateTemplate>
    </div>
  );
}

export default UpdateEnterprise;
