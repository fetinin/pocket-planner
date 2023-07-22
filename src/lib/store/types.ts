/**
* This file was @generated using pocketbase-typegen
*/

export enum Collections {
	Rooms = "rooms",
	RoomsTasks = "rooms_tasks",
	RoomsVoters = "rooms_voters",
	Users = "users",
	Voters = "voters",
}

// Alias types for improved usability
export type IsoDateString = string
export type RecordIdString = string
export type HTMLString = string

// System fields
export type BaseSystemFields<T = never> = {
	id: RecordIdString
	created: IsoDateString
	updated: IsoDateString
	collectionId: string
	collectionName: Collections
	expand?: T
}

export type AuthSystemFields<T = never> = {
	email: string
	emailVisibility: boolean
	username: string
	verified: boolean
} & BaseSystemFields<T>

// Record types for each collection

export type RoomsRecord = {
	creator_id: RecordIdString
	public_id?: string
}

export type RoomsTasksRecord<Tvote_by_role = unknown> = {
	description: string
	vote?: number
	room_id: RecordIdString
	vote_by_role?: null | Tvote_by_role
}

export enum RoomsVotersRoleOptions {
	"dev" = "dev",
	"qa" = "qa",
	"observer" = "observer",
}
export type RoomsVotersRecord = {
	voter_id: RecordIdString
	room_id: RecordIdString
	vote?: number
	role?: RoomsVotersRoleOptions
}

export type UsersRecord = {
	name?: string
	avatar?: string
}

export type VotersRecord = {
	nickname: string
}

// Response types include system fields and match responses from the PocketBase API
export type RoomsResponse<Texpand = unknown> = Required<RoomsRecord> & BaseSystemFields<Texpand>
export type RoomsTasksResponse<Tvote_by_role = unknown, Texpand = unknown> = Required<RoomsTasksRecord<Tvote_by_role>> & BaseSystemFields<Texpand>
export type RoomsVotersResponse<Texpand = unknown> = Required<RoomsVotersRecord> & BaseSystemFields<Texpand>
export type UsersResponse<Texpand = unknown> = Required<UsersRecord> & AuthSystemFields<Texpand>
export type VotersResponse<Texpand = unknown> = Required<VotersRecord> & BaseSystemFields<Texpand>

// Types containing all Records and Responses, useful for creating typing helper functions

export type CollectionRecords = {
	rooms: RoomsRecord
	rooms_tasks: RoomsTasksRecord
	rooms_voters: RoomsVotersRecord
	users: UsersRecord
	voters: VotersRecord
}

export type CollectionResponses = {
	rooms: RoomsResponse
	rooms_tasks: RoomsTasksResponse
	rooms_voters: RoomsVotersResponse
	users: UsersResponse
	voters: VotersResponse
}