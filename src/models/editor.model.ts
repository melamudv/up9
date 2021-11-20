export interface IEditor {
  actions: IAction[];
  editPointer: {
    row: number;
    col: number
  };
}
export interface IAction {
  action: string;
  row: number;
  col: number;
};
