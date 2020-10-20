interface Options {
  epoch?: number | Date;
  worker?: number;
  process?: number;
}

interface SnowflakeType {
  epoch: number;
  timestamp: string;
  worker: string;
  process: string;
  increment: string;
  binary: string;
}

class Snowflake {
  EPOCH: number;
  WORKER: number;
  PROCESS: number;

  INCREMENT: number;

  public constructor(opt: Options = {}) {
    if (opt.epoch instanceof Date) {
      opt.epoch = new Date(opt.epoch).getMilliseconds();
    }

    opt.epoch = !opt.epoch ? 11598911200000 : opt.epoch;
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

  public generate() {
    const timestamp = new Date(Date.now()).getTime;
    this.INCREMENT++;
    if (this.INCREMENT > 4095) this.INCREMENT = 0;
    let out = (Date.now() - this.EPOCH).toString(2).padStart(42, "0");
    out += this.WORKER.toString(2).padStart(5, "0");
    out += this.PROCESS.toString(2).padStart(5, "0");
    out += this.INCREMENT.toString(2).padStart(12, "0");
    return this.parseBigInt(out, 2).toString();
  }

  private parseBigInt(str: string, base: number) {
    let bigint = BigInt(0);
    for (let i = 0; i < str.length; i++) {
      let code = str[str.length - 1 - i].charCodeAt(0) - 48;
      if (code >= 10) code -= 39;
      bigint += BigInt(base) ** BigInt(i) * BigInt(code);
    }
    return bigint;
  }

  public decompose(snowflake: string) {
    const binary = BigInt(snowflake).toString(2);
    const out: SnowflakeType = {
      epoch: this.EPOCH,
      timestamp:(this.parseBigInt(binary.slice(0, -22), 2) + BigInt(this.EPOCH)).toString(),
      worker: this.parseBigInt(binary.slice(-22, -17), 2).toString(),
      process: this.parseBigInt(binary.slice(-17, -12), 2).toString(),
      increment: this.parseBigInt(binary.slice(-12), 2).toString(),
      binary: binary,
    };
    return out;
  }
}

export default Snowflake;
