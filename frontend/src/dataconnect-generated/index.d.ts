import { ConnectorConfig, DataConnect, QueryRef, QueryPromise, MutationRef, MutationPromise } from 'firebase/data-connect';

export const connectorConfig: ConnectorConfig;

export type TimestampString = string;
export type UUIDString = string;
export type Int64String = string;
export type DateString = string;




export interface CreateProfileLinkData {
  profileLink_insert: ProfileLink_Key;
}

export interface CreateProfileLinkVariables {
  linkId: string;
}

export interface GetMyMessagesData {
  messages: ({
    id: UUIDString;
    content: string;
    createdAt: TimestampString;
    senderIp?: string | null;
    recipient: {
      username: string;
    };
  } & Message_Key)[];
}

export interface ListAllUsersData {
  users: ({
    id: UUIDString;
    username: string;
    displayName?: string | null;
    profilePictureUrl?: string | null;
    createdAt: TimestampString;
  } & User_Key)[];
}

export interface Message_Key {
  id: UUIDString;
  __typename?: 'Message_Key';
}

export interface ProfileLink_Key {
  id: UUIDString;
  __typename?: 'ProfileLink_Key';
}

export interface SendMessageData {
  message_insert: Message_Key;
}

export interface SendMessageVariables {
  recipientId: UUIDString;
  content: string;
}

export interface User_Key {
  id: UUIDString;
  __typename?: 'User_Key';
}

interface ListAllUsersRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListAllUsersData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListAllUsersData, undefined>;
  operationName: string;
}
export const listAllUsersRef: ListAllUsersRef;

export function listAllUsers(): QueryPromise<ListAllUsersData, undefined>;
export function listAllUsers(dc: DataConnect): QueryPromise<ListAllUsersData, undefined>;

interface GetMyMessagesRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<GetMyMessagesData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<GetMyMessagesData, undefined>;
  operationName: string;
}
export const getMyMessagesRef: GetMyMessagesRef;

export function getMyMessages(): QueryPromise<GetMyMessagesData, undefined>;
export function getMyMessages(dc: DataConnect): QueryPromise<GetMyMessagesData, undefined>;

interface CreateProfileLinkRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateProfileLinkVariables): MutationRef<CreateProfileLinkData, CreateProfileLinkVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateProfileLinkVariables): MutationRef<CreateProfileLinkData, CreateProfileLinkVariables>;
  operationName: string;
}
export const createProfileLinkRef: CreateProfileLinkRef;

export function createProfileLink(vars: CreateProfileLinkVariables): MutationPromise<CreateProfileLinkData, CreateProfileLinkVariables>;
export function createProfileLink(dc: DataConnect, vars: CreateProfileLinkVariables): MutationPromise<CreateProfileLinkData, CreateProfileLinkVariables>;

interface SendMessageRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: SendMessageVariables): MutationRef<SendMessageData, SendMessageVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: SendMessageVariables): MutationRef<SendMessageData, SendMessageVariables>;
  operationName: string;
}
export const sendMessageRef: SendMessageRef;

export function sendMessage(vars: SendMessageVariables): MutationPromise<SendMessageData, SendMessageVariables>;
export function sendMessage(dc: DataConnect, vars: SendMessageVariables): MutationPromise<SendMessageData, SendMessageVariables>;

