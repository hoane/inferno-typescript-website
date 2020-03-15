import { Link } from "inferno-router";

export interface NavButtonProps {
    name: string,
    link: string
}

export const NavButton = (props: NavButtonProps) => (
    <div class="nav-button">
        <Link to={props.link} class="nav-text">
            {props.name}
        </Link>
    </div>
);
