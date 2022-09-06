import React from "react";
import "./policy.style.scss";
const Policy = () => {
  return (
    <div className="policy-page">
      <h2>Điều khoản khi tham gian sàn giao dịch việc làm FIDOU</h2>
      <div className="list">
        <h3>Điều khoảng 1:</h3>
        <p>
          Mọi cá nhân đều phải có trách nhiệm đối với thông tin bài đăng của mình và cá nhân tham gia
          phải đủ 18 tuổi.
        </p>
        <p>
          Không được đăng thông tin nội dung xuyên tạc chính quyền, nhà nước Việt Nam
        </p>
        <p>
          Không có hành vi phân biệt chủng tộc, phân biệt giai cấp, phân biệt giới tính
        </p>
        <p>
          Phải đề cao cảnh giác trước những hành vi lừa đảo
        </p>
        <p>
          Không được đăng thông tin sai sự thật, tin giả
        </p>
      </div>
      <div className="list">
        <h3>Điều khoảng 2:</h3>
        <p>
          Tiền kí quỹ là số tiền đảm bảo sự công bằng cho mỗi cá nhân tham gia,sẽ được hoàn trả sau khi ứng viên hoàn thành công việc
        </p>
        <p>
          Mọi sự chậm trễ do việc nạp tiền sẽ được giải quyết từ trên xuống dưới
        </p>
       
      </div>
      <div className="list">
        <h3>Điều khoảng 3:</h3>
        <p color="red">
          Quyết định cuối cùng khi xảy ra tranh chấp sẽ thuộc quyền quyết định của quản trị viên FIDOU
        </p>
        
       
      </div>
      
    </div>
  );
};

export default Policy;
