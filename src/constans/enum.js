const ORDER_STATUS = {
  0: {
    title: "Đang tìm ứng cử viên",
    state: "success",
  },
  1: {
    title: "Đang tiến hành",
    state: "process",
  },
  2: {
    title: "Đã hoàn thành",
    state: "success",
  },
  3: {
    title: "Đã xóa",
    state: "danger",
  },
};

const TRANSACTION_TYPE = {
  0: "Nhận khoản thanh toán",
  1: "Kí quỹ",
  2: "Nạp tiền",
  3: "Hoàn trả",
  4: "Thanh toán cho công việc",
};

const TONE = {
  0: "Giọng trầm",
  1: "Giọng vừa",
  2: "Giọng cao",
};

const ACCOUNT_STATUS = {
  0: "Không hoạt động",
  1: "Hoạt động",
  2: "Bị khóa",
  3: "Bị xóa",
};

const ROLE_ENUM = {
  0: "Ứng viên",
  1: "Nhà tuyển dụng",
};

export { ORDER_STATUS, TRANSACTION_TYPE, TONE, ACCOUNT_STATUS, ROLE_ENUM };
