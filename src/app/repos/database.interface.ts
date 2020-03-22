export interface IDataRepo<T> {
  setObject?(payload: T[]): Promise<void>;
  getItems?(): Promise<T[]>;
  setItem?(val: string): Promise<void>;
  getItem?(): Promise<T[]>;
  addItem?(payload: T): Promise<void>;
  updateItem?(payload: T): Promise<void>;
}
