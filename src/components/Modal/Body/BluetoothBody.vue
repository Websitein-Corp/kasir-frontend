<template>
  <div>Printer Status: {{ printerStatus }}</div>
  <div class="flex justify-center mt-8">
    <CustomButton
      v-if="bluetoothReceipt.printerStatus !== 'CONNECTED'"
      label="Connect"
      size="fit"
      class="bg-primary-400 text-black"
      @click="bluetoothReceipt.handleConnectButtonClick()"
    />
    <CustomButton
      v-else
      label="Disconnect"
      size="fit"
      class="bg-red-400 text-white"
      @click="bluetoothReceipt.handleDisconnect()"
    />
  </div>
</template>

<script setup>
import useCart from "@/stores/useCart";
import { onMounted, ref } from "vue";
import CustomButton from "@/components/Button/CustomButton.vue";
import useModal from "@/stores/useModal";
import useToast from "@/stores/useToast";
import useBluetoothReceipt from "@/stores/useBluetoothReceipt";

const printerStatus = ref("WAITING...");

const cart = useCart();
const modal = useModal();
const bluetoothReceipt = useBluetoothReceipt();
const toast = useToast();
</script>
