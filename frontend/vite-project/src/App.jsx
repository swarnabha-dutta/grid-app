
import { useEffect, useState } from "react";
import "./App.css";
import { io } from "socket.io-client";

const socket = io("https://grid-app-0r27.onrender.com");
const ROWS = 20;
const COLS = 20;

function App() {
    const [grid, setGrid] = useState(
        Array.from({ length: ROWS }, () => Array.from({ length: COLS }, () => null))
    );
    const generateUser = () => {
        const colors = ["#e74c3c", "#3498db", "#2ecc71", "#f1c40f", "#9b59b6"];

        return {
            id: Math.random().toString(36).substring(7),
            color: colors[Math.floor(Math.random() * colors.length)],
        };
    };

    const [user] = useState(() => generateUser());
    const [isCooldown, setIsCooldown] = useState(false);

    const handleClick = (row, col) => {
        if (isCooldown) return;

        if (grid[row][col] === null) {
            socket.emit("claim-cell", { row, col, user });

            setIsCooldown(true);

            setTimeout(() => {
                setIsCooldown(false);
            }, 1000);
        }
    };

    useEffect(() => {
        socket.on("init-grid", (serverGrid) => {
            setGrid(serverGrid);
        });

        socket.on("cell-updated", ({ row, col, user }) => {
            setGrid((prev) => {
                const newGrid = structuredClone(prev);
                newGrid[row][col] = user;
                return newGrid;
            });
        });
        socket.on("cell-rejected", ({ row, col }) => {
            setIsCooldown(false);
        });
        return () => {
            socket.off("init-grid");
            socket.off("cell-updated");
            socket.off("cell-rejected");
        };
    }, []);
    return (
        <div className="container">
            <h2>Grid App</h2>
            <div className="grid">
                {grid.map((row, i) =>
                    row.map((cell, j) => (
                        <div
                            key={`${i}-${j}`}
                            className="cell"
                            onClick={() => handleClick(i, j)}
                            style={{
                                backgroundColor: cell ? cell.color : "#eee",
                                opacity: isCooldown ? 0.6 : 1,
                                pointerEvents: isCooldown ? "none" : "auto",
                            }}
                        ></div>
                    ))
                )}
            </div>
        </div>
    );
}

export default App;
