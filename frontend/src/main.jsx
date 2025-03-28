import React from "react";
import ReactDOM from "react-dom/client";

import "./index.css";

import { RouterProvider } from "react-router-dom";
import router from "./router.jsx";

// import { ContextProvider } from "./contexts/ContextProvider.jsx";

import { Provider } from "react-redux";
import store from "./store/index.js";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {/* <ContextProvider> */}
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
    {/* </ContextProvider> */}
  </React.StrictMode>
);
