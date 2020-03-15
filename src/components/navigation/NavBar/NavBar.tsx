import { BrowserRouter, Route } from 'inferno-router'
import { HomePage } from "../../views/HomePage";
import { GamesPage } from "../../views/GamesPage";
import './syles.scss'
import { NavButton } from "./NavButton";

export const NavBar = () => (
    <BrowserRouter>
        <div class="container">
            <div class="nav-bar">
                <NavButton name="Home" link="/"/>
                <NavButton name="Games" link="/games"/>
            </div>
            <div class="content">
                <Route exact path="/" component={ HomePage }/>
                <Route path="/games" component={ GamesPage }/>
            </div>
        </div>
    </BrowserRouter>
);
