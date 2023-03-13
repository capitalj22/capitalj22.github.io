import { useState } from "react";
import "./skilltree.scss";

type IProps = {
  nodes: any;
  nodesUpdated: any;
};
function SkillTree({ nodes, nodesUpdated }: IProps) {
  const handleNodeUpdated = (event: any) => {
    nodesUpdated(event);
  };

  return (
    <div className="skill-tree">
      Skill Tree
      <button onClick={handleNodeUpdated}> Update Skill</button>
    </div>
  );
}

export default SkillTree;
