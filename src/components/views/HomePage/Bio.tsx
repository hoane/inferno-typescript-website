import './Bio.scss';

export interface BioItemProps {
    name: string,
    link: string
}

export const BioItem = (props: BioItemProps) => (
    <div class="bio-div">
        <a href={props.link}>{props.name}</a>
    </div>
);

export const Bio = () => (
    <div class="bio-list">
        <BioItem link="https://www.linkedin.com/in/brandon-hoane-356972187/" name="LinkedIn" />
        <BioItem link="https://twitter.com/inductionist" name="Twitter" />
        <BioItem link="https://github.com/hoane" name="Github" />
        <BioItem link="https://github.com/hoane/inferno-typescript-website" name="Source" />
    </div>
);
