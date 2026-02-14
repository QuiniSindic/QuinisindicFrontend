export default function NormalPredictionButtons() {
  const buttons = ['1', 'X', '2'];

  return (
    <div className="flex gap-2 justify-center min-w-[120px]">
      {buttons.map((opcion) => (
        <button
          key={opcion}
          //   onClick={() => handlePrediccion(index, opcion)}
          //   className={`w-8 h-8 rounded-full border ${
          //     predicciones[index] === opcion
          //       ? "bg-secondary text-white"
          //       : "bg-foreground-50 hover:bg-secondary"
          //   }`}
        >
          {opcion}
        </button>
      ))}
    </div>
  );
}
