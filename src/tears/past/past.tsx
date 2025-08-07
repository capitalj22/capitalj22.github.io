import { Cry } from "../tears";
import { TearsEntry } from "./entry";

export function TearsPast() {
  const entries: Cry[] = [
    {
      date: new Date("8/4/2025"),
      where: "home",
      trigger: "stress",
      intensity: 1,
      wasCathartic: true,
    },
    {
      date: new Date("8/2/2025"),
      where: "home",
      trigger: "stress",
      intensity: 2,
      wasCathartic: true,
    },
    {
      date: new Date("8/2/2025"),
      where: "home",
      trigger: "stress",
      intensity: 1,
      wasCathartic: true,
    },
    {
      date: new Date("8/1/2025"),
      where: "home",
      trigger: "stress",
      intensity: 2,
      wasCathartic: true,
    },
    {
      date: new Date("7/30/2025"),
      where: "home",
      trigger: "stress",
      intensity: 4,
      wasCathartic: true,
    },
  ];
  return (
    <div>
      <div className="label">my cries</div>

      <div className="entries">
        {entries.map((entry, index) => (
          <TearsEntry cry={entry} />
        ))}
      </div>
    </div>
  );
}
