export type Feature = 'email' | 'calendar' | 'translator';
export type BackgroundFunction<TPayload, TResult> = (payload?: TPayload) => Promise<TResult>;
