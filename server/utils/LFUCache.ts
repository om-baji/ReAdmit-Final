
class ListNode<T> {
  key: string;
  value: T;
  freq: number;
  prev: ListNode<T> | null;
  next: ListNode<T> | null;

  constructor(key: string, value: T) {
    this.key = key;
    this.value = value;
    this.freq = 1;
    this.prev = null;
    this.next = null;
  }
}

class FreqNode {
  freq: number;
  prev: FreqNode | null;
  next: FreqNode | null;
  nodeList: ListNode<any>[];

  constructor(freq: number) {
    this.freq = freq;
    this.prev = null;
    this.next = null;
    this.nodeList = [];
  }
}

class LFUCache<T> {
  capacity: number;
  size: number;
  cache: Map<string, ListNode<T>>;
  freqHead: FreqNode;

  constructor(capacity: number) {
    this.capacity = capacity;
    this.size = 0;
    this.cache = new Map();
    this.freqHead = new FreqNode(0);
  }

  private addNode(node: ListNode<T>, freqNode: FreqNode) {
    node.freq = freqNode.freq;
    freqNode.nodeList.push(node);
  }

  private removeNode(node: ListNode<T>, freqNode: FreqNode) {
    freqNode.nodeList = freqNode.nodeList.filter(n => n.key !== node.key);
  }

  private getFreqNode(freq: number): FreqNode {
    let curr = this.freqHead;
    while (curr.next && curr.next.freq <= freq) {
      curr = curr.next;
    }

    if (curr.freq === freq) return curr;

    const newFreqNode = new FreqNode(freq);
    newFreqNode.next = curr.next;
    if (curr.next) curr.next.prev = newFreqNode;
    curr.next = newFreqNode;
    newFreqNode.prev = curr;
    return newFreqNode;
  }

  get(key: string): T | undefined {
    const node = this.cache.get(key);
    if (!node) return undefined;

    const oldFreqNode = this.getFreqNode(node.freq);
    const newFreqNode = this.getFreqNode(node.freq + 1);

    this.removeNode(node, oldFreqNode);
    this.addNode(node, newFreqNode);

    return node.value;
  }

  put(key: string, value: T) {
    if (this.capacity <= 0) return;

    const node = this.cache.get(key);
    if (node) {
      node.value = value;
      this.get(key);
      return;
    }

    if (this.size >= this.capacity) {
      let curr = this.freqHead.next;
      while (curr && curr.nodeList.length === 0) {
        curr = curr.next;
      }
      if (curr && curr.nodeList.length > 0) {
        const lfu = curr.nodeList[0];
        this.removeNode(lfu, curr);
        this.cache.delete(lfu.key);
        this.size--;
      }
    }

    const newNode = new ListNode(key, value);
    this.cache.set(key, newNode);
    const freqNode = this.getFreqNode(1);
    this.addNode(newNode, freqNode);
    this.size++;
  }

  has(key: string): boolean {
    return this.cache.has(key);
  }
}

export default LFUCache;
