import { Main } from "./components/main/main";
import "./App.scss";
import { TagsProvider } from "./assets/services/tags/tagsService";
import { StatsProvider } from "./assets/services/stats/statsService";

export function App() {
  return (
    <StatsProvider>
      <TagsProvider>
        <Main></Main>
      </TagsProvider>
    </StatsProvider>
  );
}
