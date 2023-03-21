import { Main } from "./components/main/main";
import "./App.scss";
import { StatsProvider } from "./providers/stats/statsProvider";
import { TagsProvider } from "./providers/tags/tagsProvider";
import { AbilitiesProvider } from "./providers/abilities/abilitiesProvider";

export function App() {
  return (
    <AbilitiesProvider>
      <StatsProvider>
        <TagsProvider>
          <Main></Main>
        </TagsProvider>
      </StatsProvider>
    </AbilitiesProvider>
  );
}
