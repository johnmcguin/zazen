export interface IDataRepo<T> {
  /**
   * Schema:
   *  - Settings object (user preferences)
   *  - Sessions object (saved sessions)
   *  - for any key that holds an array of values, the convention will be { item: array<data> }
   */
  setObject?(payload: T[]): Promise<void>;
  getObject?(): Promise<T[]>;
  setItem?(val: string): Promise<void>;
  getItem?(): Promise<T[]>;
  addItem?(payload: T): Promise<void>;
  updateItem?(payload: T): Promise<void>;
}
