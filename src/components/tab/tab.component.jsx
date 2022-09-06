import * as React from "react";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Job from "../Job/job.component";
import { useEffect } from "react";
import { AccountContext } from "../../context/AccountProvider";
import { getAuthen } from "../../axios/authenfunction";
import API from "../../constans/api";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export default function BasicTabs({ listOrder }) {
  const [value, setValue] = React.useState(0);
  const [favorite, setFavorite] = React.useState([]);
  const [updateFavorite, setUpdateFavorite] = React.useState(true);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  let accountContext = React.useContext(AccountContext);
  let { data } = accountContext;

  useEffect(() => {
    updateFavorite &&
      getAuthen(API["GET_FAVORITE_JOB"], true).then((response) => {
        console.log(response.data.data);
        setFavorite(response.data.data);
        setUpdateFavorite(false);
      });
  }, [updateFavorite]);

  useEffect(() => {
    console.log(listOrder);
  }, [listOrder]);

  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
        >
          <Tab
            label={
              data?.account?.role == "0"
                ? "Đang ứng tuyển"
                : "Đang tìm ứng viên"
            }
            {...a11yProps(0)}
          />
          <Tab label="Đang thực thi" {...a11yProps(1)} />
          <Tab label="Đã hoàn thành" {...a11yProps(2)} />
          {data?.account?.role == "0" ? (
            <Tab label="Yêu thích" {...a11yProps(3)} />
          ) : (
            ""
          )}
        </Tabs>
      </Box>

      {data?.account?.role == "0" ? (
        <TabPanel value={value} index={3}>
          {favorite?.map((item, index) => {
            item = item.job;
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
                deleteFavorite={true}
                setUpdateFavorite={setUpdateFavorite}
              />
            );
          })}
          {favorite.length == 0 ? <p>Danh sách hiện đang trống</p> : ""}
        </TabPanel>
      ) : (
        ""
      )}

      <TabPanel value={value} index={0}>
        {listOrder?.map((item, index) => {
          if (item.jobStatus == 0) {
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
              />
            );
          }

          if (item.status == 0) {
            item = item.job;
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
              />
            );
          }
        })}
        {listOrder.filter((item) => item.jobStatus == 0).length == 0 ? (
          <p>Danh sách hiện đang trống</p>
        ) : (
          ""
        )}
      </TabPanel>
      <TabPanel value={value} index={1}>
        {listOrder?.map((item, index) => {
          if (item.jobStatus == 1) {
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
                report={true}
                orderId={item.orders[0]?.id}
              />
            );
          }
          if (item.status == 1) {
            item = item.job;
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
              />
            );
          }
        })}
        {listOrder.filter((item) => item.jobStatus == 1 && item.jobStatus)
          .length == 0 ? (
          <p>Danh sách hiện đang trống</p>
        ) : (
          ""
        )}
      </TabPanel>
      <TabPanel value={value} index={2}>
        {listOrder?.map((item, index) => {
          if (item.jobStatus == 2) {
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
                review={true}
                orderId={item.orders[0]?.id}
              />
            );
          }
        })}

        {listOrder?.map((item, index) => {
          if (item?.status == 2) {
            item = item.job;
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
                // orderId={item.orders[0].id}
              />
            );
          }
        })}
        {listOrder.filter((item) => item.jobStatus == 2 && item.status == 2)
          .length == 0 ? (
          <p>Danh sách hiện đang trống</p>
        ) : (
          ""
        )}
      </TabPanel>
    </Box>
  );
}
