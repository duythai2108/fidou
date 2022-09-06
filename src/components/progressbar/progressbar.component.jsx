import React from "react";
import "./progressbar.style.scss";

const Progressbar = (props) => (
  <section class="step-wizard">
    <ul class="step-wizard-list">
      <li class="step-wizard-item ">
        <span class="progress-count">1</span>
        <span class="progress-label">Init</span>
      </li>
      <li class="step-wizard-item current-item">
        <span class="progress-count">4</span>
        <span class="progress-label">Confirm</span>
      </li>
      <li class="step-wizard-item">
        <span class="progress-count">5</span>
        <span class="progress-label">Finish</span>
      </li>
    </ul>
  </section>
);

export default Progressbar;
