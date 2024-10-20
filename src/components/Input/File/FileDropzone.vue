<template>
  <!-- add `data-active` and the event listeners -->
  <div
    :data-active="active"
    @dragenter.prevent="setActive"
    @dragover.prevent="setActive"
    @dragleave.prevent="setInactive"
    @drop.prevent="onDrop"
  >
    <!-- share state with the scoped slot -->
    <slot :dropZoneActive="active"></slot>
  </div>
</template>

<script setup>
// make sure to import `ref` from Vue
import { ref, onMounted, onUnmounted } from "vue";
const emit = defineEmits(["file-dropped"]);

// Create `active` state and manage it with functions
let active = ref(false);
let inActiveTimeout = null; // add a variable to hold the timeout key

function setActive() {
  active.value = true;
  clearTimeout(inActiveTimeout); // clear the timeout
}
function setInactive() {
  // wrap it in a `setTimeout`
  inActiveTimeout = setTimeout(() => {
    active.value = false;
  }, 50);
}
function onDrop(e) {
  console.log(e.dataTransfer);
  setInactive(); // add this line too
  emit("file-dropped", e.dataTransfer.files[0]);
}

function preventDefaults(e) {
  e.preventDefault();
}

const events = ["dragenter", "dragover", "dragleave", "drop"];

onMounted(() => {
  events.forEach((eventName) => {
    document.body.addEventListener(eventName, preventDefaults);
  });
});

onUnmounted(() => {
  events.forEach((eventName) => {
    document.body.removeEventListener(eventName, preventDefaults);
  });
});
</script>
