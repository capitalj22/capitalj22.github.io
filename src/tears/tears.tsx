import { useState } from "react";
import "./tears.scss";

import { TearsAdd } from "./add/add";
import { TearsHome } from "./summary/home";
import { TearsStateProvider } from "./tearsStateProvider";

export interface Cry {
  date: Date;
  where: string;
  emotion: string;
  trigger: string;
  intensity: 1 | 2 | 3 | 4 | 5;
  wasCathartic: 'yes' | 'no';
}

export function Tears() {
  const [isAdding, setIsAdding] = useState(false);
  const back = () => {
      setIsAdding(false);
    },
    goToAdd = () => {
      setIsAdding(true);
    };

  return (
    <TearsStateProvider>
      <div className="tears">
        {!isAdding && <TearsHome addPressed={goToAdd} />}
        {isAdding && <TearsAdd backPressed={back} savePressed={back} />}
      </div>
    </TearsStateProvider>
  );
}
