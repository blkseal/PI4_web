import "./exames.css";

export default function Exames() {
  const exames = [
    { id: 1, nome: "Exame_20-08-2025" },
    { id: 2, nome: "Exame_12-08-2025" },
    { id: 3, nome: "Exame_01-07-2025" },
    { id: 4, nome: "Exame_15-06-2025" },
    { id: 5, nome: "Exame_20-05-2025" },
  ];

  return (
    <div className="exames-page">
      <h1 className="exames-title">Exames</h1>

      <div className="exames-list">
        {exames.map((exame) => (
          <div key={exame.id} className="exame-card">
            {exame.nome}
          </div>
        ))}
      </div>
    </div>
  );
}
