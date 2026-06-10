// sport values -> ('football', 'basketball', 'tennis', 'motorsport')
// league values -> ('Bundesliga', 'DFB+Pokal') //FIX: arreglar espacios
// competition_id values -> ('54', '209') // FIX: creo que no es necesario
// status values -> ('live', 'upcoming')
export type SearchParamValue = string | string[] | undefined; // TODO: tipar mejor, creo que no llegan arrays

// EJ: {"sport": "football", "league": "Bundesliga","competition_id": "54", "status": "live"}
export type SearchParamRecord = Record<string, SearchParamValue>; // status: live/upcoming

export type SearchParams = Promise<SearchParamRecord>;
