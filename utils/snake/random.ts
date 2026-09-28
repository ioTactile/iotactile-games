/** Port: injectable random source for deterministic tests. */
export interface IRandomSource {
  /** Returns a float in [0, 1). */
  next(): number;
}

export class MathRandomSource implements IRandomSource {
  next(): number {
    return Math.random();
  }
}

/** Deterministic sequence for tests. Cycles if exhausted. */
export class SequenceRandomSource implements IRandomSource {
  private index = 0;

  constructor(private readonly values: number[]) {
    if (values.length === 0) {
      throw new Error('SequenceRandomSource requires at least one value');
    }
  }

  next(): number {
    const value = this.values[this.index % this.values.length];
    this.index += 1;
    return value;
  }
}
