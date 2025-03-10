<template>
  <div class="relative w-screen h-screen overflow-hidden bg-[#cdfaee]">
    <!-- header logo -->
    <div class="py-2">
      <img
        src="../../public/img/logo.svg"
        alt="logo"
        class="w-10 md:w-12 flex-shrink-0 mx-auto items-center"
      />
    </div>
    <hr class="h-px bg-primary-700 border-none" />
    <div class="w-1/3 mx-auto items-center">
      <!-- step 1 -->
      <div v-if="currentStep === 1">
        <h1 class="mt-4 text-center text-lg text-primary-900">
          Tambah Toko Baru Kamu!
        </h1>
        <TextInput
          v-model="namaPemilik"
          type="text"
          label="Nama Pemilik"
          placeholder="Enter your name"
        />
        <TextInput
          v-model="alamatPemilik"
          type="text"
          label="Alamat Pemilik"
          placeholder="Enter your address"
        />
        <TextInput
          v-model="namaToko"
          type="text"
          label="Nama Toko"
          placeholder="Enter your store name"
        />
        <TextInput
          v-model="alamatToko"
          type="text"
          label="Alamat Toko"
          placeholder="Enter your store address"
        />
      </div>
      <!-- step2 -->
      <div v-if="currentStep === 2">
        <h1 class="mt-4 text-center text-lg text-primary-900">Pilih Plan</h1>
        <div class="flex gap-10 mt-8">
          <!-- ini cardnya nanti jadiin component -->
          <div
            class="max-w-sm w-full p-6 border rounded-2xl shadow-md bg-white hover:shadow-lg transition-all duration-300"
            :class="
              selected
                ? 'border-primary-700 ring-2 ring-primary-700'
                : 'border-gray-200'
            "
            @click="toggleSelect"
          >
            <div class="text-center space-y-1">
              <h1 class="text-lg font-semibold text-gray-800">Trial</h1>
              <p class="text-2xl font-bold text-primary-700">FREE</p>
            </div>
            <hr />
            <ul class="mt-4 space-y-1 text-sm text-gray-700">
              <li>✅ 1 Outlet</li>
              <li>✅ 5 User</li>
              <li>✅ 100 Product</li>
              <li>✅ Unlimited Ingredient List</li>
              <li>✅ Email Online Receipt</li>
              <li>✅ Payment Tunai</li>
              <li>✅ Semua Laporan</li>
              <li>✅ Android, PC, IOS</li>
            </ul>

            <button
              class="w-full mt-5 py-2 border rounded-md font-semibold transition-all duration-300"
              :class="
                selected
                  ? 'bg-primary-700 text-white border-primary-700'
                  : 'text-primary-700 border-primary-700 hover:bg-primary-100'
              "
            >
              {{ selected ? "Selected" : "Select" }}
            </button>
          </div>
          <div
            class="max-w-sm w-full p-6 border rounded-3xl shadow-lg bg-white hover:shadow-xl transition-all duration-300"
            :class="
              selected
                ? 'border-primary-700 ring-2 ring-primary-700'
                : 'border-gray-200'
            "
            @click="toggleSelect"
          >
            <!-- Header -->
            <div class="text-center mb-4">
              <h1 class="text-lg font-semibold text-gray-800">Kasirin</h1>
              <p class="text-4xl font-extrabold text-primary-700 mt-1">
                589000
                <span class="text-base font-medium text-primary-700"
                  >Rp/tahun</span
                >
              </p>
            </div>

            <hr class="my-4 border-gray-200" />

            <!-- Fitur List -->
            <ul class="space-y-2 text-sm text-gray-700">
              <li class="flex items-start gap-2">✅ <span>1 Outlet</span></li>
              <li class="flex items-start gap-2">
                ✅ <span>Unlimited User</span>
              </li>
              <li class="flex items-start gap-2">
                ✅ <span>5000 Product</span>
              </li>
              <li class="flex items-start gap-2">
                ✅ <span>Unlimited Ingredient List</span>
              </li>
              <li class="flex items-start gap-2">
                ✅ <span>Email Online Receipt</span>
              </li>
              <li class="flex items-start gap-2">
                ✅ <span>Payment Tunai & QRIS</span>
              </li>
              <li class="flex items-start gap-2">
                ✅ <span>Semua Laporan</span>
              </li>
              <li class="flex items-start gap-2">✅ <span>Bayar PPOB</span></li>
              <li class="flex items-start gap-2">
                ✅ <span>Android, PC, IOS</span>
              </li>
            </ul>

            <!-- Tombol -->
            <button
              class="w-full mt-6 py-2.5 text-sm rounded-lg border font-semibold transition-all duration-300"
              :class="
                selected
                  ? 'bg-primary-700 text-white border-primary-700'
                  : 'text-primary-700 border-primary-700 hover:bg-primary-100'
              "
            >
              {{ selected ? "Selected" : "Select" }}
            </button>
          </div>
        </div>
      </div>
      <!-- step3 -->
      <div v-if="currentStep === 3">
        <h1 class="mt-4 text-center text-lg text-primary-900">
          Pilih Metode Pembayaran
        </h1>
        <div
          class="border-primary-700 border-2 rounded-md mt-8 p-4 flex gap-4 justify-center"
        >
          <div
            class="p-1 border rounded-xl shadow-lg bg-white hover:shadow-xl transition-all duration-300 cursor-pointer"
            :class="
              selected
                ? 'border-primary-700 ring-2 ring-primary-700'
                : 'border-gray-200'
            "
            @click="toggleSelect"
          >
            <img
              src="https://i0.wp.com/umsu.ac.id/berita/wp-content/uploads/2024/07/cara-lihat-nomor-gopay-di-aplikasi-gojek.webp?fit=850%2C510&ssl=1"
              alt=""
              class="w-36 h-20 rounded-xl"
            />
          </div>
          <div
            class="p-1 border rounded-xl shadow-lg bg-white hover:shadow-xl transition-all duration-300 cursor-pointer"
            :class="
              selected
                ? 'border-primary-700 ring-2 ring-primary-700'
                : 'border-gray-200'
            "
            @click="toggleSelect"
          >
            <img
              src="https://stitmadani.ac.id/wp-content/uploads/2023/11/5.jpg"
              alt=""
              class="w-36 h-20 rounded-xl"
            />
          </div>
          <div
            class="p-1 border rounded-xl shadow-lg bg-white hover:shadow-xl transition-all duration-300 cursor-pointer"
            :class="
              selected
                ? 'border-primary-700 ring-2 ring-primary-700'
                : 'border-gray-200'
            "
            @click="toggleSelect"
          >
            <img
              src="https://asset.kompas.com/crops/SjtW5lnymfzfHSa4UTTdHUgs9hk=/0x105:680x558/1200x800/data/photo/2022/10/09/63429e3a6ec3d.png"
              alt=""
              class="w-36 h-20 rounded-xl"
            />
          </div>
        </div>
        <div class="mt-4 flex justify-between">
          <p>Total Pembayaran</p>
          <p>100.000 Rp</p>
        </div>
      </div>
    </div>

    <!-- progress  wrapper -->
    <div
      class="fixed bottom-10 left-1/2 transform -translate-x-1/2 w-full max-w-md px-6 z-50"
    >
      <!-- Step Text -->
      <p class="text-sm text-center text-primary-900 mb-2">
        Step {{ currentStep }} of {{ totalSteps }}
      </p>

      <!-- Buttons -->
      <div class="flex justify-between">
        <button
          @click="prevStep"
          :disabled="currentStep === 1"
          class="px-4 py-2 border-primary-700 border-2 text-primary-700 rounded-md disabled:opacity-50"
        >
          Back
        </button>

        <button
          @click="handleNextButton"
          :disabled="currentStep === totalSteps"
          class="px-4 py-2 bg-primary-600 text-white rounded-md disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>

    <div
      class="fixed bottom-0 left-0 w-full h-3 bg-gray-300 overflow-hidden z-50"
    >
      <div
        class="h-full bg-primary-600 transition-all duration-500 ease-in-out"
        :style="{ width: handlePercent + '%' }"
      ></div>
    </div>
  </div>
</template>

<script setup>
import { computed, defineAsyncComponent, ref } from "vue";
import router from "@/router";
import CustomButton from "@/components/Button/CustomButton.vue";
import usePage from "@/stores/usePage";

const TextInput = defineAsyncComponent(() =>
  import("@/components/Input/TextInput.vue")
);

const selected = ref(false);

const toggleSelect = () => {
  selected.value = !selected.value;
};

const page = usePage();
const namaPemilik = ref("");
const alamatPemilik = ref("");
const namaToko = ref("");
const alamatToko = ref("");
const currentStep = ref(1);
const totalSteps = ref(4);

const prevStep = () => {
  currentStep.value--;
};

const handlePercent = computed(() => {
  return (currentStep.value / totalSteps.value) * 100;
});

const handleNextButton = () => {
  currentStep.value++;
};
const sendEmailVerification = () => {
  toggleVerifyEmail();
  handleVerifyButton();
};
</script>

<style>
body,
html {
  margin: 0;
  padding: 0;
  height: 100%;
  width: 100%;
  overflow: hidden;
}

.bg-kasir {
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' version='1.1' xmlns:xlink='http://www.w3.org/1999/xlink' xmlns:svgjs='http://svgjs.dev/svgjs' width='480' height='480' preserveAspectRatio='none' viewBox='0 0 480 480'%3e%3cg mask='url(%26quot%3b%23SvgjsMask1029%26quot%3b)' fill='none'%3e%3crect width='480' height='480' x='0' y='0' fill='rgba(16%2c 117%2c 102%2c 1)'%3e%3c/rect%3e%3cpath d='M110.87 256.81L115.76 256.81L115.76 261.7L110.87 261.7z' fill='rgba(178%2c 172%2c 136%2c 1)'%3e%3c/path%3e%3cpath d='M296.2 150.28L341.25 150.28L341.25 184.23L296.2 184.23z' fill='rgba(178%2c 172%2c 136%2c 1)'%3e%3c/path%3e%3cpath d='M172.96 104.04 a18.8 18.8 0 1 0 37.6 0 a18.8 18.8 0 1 0 -37.6 0z' fill='rgba(195%2c 176%2c 145%2c 1)'%3e%3c/path%3e%3cpath d='M142.61 367.17L146.41 367.17L146.41 409.09L142.61 409.09z' fill='rgba(178%2c 172%2c 136%2c 1)'%3e%3c/path%3e%3cpath d='M272.73 449.64L274.26 449.64L274.26 451.17L272.73 451.17z' stroke='rgba(178%2c 172%2c 136%2c 1)'%3e%3c/path%3e%3cpath d='M183.15 379.05 a4.24 4.24 0 1 0 8.48 0 a4.24 4.24 0 1 0 -8.48 0z' stroke='rgba(178%2c 172%2c 136%2c 1)'%3e%3c/path%3e%3cpath d='M307.04 396.58a26.38 26.38 0 1 0 42.1 31.79z' fill='rgba(195%2c 176%2c 145%2c 1)'%3e%3c/path%3e%3cpath d='M318.99 30.63a26.66 26.66 0 1 0-3.51-53.21z' fill='rgba(178%2c 172%2c 136%2c 1)'%3e%3c/path%3e%3cpath d='M220.16 125.04L259.99 125.04L259.99 164.87L220.16 164.87z' fill='rgba(195%2c 176%2c 145%2c 1)'%3e%3c/path%3e%3cpath d='M-37.33 223.68 a40.42 40.42 0 1 0 80.84 0 a40.42 40.42 0 1 0 -80.84 0z' fill='rgba(195%2c 176%2c 145%2c 1)'%3e%3c/path%3e%3cpath d='M94.04 342.04L123.06 342.04L123.06 371.06L94.04 371.06z' stroke='rgba(195%2c 176%2c 145%2c 1)'%3e%3c/path%3e%3cpath d='M299.96 237.64L344.23 237.64L344.23 281.91L299.96 281.91z' stroke='rgba(195%2c 176%2c 145%2c 1)'%3e%3c/path%3e%3cpath d='M230.66 464.51a0.46 0.46 0 1 0-0.92 0.05z' fill='rgba(178%2c 172%2c 136%2c 1)'%3e%3c/path%3e%3c/g%3e%3cdefs%3e%3cmask id='SvgjsMask1029'%3e%3crect width='480' height='480' fill='white'%3e%3c/rect%3e%3c/mask%3e%3c/defs%3e%3c/svg%3e");
  background-position: center;
  background-size: cover;
}
</style>
