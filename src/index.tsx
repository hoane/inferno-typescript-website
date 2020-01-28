import { Component, render } from 'inferno';
import { BannerGame } from './components/bannergame/BannerGame';
import { Bio } from './components/Bio';
import './favicon.ico';
import './main.scss';

const container = document.getElementById('app');

class App extends Component<any, any> {

    constructor(props, context) {
        super(props, context);
    }

    public render() {
        return (
            <div>
                <h1>{`Brandon Hoane's Website`}</h1>
                <Bio />
                <BannerGame/>
            </div>
        );
    }
}

render(<App />, container);
