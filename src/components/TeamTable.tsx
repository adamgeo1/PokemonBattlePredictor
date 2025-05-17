import React from "react";
import {Pokemon} from "../../backend/express/src/services/Pokemon.ts";

type TeamTableProps = {
    team: Pokemon[]
};

const chunkIntoRows = <T,>(arr: T[], size: number): T[][] => {
  const rows: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    rows.push(arr.slice(i, i + size));
  }
  return rows;
};

const TeamTable: React.FC<TeamTableProps> = ({ team }) => {
    const rows = chunkIntoRows(team, 3)
    return (
        <table>
            <tbody>
            {rows.map((row, rowIndex) => (
                <tr key={rowIndex}>
                    {row.map((mon) => (
                        <td key={mon.id}>
                            <div style={{ marginTop: '1rem', textAlign: 'center' }}>
                                <h2>{mon.name}</h2>
                                <img src={mon.sprite} alt={mon.name} />
                                <p>Types: {mon.types.join(', ')}</p>
                                <p>Abilities: {mon.abilities.join(', ')}</p>
                                <ul>
                                    {Object.entries(mon.baseStats).map(([stat, val]) => (
                                        <li key={stat}>{stat}: {val}</li>
                                    ))}
                                </ul>
                            </div>
                        </td>
                    ))}
                    {Array.from({ length: 3 - row.length }).map((_, i) => (
                        <td key={`empty-${i}`} />
                    ))}
                </tr>
            ))}
            </tbody>
        </table>
    );
};

export default TeamTable;