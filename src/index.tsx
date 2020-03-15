import { Component, render } from 'inferno';
import './favicon.ico';
import './main.scss';
import { NavBar } from "./components/navigation/NavBar";

const container = document.getElementById('app');

class App extends Component<any, any> {

    constructor(props, context) {
        super(props, context);
    }

    public render() {
        return (
            <div>
                <NavBar/>
            </div>
        );
    }
}

render(<App />, container);
