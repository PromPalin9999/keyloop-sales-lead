declare global {
  type Nullable<T> = T | null | undefined;
  type Maybe<T> = T | null;
  type Optional<T> = T | undefined;
  type PrimitiveType = string | number | boolean | null | undefined;
  type ObjectType = Record<string, unknown>;
  type AnyObject = Record<string, unknown>;
  type AnyArray<T = unknown> = Array<T>;
  type AnyPromise<T = unknown> = Promise<T>;
  type AnyElement = HTMLElement | SVGElement;
  type ReactSet<T> = React.Dispatch<React.SetStateAction<T>>;
  type ReactRef<T> = React.RefObject<T>;
  type ReactRefCallback<T> = (instance: T | null) => void;
  type ValueOf<T> = T[keyof T];
  type FetchPromiseFn<Params, Data> = (props: Params) => Promise<Data>;
  type PaginationValues<R> = {
    items: R[];
    total?: number;
    page?: number;
    pageSize?: number;
  };
}

export {};
