export interface ParsedLine {
  key: string;
  timestamp?: string;
  speaker?: string;
  text: string;
  colorClass?: string;
  seconds?: number;
}

export enum ActiveView {
  Input,
  Recap,
  Transcript,
  Editor,
}