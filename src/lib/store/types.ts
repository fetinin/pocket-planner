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

// System fields
export type BaseSystemFields = {
	id: RecordIdString
	created: IsoDateString
	updated: IsoDateString
	collectionId: string
	collectionName: Collections
	expand?: { [key: string]: any }
}

export type AuthSystemFields = {
	email: string
	emailVisibility: boolean
	username: string
	verified: boolean
} & BaseSystemFields

// Record types for each collection

export type RoomsRecord = {
	creator_id: RecordIdString
	public_id?: string
}

export type RoomsTasksRecord<Tvotes = unknown> = {
	title: string
	description: string
	votes?: null | Tvotes
}

export type RoomsVotersRecord = {
	voter_id: RecordIdString
	room_id: RecordIdString
}

export type UsersRecord = {
	name?: string
	avatar?: string
}

export type VotersRecord = {
	nickname: string
}

// Response types include system fields and match responses from the PocketBase API
export type RoomsResponse = RoomsRecord & BaseSystemFields
export type RoomsTasksResponse<Tvotes = unknown> = RoomsTasksRecord<Tvotes> & BaseSystemFields
export type RoomsVotersResponse = RoomsVotersRecord & BaseSystemFields
export type UsersResponse = UsersRecord & AuthSystemFields
export type VotersResponse = VotersRecord & BaseSystemFields

export type CollectionRecords = {
	rooms: RoomsRecord
	rooms_tasks: RoomsTasksRecord
	rooms_voters: RoomsVotersRecord
	users: UsersRecord
	voters: VotersRecord
}