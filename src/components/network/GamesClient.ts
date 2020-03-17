import axios from 'axios'

const endpoint = "https://api.brandonhoane.com";
const gamesPath = "/games";

export interface GameItem {
    path: string,
    name: string
}

export interface GamesList {
    count: number,
    items: GameItem[]
}

const getHelper = async (host: string, path: string): Promise<any> => {
    const res = await axios.get(`${host}${path}`);
    return res.data;
};

export const getGames = async () => {
    const body: GamesList = await getHelper(endpoint, gamesPath);
    return body;
};
