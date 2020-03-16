import { Link } from "inferno-router";

export interface NavButtonProps {
    name: string,
    link: string
}

export const NavButton = (props: NavButtonProps) => (
        <Link to={props.link} class="nav-text">
            <div class="nav-button">
                {props.name}
            </div>
        </Link>
);
