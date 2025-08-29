import { create, StateCreator } from 'zustand';
import { devtools } from 'zustand/middleware';
import { persist, PersistOptions } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

type StoreOptions<T> = {
  name: string;
  persist?: Partial<PersistOptions<T>> | boolean;
  devtools?: boolean;
};

export function createStore<T>(
  name: string,
  initializer: StateCreator<T, [['zustand/immer', never]], [], T>,
  options?: Partial<StoreOptions<T>>
) {
  const { persist: persistOptions, devtools: enableDevtools = true } = options || {};

  let store = immer(initializer);

  if (persistOptions) {
    const persistConfig: PersistOptions<T> =
      typeof persistOptions === 'boolean'
        ? { name: `14voices-${name}` }
        : { name: `14voices-${name}`, ...persistOptions };

    store = persist(store, persistConfig) as any;
  }

  if (enableDevtools && process.env.NODE_ENV !== 'production') {
    store = devtools(store, { name }) as any;
  }

  return create<T>()(store);
}
