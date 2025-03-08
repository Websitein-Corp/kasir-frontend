/* prettier-ignore */
/* eslint-disable */
class e{constructor(e){this._events={}}on(e,t){this._events[e]=this._events[e]||[],this._events[e].push(t)}emit(e,...t){let i=this._events[e];i&&i.forEach((e=>{setTimeout((()=>e(...t)),0)}))}}
class t {
  constructor() {
    (this._queue = []), (this._working = !1);
  }
  add(e) {
    let t = this;
    this._queue.push(e),
      this._working ||
        (async function e() {
          if (!t._queue.length) return void (t._working = !1);
          t._working = !0;
          let i = t._queue.shift();
          await i(), e();
        })();
  }
  sleep(e) {
    this.add(() => new Promise((t) => setTimeout(t, e)));
  }
}
const i = [
  {
    filters: [{ namePrefix: "TM-P" }],
    functions: {
      print: {
        service: "49535343-fe7d-4ae5-8fa9-9fafd205e455",
        characteristic: "49535343-8841-43f4-a8d4-ecbe34729bb3",
      },
      status: {
        service: "49535343-fe7d-4ae5-8fa9-9fafd205e455",
        characteristic: "49535343-1e4d-4bd9-ba61-23c647249616",
      },
    },
    language: "esc-pos",
    codepageMapping: "epson",
  },
  {
    filters: [{ namePrefix: "STAR L" }],
    functions: {
      print: {
        service: "49535343-fe7d-4ae5-8fa9-9fafd205e455",
        characteristic: "49535343-8841-43f4-a8d4-ecbe34729bb3",
      },
      status: {
        service: "49535343-fe7d-4ae5-8fa9-9fafd205e455",
        characteristic: "49535343-1e4d-4bd9-ba61-23c647249616",
      },
    },
    language: "star-line",
    codepageMapping: "star",
  },
  {
    filters: [
      {
        name: "BlueTooth Printer",
        services: ["000018f0-0000-1000-8000-00805f9b34fb"],
      },
    ],
    functions: {
      print: {
        service: "000018f0-0000-1000-8000-00805f9b34fb",
        characteristic: "00002af1-0000-1000-8000-00805f9b34fb",
      },
      status: {
        service: "000018f0-0000-1000-8000-00805f9b34fb",
        characteristic: "00002af0-0000-1000-8000-00805f9b34fb",
      },
    },
    language: "esc-pos",
    codepageMapping: "zjiang",
  },
  {
    filters: [
      {
        name: "Printer001",
        services: ["000018f0-0000-1000-8000-00805f9b34fb"],
      },
    ],
    functions: {
      print: {
        service: "000018f0-0000-1000-8000-00805f9b34fb",
        characteristic: "00002af1-0000-1000-8000-00805f9b34fb",
      },
      status: {
        service: "000018f0-0000-1000-8000-00805f9b34fb",
        characteristic: "00002af0-0000-1000-8000-00805f9b34fb",
      },
    },
    language: "esc-pos",
    codepageMapping: "xprinter",
  },
  {
    filters: [
      { name: "MPT-II", services: ["000018f0-0000-1000-8000-00805f9b34fb"] },
    ],
    functions: {
      print: {
        service: "000018f0-0000-1000-8000-00805f9b34fb",
        characteristic: "00002af1-0000-1000-8000-00805f9b34fb",
      },
      status: {
        service: "000018f0-0000-1000-8000-00805f9b34fb",
        characteristic: "00002af0-0000-1000-8000-00805f9b34fb",
      },
    },
    language: "esc-pos",
    codepageMapping: "mpt",
  },
  {
    filters: [{ services: ["0000ae30-0000-1000-8000-00805f9b34fb"] }],
    functions: {
      print: {
        service: "0000ae30-0000-1000-8000-00805f9b34fb",
        characteristic: "0000ae01-0000-1000-8000-00805f9b34fb",
      },
      notify: {
        service: "0000ae30-0000-1000-8000-00805f9b34fb",
        characteristic: "0000ae02-0000-1000-8000-00805f9b34fb",
      },
    },
    language: "meow",
    codepageMapping: "default",
    messageSize: 200,
    sleepAfterCommand: 30,
  },
  {
    filters: [{ services: ["000018f0-0000-1000-8000-00805f9b34fb"] }],
    functions: {
      print: {
        service: "000018f0-0000-1000-8000-00805f9b34fb",
        characteristic: "00002af1-0000-1000-8000-00805f9b34fb",
      },
      status: {
        service: "000018f0-0000-1000-8000-00805f9b34fb",
        characteristic: "00002af0-0000-1000-8000-00805f9b34fb",
      },
    },
    language: "esc-pos",
    codepageMapping: "default",
  },
];
class s {}
class a extends s {
  #e;
  #t;
  #i = null;
  #s = null;
  #a = { print: null, status: null };
  constructor() {
    super(),
      (this.#e = new e()),
      (this.#t = new t()),
      navigator.bluetooth.addEventListener("disconnect", (e) => {
        this.#i == e.device && this.#e.emit("disconnected");
      });
  }
  async connect() {
    let e = i.map((e) => e.filters).reduce((e, t) => e.concat(t)),
      t = i
        .map((e) => Object.values(e.functions).map((e) => e.service))
        .reduce((e, t) => e.concat(t))
        .filter((e, t, i) => i.indexOf(e) === t);
    try {
      let i = await navigator.bluetooth.requestDevice({
        filters: e,
        optionalServices: t,
      });
      i && (await this.#c(i));
    } catch (e) {
      console.log("Could not connect! " + e);
    }
  }
  async reconnect(e) {
    if (!navigator.bluetooth.getDevices) return;
    let t = (await navigator.bluetooth.getDevices()).find((t) => t.id == e.id);
    t && (await this.#c(t));
  }
  async #c(e) {
    this.#i = e;
    let t = await this.#i.gatt.connect(),
      s = (await t.getPrimaryServices()).map((e) => e.uuid);
    this.#s = i.find((e) => e.filters.some((e) => this.#r(e, s)));
    let a = await t.getPrimaryService(this.#s.functions.print.service);
    if (
      ((this.#a.print = await a.getCharacteristic(
        this.#s.functions.print.characteristic
      )),
      this.#s.functions.status)
    ) {
      let e = await t.getPrimaryService(this.#s.functions.status.service);
      this.#a.status = await e.getCharacteristic(
        this.#s.functions.status.characteristic
      );
    }
    this.#e.emit("connected", {
      type: "bluetooth",
      name: this.#i.name,
      id: this.#i.id,
      language: await this.#n(this.#s.language),
      codepageMapping: await this.#n(this.#s.codepageMapping),
    });
  }
  async #n(e) {
    return "function" == typeof e ? await e(this.#i) : e;
  }
  #r(e, t) {
    if (e.services) for (let i of e.services) if (!t.includes(i)) return !1;
    return (
      (!e.name || this.#i.name == e.name) &&
      !(e.namePrefix && !this.#i.name.startsWith(e.namePrefix))
    );
  }
  async listen() {
    return (
      !!this.#a.status &&
      (await this.#a.status.startNotifications(),
      this.#a.status.addEventListener("characteristicvaluechanged", (e) => {
        this.#e.emit("data", e.target.value);
      }),
      !0)
    );
  }
  async disconnect() {
    this.#i &&
      (await this.#i.gatt.disconnect(),
      (this.#i = null),
      (this.#a.print = null),
      (this.#a.status = null),
      (this.#s = null),
      this.#e.emit("disconnected"));
  }
  print(e) {
    return new Promise((t) => {
      ArrayBuffer.isView(e) && (e = [e]);
      for (let t of e) {
        const e = this.#s.messageSize || 100;
        let i = Math.ceil(t.length / e);
        if (1 === i) {
          let e = t;
          this.#t.add(() => this.#a.print.writeValueWithResponse(e)),
            this.#s.sleepAfterCommand &&
              this.#t.sleep(this.#s.sleepAfterCommand);
        } else
          for (let s = 0; s < i; s++) {
            let i = s * e,
              a = Math.min(t.length, i + e),
              c = t.slice(i, a);
            this.#t.add(() => this.#a.print.writeValueWithResponse(c)),
              this.#s.sleepAfterCommand &&
                this.#t.sleep(this.#s.sleepAfterCommand);
          }
      }
      this.#t.add(() => t());
    });
  }
  addEventListener(e, t) {
    this.#e.on(e, t);
  }
}
export { a as default };
