import { Component } from 'inferno';
import * as BannerGameScript from './BannerGameScript';

export class BannerGame extends Component {

    public componentDidMount() {
        BannerGameScript.init();
    }

    public render() {
        return (
            <div id="footer-canvas"/>
        );
    }
}
