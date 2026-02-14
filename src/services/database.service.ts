// export async function updateUserPoints(
//   profileId: string,
//   competitionId: number,
//   eventId: number,
//   points: number,
// ) {
//   const supabase = createClient();
//   const { data: predictionData, error: predictionError } = await supabase
//     .from('predictions')
//     .update({ points })
//     .eq('profile_id', profileId)
//     .eq('event_id', eventId)
//     .eq('competition_id', competitionId);

//   if (predictionError) {
//     throw new Error(predictionError.message);
//   }

//   const { data: totalPointsData, error: totalPointsError } = await supabase
//     .from('user_competition_points')
//     .update({ total_points: points })
//     .eq('user_id', profileId)
//     .eq('competition_id', competitionId);

//   if (totalPointsError) {
//     throw new Error(totalPointsError.message);
//   }

//   return { predictionData, totalPointsData };
// }

// export async function getLeaderboard(
//   competitionId: number,
// ): Promise<UserProfile[]> {
//   const supabase = createClient();
//   const { data, error } = await supabase
//     .from('user_competition_points')
//     .select('*, profiles (username)')
//     .eq('competition_id', competitionId)
//     .order('total_points', { ascending: false });

//   if (error) {
//     throw new Error(error.message);
//   }

//   return data;
// }
