<template>
  <div class="relative w-screen h-screen">
    <!-- SVG as the background -->
    <svg
      xmlns="http://www.w3.org/2000/svg"
      version="1.1"
      xmlns:xlink="http://www.w3.org/1999/xlink"
      xmlns:svgjs="http://svgjs.dev/svgjs"
      width="1980"
      height="1080"
      preserveAspectRatio="none"
      viewBox="0 0 1980 1080"
    >
      <g mask='url("#SvgjsMask1020")' fill="none">
        <rect
          width="1980"
          height="1080"
          x="0"
          y="0"
          fill="rgba(205, 250, 238, 1)"
        ></rect>
        <path
          d="M 0,907 C 132,733.6 396,111.8 660,40 C 924,-31.8 1056,547.6 1320,548 C 1584,548.4 1848,143.2 1980,42L1980 1080L0 1080z"
          fill="rgba(18, 93, 83, 1)"
        ></path>
        <path
          d="M 0,376 C 79.2,425.6 237.6,644.4 396,624 C 554.4,603.6 633.6,210.2 792,274 C 950.4,337.8 1029.6,937.2 1188,943 C 1346.4,948.8 1425.6,299 1584,303 C 1742.4,307 1900.8,831 1980,963L1980 1080L0 1080z"
          fill="rgba(15, 146, 126, 1)"
        ></path>
        <path
          d="M 0,355 C 132,447.8 396,794.4 660,819 C 924,843.6 1056,475 1320,478 C 1584,481 1848,762.8 1980,834L1980 1080L0 1080z"
          fill="rgba(22, 182, 153, 1)"
        ></path>
      </g>
      <defs>
        <mask id="SvgjsMask1020">
          <rect width="1980" height="1080" fill="#ffffff"></rect>
        </mask>
      </defs>
    </svg>

    <!-- Login Form -->
    <div class="loginview absolute inset-0 flex items-center justify-center">
      <div
        class="flex flex-row min-w-fit w-4/12 h-[45vh] border border-1 rounded-xl bg-white shadow-lg z-10"
      >
        <!-- Image will be hidden on small screens and visible on medium (tablet) and larger screens -->
        <img
          src="../../public/img/login.png"
          alt="login image"
          class="hidden md:block"
        />

        <div class="flex flex-col items-center justify-center py-4 px-8 w-full">
          <div class="flex flex-row items-center justify-center">
            <img src="../../public/img/logo.svg" alt="logo" class="w-16" />
            <h1 class="pl-2 text-xl">
              {{ isForgotPassword ? "Forgot Password" : "Login" }}
            </h1>
          </div>

          <div class="flex flex-col mt-4">
            <CustomInput
              v-model="email"
              name="email"
              type="email"
              label="EMAIL"
              placeholder="Enter your email"
            />
            <CustomInput
              v-if="!isForgotPassword"
              v-model="password"
              name="password"
              type="password"
              label="PASSWORD"
              placeholder="Enter your password"
            />
          </div>

          <p
            class="text-primary-700 text-center py-2 cursor-pointer"
            @click="toggleForgotPassword"
          >
            {{ isForgotPassword ? "Login" : "Forgot password?" }}
          </p>

          <button
            class="bg-primary-700 rounded-md text-xl text-white w-3/4 px-8 py-2 mx-auto"
            @click="formAction"
          >
            {{ isForgotPassword ? "Send" : "Login" }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineAsyncComponent, ref } from "vue";
import axios from "axios";

const CustomInput = defineAsyncComponent(() =>
  import("@/components/CustomInput/CustomInput.vue")
);

const email = ref("");
const password = ref("");

const isForgotPassword = ref(false);

const toggleForgotPassword = () => {
  isForgotPassword.value = !isForgotPassword.value;
};

const formAction = () => {
  console.log(process.env);

  if (isForgotPassword.value) {
    sendResetPasswordEmail();
  } else {
    login();
  }
};

const login = async () => {
  try {
    const baseURL = process.env.VUE_APP_API_BASE_URL;
    const endpoint = `${baseURL}/api/auth/login`;

    const response = await axios.post(endpoint, {
      email: email.value,
      password: password.value,
    });

    console.log("Login successful:", response.data);

    const token = response.data.token;

    if (token) {
      localStorage.setItem("auth_token", token);
      console.log("Token saved to localStorage:", token);
    } else {
      console.error("No token received in the response");
    }
    alert("Login successful");
  } catch (error) {
    console.error("Login failed:", error.response?.data || error.message);
  }
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
</style>
