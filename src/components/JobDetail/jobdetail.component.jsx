import React, { useContext, useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { getAuthen, postAuthen, putAuthen } from "../../axios/authenfunction";
import API from "../../constans/api";
import { ORDER_STATUS, TONE } from "../../constans/enum";
import LabelStatus from "../label-status/label-status.component";
import "./jobdetail.style.scss";
import { addDoc, collection, db } from "../../Firebase/config";
import { AccountContext } from "../../context/AccountProvider";
import Swal from "sweetalert2";
const JobDetail = () => {
  let { id, action } = useParams();
  const [job, setJob] = useState();
  const [category, setCategory] = useState();
  const [enterprise, setEnterprise] = useState();
  const location = useLocation();
  const [isAccept, setIsAccept] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    getAuthen(API["GET_JOB"] + `${id}`)
      .then((response) => {
        setJob(response.data.data);
      })
      .catch();
  }, [location]);

  useEffect(() => {
    if (location.search.split("=")[1] == "accept") {
      setIsAccept(true);
    }
  }, [location]);

  useEffect(() => {
    if (job) {
      getAuthen(API["GET_SUBCATEGORY"] + `/${job.subCategoryId}`)
        .then((response) => {
          setCategory(response.data.data);
        })
        .catch();

      getAuthen(API["GET_ENTERPRISE_INFO"] + `${job.enterpriseId}`)
        .then((response) => {
          setEnterprise(response.data.data);
        })
        .catch();
    }
  }, [job]);

  const accountContext = useContext(AccountContext);
  let { data } = accountContext;

  const acceptJob = (status) => {
    console.log(enterprise.id);
    //   enterprise.id,
    //   data.account?.id,
    //   `Group chat ${data.jobInvitation.job.name} (Invite Job)`,
    //   data.transaction.order.id);
    putAuthen(
      API["ACCEPT_JOB"],
      {
        id: id,
        status: status,
      },
      true
    ).then((response) => {
      if (status == 2) {
        const dataResponse = response.data.data;
        createRoom(
          enterprise.id,
          data.account?.id,
          `Group chat ${dataResponse.jobInvitation.job.name} (Invite Job)`,
          dataResponse.transaction.order.id
        );
        setJob({
          ...job,
          jobStatus: 1,
        });
        Swal.fire(
          "Thông báo!",
          "Tham gia vào dự án thành công!",
          "success"
        ).then((response) => {
          navigate(location.pathname);
        });
      }

      if (status == 1) {
        Swal.fire(
          "Thông báo!",
          "Từ chôi vào dự án thành công!",
          "success"
        ).then((response) => {
          navigate(location.pathname);
        });
      }
    });
  };

  const createRoom = (id1, id2, title, orderId) => {
    const date = new Date();
    const dateString =
      date.getDate() +
      "/" +
      date.getMonth() +
      "/" +
      date.getFullYear() +
      " " +
      date.getHours() +
      ":" +
      date.getMinutes();
    addDoc(collection(db, "room"), {
      title: title,
      description: "tesst new",
      lastSent: dateString,
      user: [id1, id2],
      orderId: orderId,
    })
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleApplyJob = () => {
    const fee = job.price * 0.1;
    Swal.fire({
      title: "Bạn có muốn tiếp tục?",
      text:
        "Khi ứng tuyển vào dự này bạn sẽ kí quỹ " + fee + "β trong tài khoản.",
      icon: "info",
      showCancelButton: true,
      confirmButtonColor: "#79be82",
      cancelButtonColor: "#d33",
      confirmButtonText: "Ứng tuyển",
    }).then((result) => {
      if (result.isConfirmed) {
        postAuthen(
          API["POST_ORDER"],
          {
            jobId: job.id,
          },
          true
        )
          .then((response) => {
            Swal.fire(
              "Thông báo!",
              "Apply vào dự án " + job.name + " success",
              "success"
            );
          })
          .catch((error) => {
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: error.response.data.msg,
            });
          });
      }
    });
  };

  return (
    <div className="jobdetail">
      <h1>{job?.name}</h1>
      <div className="jobdetail__company__info">
        <strong>
          <Link to={`/company/${enterprise?.id}`}>
            <div className="enterprise__info">
              <img src={enterprise?.logoUrl} alt="" />
              {enterprise?.name}
            </div>
          </Link>{" "}
          - {new Date(job?.createdTime).toLocaleDateString()}
        </strong>
      </div>

      <div className="jobdetail__content box">
        <div className="item">
          <p>
            <strong>Mô tả: </strong>
          </p>

          <p>{job?.description}</p>
        </div>

        <div className="item">
          <strong>Thời gian: </strong>

          {job?.dayDuration ? (
            <LabelStatus
              state={"info"}
              label={`${job?.dayDuration} ngày`}
              size={"large"}
            />
          ) : (
            <></>
          )}

          {job?.hourDuration ? (
            <LabelStatus
              state={"info"}
              label={`${job?.hourDuration} giờ`}
              size={"large"}
            />
          ) : (
            <></>
          )}

          {job?.minuteDuration ? (
            <LabelStatus
              state={"info"}
              label={`${job?.minuteDuration} phút`}
              size={"large"}
            />
          ) : (
            <></>
          )}
        </div>

        <div className="item">
          <strong>Thể loại: </strong>
          {category ? (
            <LabelStatus state={"info"} label={category.name} size={"large"} />
          ) : (
            <></>
          )}
        </div>

        <div className="item">
          <strong>Trạng thái: </strong>
          <LabelStatus
            label={ORDER_STATUS[job?.jobStatus]?.title}
            state={ORDER_STATUS[job?.jobStatus]?.state}
            size={"large"}
          />
        </div>

        <div className="item">
          <strong>Chất giọng: </strong>
          <LabelStatus label={TONE[job?.tone]} state={"info"} size={"large"} />
        </div>

        <div className="item">
          <strong>Giá: </strong>
          <span>{job?.price}β</span>
        </div>
        {isAccept && job?.jobStatus == 0 ? (
          <div className="accept_button">
            <button
              className="button"
              onClick={() => {
                acceptJob(2);
              }}
            >
              Chấp nhận công việc
            </button>

            <button
              className="button inject"
              onClick={() => {
                acceptJob(1);
              }}
            >
              Từ chối công việc
            </button>
          </div>
        ) : (
          <>
            {data.account?.role == 0 && job?.jobStatus == 0 ? (
              <div className="accept_button">
                <button className="button" onClick={handleApplyJob}>
                  Ứng tuyển
                </button>
              </div>
            ) : (
              <></>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default JobDetail;
