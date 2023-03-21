import { Main } from "./components/main/main";
import "./App.scss";
import { StatsProvider } from "./providers/stats/statsProvider";
import { TagsProvider } from "./providers/tags/tagsProvider";

export function App() {
  return (
    <StatsProvider>
      <TagsProvider>
        <Main></Main>
      </TagsProvider>
    </StatsProvider>
  );
}
