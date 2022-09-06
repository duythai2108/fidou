import React, { useEffect, useReducer } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAuthen } from "../axios/authenfunction";
import API from "../constans/api";
import path from "../constans/path";

export const AccountContext = React.createContext();

const dataReducer = (state, action) => {
  switch (action.type) {
    case "SET_ACCOUNT":
      return {
        ...state,
        account: action.payload,
      };
    case "SET_INFOMATION":
      return {
        ...state,
        information: action.payload,
      };
    case "LOG_OUT":
      return {
        ...state,
        account: null,
        information: null,
      };
    default:
      return state;
  }
};

function AccountProvider({ children }) {
  const [data, dispatch] = useReducer(dataReducer, {
    account: null,
    information: null,
  });

  let navigate = useNavigate();
  const getAccount = () => {
    return JSON.parse(localStorage.getItem("account"));
  };

  useEffect(() => {
    const sessionAccount = getAccount();
    if (!data.account && sessionAccount) {
      dispatch({
        type: "SET_ACCOUNT",
        payload: sessionAccount,
      });
    }
    if (data.account) {
      if (data.account.role == 0 && !data.information) {
        getAuthen(API["GET_CANDIDATE_INFO"] + data.account.id, true)
          .then((response) => {
            if (!response.data.data) {
              navigate(path["UPDATE_PROFILE_PAGE"] + `/candidate`);
            } else {
              if (!data.information) {
                dispatch({
                  type: "SET_INFOMATION",
                  payload: response.data.data,
                });
              }
            }
          })
          .catch((error) => {
            navigate(path["UPDATE_PROFILE_PAGE"] + `/candidate`);
          });
      } else if (data.account.role == 1 && !data.information) {
        getAuthen(API["GET_ENTERPRISE_INFO"] + data.account.id, true)
          .then((response) => {
            if (!response.data.data) {
              navigate(path["UPDATE_PROFILE_PAGE"] + `/enterprise`);
            } else {
              if (!data.information) {
                dispatch({
                  type: "SET_INFOMATION",
                  payload: response.data.data,
                });
              }
            }
          })
          .catch((error) => {
            navigate(path["UPDATE_PROFILE_PAGE"] + `/enterprise`);
          });
      }
    }
  }, [data]);
  return (
    <AccountContext.Provider value={{ data, dispatch }}>
      {children}
    </AccountContext.Provider>
  );
}

export default AccountProvider;
