export interface IMessage<T> {
  event: string;
  payload?: T;
}
