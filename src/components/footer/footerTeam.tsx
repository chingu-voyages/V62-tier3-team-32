const teamMembers = [
  { name: "Alex Thomas · Scrum Master", href: "https://linkedin.com/in/ajt11176" },
  { name: "Vandna Kapoor · Developer", href: "https://www.linkedin.com/in/vandnakapoor" },
  { name: "Alex Njaiya · Developer", href: "https://www.linkedin.com/in/alex-njaiya" },
  { name: "Alex Takamizawa · Developer", href: "https://linkedin.com/in/atakamizawa" },
  { name: "Hasan Sammour · Developer", href: "https://www.linkedin.com/in/hasan-sammour-72657a3a1/" },
  { name: "Bathshua Bradley · Shadow Scrum Master", href: "https://linkedin.com/in/bathshuabradley/" },
];

export default function FooterTeam() {
  return (
    <div className="footer-column footer-column-team">
      <h3>About the team</h3>

      <ul className="team-list">
        {teamMembers.map((member) => (
          <li key={member.name}>
            <a href={member.href} target="_blank" rel="noopener noreferrer" className="team-link">
              {member.name}
            </a>
          </li>
        ))}
      </ul>

      <div className="footer-actions">
        <button type="button" className="team-button">
          About the team
          <span className="action-icon">↗</span>
        </button>

        <a href="#" className="github-link">
          GitHub repository
          <span className="github-icon">↗</span>
        </a>
      </div>
    </div>
  );
}
