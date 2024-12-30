<template>
  <div class="flex justify-center items-center mb-4">
    <Printer :stroke-width="1" size="150" />
  </div>
  <div class="flex justify-center text-center mt-8">
    <CustomAlert :type="getStatusStyle()" title="Status" class="mb-4">
      <div class="ml-0">
        {{ bluetoothReceipt.printerStatus }}
      </div>
    </CustomAlert>
  </div>
  <div class="flex justify-center mt-8 space-x-4">
    <CustomButton
      v-if="bluetoothReceipt.printerStatus !== 'CONNECTED'"
      label="Connect"
      size="fit"
      :icon="BluetoothSearching"
      class="bg-primary-700 hover:bg-primary-800"
      @click="bluetoothReceipt.handleConnectButtonClick()"
    />
    <CustomButton
      v-else
      label="Disconnect"
      size="fit"
      :icon="BluetoothOff"
      class="bg-red-700 hover:bg-red-800"
      @click="bluetoothReceipt.handleDisconnect()"
    />
    <CustomButton
      v-if="bluetoothReceipt.printerStatus === 'CONNECTED'"
      label="Cetak Struk"
      size="fit"
      :icon="Printer"
      class="bg-primary-700 hover:bg-primary-800"
      @click="bluetoothReceipt.printReceipt(modal.props)"
    />
  </div>
</template>

<script setup>
import useCart from "@/stores/useCart";
import CustomButton from "@/components/Button/CustomButton.vue";
import useModal from "@/stores/useModal";
import useToast from "@/stores/useToast";
import useBluetoothReceipt from "@/stores/useBluetoothReceipt";
import { BluetoothOff, BluetoothSearching, Printer } from "lucide-vue-next";
import CustomAlert from "@/components/Alert/CustomAlert.vue";

const cart = useCart();
const modal = useModal();
const bluetoothReceipt = useBluetoothReceipt();
const toast = useToast();

const getStatusStyle = () => {
  switch (bluetoothReceipt.printerStatus) {
    case "CONNECTED":
      return "success";
    case "WAITING...":
      return "info";
  }
};
</script>
