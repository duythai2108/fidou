import React, { useContext, useEffect, useState } from "react";
import { getAuthen } from "../../axios/authenfunction";
import API from "../../constans/api";
import { TRANSACTION_TYPE } from "../../constans/enum";
import { AccountContext } from "../../context/AccountProvider";
import "./wallet.style.scss";
const Wallet = () => {
  let [wallet, setWallet] = useState();
  let [transaction, setTransaction] = useState();
  const accountContext = useContext(AccountContext);
  const { data } = accountContext;
  useEffect(() => {
    console.log(data.account);
    if (data.account) {
      getAuthen(API["GET_WALLET"] + "/" + data.account?.id)
        .then((response) => {
          setWallet(response.data.data);
        })
        .catch();
      getAuthen(API["GET_TRANSACTION_HISTORY"], true)
        .then((response) => {
          console.log(response.data.data);
          setTransaction(response.data.data);
        })
        .catch();
    }
  }, [data]);

  return (
    <div className="wallet">
      <h3>
        Coin của bạn: <strong>{wallet?.availableBalance} β </strong>
      </h3>
      <h3>
        Coin đang kí quỹ: <strong>{wallet?.lockedBalance} β </strong>
      </h3>

      <h3>Nạp β coin vào ví:</h3>
      <div className="money">
        <div className="item">
          <strong>Chuyển tiền đến stk:</strong>
          <span>0192318923</span>
        </div>
        <div className="item">
          <strong>Ngân hàng:</strong>
          <span>vietcombank</span>
        </div>

        <div className="item">
          <strong>Nội dung:</strong>
          <span>VOICE {wallet?.depositCode}</span>
        </div>
      </div>
      <div className="transaction">
        <h3 style={{ marginTop: "20px" }}>Lịch sử giao dịch:</h3>
        <table border={1}>
          <thead>
            <tr>
              <th>Admin</th>
              <th>Amount</th>
              <th>Time</th>
              <th>Type</th>
            </tr>
          </thead>
          <tbody>
            {transaction?.map((item) => {
              const date = new Date(item.createdTime);
              console.log(date);
              return (
                <tr>
                  <td>{item.adminId}</td>
                  <td>{item.amount}</td>
                  <td>{date.toDateString()}</td>
                  <td>{TRANSACTION_TYPE[item.transactionType]}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Wallet;
