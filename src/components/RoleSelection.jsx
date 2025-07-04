export default function RoleSelection({ onSelect }) {
  return (
    <div>
      <p>Select your role:</p>
      <button onClick={() => onSelect("tourist")}>Tourist</button>
      <button onClick={() => onSelect("guide")}>Guide</button>
    </div>
  );
}
