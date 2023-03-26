import { Accordion } from "../../../layout/accordion/accordion";
const example1 = `{myParam}This only appears when 'myParam' is at least 1{/myParam}`;
const example2 = "%myParam% will be replaced with the value of 'myParam'";
const example3 = `You make 1 melee attack against an adjacent enemy. Roll 1d6{dmg}+%dmg%{/dmg} and do that much damage.`;

export function HelpPanel() {
  return (
    <div>
      <Accordion name="Description Syntax" startOpen={false}>
        <div className="padding-md" style={{ textAlign: "left" }}>
          <h3>Condition</h3>
          <p>{example1}</p>
          <h3>Value</h3>
          <p>{example2}</p>
          <h3>Example</h3>
          <p>{example3}</p>
        </div>
      </Accordion>
      <Accordion name="Hotkeys" startOpen={true}>
        <div className="padding-md" style={{ textAlign: "left" }}>
          <p>
            <ul>
              <li><span className="bold">Shift + E</span> - Toggle Edit Mode</li>
              <li><span className="bold">Shift + F</span> - Toggle Fast Build Mode</li>
            </ul>
          </p>
        </div>
      </Accordion>
    </div>
  );
}
