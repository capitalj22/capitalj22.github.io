import { useState } from "react";
import "./skillNode.scss";
import classnames from "classnames";

type IProps = { node: any; isActive: boolean; isAvailable: boolean };

function skillNode({ node, isActive, isAvailable }: IProps) {
  return (
    <div className="skill-node">
      <div
        className={classnames(isActive && "active", isAvailable && "available")}
      ></div>
    </div>
  );
}

export default skillNode;
