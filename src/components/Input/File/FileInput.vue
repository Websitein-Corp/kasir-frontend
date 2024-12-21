<template>
  <div class="w-full mt-6">
    <div class="text-primary-600 text-sm mb-2">
      {{ label }}
    </div>
    <DropZone
      :maxFiles="1"
      :multipleUpload="false"
      :uploadOnDrop="false"
      :maxFileSize="10000000"
      class="cursor-pointer"
      dropzoneMessageClassName="dropzone-message"
      @errorAdd="onError"
      v-bind="$attrs"
    />
  </div>
</template>

<script setup>
import useToast from "@/stores/useToast";
import DropZone from "dropzone-vue";

const props = defineProps({
  label: {
    type: String,
    default: "File",
  },
  modelValue: null,
});

const toast = useToast();

const onError = (e) => {
  toast.message = "Gagal";
  toast.description = handleErrorMessage(e.error);
  toast.type = "FAILED";
  toast.trigger();
};

const handleErrorMessage = (code) => {
  switch (code) {
    case "INVALID_TYPE":
      return "Tipe file harus berupa .png, .jpg, atau .jpeg!";
    case "MAX_FILE":
      return "Hanya bisa mengunggah 1 gambar!";
    case "MAX_FILE_SIZE":
      return "Ukuran gambar maksimal 10 MB!";
  }
};
</script>
