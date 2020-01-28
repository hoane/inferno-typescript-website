import { Component, render } from 'inferno';
import './main.scss';
import { Bio } from './components/Bio';
import { BannerGame } from './components/bannergame/BannerGame'
import './favicon.ico'

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
