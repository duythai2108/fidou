import React from "react";

export const AppContext = React.createContext();
function AppProvider({ children }) {
  return <AppContext.Provider value={"test"}>{children}</AppContext.Provider>;
}

export default AppProvider;
