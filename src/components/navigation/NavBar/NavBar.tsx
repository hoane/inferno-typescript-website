import { BrowserRouter, Route, Switch } from 'inferno-router'
import { HomePage } from "../../views/HomePage";
import { LivePage } from "../../views/LivePage";
import { GamesPage } from "../../views/GamesPage";
import './syles.scss'
import { NavButton } from "./NavButton";

const NoMatchPage = () => (
    <h1>404 Not Found</h1>
);

export const NavBar = () => (
    <BrowserRouter>
        <div class="container">
            <div class="nav-bar">
                <NavButton name="Home" link="/"/>
                <NavButton name="Live" link="/live"/>
                <NavButton name="Games" link="/games"/>
            </div>
            <div class="content">
                <Switch>
                    <Route exact path="/" component={ HomePage }/>
                    <Route path="/live" component={ LivePage }/>
                    <Route path="/games" component={ GamesPage }/>
                    <Route component={ NoMatchPage }/>
                </Switch>
            </div>
        </div>
    </BrowserRouter>
);
