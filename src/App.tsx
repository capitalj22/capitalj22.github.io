import { Main } from "./components/main/main";
import "./App.scss";
import { StatsProvider } from "./providers/stats/statsProvider";
import { TagsProvider } from "./providers/tags/tagsProvider";
import { AbilitiesProvider } from "./providers/abilities/abilitiesProvider";
import { BuildProvider } from "./providers/build/buildProvider";
import { NodesProvider } from "./providers/nodes/nodesProvider";
import { ThemeProvider } from "./providers/theme.provider";

export function App() {
  return (
    <ThemeProvider>
      <NodesProvider>
        <BuildProvider>
          <AbilitiesProvider>
            <StatsProvider>
              <TagsProvider>
                <Main></Main>
              </TagsProvider>
            </StatsProvider>
          </AbilitiesProvider>
        </BuildProvider>
      </NodesProvider>
    </ThemeProvider>
  );
}
