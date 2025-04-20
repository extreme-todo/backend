export interface FocusedTimeResponse {
  start?: number;
  end?: number;
  day?: string;
  week?: number;
  focused: number;
}

export interface FocusedTimeTotalResponse {
  total: {
    start: string;
    end: string;
    focused: number;
    prevFocused: number;
  };
  values: FocusedTimeResponse[];
} 