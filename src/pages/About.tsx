const TECHNOLOGIES: string[] = [
  "React",
  "TypeScript",
  "Vite",
  "React Router",
  "REST Countries API",
  "CSS",
];

export default function About() {
  return (
    <section>
      <header className="page__header">
        <h1 className="page__title">About Countries Explorer</h1>
      </header>

      <div className="about">
        <div className="panel">
          <h2>About this project</h2>
          <p>
            Countries Explorer is a React + TypeScript app that lets users browse countries,
            explore their details, save favorite countries, and review search history. It is
            designed to provide a clean and interactive way to discover information about the
            world in one place.
          </p>
          <ul className="tech-list" aria-label="Technologies used">
            {TECHNOLOGIES.map((tech) => (
              <li key={tech}>{tech}</li>
            ))}
          </ul>
        </div>

        <div className="panel">
          <h2>Developer</h2>
          <dl className="dev-details">
            <dt>Name</dt>
            <dd>Anan Abdo</dd>
            <dt>GitHub</dt>
            <dd>
              <a href="https://github.com/Ananabdo" target="_blank" rel="noreferrer">
                github.com/Ananabdo
              </a>
            </dd>
          </dl>
        </div>
      </div>
    </section>
  );
}
