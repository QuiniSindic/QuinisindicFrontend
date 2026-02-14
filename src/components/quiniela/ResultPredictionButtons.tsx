export default function ResultPredictionButtons() {
  const buttons = ['0', '1', '2', 'M'];

  return (
    <div className="flex justify-center gap-4">
      <div className="flex gap-1">
        {buttons.map((gol) => (
          <button
            key={`local-${gol}`}
            // onClick={() => handlePrediccionGoles(index, "local", gol)}
            // className={`w-8 h-8 rounded-full border ${
            //   prediccion.local === gol
            //     ? "bg-secondary text-white"
            //     : "bg-foreground-50 hover:bg-secondary"
            // }`}
          >
            {gol}
          </button>
        ))}
      </div>
      <div className="border-l border-gray-300 mx-1"></div>
      <div className="flex gap-1">
        {buttons.map((gol) => (
          <button
            key={`visitante-${gol}`}
            // onClick={() => handlePrediccionGoles(index, "visitante", gol)}
            // className={`w-8 h-8 rounded-full border ${
            //   prediccion.visitante === gol
            //     ? "bg-secondary text-white"
            //     : "bg-foreground-50 hover:bg-secondary"
            // }`}
          >
            {gol}
          </button>
        ))}
      </div>
    </div>
  );
}
