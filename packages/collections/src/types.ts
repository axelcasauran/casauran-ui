export type CollectionKey = string | number;

export interface CollectionItem<Key extends CollectionKey = CollectionKey, Metadata = unknown> {
  readonly key: Key;
  readonly parentKey?: Key | undefined;
  readonly disabled?: boolean | undefined;
  readonly textValue?: string | undefined;
  readonly metadata?: Metadata | undefined;
}

export interface CollectionSnapshot<Key extends CollectionKey = CollectionKey, Metadata = unknown> {
  readonly size: number;
  readonly keys: readonly Key[];
  readonly rootKeys: readonly Key[];
  readonly enabledKeys: readonly Key[];
  has(key: Key): boolean;
  getItem(key: Key): Readonly<CollectionItem<Key, Metadata>> | undefined;
  getParentKey(key: Key): Key | null;
  getChildren(key: Key): readonly Key[];
  getDepth(key: Key): number | undefined;
}
