import { useState } from "react";
import "./tears.scss";

import { TearsAdd } from "./add/add";
import { TearsHome } from "./summary/home";

export interface Cry {
  date: Date;
  where: string;
  trigger: string;
  intensity: 1 | 2 | 3 | 4 | 5;
  wasCathartic: boolean;
}

export function Tears() {
  const [isAdding, setIsAdding] = useState(false);
  const back = () => {
      console.log("asd");
      setIsAdding(false);
    },
    goToAdd = () => {
      setIsAdding(true);
    };

  return (
    <div className="tears">
      {!isAdding && <TearsHome addPressed={goToAdd} />}
      {isAdding && <TearsAdd backPressed={back} savePressed={back} />}
    </div>
  );
}
