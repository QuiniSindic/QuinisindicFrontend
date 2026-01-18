// import { getAllPredictions } from '@/services/database.service';

export default async function PredictionsPage() {
  return <h1>Predictions</h1>;
  //   const predictions = await getAllPredictions();
  //   console.log(predictions);
  //   return (
  //     <div className="p-6 min-h-screen">
  //       <div className="flex items-center justify-between mb-4">
  //         <h1 className="text-2xl font-bold">Predictions Page</h1>
  //         {/* <div className="flex items-center space-x-2">
  //           <label>{showAllUsers ? "All Users" : "Your Predictions"}</label>
  //           <Link href={`?allUsers=${!showAllUsers}`}>
  //             <input type="checkbox" checked={showAllUsers} readOnly />
  //           </Link>
  //         </div> */}
  //       </div>
  //       {/*
  //       {showAllUsers && (
  //         <div className="grid grid-cols-3 gap-3 mb-4">
  //           <select
  //             value={sport}
  //             onChange={() => {}}
  //             className="border rounded-sm p-2"
  //           >
  //             <option value="">Select Sport</option>
  //             <option value="football"><Link href={`?allUsers=true&sport=football`}>Football</Link></option>
  //             <option value="basketball"><Link href={`?allUsers=true&sport=basketball`}>Basketball</Link></option>
  //             <option value="tennis"><Link href={`?allUsers=true&sport=tennis`}>Tennis</Link></option>
  //             <option value="f1"><Link href={`?allUsers=true&sport=f1`}>F1</Link></option>
  //           </select>
  //           <select
  //             value={competition}
  //             onChange={() => {}}
  //             className="border rounded-sm p-2"
  //           >
  //             <option value="">Select Competition</option>
  //             <option value="laliga"><Link href={`?allUsers=true&sport=${sport}&competition=laliga`}>La Liga</Link></option>
  //             <option value="premier"><Link href={`?allUsers=true&sport=${sport}&competition=premier`}>Premier League</Link></option>
  //             <option value="nba"><Link href={`?allUsers=true&sport=${sport}&competition=nba`}>NBA</Link></option>
  //           </select>
  //           <select
  //             value={event}
  //             onChange={() => {}}
  //             className="border rounded-sm p-2"
  //           >
  //             <option value="">Select Event</option>
  //             <option value="event1"><Link href={`?allUsers=true&sport=${sport}&competition=${competition}&event=event1`}>Event 1</Link></option>
  //             <option value="event2"><Link href={`?allUsers=true&sport=${sport}&competition=${competition}&event=event2`}>Event 2</Link></option>
  //             <option value="event3"><Link href={`?allUsers=true&sport=${sport}&competition=${competition}&event=event3`}>Event 3</Link></option>
  //           </select>
  //         </div>
  //       )} */}
  //       <div className="grid grid-cols-1 gap-4">
  //         {predictions.length === 0 && <p>No predictions available.</p>}
  //         {predictions.map((prediction) => (
  //           <div key={prediction.id} className="border rounded-sm p-4">
  //             <div className="mb-2">
  //               <p>{prediction.profiles.username}</p>
  //               <strong>{prediction.event_name}</strong>
  //               <div className="text-sm text-gray-500">
  //                 Futbol - La Liga
  //                 {/* {prediction.sport} - {prediction.competition} */}
  //               </div>
  //             </div>
  //             <div>
  //               <p>
  //                 {prediction.prediction.home_score} -{' '}
  //                 {prediction.prediction.away_score}
  //               </p>
  //               {/* {showAllUsers && (
  //                 <p className="text-sm text-gray-500 mt-2">
  //                   By: {prediction.username}
  //                 </p>
  //               )} */}
  //             </div>
  //           </div>
  //         ))}
  //       </div>
  //     </div>
  //   );
}
