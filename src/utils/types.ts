export namespace UtilTypes {
  export type RoomPayload = {
    room_no: number;
    timestamp: number;
  };
  export type MemberPayload = {
    member_no: number;
    timestamp: number;
  };
  export namespace Auth {
    export type CreateMemberToken = (memberNo: number) => string;
    export type DecryptMemberToken = (memberToken: string) => MemberPayload;
    export type CreateRoomToken = (roomNo: number) => string;
    export type DecryptRoomToken = (roomToken: string) => RoomPayload;
  }
}