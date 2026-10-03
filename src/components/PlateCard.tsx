import { Link } from 'react-router-dom';
import type { Project } from '../data/projects';
import { LivePreview } from './LivePreview';

export function PlateCard({ project }: { project: Project }) {
  return (
    <Link className="plate" to={`/projects/${project.slug}`}>
      <div className="plate-art">
        <LivePreview
          poster={project.poster}
          reel={project.reel}
          alt={`${project.title} live site`}
        />
      </div>
      <div className="plate-foot">
        <div>
          <h3>{project.title}</h3>
          <p>{project.subtitle}</p>
        </div>
        <span className="idx">{project.index}</span>
      </div>
    </Link>
  );
}
