export type Feature = 'email' | 'calendar' | 'translator' | 'tools';
export type BackgroundFunction<TPayload, TResult> = (payload?: TPayload) => Promise<TResult>;
export type InjectedConfiguration = {
  domains: string[];
  duration: number;
  run: () => Promise<boolean>;
};

export interface IMessage<T> {
  event: string;
  payload?: T;
}
