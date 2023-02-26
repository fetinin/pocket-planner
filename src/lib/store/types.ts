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

export type RoomsTasksRecord = {
	description: string
	vote?: number
	room_id: RecordIdString
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
export type RoomsResponse<Texpand = unknown> = RoomsRecord & BaseSystemFields<Texpand>
export type RoomsTasksResponse<Texpand = unknown> = RoomsTasksRecord & BaseSystemFields<Texpand>
export type RoomsVotersResponse<Texpand = unknown> = RoomsVotersRecord & BaseSystemFields<Texpand>
export type UsersResponse = UsersRecord & AuthSystemFields
export type VotersResponse = VotersRecord & BaseSystemFields

export type CollectionRecords = {
	rooms: RoomsRecord
	rooms_tasks: RoomsTasksRecord
	rooms_voters: RoomsVotersRecord
	users: UsersRecord
	voters: VotersRecord
}