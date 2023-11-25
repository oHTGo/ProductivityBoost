export interface ICredential {
  clientId: string;
  clientSecret: string;
}

export interface IMessage<T> {
  event: string;
  payload?: T;
}
