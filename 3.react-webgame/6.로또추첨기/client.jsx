import React from "react";
import ReactDom from "react-dom";

// import Lotto from './Lotto';
import Lotto from "./LottoHooks";

const Hot = hot(Lotto);

ReactDom.render(<Hot />, document.querySelector("#root"));
