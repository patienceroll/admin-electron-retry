type Queue = {
  id: string;
};

type Callback = (status: "start" | "finished") => void;

class ProgressControler {
  private idRooter = 1;

  private createId() {
    if ((this.idRooter = Number.MAX_SAFE_INTEGER)) {
      this.idRooter = 0;
    }
    this.idRooter += 1;
    return `${+new Date()}${this.idRooter}`;
  }

  private queue: Map<string, Queue>;

  private eimterList: Callback[] = [];

  constructor() {
    this.queue = new Map();
  }

  private get isFinished() {
    return this.queue.size === 0;
  }

  private triggerStart() {
    this.eimterList.forEach((item) => {
      item("start");
    });
  }

  private triggerFinished() {
    this.eimterList.forEach((item) => {
      item("finished");
    });
  }

  linsten(callback: Callback) {
    this.eimterList.push(callback);
  }

  remove(callback: Callback) {
    this.eimterList = this.eimterList.filter((item) => item !== callback);
  }

  push() {
    if (this.isFinished) {
      this.triggerStart();
    }
    const quene: Queue = {
      id: this.createId(),
    };

    this.queue.set(quene.id, quene);

    const instance = this;

    return {
      id: quene.id,
      resolve() {
        instance.queue.delete(quene.id);
        if (instance.isFinished) {
          instance.triggerFinished();
        }
      },
    };
  }
}

export default new ProgressControler();
