// import { QUINIELA_DATA_URL } from '@/core/config';
// import { QuinielaData, QuinielaResponse } from '@/types/quiniela.types';
// import { createClient } from '@/utils/supabase/server';
// import axios from 'axios';

// export const getQuinielaData = async (): Promise<QuinielaResponse | []> => {
//   const supabase = await createClient();
//   const maxDays = 7;

//   try {
//     // 1. Precalculamos todas las fechas posibles
//     const dates = Array.from({ length: maxDays }, (_, i) => {
//       const date = new Date();
//       date.setDate(date.getDate() + i);
//       return {
//         queryDate: date.toISOString().split('T')[0], // YYYY-MM-DD
//         formattedDate: date.toISOString().split('T')[0].replace(/-/g, ''), // YYYYMMDD
//       };
//     });

//     // 2. Consulta única a Supabase para todas las fechas
//     const { data: supabaseResults } = await supabase
//       .from('quinielas')
//       .select('*')
//       .in(
//         'fecha_sorteo::date',
//         dates.map((d) => d.queryDate),
//       )
//       .order('fecha_sorteo', { ascending: true });

//     if (supabaseResults?.length) {
//       return {
//         data: supabaseResults[0].data,
//         date: supabaseResults[0].fecha_sorteo,
//       };
//     }

//     // 3. Búsqueda iterativa en la API con caché automático
//     for (const date of dates) {
//       try {
//         const url = `${QUINIELA_DATA_URL}${date.formattedDate}`;
//         const response = await axios.get<QuinielaData[] | string>(url, {
//           headers: {
//             'User-Agent':
//               'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
//           },
//         });

//         const data = response.data;

//         if (
//           data ===
//           'No se ha encontrado ningún registro para los parámetros introducidos.'
//         ) {
//           continue;
//         }

//         const quinielaData = data as QuinielaData[];

//         // 4. Cachear en Supabase para futuras consultas
//         await supabase.from('quinielas').upsert(
//           [
//             {
//               fecha_sorteo: date.queryDate,
//               data: quinielaData[0],
//               updated_at: new Date().toISOString(),
//             },
//           ],
//           {
//             onConflict: 'fecha_sorteo',
//           },
//         );

//         return {
//           data: quinielaData[0],
//           date: date.formattedDate,
//         };
//       } catch (error) {
//         console.error(`Error en fecha ${date.formattedDate}:`, error);
//         continue;
//       }
//     }

//     return [];
//   } catch (error) {
//     console.error('Error general:', error);
//     return [];
//   }
// };
