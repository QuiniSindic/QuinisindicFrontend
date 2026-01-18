'use client';

export default function QuinielaPage() {
  // //   const [quinielaData, setQuinielaData] = React.useState([]);
  // //   const [message, setMessage] = React.useState('');
  // const [loading, setLoading] = React.useState(true);
  // const [error, setError] = React.useState('');
  // const [jornada, setJornada] = React.useState<string>('');
  // const [partidos, setPartidos] = React.useState<Partido[]>([]);
  // // eslint-disable-next-line @typescript-eslint/no-unused-vars
  // const [predictions, setPredictions] = React.useState<string[]>([]);

  // React.useEffect(() => {
  //   const fetchQunielaData = async () => {
  //     setLoading(true);
  //     const response = await fetch('/api/quiniela');

  //     if (!response.ok) {
  //       setLoading(false);
  //       const { error } = await response.json();
  //       setError(error);
  //     }

  //     const data: {
  //       quinielaData: QuinielaResponse;
  //     } = await response.json();

  //     const {
  //       quinielaData: { data: quinielaData },
  //     } = data;

  //     const { partidos, jornada } = quinielaData;
  //     setJornada(jornada);
  //     setPartidos(partidos);

  //     setLoading(false);
  //   };

  //   fetchQunielaData();
  // }, []);

  return (
    <div className="container mx-auto px-4 py-4 min-h-screen">
      <h1 className="text-3xl font-bold text-center mb-2">Quiniela</h1>
      {/* <h2 className="text-xl text-center mb-2">Jornada {jornada}</h2>

      {loading && <p>Cargando...</p>}
      {error && <p>{error}</p>}

      <Predictions partidos={partidos} predictions={predictions} /> */}
    </div>
  );
}
