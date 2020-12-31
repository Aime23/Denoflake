export interface Options {
  epoch?: number | Date;
  worker?: number;
  process?: number;
}

export interface TSnowflake {
  epoch: number;
  timestamp: string;
  worker: string;
  process: string;
  increment: string;
  binary: string;
}

export class Snowflake {
  EPOCH: number;
  WORKER: number;
  PROCESS: number;

  INCREMENT: number;

  /**
   * @param opt constructor options
   * @param [opt.epoch] Epoch timestamp
   * @param [opt.worker] Worker's id
   * @param [opt.process] Process's id
   */
  public constructor(opt: Options = {}) {
    if (opt.epoch instanceof Date) {
      opt.epoch = opt.epoch.getTime();
    }

    opt.epoch = !opt.epoch ? 1598911200000 : opt.epoch; //Sept 1 2020 00:00:00 GTM+0200
    opt.worker = !opt.worker ? 0 : opt.worker;
    opt.process = !opt.process ? 0 : opt.process;

    if (opt.epoch < 0) {
      throw new Error("Epoch can not be a negative number");
    }
    if (0 > opt.worker || opt.worker > 31) {
      throw new Error("Worker needs to be between 0 and 31");
    }
    if (0 > opt.process || opt.process > 31) {
      throw new Error("Process needs to be between 0 and 31");
    }
    this.EPOCH = opt.epoch;
    this.WORKER = opt.worker;
    this.PROCESS = opt.process;
    this.INCREMENT = 0;
  }

  /**
   * Generate a snowflake
   * @returns The generated snowflake
   */
  public generate(): string {
    if (this.INCREMENT > 4095) this.INCREMENT = 0;
    let out = (Date.now() - this.EPOCH).toString(2).padStart(42, "0");
    out += this.WORKER.toString(2).padStart(5, "0");
    out += this.PROCESS.toString(2).padStart(5, "0");
    out += this.INCREMENT.toString(2).padStart(12, "0");
    this.INCREMENT++;
    return this.parseBigInt(out, 2).toString();
  }

  private parseBigInt(str: string, base: number): bigint {
    let bigint = BigInt(0);
    for (let i = 0; i < str.length; i++) {
      let code = str[str.length - 1 - i].charCodeAt(0) - 48;
      if (code >= 10) code -= 39;
      bigint += BigInt(base) ** BigInt(i) * BigInt(code);
    }
    return bigint;
  }

  /**
  * Decompose a snowflake in it's different components
  * @param snowflake The snowflake to decompose
  * @returns The decomposed snowflake
  */
  public decompose(snowflake: string): TSnowflake | boolean {
    const binary = BigInt(snowflake).toString(2);
    const out: TSnowflake = {
      epoch: this.EPOCH,
      timestamp: (this.parseBigInt(binary.slice(0, -22), 2) + BigInt(this.EPOCH)).toString(),
      worker: this.parseBigInt(binary.slice(-22, -17), 2).toString(),
      process: this.parseBigInt(binary.slice(-17, -12), 2).toString(),
      increment: this.parseBigInt(binary.slice(-12), 2).toString(),
      binary: binary,
    };
    return out;
  }
}