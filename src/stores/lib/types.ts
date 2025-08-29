export type StoreState<T> = T & {
  hydrate?: (state: Partial<T>) => void;
  reset?: () => void;
};

export type Selector<T, U> = (state: T) => U;

export interface StoreActions {
  reset: () => void;
}
