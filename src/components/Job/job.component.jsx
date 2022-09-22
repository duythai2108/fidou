import React, { useContext, useState } from "react";
import { AccountContext } from "../../context/AccountProvider";
import LabelStatus from "../label-status/label-status.component";
import "./job.style.scss";
import { Avatar, Tooltip } from "antd";
import { Link, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import {
  deleteAuthen,
  postAuthen,
  putAuthen,
} from "../../axios/authenfunction";
import API from "../../constans/api";
import {
  addDoc,
  collection,
  db,
  onSnapshot,
  query,
  where,
} from "../../Firebase/config";
import { ORDER_STATUS } from "../../constans/enum";
import { async } from "@firebase/util";
import { useEffect } from "react";
import { uploadFile } from "../../Firebase/service";
import path from "../../constans/path";
import { Button, Modal } from "antd";
import Rating from "@mui/material/Rating";

function Job({
  id,
  title,
  description,
  day,
  hours,
  minute,
  price,
  listTalen,
  jobId,
  jobName,
  tone,
  jobStatus,
  showAddtofavorite,
  review,
  report,
  orderId,
  setDeleteId,
  setIsShowAddJob,
  subCategoryId,
  field,
  setUpdate,
  status,
  deleteFavorite,
  setUpdateFavorite,
  minAge,
  maxAge,
  language,
  gender,
}) {
  const [value, setValue] = React.useState(0);

  let accountContext = useContext(AccountContext);
  let { data } = accountContext;
  let { username } = useParams();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [content, setContent] = useState("");

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    postAuthen(
      API["POST_REVIEW"],
      {
        id: orderId,
        content: content,
        reviewPoint: value,
      },
      true
    )
      .then((response) => {
        Swal.fire("Thông báo!", "Đánh giá ứng cử viên thành công!", "success");
      })
      .catch((error) => {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Something went wrong!",
        });
      });
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const showReview = async () => {
    showModal();
  };

  const handleDelete = () => {
    Swal.fire({
      title: `Bạn có muốn tiếp tục xóa ${title}?`,
      showCancelButton: true,
      confirmButtonText: "Xóa",
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        deleteAuthen(API["DELETE_JOB"] + id, true)
          .then((response) => {
            Swal.fire("Thông báo", "Xóa job thành công!", "success");
            setDeleteId(id);
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

  const showEdit = () => {
    field.setValue(subCategoryId);
    setIsShowAddJob(true);
    field.title2.current.value = title;
    field.description2.current.value = description;
    field.day.current.value = day;
    field.hours.current.value = hours;
    field.minute.current.value = minute;
    field.price.current.value = price;
    field.tone.current.value = tone;
    field.minAge.current.value = minAge;
    field.maxAge.current.value = maxAge;
    field.gender.current.value = gender;
    field.language.current.value = language;  
    setUpdate(id);
  };

  const showReport = async () => {
    let isHaveRecord = true;
    const q = query(collection(db, "file"), where("orderId", "==", orderId));
    let newList;
    const unsubscribe = onSnapshot(q, async (querySnapshot) => {
      newList = querySnapshot.docs.map((doc) => {
        return { ...doc.data(), id: doc.id };
      });

      if (newList.length == 0) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Ứng viên chưa gửi report nào nên không thể báo cáo!",
        });
      } else {
        console.log("show");
        const { value: formValues } = await Swal.fire({
          title: "Báo cáo ứng cử viên",
          html: `
          <div class="row">
            <textarea name="" id="swal-input3" placeholder="Nội dung đánh giá" cols="30" rows="5"></textarea>
          </div>
        `,
          showCancelButton: true,
          focusConfirm: false,
          confirmButtonText: "Gửi báo cáo",
          preConfirm: async () => {
            // const url = await uploadFile(
            //   document.getElementById("swal-input1").files[0],
            //   data.account?.id + new Date(),
            //   "audio/mpeg"
            // );
            return {
              id: orderId,
              voiceLink: newList[0].file,
              content: document.getElementById("swal-input3").value,
            };
          },
        });
        if (formValues) {
          postAuthen(API["POST_REPORT"], formValues, true)
            .then((response) => {
              Swal.fire(
                "Thông báo!",
                "Báo cáo ứng cử viên thành công!",
                "success"
              );
            })
            .catch((error) => {
              Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Something went wrong!",
              });
            });
        }
      }
      unsubscribe();
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
      description: "Phòng trao đổi",
      lastSent: dateString,
      user: [id1, id2],
      orderId: orderId,
    })
      .then((response) => {})
      .catch((error) => {
        console.log(error);
      });
  };

  const approveJob = (orderId, jobId) => {
    putAuthen(
      API["APPROVE_JOB"],
      {
        orderId,
        jobId,
      },
      true
    ).then((response) => {
      Swal.fire("Thông báo!", "Chấp nhận ứng viên thành công", "success").then(() => {
        createRoom(
          response.data.data.candidateId,
          data.account.id,
          "Phòng trao đổi " + jobName,
          orderId
        );
      });
    });
  };

  const convertTone = (tone) => {
    switch (tone) {
      case 0:
        return <span>Giọng trầm</span>;
      case 1:
        return <span>Giọng vừa</span>;
      case 2:
        return <span>Giọng cao</span>;
      default:
        return <span></span>;
    }
  };

  const handleApplyJob = (jobId, price) => {
    const fee = price * 0.1;
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
            jobId: jobId,
          },
          true
        )
          .then((response) => {
            Swal.fire(
              "Thông báo!",
              "Nộp đơn vào dự án " + title + " thành công",
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

  const addToFavorite = async (jobId) => {
    try {
      await postAuthen(
        API["FAVORITE_JOB"],
        {
          jobId: jobId,
        },
        true
      );
      Swal.fire(
        "Thông báo!",
        "Thêm vào danh sách yêu thích thành công",
        "success"
      );
    } catch (e) {
      if (
        (e.response.data.msg =
          "This Candidate have added this Job to FavouriteJob before.")
      ) {
        Swal.fire("Công việc này đã nằm trong danh sách yêu thích của bạn!");
      }
    }
  };

  const deleteFavoriteHandle = () => {
    deleteAuthen(API["FAVORITE_JOB"] + `?JobId=${jobId}`, true)
      .then((response) => {
        console.log(response.data.data);
        console.log(response);
        setUpdateFavorite(true);
      })
      .catch();
  };

  return (
    <div className="job">
      <div className="">
        <div className="title">
          <h4>
            <Link to={`/${path["JOB"]}/${id}`}>{title}</Link>
            <LabelStatus
              label={ORDER_STATUS[jobStatus]?.title}
              state={ORDER_STATUS[jobStatus]?.state}
            />
          </h4>
          {showAddtofavorite ? (
            <button
              onClick={() => {
                addToFavorite(jobId);
              }}
            >
              + thêm vào danh sách yêu thích
            </button>
          ) : (
            ""
          )}

          {deleteFavorite ? (
            <>
              <button onClick={deleteFavoriteHandle}>xóa khỏi danh sách</button>
            </>
          ) : (
            <></>
          )}
        </div>
        <p>{description}</p>
        <div className="">
          {day ? <LabelStatus label={day + " day"} state={"info"} /> : ""}
          {hours ? <LabelStatus label={hours + " hours"} state={"info"} /> : ""}
          {minute ? (
            <LabelStatus label={minute + " minute"} state={"info"} />
          ) : (
            ""
          )}
          <LabelStatus label={convertTone(tone)} state={"info"} />
        </div>
        <h5>{price}β</h5>
        <div className="job_button">
          <div className="candidate">
            {listTalen?.map((item, index) => {
              return (
                <div className="candidate__item" key={index}>
                  <Link to={`/profile/${item.candidate.id}`} target={"_blank"}>
                    <Tooltip title={item.candidate.name}>
                      <Avatar src={item.candidate.avatarUrl}></Avatar>
                    </Tooltip>
                  </Link>
                  <button
                    className="button"
                    onClick={() => {
                      approveJob(item.id, jobId);
                    }}
                  >
                    Phê duyệt
                  </button>
                </div>
              );
            })}
            {listTalen?.length == 0 ? <p>Chưa có ai nhận</p> : ""}
          </div>
          {data.account?.role == 0 && jobStatus == 0 ? (
            <button
              className="button"
              onClick={() => {
                handleApplyJob(id, price);
              }}
            >
              Nhận công việc
            </button>
          ) : (
            ""
          )}
        </div>
        {review ? (
          <div className="review">
            <button className="button" onClick={showReview}>
              Đánh giá
            </button>
          </div>
        ) : (
          ""
        )}
        {report ? (
          <div className="review">
            <button className="button" onClick={showReport}>
              Báo cáo
            </button>
          </div>
        ) : (
          ""
        )}
      </div>
      {data.account && data.account?.id == username && status == 0 ? (
        <div className="edit">
          <button clasName="delete" onClick={handleDelete}>
            delete
          </button>
          <button className="update" onClick={showEdit}>
            update 
          </button>
        </div>
      ) : (
        ""
      )}

      <Modal
        title="Đánh giá"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <div className="" style={{ display: "flex", justifyContent: "center" }}>
          <Rating
            name="simple-controlled"
            value={value}
            onChange={(event, newValue) => {
              setValue(newValue);
            }}
          />
        </div>

        <textarea
          name=""
          id=""
          cols="30"
          rows="10"
          style={{
            width: "100%",
            padding: "10px",
            outline: "none",
            marginTop: "20px",
          }}
          placeholder="Nội dung"
          value={content}
          onChange={(event, newValue) => {
            setContent(event.target.value);
          }}
        ></textarea>
      </Modal>
    </div>
  );
}

export default Job;
