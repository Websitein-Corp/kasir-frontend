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

    <!-- Login Form -->
    <div
      class="loginview absolute inset-0 flex items-center justify-center overflow-y-auto"
    >
      <div
        class="flex flex-row min-w-fit w-10/12 md:w-4/12 h-[25rem] md:h-[30rem] border border-1 rounded-xl bg-white shadow-lg z-10 overflow-y-auto"
      >
        <!-- Image will be hidden on small screens and visible on medium (tablet) and larger screens -->
        <div
          class="hidden md:flex flex-col items-center justify-center bg-kasir w-1/2 px-8 overflow-y-auto"
        >
          <h2 class="text-2xl font-semibold text-primary-100 md:text-3xl">
            Mari bangun bisnismu bersama
            <span class="text-red-900">Kasirin</span>
          </h2>
          <p class="mt-4 text-[#F5F5DC] text-sm md:text-base">
            Langkah awal untuk bisnis cerdas dimulai di sini
          </p>
          <div class="mt-6 flex justify-center">
            <div
              class="bg-gray-200 p-2 rounded-full w-10 h-10 flex items-center justify-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="w-6 h-6 text-gray-700"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          </div>
        </div>

        <div
          class="flex flex-col items-center justify-center p-4 w-full md:w-1/2 overflow-y-auto"
        >
          <div class="flex flex-row items-center justify-center min-h-fit">
            <img
              src="../../public/img/logo.svg"
              alt="logo"
              class="w-12 md:w-16 flex-shrink-0"
            />
            <h1 class="pl-2 text-xl">
              {{ isVerifyEmail ? "Email Verification" : "Register" }}
            </h1>
          </div>

          <div class="flex flex-col mt-4 w-full">
            <TextInput
              v-if="!isVerifyEmail"
              v-model="email"
              name="email"
              type="email"
              label="EMAIL"
              placeholder="Enter your email"
            />

            <p
              v-if="isVerifyEmail"
              class="text-base md:text-xl text-center py-2 cursor-pointer w-48 sm:w-96 mx-auto"
            >
              Akun Anda hampir siap! Silakan buka email Anda dan selesaikan
              proses verifikasi untuk mulai menggunakan Kasirin.
            </p>
          </div>

          <p
            class="text-primary-700 text-center py-2 cursor-pointer underline"
            @click="redirectToLogin"
            v-if="!isVerifyEmail"
          >
            Already Have an Account?
          </p>

          <CustomButton
            :label="isVerifyEmail ? 'Kirim Ulang' : 'Verify Email'"
            class="bg-primary-700 hover:bg-primary-600 rounded-md text-xl text-white w-full mt-6 px-8 py-2 mx-auto"
            @click="formAction"
            icon-side="left"
            :disabled="isVerifyButtonDisabled"
            :loading="page.buttonLoading"
          />
          <p
            v-if="isVerifyButtonDisabled"
            class="text-base md:text-xl mt-4 w-48 sm:w-96 text-center"
          >
            Anda dapat mengirim ulang dalam {{ countdown }} detik.
          </p>
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
