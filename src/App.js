import { Route, Routes } from "react-router-dom";
import ExtraHeaderFooter from "./components/ExtraHeaderFooter/extraheaderfooter.component";
import PATH from "./constans/path";
import CategoryAdmin from "./pages/CategoryManager/categoryadmin.page";
import Chat from "./pages/ChatApp";
import Dashboard from "./pages/Dashboard/dashboard.page";
import DepositManager from "./pages/DepositManager/depositmanager.page";
import Home from "./pages/Home/home.page";
import JobManager from "./pages/JobManager/jobmanager.page";
import NotFound from "./pages/NotFound/notfound.page";
import Policy from "./pages/Policy/policy.page";
import Profile from "./pages/Profile/profile.page";
import SearchTalen from "./pages/SearchTalen/searchtalen.page";
import SearchJob from "./pages/SearchJob/searchjob.page";
import Talen from "./pages/Talen/talen.page";
import UpdateCandidate from "./pages/UpdateCandidate/updatecandidate.page";
import UpdateEnterprise from "./pages/UpdateEnterprise/updateenterprise.page";
import AccountManager from "./pages/AccountManager/accountmanager.page";
import Wallet from "./pages/Wallet/wallet.page";
import Report from "./pages/Report/report.page";
import JobDetail from "./components/JobDetail/jobdetail.component";
import SubCategoryManager from "./pages/SubCategoryManager/subcategorymanager.page";

function App() {
  return (
    <>
      <Routes>
        {/* none header footer*/}
        <Route path="/chat" element={<Chat />} />
        <Route path={PATH["ADMIN_PAGE"]} element={<Dashboard />}>
          <Route
            path={PATH["CATEGORY_ADMIN_PAGE"]}
            element={<CategoryAdmin />}
          />
          <Route
            path={PATH["DEPOSIT_ADMIN_PAGE"]}
            element={<DepositManager />}
          />

          <Route
            path={PATH["SUBCATEGORY_ADMIN_PAGE"]}
            element={<SubCategoryManager />}
          />
          <Route
            path={PATH["ACCOUNT_ADMIN_PAGE"]}
            element={<AccountManager />}
          />
          <Route path={PATH["REPORT"]} element={<Report />} />
        </Route>

        <Route path="" element={<ExtraHeaderFooter />}>
          {/* have header footer*/}
          <Route path={PATH["HOME_PAGE"]} element={<Home />} />
          <Route path={PATH["WALLET"]} element={<Wallet />} />
          <Route path={PATH["POLICY"]} element={<Policy />} />
          <Route path={PATH["TALEN_PAGE"]} element={<Talen />} />
          <Route path={PATH["MANAGER_JOB_PAGE"]} element={<JobManager />} />
          <Route path={PATH["SEARCH_PAGE"]}>
            <Route path="candidate" element={<SearchTalen />} />
            <Route path="job" element={<SearchJob />} />
          </Route>
          <Route path="job">
            <Route path=":id" element={<JobDetail />} />
          </Route>
          <Route path={PATH["UPDATE_PROFILE_PAGE"]}>
            <Route path="candidate" element={<UpdateCandidate />} />
            <Route path="enterprise" element={<UpdateEnterprise />} />
          </Route>
          <Route path={PATH["COMPANY_PAGE"]}>
            <Route path=":username" element={<Profile />} />
          </Route>
          <Route path={PATH["PROFILE_PAGE"]}>
            <Route path=":username" element={<Profile />} />
          </Route>
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
