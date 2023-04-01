import "./App.less";
import MainRouter from "./MainRouter";
import { AppHeader } from "./config/Util";

function App() {
    return (
        <div className="App">
            <AppHeader />
            <MainRouter />
        </div>
    );
}

export default App;
