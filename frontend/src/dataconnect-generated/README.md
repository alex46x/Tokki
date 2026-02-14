# Generated TypeScript README
This README will guide you through the process of using the generated JavaScript SDK package for the connector `example`. It will also provide examples on how to use your generated SDK to call your Data Connect queries and mutations.

**If you're looking for the `React README`, you can find it at [`dataconnect-generated/react/README.md`](./react/README.md)**

***NOTE:** This README is generated alongside the generated SDK. If you make changes to this file, they will be overwritten when the SDK is regenerated.*

# Table of Contents
- [**Overview**](#generated-javascript-readme)
- [**Accessing the connector**](#accessing-the-connector)
  - [*Connecting to the local Emulator*](#connecting-to-the-local-emulator)
- [**Queries**](#queries)
  - [*ListAllUsers*](#listallusers)
  - [*GetMyMessages*](#getmymessages)
- [**Mutations**](#mutations)
  - [*CreateProfileLink*](#createprofilelink)
  - [*SendMessage*](#sendmessage)

# Accessing the connector
A connector is a collection of Queries and Mutations. One SDK is generated for each connector - this SDK is generated for the connector `example`. You can find more information about connectors in the [Data Connect documentation](https://firebase.google.com/docs/data-connect#how-does).

You can use this generated SDK by importing from the package `@dataconnect/generated` as shown below. Both CommonJS and ESM imports are supported.

You can also follow the instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#set-client).

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/generated';

const dataConnect = getDataConnect(connectorConfig);
```

## Connecting to the local Emulator
By default, the connector will connect to the production service.

To connect to the emulator, you can use the following code.
You can also follow the emulator instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#instrument-clients).

```typescript
import { connectDataConnectEmulator, getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/generated';

const dataConnect = getDataConnect(connectorConfig);
connectDataConnectEmulator(dataConnect, 'localhost', 9399);
```

After it's initialized, you can call your Data Connect [queries](#queries) and [mutations](#mutations) from your generated SDK.

# Queries

There are two ways to execute a Data Connect Query using the generated Web SDK:
- Using a Query Reference function, which returns a `QueryRef`
  - The `QueryRef` can be used as an argument to `executeQuery()`, which will execute the Query and return a `QueryPromise`
- Using an action shortcut function, which returns a `QueryPromise`
  - Calling the action shortcut function will execute the Query and return a `QueryPromise`

The following is true for both the action shortcut function and the `QueryRef` function:
- The `QueryPromise` returned will resolve to the result of the Query once it has finished executing
- If the Query accepts arguments, both the action shortcut function and the `QueryRef` function accept a single argument: an object that contains all the required variables (and the optional variables) for the Query
- Both functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.

Below are examples of how to use the `example` connector's generated functions to execute each query. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#using-queries).

## ListAllUsers
You can execute the `ListAllUsers` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
listAllUsers(): QueryPromise<ListAllUsersData, undefined>;

interface ListAllUsersRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListAllUsersData, undefined>;
}
export const listAllUsersRef: ListAllUsersRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listAllUsers(dc: DataConnect): QueryPromise<ListAllUsersData, undefined>;

interface ListAllUsersRef {
  ...
  (dc: DataConnect): QueryRef<ListAllUsersData, undefined>;
}
export const listAllUsersRef: ListAllUsersRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listAllUsersRef:
```typescript
const name = listAllUsersRef.operationName;
console.log(name);
```

### Variables
The `ListAllUsers` query has no variables.
### Return Type
Recall that executing the `ListAllUsers` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListAllUsersData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ListAllUsersData {
  users: ({
    id: UUIDString;
    username: string;
    displayName?: string | null;
    profilePictureUrl?: string | null;
    createdAt: TimestampString;
  } & User_Key)[];
}
```
### Using `ListAllUsers`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listAllUsers } from '@dataconnect/generated';


// Call the `listAllUsers()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listAllUsers();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listAllUsers(dataConnect);

console.log(data.users);

// Or, you can use the `Promise` API.
listAllUsers().then((response) => {
  const data = response.data;
  console.log(data.users);
});
```

### Using `ListAllUsers`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listAllUsersRef } from '@dataconnect/generated';


// Call the `listAllUsersRef()` function to get a reference to the query.
const ref = listAllUsersRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listAllUsersRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.users);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.users);
});
```

## GetMyMessages
You can execute the `GetMyMessages` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
getMyMessages(): QueryPromise<GetMyMessagesData, undefined>;

interface GetMyMessagesRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<GetMyMessagesData, undefined>;
}
export const getMyMessagesRef: GetMyMessagesRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getMyMessages(dc: DataConnect): QueryPromise<GetMyMessagesData, undefined>;

interface GetMyMessagesRef {
  ...
  (dc: DataConnect): QueryRef<GetMyMessagesData, undefined>;
}
export const getMyMessagesRef: GetMyMessagesRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getMyMessagesRef:
```typescript
const name = getMyMessagesRef.operationName;
console.log(name);
```

### Variables
The `GetMyMessages` query has no variables.
### Return Type
Recall that executing the `GetMyMessages` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetMyMessagesData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
```
### Using `GetMyMessages`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getMyMessages } from '@dataconnect/generated';


// Call the `getMyMessages()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getMyMessages();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getMyMessages(dataConnect);

console.log(data.messages);

// Or, you can use the `Promise` API.
getMyMessages().then((response) => {
  const data = response.data;
  console.log(data.messages);
});
```

### Using `GetMyMessages`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getMyMessagesRef } from '@dataconnect/generated';


// Call the `getMyMessagesRef()` function to get a reference to the query.
const ref = getMyMessagesRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getMyMessagesRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.messages);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.messages);
});
```

# Mutations

There are two ways to execute a Data Connect Mutation using the generated Web SDK:
- Using a Mutation Reference function, which returns a `MutationRef`
  - The `MutationRef` can be used as an argument to `executeMutation()`, which will execute the Mutation and return a `MutationPromise`
- Using an action shortcut function, which returns a `MutationPromise`
  - Calling the action shortcut function will execute the Mutation and return a `MutationPromise`

The following is true for both the action shortcut function and the `MutationRef` function:
- The `MutationPromise` returned will resolve to the result of the Mutation once it has finished executing
- If the Mutation accepts arguments, both the action shortcut function and the `MutationRef` function accept a single argument: an object that contains all the required variables (and the optional variables) for the Mutation
- Both functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.

Below are examples of how to use the `example` connector's generated functions to execute each mutation. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#using-mutations).

## CreateProfileLink
You can execute the `CreateProfileLink` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
createProfileLink(vars: CreateProfileLinkVariables): MutationPromise<CreateProfileLinkData, CreateProfileLinkVariables>;

interface CreateProfileLinkRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateProfileLinkVariables): MutationRef<CreateProfileLinkData, CreateProfileLinkVariables>;
}
export const createProfileLinkRef: CreateProfileLinkRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createProfileLink(dc: DataConnect, vars: CreateProfileLinkVariables): MutationPromise<CreateProfileLinkData, CreateProfileLinkVariables>;

interface CreateProfileLinkRef {
  ...
  (dc: DataConnect, vars: CreateProfileLinkVariables): MutationRef<CreateProfileLinkData, CreateProfileLinkVariables>;
}
export const createProfileLinkRef: CreateProfileLinkRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createProfileLinkRef:
```typescript
const name = createProfileLinkRef.operationName;
console.log(name);
```

### Variables
The `CreateProfileLink` mutation requires an argument of type `CreateProfileLinkVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateProfileLinkVariables {
  linkId: string;
}
```
### Return Type
Recall that executing the `CreateProfileLink` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateProfileLinkData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateProfileLinkData {
  profileLink_insert: ProfileLink_Key;
}
```
### Using `CreateProfileLink`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createProfileLink, CreateProfileLinkVariables } from '@dataconnect/generated';

// The `CreateProfileLink` mutation requires an argument of type `CreateProfileLinkVariables`:
const createProfileLinkVars: CreateProfileLinkVariables = {
  linkId: ..., 
};

// Call the `createProfileLink()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createProfileLink(createProfileLinkVars);
// Variables can be defined inline as well.
const { data } = await createProfileLink({ linkId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createProfileLink(dataConnect, createProfileLinkVars);

console.log(data.profileLink_insert);

// Or, you can use the `Promise` API.
createProfileLink(createProfileLinkVars).then((response) => {
  const data = response.data;
  console.log(data.profileLink_insert);
});
```

### Using `CreateProfileLink`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createProfileLinkRef, CreateProfileLinkVariables } from '@dataconnect/generated';

// The `CreateProfileLink` mutation requires an argument of type `CreateProfileLinkVariables`:
const createProfileLinkVars: CreateProfileLinkVariables = {
  linkId: ..., 
};

// Call the `createProfileLinkRef()` function to get a reference to the mutation.
const ref = createProfileLinkRef(createProfileLinkVars);
// Variables can be defined inline as well.
const ref = createProfileLinkRef({ linkId: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createProfileLinkRef(dataConnect, createProfileLinkVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.profileLink_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.profileLink_insert);
});
```

## SendMessage
You can execute the `SendMessage` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
sendMessage(vars: SendMessageVariables): MutationPromise<SendMessageData, SendMessageVariables>;

interface SendMessageRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: SendMessageVariables): MutationRef<SendMessageData, SendMessageVariables>;
}
export const sendMessageRef: SendMessageRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
sendMessage(dc: DataConnect, vars: SendMessageVariables): MutationPromise<SendMessageData, SendMessageVariables>;

interface SendMessageRef {
  ...
  (dc: DataConnect, vars: SendMessageVariables): MutationRef<SendMessageData, SendMessageVariables>;
}
export const sendMessageRef: SendMessageRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the sendMessageRef:
```typescript
const name = sendMessageRef.operationName;
console.log(name);
```

### Variables
The `SendMessage` mutation requires an argument of type `SendMessageVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface SendMessageVariables {
  recipientId: UUIDString;
  content: string;
}
```
### Return Type
Recall that executing the `SendMessage` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `SendMessageData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface SendMessageData {
  message_insert: Message_Key;
}
```
### Using `SendMessage`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, sendMessage, SendMessageVariables } from '@dataconnect/generated';

// The `SendMessage` mutation requires an argument of type `SendMessageVariables`:
const sendMessageVars: SendMessageVariables = {
  recipientId: ..., 
  content: ..., 
};

// Call the `sendMessage()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await sendMessage(sendMessageVars);
// Variables can be defined inline as well.
const { data } = await sendMessage({ recipientId: ..., content: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await sendMessage(dataConnect, sendMessageVars);

console.log(data.message_insert);

// Or, you can use the `Promise` API.
sendMessage(sendMessageVars).then((response) => {
  const data = response.data;
  console.log(data.message_insert);
});
```

### Using `SendMessage`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, sendMessageRef, SendMessageVariables } from '@dataconnect/generated';

// The `SendMessage` mutation requires an argument of type `SendMessageVariables`:
const sendMessageVars: SendMessageVariables = {
  recipientId: ..., 
  content: ..., 
};

// Call the `sendMessageRef()` function to get a reference to the mutation.
const ref = sendMessageRef(sendMessageVars);
// Variables can be defined inline as well.
const ref = sendMessageRef({ recipientId: ..., content: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = sendMessageRef(dataConnect, sendMessageVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.message_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.message_insert);
});
```

