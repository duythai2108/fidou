import { InputNumber, Modal, Radio, Select } from "antd";
import React, { useContext, useEffect, useRef, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { getAuthen, postAuthen, putAuthen } from "../../axios/authenfunction";
import voice from "../../axios/voice";
import Comment from "../../components/Comment/comment.component";
import Demo from "../../components/Demo/demo.component";
import Job from "../../components/Job/job.component";
import LabelStatus from "../../components/label-status/label-status.component";
import API from "../../constans/api";
import path from "../../constans/path";
import { AccountContext } from "../../context/AccountProvider";
import { uploadFile } from "../../Firebase/service";
import "./profile.style.scss";
function Profile() {
  const location = useLocation();
  const { Option } = Select;
  let [prepareData, setPrepareData] = useState({
    sub: [],
    demos: [],
    account: [],
    jobs: [],
  });
  let [update, setUpdate] = useState();
  let { username } = useParams();
  let headerInfo = useRef(null);
  let [isSticky, setIsSticky] = useState(false);
  let [isShowAdd, setIsShowAdd] = useState(false);
  let [isEditable, setIsEditable] = useState(false);
  let [isShowAddJob, setIsShowAddJob] = useState(false);
  let [deleteId, setDeleteId] = useState("");
  let file = useRef(null);
  let title = useRef(null);
  let title2 = useRef(null);
  const [value, setValue] = useState(1);
  let day = useRef(null);
  let hours = useRef(null);
  let minute = useRef(null);
  let description2 = useRef(null);
  let price = useRef(null);
  let tone = useRef(null);
  let toneDemo = useRef(null);
  let minAge = useRef(null);
  let maxAge = useRef(null);
  let gender = useRef(null);
  let language = useRef(null);

  const isCompany = location.pathname.includes(path["COMPANY_PAGE"]);

  const accountContext = useContext(AccountContext);
  let { data } = accountContext;

  const onChange = (e) => {
    setValue(e.target.value);
  };
  let description = useRef(null);
  const handleScroll = () => {
    let headerOffset = headerInfo.current?.offsetTop;
    let pageOffset = window.pageYOffset;
    if (headerOffset && pageOffset > headerOffset) {
      setIsSticky(true);
    } else {
      setIsSticky(false);
    }
  };

  useEffect(() => {
    console.log(deleteId);
    if (deleteId) {
      prepareData.account.jobs = prepareData.account.jobs.filter(
        (item) => item.id != deleteId
      );
      console.log(prepareData.account.jobs);
      setPrepareData(prepareData);
      setDeleteId("");
    }
  }, [deleteId]);

  useEffect(() => {
    console.log(data);
  }, [data]);

  useEffect(() => {
    const fetchDataCadidates = async () => {
      const [sub, accountRequest] = await Promise.all([
        getAuthen(API["GET_SUBCATEGORY"]),
        // getAuthen(API["GET_DEMO"], true),
        getAuthen(API["GET_CANDIDATE_INFO"] + username),
      ]);
      console.log(accountRequest);
      setPrepareData({
        sub: sub.data.data,
        // demos: demos.data.data,
        account: accountRequest.data.data,
      });
    };

    const fetchDataEnterprise = async () => {
      const [sub, accountRequest] = await Promise.all([
        getAuthen(API["GET_SUBCATEGORY"]),
        getAuthen(API["GET_ENTERPRISE_INFO"] + username),
      ]);
      setPrepareData({
        sub: sub.data.data,
        account: accountRequest.data.data,
      });
    };

    if (isCompany) {
      fetchDataEnterprise();
    } else {
      fetchDataCadidates();
    }

    let account = JSON.parse(localStorage.getItem("account"));
    if (account?.id == username) {
      setIsEditable(true);
    }
    window.scrollTo(0, 0);
    handleScroll();
    window.addEventListener("scroll", (event) => {
      handleScroll();
    });
  }, []);

  const handelAddJob = () => {
    const txtTitle = title2.current.value;
    const txtDescription = description2.current.value;
    const txtDay = day.current.value;
    const txtHours = hours.current.value;
    const txtMinute = minute.current.value;
    const txtPrice = price.current.value;
    const txtTone = tone.current.value;
    const txtMinAge = minAge.current.value;
    const txtMaxAge = maxAge.current.value;
    const txtGender = gender.current.value;
    const txtLanguage = language.current.value;

    if (
      !txtTitle ||
      !txtDescription ||
      (!txtDay && !txtHours && !txtMinute) ||
      !txtPrice ||
      !txtTone
    ) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Vui lòng điền đầy đủ thông tin!",
      });
      return;
    }

    if (Number(txtPrice) <= 0) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Giá tiền phải lớn hơn 0!",
      });
      return;
    }

    if (update) {
      putAuthen(
        API["PUT_JOB"],
        {
          id: update,
          name: txtTitle,
          description: txtDescription,
          dayDuration: Number(txtDay),
          hourDuration: Number(txtHours),
          minuteDuration: Number(txtMinute),
          subCategoryId: value,
          price: Number(txtPrice),
          tone: Number(txtTone),
          minAge: Number(txtMinAge),
          maxAge: Number(txtMaxAge),
          language: Number(txtLanguage),
          gender: Number(txtGender)
        },
        true
      )
        .then((response) => {
          console.log(response.data.data);
          setIsShowAddJob(false);
          Swal.fire("Thông báo", "Update job thành công!", "success");
          const {
            dayDuration,
            description,
            enterpriseId,
            hourDuration,
            id,
            isPublic,
            jobStatus,
            minuteDuration,
            name,
            price,
            subCategoryId,
            tone,
            minAge,
            maxAge,
            language,
            gender
          } = response.data.data;
          const oldData = prepareData.account.jobs.filter(
            (item) => item.id == id
          )[0];
          const index = prepareData.account.jobs.indexOf(oldData);
          prepareData.account.jobs[index] = {
            dayDuration,
            description,
            enterpriseId,
            hourDuration,
            id,
            isPublic,
            jobStatus,
            minuteDuration,
            name,
            price,
            subCategoryId,
            tone,
            minAge,
            maxAge,
            language,
            gender
          };
          console.log(prepareData.account.jobs);
          setPrepareData({
            ...prepareData,
          });
        })
        .catch((error) => {
          setIsShowAddJob(false);
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: error.response.data.msg,
          });
        });
    } else {
      postAuthen(
        API["POST_JOB"],
        {
          name: txtTitle,
          description: txtDescription,
          dayDuration: Number(txtDay),
          hourDuration: Number(txtHours),
          minuteDuration: Number(txtMinute),
          subCategoryId: value,
          price: Number(txtPrice),
          tone: Number(txtTone),
          minAge: Number(txtMinAge),
          maxAge: Number(txtMaxAge),
          language: Number(txtLanguage),
          gender: Number(txtGender)
        },
        true
      )
        .then((response) => {
          setIsShowAddJob(false);
          Swal.fire("Thông báo", "Đăng job thành công!", "success");
          const {
            dayDuration,
            description,
            enterpriseId,
            hourDuration,
            id,
            isPublic,
            jobStatus,
            minuteDuration,
            name,
            price,
            subCategoryId,
            tone,
            minAge,
            maxAge,
            language,
            gender
          } = response.data.data.transaction.job;
          prepareData.account.jobs.push({
            dayDuration,
            description,
            enterpriseId,
            hourDuration,
            id,
            isPublic,
            jobStatus,
            minuteDuration,
            name,
            price,
            subCategoryId,
            tone,
            minAge,
            maxAge,
            language,
            gender
          });
          console.log(prepareData.account.jobs);
          setPrepareData({
            ...prepareData,
          });
        })
        .catch((error) => {
          setIsShowAddJob(false);
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: error.response.data.msg,
          });
        });
    }
  };

  const handelCreateDemo = () => {
    if (file.current.files[0].type == "audio/mpeg") {
      const txtfile = file.current.files[0];
      const txtTitle = title.current.value;
      const txtDescription = description.current.value;
      const txtTone = toneDemo.current.value;
      const url = uploadFile(
        txtfile,
        txtTitle + new Date().toDateString,
        "audio/mpeg"
      );

      url
        .then((response) => {
          let url = response;
          voice
            .post("/transcript", {
              audio_url: url,
            })
            .then((response) => {
              let status = "queued";
              let script = "";
              const interval = setInterval(() => {
                if (status != "completed") {
                  voice
                    .get(`/transcript/${response.data.id}`)
                    .then((response) => {
                      status = response.data.status;
                      if (status == "completed") {
                        script = response.data.text;
                      }
                    });
                } else {
                  clearInterval(interval);
                  postAuthen(
                    API["POST_DEMO"],
                    {
                      title: txtTitle,
                      description: txtDescription,
                      url: url,
                      subCategoryId: value,
                      tone: Number(txtTone),
                      textTranscript:
                        script.length > 0 ? script : "script trống!",
                    },
                    true
                  )
                    .then((response) => {
                      const {
                        candidateId,
                        description,
                        id,
                        subCategoryName,
                        title,
                        tone,
                        url,
                        textTranscript,
                      } = response.data.data;
                      prepareData.account.voiceDemos.push({
                        candidateId: candidateId,
                        description: description,
                        id: id,
                        subCategoryName: subCategoryName,
                        textTranscript: textTranscript,
                        title: title,
                        tone: tone,
                        url: url,
                      });
                      Swal.fire(
                        "Thông báo",
                        "Đăng demo thành công!",
                        "success"
                      );
                      setIsShowAdd(false);
                      setPrepareData({
                        ...prepareData,
                      });
                    })
                    .catch();
                }
              }, 1000);
            })
            .catch();
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Chỉ áp dụng cho file audio!",
      });
    }
  };

  return (
    <div className="profile">
      <div
        ref={headerInfo}
        className={`header-info ${isSticky ? "sticky" : ""}`}
      >
        <div className="row">
          <div className="header-info__avatar">
            <img
              src={
                isCompany
                  ? prepareData.account.logoUrl
                  : prepareData.account.avatarUrl
              }
              alt=""
            />
          </div>

          <div className="header-info__info">
            <h2>
              {prepareData.account.name} <i class="fa fa-check-circle"></i>
            </h2>
            <h4>
              <i class="fa fa-map-marker-alt"></i>{" "}
              <span>Thành phố {prepareData.account.province}</span>
            </h4>
          </div>
        </div>
        <div className="header-info__button">
          {isEditable ? (
            !isCompany ? (
              <div>
                <button
                  onClick={() => {
                    setIsShowAdd(true);
                  }}
                >
                  Thêm bản ghi âm
                </button>
                <Modal
                  title="Add new demo"
                  centered
                  visible={isShowAdd}
                  onOk={() => handelCreateDemo()}
                  onCancel={() => setIsShowAdd(false)}
                  width={800}
                  className="modal-adddemo"
                >
                  <div className="modal-adddemo__skill box">
                    <h3>
                      Skill <span>*</span>
                    </h3>
                    <p>Chọn 1 kĩ năng mà bản ghi âm này sẽ thể hiện.</p>
                    {!isCompany ? (
                      <div className="modal-adddemo__skill__list">
                        <Radio.Group onChange={onChange} value={value}>
                          {prepareData.sub?.length > 0
                            ? prepareData.sub.map((item, index) => {
                                return (
                                  <Radio value={item.id} key={index}>
                                    {item.name}
                                  </Radio>
                                );
                              })
                            : ""}
                        </Radio.Group>
                      </div>
                    ) : (
                      ""
                    )}
                  </div>

                  <div className="modal-adddemo__description box">
                    <h3>
                      Tiêu đề <span>*</span>
                    </h3>
                    <p>
                      Bao gồm tiêu đề của bản ghi âm, một chút kĩ năng ngắn gọn
                      hoặc giới thiệu về bạn.
                    </p>
                    <input type="text" ref={title} />
                    <h3>
                      Nội dung <span>*</span>
                    </h3>
                    <p>
                      Chia sẻ một số thông tin cơ bản và thêm thông tin về mẫu
                      thử này và bạn đã đóng góp như thế nào cho nó.
                    </p>
                    <input type="text" ref={description} />
                  </div>

                  <div className="modal-adddemo__description box">
                    <h3>
                      Upload Bản Ghi Âm <span>*</span>
                    </h3>
                    <p>
                      Giới hạn trong 1 file, nó phải định dạng MP3, giới hạn
                      dung lượng tối đa 100MB.
                    </p>
                    <input type="file" ref={file} />

                    <h3>
                      Tone <span>*</span>
                    </h3>
                    <select ref={toneDemo}>
                      <option disabled selected value>
                        -- Chọn --
                      </option>
                      <option value="0">Giọng trầm</option>
                      <option value="1">Giọng vừa</option>
                      <option value="2">Giọng cao</option>
                    </select>
                  </div>
                </Modal>
              </div>
            ) : (
              <div>
                <button
                  onClick={() => {
                    setIsShowAddJob(true);
                  }}
                >
                  Thêm công việc
                </button>
                <Modal
                  title="Add Job"
                  centered
                  visible={isShowAddJob}
                  onOk={handelAddJob}
                  onCancel={() => {
                    setUpdate();
                    setIsShowAddJob(false);
                  }}
                  width={800}
                  className="modal-adddemo"
                >
                  <div className="modal-adddemo__skill box">
                    <h3>
                      Kĩ năng <span>*</span>
                    </h3>
                    <p>Chọn 1 yêu cầu kĩ năng cho công việc của bạn.</p>
                    <div className="modal-adddemo__skill__list">
                      <Radio.Group onChange={onChange} value={value}>
                        {prepareData.sub.length > 0
                          ? prepareData.sub.map((item, index) => {
                              return (
                                <Radio value={item.id} key={index}>
                                  {item.name}
                                </Radio>
                              );
                            })
                          : ""}
                      </Radio.Group>
                    </div>
                      <h3>
                          Ngôn ngữ yêu cầu cho ứng viên <span>*</span>
                      </h3>
                      <select ref={language}>
                        <option disabled selected value>
                            -- Chọn --
                        </option>
                        <option value="0">Tiếng Việt</option>
                        <option value="1">Tiếng Anh</option>
                        </select>
                    <h3>
                      Giới tính yêu cầu cho ứng viên <span>*</span>
                    </h3>
                    <select ref={gender}>
                      <option disabled selected value>
                        -- Chọn --
                      </option>
                      <option value="0">Nam</option>
                      <option value="1">Nữ</option>
                    </select>
                    <h3>
                      Tone giọng yêu cầu cho ứng viên <span>*</span>
                    </h3>
                    <select ref={tone}>
                      <option disabled selected value>
                        -- Chọn --
                      </option>
                      <option value="0">Giọng trầm</option>
                      <option value="1">Giọng vừa</option>
                      <option value="2">Giọng cao</option>
                    </select>
                  </div>
                  <div className="box">
                      <div className="row">
                        <h3>Độ tuổi <span>*</span></h3>
                        <input type="number" min = "18" ref={minAge}/> -  <input type="number" min = "18" ref={maxAge}/>
                      </div>
                  </div>
                  <div className="modal-adddemo__description box">
                    <h3>
                      Tiêu đề công việc <span>*</span>
                    </h3>
                    <p>Miêu tả ngắn gọn tiêu đề cần cho công việc của bạn.</p>
                    <input type="text" ref={title2} />
                    <h3>
                      Nội dung <span>*</span>
                    </h3>
                    <p>
                      Chia sẻ một số yêu cầu công việc cần thiết cho ứng viên.
                    </p>
                    <input type="text" ref={description2} />
                  </div>
                            
                  <div className="box">
                    <div className="row">
                      <h3>
                        Ngày cần hoàn thành <span>*</span>
                      </h3>
                      <input type="number" ref={day} />
                    </div>
                    <div className="row">
                      <h3>
                        Giờ cần hoàn thành <span>*</span>
                      </h3>
                      <input type="number" ref={hours} />
                    </div>
                    <div className="row">
                      <h3>
                        Phút cần hoàn thành <span>*</span>
                      </h3>
                      <input type="number" ref={minute} />
                    </div>
                    <div className="row">
                      <h3>
                        Giá <span>*</span>
                      </h3>
                      <input type="number" ref={price} />
                    </div>
                  </div>
                </Modal>
              </div>
            )
          ) : data.account?.id == 1 && isCompany ? (
            <button>Mời vào việc</button>
          ) : (
            ""
          )}
        </div>
      </div>

      <div className="profile__info">
        <div className="profile__info__left">
          {isCompany ? (
            <>
              <h3>Các dự án của {prepareData.account.name}</h3>
              <div className="">
                {prepareData.account.jobs &&
                prepareData.account.jobs?.length > 0 ? (
                  prepareData.account.jobs.map((item, index) => {
                    console.clear();
                    console.log(item);
                    return (
                      <Job
                        title={item.name}
                        description={item.description}
                        key={index}
                        day={item.dayDuration}
                        hours={item.hourDuration}
                        minute={item.minuteDuration}
                        price={item.price}
                        id={item.id}
                        tone={item.tone}
                        minAge={item.minAge}
                        maxAge={item.maxAge}
                        language={item.language}
                        gender={item.gender}
                        setDeleteId={setDeleteId}
                        setIsShowAddJob={setIsShowAddJob}
                        subCategoryId={item.subCategoryId}
                        setUpdate={setUpdate}
                        status={item.jobStatus}
                        field={{
                          title2,
                          description2,
                          day,
                          hours,
                          minute,
                          price,
                          tone,
                          minAge,
                          maxAge,
                          language,
                          gender,
                          setValue,
                        }}
                      />
                    );
                  })
                ) : (
                  <h6>Hiện tại {prepareData.account.name} chưa có job nào</h6>
                )}
              </div>
            </>
          ) : (
            <>
              <h3>Voice Over Demos</h3>
              {prepareData.account.voiceDemos?.length > 0 ? (
                prepareData.account.voiceDemos.map((item, index) => {
                  return (
                    <Demo
                      title={item.title}
                      src={item.url}
                      sub={item.subCategoryName}
                      key={index}
                      description={item.description}
                      tone={item.tone}
                      script={item.textTranscript}
                    />
                  );
                })
              ) : (
                <h6>Hiện tại {prepareData.account.name} chưa có demo nào</h6>
              )}
            </>
          )}
        </div>
        <div className="profile__info__right">
          <div className="profile__info__right__info">
            <div className="item">
              <i class="fa fa-user-clock"></i>
              <strong>Kĩ năng:</strong> <br />
              {prepareData.account?.subCategorieNames?.map((item, index) => {
                return <LabelStatus label={item} state={"info"} />;
              })}
            </div>
          </div>
          <div className="profile__info__right__description">
            <h3>About {prepareData.account.name}</h3>
            <p>{prepareData.account.description}</p>
          </div>

          {prepareData.account?.reviews ? (
            <div className="comment-list aaaa">
              {prepareData.account?.reviews?.map((item) => {
                const date = new Date(item.createdTime).toLocaleDateString();
                return (
                  <Comment
                    date={date}
                    value={item.reviewPoint}
                    content={item.content}
                  />
                );
              })}
            </div>
          ) : (
            <></>
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile;
