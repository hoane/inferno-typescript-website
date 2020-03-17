import { GamesList, GameItem, getGames } from "../../network/GamesClient";
import { Component } from "inferno";

export const GameButton = (props: {game: GameItem}) => (
    <div>
        <div>{props.game.name}</div>
    </div>
);

export const LoadedGamesPage = (props: {games: GamesList}) => {
    const items = props.games.items;
    const buttons = items.map(game => <GameButton game={game}/>);
    return (
        <div>
            <h1>Found {props.games.count} Games</h1>
            <ol>
                {buttons}
            </ol>
        </div>
    );
};

interface GamesPageState {
    games: GamesList | 'loading' | 'failed'
}

export class GamesPage extends Component<{}, GamesPageState> {
    constructor() {
        super();
        this.state = {
            games: 'loading'
        };
    }

    async componentDidMount() {
        try {
            const games = await getGames();
            this.setState({games: games});
        } catch {
            this.setState({games: 'failed'});
        }
    }

    render() {
        if (this.state.games == 'loading') {
            return (<div/>);
        } else if (this.state.games == 'failed') {
            return (<h2>Error</h2>)
        } else {
            return (<LoadedGamesPage games={this.state.games}/>);
        }
    }
}
