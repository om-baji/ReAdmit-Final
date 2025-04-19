
class ListNode<T> {
  key: string;
  value: T;
  prev: ListNode<T> | null;
  next: ListNode<T> | null;

  constructor(key: string, value: T) {
    this.key = key;
    this.value = value;
    this.prev = null;
    this.next = null;
  }
}

class LRUCache<T> {
  capacity: number;
  cache: Map<string, ListNode<T>>;
  head: ListNode<T>;
  tail: ListNode<T>;

  constructor(capacity: number) {
    this.capacity = capacity;
    this.cache = new Map();
    this.head = new ListNode<T>("head", null as T);
    this.tail = new ListNode<T>("tail", null as T);
    this.head.next = this.tail;
    this.tail.prev = this.head;
  }

  private addNode(node: ListNode<T>) {
    node.prev = this.head;
    node.next = this.head.next;
    this.head.next!.prev = node;
    this.head.next = node;
  }

  private removeNode(node: ListNode<T>) {
    const prev = node.prev;
    const next = node.next;
    prev!.next = next;
    next!.prev = prev;
  }

  private moveToHead(node: ListNode<T>) {
    this.removeNode(node);
    this.addNode(node);
  }

  private popTail(): ListNode<T> {
    const node = this.tail.prev!;
    this.removeNode(node);
    return node;
  }

  get(key: string): T | undefined {
    const node = this.cache.get(key);
    if (!node) return undefined;

    this.moveToHead(node);
    return node.value;
  }

  put(key: string, value: T) {
    const node = this.cache.get(key);

    if (node) {
      node.value = value;
      this.moveToHead(node);
      return;
    }

    const newNode = new ListNode(key, value);
    this.cache.set(key, newNode);
    this.addNode(newNode);

    if (this.cache.size > this.capacity) {
      const tail = this.popTail();
      this.cache.delete(tail.key);
    }
  }

  has(key: string): boolean {
    return this.cache.has(key);
  }

  size(): number {
    return this.cache.size;
  }
}

export default LRUCache;
