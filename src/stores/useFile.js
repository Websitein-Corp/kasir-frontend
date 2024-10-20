import { defineStore } from "pinia";

export default defineStore("file", {
  state: () => ({
    file: null,
  }),

  actions: {
    addFile(file) {
      this.file = new UploadableFile(file);
    },

    removeFile() {
      this.file = null;
    },
  },
});

class UploadableFile {
  constructor(file) {
    this.file = file;
    this.url = URL.createObjectURL(file);
    this.status = null;
  }
}
