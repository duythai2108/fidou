import React, { useContext, useEffect, useReducer, useState } from "react";
import { getAuthen, getParam } from "../../axios/authenfunction";
import Job from "../../components/Job/job.component";
import JobDetail from "../../components/JobDetail/jobdetail.component";
import API from "../../constans/api";
import { AccountContext } from "../../context/AccountProvider";
import "./searchjob.style.scss";
const queryReducer = (state, action) => {
  switch (action.type) {
    case "SET_FIELD":
      state[action.payload.field] = action.payload.value;
      return {
        ...state,
      };
    default:
      return state;
  }
};

const SearchJob = () => {
  let [subCategories, setSubCategories] = useState([]);
  let [candidates, setCandidates] = useState([]);
  const accountContext = useContext(AccountContext);
  const { data } = accountContext;
  let [query, queryDispatch] = useReducer(queryReducer, {
    category: "",
    min: "",
    max: "",
    tone: "",
  });

  const search = () => {
    let fullQuery = "?aa=1";

    if (query.category != "") {
      fullQuery += `&CategoryId=${query.category}`;
    }

    if (query.min != "") {
      fullQuery += `&MinPrice=${query.min}`;
    }

    if (query.max != "") {
      fullQuery += `&MaxPrice=${query.max}`;
    }

    if (query.tone != "") {
      fullQuery += `&Tone=${query.tone}`;
    }

    getParam(API["GET_JOB_FILTER"], fullQuery).then((response) => {
      console.log(response.data.data);
      setCandidates(response.data.data);
    });
  };

  useEffect(() => {
    console.log(query);
  }, [query]);

  useEffect(() => {
    getAuthen(API["GET_CATEGORY"]).then((response) => {
      setSubCategories(response.data.data);
    });
    search();
  }, []);

  return (
    <div className="search-job">
      <div className="left">
        <div className="item">
          <h3>All Service</h3>
          <div className="list-service">
            <h4
              className={query?.category == "" ? "active" : ""}
              onClick={() => {
                queryDispatch({
                  type: "SET_FIELD",
                  payload: {
                    field: "category",
                    value: "",
                  },
                });
              }}
            >
              Tất cả
            </h4>
            {subCategories.map((item, index) => {
              return (
                <h4
                  className={query?.category == item.id ? "active" : ""}
                  onClick={() => {
                    queryDispatch({
                      type: "SET_FIELD",
                      payload: {
                        field: "category",
                        value: item.id,
                      },
                    });
                  }}
                >
                  {item.name}
                </h4>
              );
            })}
          </div>
        </div>

        <div className="item">
          <h3>Gía từ</h3>
          <input
            type="number"
            value={query?.min}
            onChange={(e) => {
              queryDispatch({
                type: "SET_FIELD",
                payload: {
                  field: "min",
                  value: e.target.value,
                },
              });
            }}
          />
        </div>

        <div className="item">
          <h3>Đến</h3>
          <input
            type="number"
            value={query?.max}
            onChange={(e) => {
              queryDispatch({
                type: "SET_FIELD",
                payload: {
                  field: "max",
                  value: e.target.value,
                },
              });
            }}
          />
        </div>

        <div className="item">
          <h3>Tone</h3>
          <select
            name=""
            id=""
            onChange={(e) => {
              queryDispatch({
                type: "SET_FIELD",
                payload: {
                  field: "tone",
                  value: e.target.value,
                },
              });
            }}
          >
            <option selected value="">
              Tất cả
            </option>
            <option value="0">Giọng trầm</option>
            <option value="1">Giọng vừa</option>
            <option value="2">Giọng cao</option>
          </select>
        </div>

        <button className="button" onClick={search}>
          Tìm kiếm
        </button>
      </div>
      <div className="right">
        <h2>Danh sách công việc</h2>
        {candidates.map((item, index) => {
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
              listTalen={item.orders}
              jobId={item.id}
              jobName={item.name}
              tone={item.tone}
              jobStatus={item.jobStatus}
              showAddtofavorite={data?.account?.role == "0"}
            />
          );
        })}
      </div>
    </div>
  );
};

export default SearchJob;
