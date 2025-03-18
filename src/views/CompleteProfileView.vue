<template>
  <div class="relative w-screen h-screen overflow-hidden">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="100%"
      height="100%"
      preserveAspectRatio="none"
      viewBox="0 0 1980 1080"
    >
      <g mask='url("#SvgjsMask1118")' fill="none">
        <rect
          width="1980"
          height="1080"
          x="0"
          y="0"
          fill="rgba(205, 250, 238, 1)"
        ></rect>
        <path
          d="M 0,130 C 79.2,165.6 237.6,312.6 396,308 C 554.4,303.4 633.6,84.8 792,107 C 950.4,129.2 1029.6,410.2 1188,419 C 1346.4,427.8 1425.6,173.4 1584,151 C 1742.4,128.6 1900.8,275.8 1980,307L1980 1080L0 1080z"
          fill="rgba(15, 146, 126, 1)"
        ></path>
        <path
          d="M 0,548 C 79.2,647.2 237.6,1002.8 396,1044 C 554.4,1085.2 633.6,796 792,754 C 950.4,712 1029.6,866.8 1188,834 C 1346.4,801.2 1425.6,572.6 1584,590 C 1742.4,607.4 1900.8,854.8 1980,921L1980 1080L0 1080z"
          fill="rgba(20, 77, 69, 1)"
        ></path>
      </g>
      <defs>
        <mask id="SvgjsMask1118">
          <rect width="1980" height="1080" fill="#ffffff"></rect>
        </mask>
      </defs>
    </svg>
    <!-- content -->
    <div
      class="absolute inset-0 flex items-center justify-center overflow-y-auto"
    >
      <div
        class="flex flex-col min-w-fit w-10/12 md:w-4/12 h-screen justify-center items-center border border-1 rounded-xl bg-white shadow-lg z-10 overflow-y-auto"
      >
        <div class="text-center mb-8">
          <h1 class="text-2xl md:text-3xl font-bold text-gray-800">
            Kasirin Plans
          </h1>
          <p class="text-sm md:text-base text-gray-600">
            Start Free and Pay as You Go
          </p>
        </div>
        <div class="flex flex-row space-x-4">
          <!-- 1 card component -->
          <div
            class="max-w-sm mx-auto rounded-2xl shadow-lg border border-gray-200 p-6 bg-white"
          >
            <h2 class="text-lg font-semibold text-gray-700 mb-1">Free Trial</h2>
            <p class="text-sm text-gray-500 mb-4">
              Pilihan terbaik untuk Usaha Baru
            </p>

            <div class="text-center mb-4">
              <!-- <p class="text-sm line-through text-gray-400">Rp 89.900</p>
                 <span
                   class="text-xs bg-purple-100 text-primary-700 px-2 py-1 rounded-full font-semibold"
                   >DISKON 86%</span
                 > -->
              <br />
              <br />
              <p class="text-3xl font-bold text-primary-700 mt-2">
                Rp FREE<span class="text-base font-normal">/ 1 bln</span>
              </p>
            </div>

            <button
              class="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-2 rounded-lg mb-2"
            >
              Pilih Paket
            </button>
            <!-- <p class="text-xs text-gray-500 text-center mb-4">
                 Perpanjangan Rp29.900/bln untuk 4 tahun.<br />Bisa dibatalkan kapan
                 saja.
               </p> -->
            <ul class="text-sm space-y-2 text-gray-700">
              <li>✔ 1 Outlet</li>
              <li>✔ 5 User dan user</li>
              <li>✔ 100 Product List</li>
              <li>✔ Unlimited Ingredient List</li>
              <li>✔ Unlimited Email</li>
              <li>✔ Payment Tunai</li>
              <li>✔ Semua Laporan</li>
              <li>✔ Android, IOS, PC Platform</li>
              <li class="text-gray-400">✖ Bayar PPOB</li>
            </ul>
          </div>

          <!-- 2 card component -->
          <div
            class="max-w-sm mx-auto rounded-2xl shadow-lg border border-gray-200 p-6 bg-white"
          >
            <h2 class="text-lg font-semibold text-gray-700 mb-1">Kasirin</h2>
            <p class="text-sm text-gray-500 mb-4">
              Pilihan terbaik untuk Bisnis Pintar
            </p>

            <div class="text-center mb-4">
              <p class="text-sm line-through text-gray-400">Rp 1.799.000</p>
              <span
                class="text-xs bg-purple-100 text-primary-700 px-2 py-1 rounded-full font-semibold"
                >DISKON 67%</span
              >
              <p class="text-3xl font-bold text-primary-700 mt-2">
                Rp 589.000<span class="text-base font-normal">/bln</span>
              </p>
            </div>

            <button
              class="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-2 rounded-lg mb-2"
            >
              Pilih Paket
            </button>

            <ul class="text-sm space-y-2 text-gray-700">
              <li>✔ 1 Outlet</li>
              <li>✔ Unlimited Users</li>
              <li>✔ Unlimited Product List</li>
              <li>✔ Unlimited Ingredient List</li>
              <li>✔ Unlimited Email</li>
              <li>✔ Qris and Tunai Payment</li>
              <li>✔ Semua laporan</li>
              <li>✔ Platform Android, PC IOS</li>
              <li>✔ Bayar PPOB</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineAsyncComponent, ref } from "vue";
import router from "@/router";
import CustomButton from "@/components/Button/CustomButton.vue";
import usePage from "@/stores/usePage";

const TextInput = defineAsyncComponent(() =>
  import("@/components/Input/TextInput.vue")
);

const page = usePage();
const email = ref("");
const password = ref("");
const isVerifyEmail = ref(false);
const isVerifyButtonDisabled = ref(false);
const countdown = ref(0);

const toggleVerifyEmail = () => {
  isVerifyEmail.value = true;
};

const handleVerifyButton = () => {
  if (isVerifyButtonDisabled.value) return;

  isVerifyButtonDisabled.value = true;
  countdown.value = 5; //ini permisalan aja;

  const timer = setInterval(() => {
    countdown.value--;
    if (countdown.value <= 0) {
      clearInterval(timer);
      isVerifyButtonDisabled.value = false;
    }
  }, 1000);
};

const redirectToLogin = () => {
  router.push("/login");
};

const formAction = () => {
  sendEmailVerification();
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
