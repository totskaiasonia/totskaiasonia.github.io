import { person } from '../data/person';

export function HeroPortrait() {
  return (
    <figure className="hero-portrait">
      <div className="hero-portrait-frame">
        <span className="hero-portrait-tick" aria-hidden="true" />
        <img
          src={person.portrait}
          alt={`${person.display}, wearing headphones`}
          width={900}
          height={1200}
        />
      </div>
      <figcaption>
        <em>ST · field plate</em>
        <span>{person.location}</span>
      </figcaption>
    </figure>
  );
}
