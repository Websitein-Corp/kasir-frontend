class EventManager {
  constructor() {
    this._events = {};
  }
  on(event, callback) {
    this._events[event] = this._events[event] || [];
    this._events[event].push(callback);
  }
  emit(event, ...args) {
    const listeners = this._events[event];
    if (listeners) {
      listeners.forEach((listener) => {
        setTimeout(() => listener(...args), 0);
      });
    }
  }
}

class TaskQueue {
  constructor() {
    this._queue = [];
    this._working = false;
  }
  add(task) {
    this._queue.push(task);
    if (!this._working) {
      this._processQueue();
    }
  }
  async _processQueue() {
    this._working = true;
    while (this._queue.length) {
      const task = this._queue.shift();
      await task();
    }
    this._working = false;
  }
  sleep(ms) {
    this.add(() => new Promise((resolve) => setTimeout(resolve, ms)));
  }
}

class BluetoothPrinterService {
  constructor() {
    this.eventManager = new EventManager();
    this.taskQueue = new TaskQueue();
    this.device = null;
    this.characteristics = { print: null, status: null };
    this.config = null;
  }

  async connect() {
    if (!navigator.bluetooth) {
      throw new Error("Web Bluetooth API is not available in this browser.");
    }

    const deviceConfig = {
      filters: [{ namePrefix: "RP" }],
    };

    try {
      const device = await navigator.bluetooth.requestDevice(deviceConfig);
      await this._setupDevice(device);
    } catch (error) {
      console.error("Connection failed:", error);
      throw error;
    }
  }

  async reconnect(lastDevice) {
    if (!navigator.bluetooth || !navigator.bluetooth.getDevices) {
      throw new Error("Browser does not support getDevices for Bluetooth.");
    }

    const devices = await navigator.bluetooth.getDevices();
    console.log(devices);
    const device = devices.find((d) => d.id === lastDevice.id);

    if (device) {
      this.device = device;
      await this._setupDevice(this.device);
    } else {
      throw new Error("Device not found for reconnection.");
    }
  }

  async _setupDevice(device) {
    this.device = device;

    if (!this.device.gatt) {
      throw new Error(
        "Device does not support GATT or is not properly connected."
      );
    }

    try {
      console.log(this.device.gatt);
      const server = await this.device.gatt.connect();
      console.log("Connected to GATT server:", server);

      const service = await server.getPrimaryService(
        "000018f0-0000-1000-8000-00805f9b34fb"
      );
      console.log("Primary service obtained:", service);

      this.characteristics.print = await service.getCharacteristic(
        "00002af1-0000-1000-8000-00805f9b34fb"
      );
      console.log("Print characteristic set:", this.characteristics.print);

      this.device.addEventListener("gattserverdisconnected", () => {
        this.eventManager.emit("disconnected");
      });

      this.eventManager.emit("connected", device);
    } catch (error) {
      console.error("Failed to connect to GATT server:", error);
      throw error;
    }
  }

  async disconnect() {
    console.log(this.device.gatt);
    if (this.device && this.device.gatt.connected) {
      await this.device.gatt.disconnect();
      this.eventManager.emit("disconnected");
      this.device = null;
      this.characteristics.print = null;
    }
  }

  async print(data) {
    if (!this.characteristics.print) {
      throw new Error("Printer is not connected.");
    }

    if (ArrayBuffer.isView(data)) {
      data = [data];
    }

    for (let chunk of data) {
      await this.taskQueue.add(() =>
        this.characteristics.print.writeValueWithResponse(chunk)
      );
    }
  }

  on(event, callback) {
    this.eventManager.on(event, callback);
  }
}

export default BluetoothPrinterService;
