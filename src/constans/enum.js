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
  0: "RECEIVE",
  1: "SEND",
  2: "DEPOSIT",
  3: "REFUNDED",
  4: "UNLOCK",
};

const TONE = {
  0: "Giọng trầm",
  1: "Giọng vừa",
  2: "Giọng cao",
};

const ACCOUNT_STATUS = {
  0: "INACTIVE",
  1: "ACTIVE",
  2: "BLOCKED",
  3: "DELETED",
};

const ROLE_ENUM = {
  0: "CANDIDATE",
  1: "ENTERPRISE",
};

export { ORDER_STATUS, TRANSACTION_TYPE, TONE, ACCOUNT_STATUS, ROLE_ENUM };
