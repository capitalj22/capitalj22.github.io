import { Accordion } from "../../../layout/accordion/accordion";

const conditionalParam = `{myParam}This only appears when 'myParam' is at least 1{/myParam}`;
const valueParam = "%myParam% will be replaced with the value of 'myParam'";
const localAbility = `You make 1 melee attack against an adjacent enemy. Roll 1d6{dmg}+%dmg%{/dmg} and do that much damage.`;

const gconditionalParam = `{@myParam}This only appears when 'myParam' is at least 1{/myParam}`;
const gvalueParam = "%@myParam% will be replaced with the value of 'myParam'";
const glocalAbility = `You make 1 melee attack against an adjacent enemy. Roll 1d6{dmg}+%dmg%{/dmg} and do that much damage.`;

export function HelpPanel() {
  return (
    <div className="help">
      <Accordion name="Description Syntax" startOpen={false}>
        <div className="padding-md" style={{ textAlign: "left" }}>
          <h2 className="text-info book">Ability Params:</h2>
          <h3>Condition</h3>
          <p>{conditionalParam}</p>
          <h3>Value</h3>
          <p>{valueParam}</p>
          <h3>Example</h3>
          <p>{localAbility}</p>

          <h2 className="text-info book">Global Params:</h2>
          <h3>Condition</h3>
          <p>{gconditionalParam}</p>
          <h3>Value</h3>
          <p>{gvalueParam}</p>
          <h3>Example</h3>
          <p>{glocalAbility}</p>
        </div>
      </Accordion>
      <Accordion name="Hotkeys" startOpen={true}>
        <div className="padding-md" style={{ textAlign: "left" }}>
          <ul>
            <li>
              <span className="bold">Shift + E</span> - Toggle Edit Mode
            </li>
            <li>
              <span className="bold">Shift + F</span> - Toggle Fast Build Mode
            </li>
          </ul>
        </div>
      </Accordion>
    </div>
  );
}
