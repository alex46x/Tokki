import { ListAllUsersData, GetMyMessagesData, CreateProfileLinkData, CreateProfileLinkVariables, SendMessageData, SendMessageVariables } from '../';
import { UseDataConnectQueryResult, useDataConnectQueryOptions, UseDataConnectMutationResult, useDataConnectMutationOptions} from '@tanstack-query-firebase/react/data-connect';
import { UseQueryResult, UseMutationResult} from '@tanstack/react-query';
import { DataConnect } from 'firebase/data-connect';
import { FirebaseError } from 'firebase/app';


export function useListAllUsers(options?: useDataConnectQueryOptions<ListAllUsersData>): UseDataConnectQueryResult<ListAllUsersData, undefined>;
export function useListAllUsers(dc: DataConnect, options?: useDataConnectQueryOptions<ListAllUsersData>): UseDataConnectQueryResult<ListAllUsersData, undefined>;

export function useGetMyMessages(options?: useDataConnectQueryOptions<GetMyMessagesData>): UseDataConnectQueryResult<GetMyMessagesData, undefined>;
export function useGetMyMessages(dc: DataConnect, options?: useDataConnectQueryOptions<GetMyMessagesData>): UseDataConnectQueryResult<GetMyMessagesData, undefined>;

export function useCreateProfileLink(options?: useDataConnectMutationOptions<CreateProfileLinkData, FirebaseError, CreateProfileLinkVariables>): UseDataConnectMutationResult<CreateProfileLinkData, CreateProfileLinkVariables>;
export function useCreateProfileLink(dc: DataConnect, options?: useDataConnectMutationOptions<CreateProfileLinkData, FirebaseError, CreateProfileLinkVariables>): UseDataConnectMutationResult<CreateProfileLinkData, CreateProfileLinkVariables>;

export function useSendMessage(options?: useDataConnectMutationOptions<SendMessageData, FirebaseError, SendMessageVariables>): UseDataConnectMutationResult<SendMessageData, SendMessageVariables>;
export function useSendMessage(dc: DataConnect, options?: useDataConnectMutationOptions<SendMessageData, FirebaseError, SendMessageVariables>): UseDataConnectMutationResult<SendMessageData, SendMessageVariables>;
