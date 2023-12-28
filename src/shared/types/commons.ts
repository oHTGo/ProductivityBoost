export type Feature = 'email' | 'calendar' | 'translator' | 'clock';
export type BackgroundFunction<TPayload, TResult> = (payload?: TPayload) => Promise<TResult>;

export interface ICredential {
  clientId: string;
  clientSecret: string;
}
export interface IMessage<T> {
  event: string;
  payload?: T;
}
