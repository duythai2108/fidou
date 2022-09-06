import { Dropdown, Menu } from "antd";
import React, { useEffect } from "react";
import { useState } from "react";
import { getAuthen } from "../../axios/authenfunction";
import API from "../../constans/api";
import "./dropdown.style.scss";
function DropdownList() {
  const menu = (
    <Menu
      items={[
        {
          key: "1",
          label: (
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://www.antgroup.com"
            >
              1st menu item
            </a>
          ),
        },
        {
          key: "2",
          label: (
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://www.aliyun.com"
            >
              2nd menu item
            </a>
          ),
        },
        {
          key: "3",
          label: (
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://www.luohanacademy.com"
            >
              3rd menu item
            </a>
          ),
        },
      ]}
    />
  );

  const [category, setCategory] = useState([]);
  const [subcategory, setSubCategory] = useState([]);

  useEffect(() => {
    getAuthen(API["GET_CATEGORY"], true)
      .then((response) => {
        console.log(response.data.data);
        setCategory(response.data.data);
      })
      .catch();

    getAuthen(API["GET_SUBCATEGORY"], true)
      .then((response) => {
        console.log(response.data.data);
        setSubCategory(response.data.data);
      })
      .catch();
  }, []);

  return (
    <div className="dropdownlist">
      {category.length > 0 ? (
        category.map((item, index) => {
          let menu = subcategory.filter((item2) => item.id == item2.categoryId);
          menu = menu.map((menuItem, index) => {
            return {
              key: index + "",
              label: (
                <a
                  rel="noopener noreferrer"
                  href={`/search/candidate?search=1&SubCategoryId=${menuItem.id}`}
                >
                  {menuItem.name}
                </a>
              ),
            };
          });
          const menuElement = <Menu items={menu} />;
          return (
            <Dropdown overlay={menuElement} placement="bottom">
              <span>{item.name}</span>
            </Dropdown>
          );
        })
      ) : (
        <></>
      )}
    </div>
  );
}

export default DropdownList;
