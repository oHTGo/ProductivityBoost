export interface IClockStatus {
  mode: 'pomodoro' | 'break';
  status: 'started' | 'paused' | 'stopped';
  time: number;
}
