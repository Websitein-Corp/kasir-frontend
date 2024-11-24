<template>
  <div class="relative w-screen h-screen">
    <!-- Parent container wraps both the SVG and login view -->
    <svg
      xmlns="http://www.w3.org/2000/svg"
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

    <div
      class="loginview absolute inset-0 flex items-center justify-center overflow-y-auto"
    >
      <div
        class="flex flex-row min-w-fit w-10/12 md:w-5/12 h-[55vh] md:h-[45vh] min-h-fit border border-1 rounded-xl bg-white shadow-lg z-10 overflow-y-auto"
      >
        <div
          class="flex flex-col items-center justify-center p-4 w-full overflow-y-auto min-h-0"
        >
          <div class="flex flex-row items-center justify-center min-h-fit">
            <img
              src="../../public/img/logo.svg"
              alt="logo"
              class="w-12 md:w-16 flex-shrink-0"
            />
            <h1 class="pl-2 text-xl">Forgot Password</h1>
          </div>

          <div class="flex flex-col mt-4 w-full">
            <TextInput
              v-model="password"
              name="password"
              type="password"
              label="PASSWORD"
              placeholder="Enter your password"
            />
            <TextInput
              v-model="passwordValidation"
              name="passwordValidation"
              type="password"
              label="KONFIRMASI PASSWORD"
              placeholder="Konfirmasi password"
            />
          </div>

          <div class="flex flex-row items-center justify-center mt-4">
            <router-link to="/login" class="text-primary-600">
              Kembali ke login
            </router-link>
          </div>

          <button
            class="bg-primary-700 hover:bg-primary-600 rounded-md text-xl text-white w-full px-8 py-2 mx-auto mt-4"
            @click="formAction"
          >
            Ubah Password
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineAsyncComponent, ref, onMounted } from "vue";
import { axios } from "@/sdk/axios";
import router from "@/router";
import useToast from "@/stores/useToast";
import useAuth from "@/stores/useAuth";
import { useRoute } from "vue-router";

const TextInput = defineAsyncComponent(() =>
  import("@/components/Input/TextInput.vue")
);

const auth = useAuth();
const toast = useToast();
const route = useRoute();

const password = ref("");
const passwordValidation = ref("");
const token = ref(route.query.token || "");

const formAction = () => {
  forgotPassword();
};

const forgotPassword = async () => {
  if (password.value !== passwordValidation.value) {
    toast.message = "Gagal";
    toast.description = "Password tidak sama";
    toast.type = "FAILED";
    toast.trigger();
    return;
  }

  try {
    const baseURL = process.env.VUE_APP_API_BASE_URL;
    const endpoint = `${baseURL}/api/mail/forgot-password/change`;

    await axios
      .post(endpoint, {
        new_password: password.value,
        token: token.value,
      })
      .then((response) => {
        if (response.data["error_type"]) {
          toast.message = "Gagal";
          toast.description = response.data.message;
          toast.type = "FAILED";
          toast.trigger();
        } else {
          toast.message = "Sukses";
          toast.description = response.data.message;
          toast.type = "SUCCESS";
          toast.trigger();
        }
      });

    router.push("/login");
  } catch (error) {
    toast.message = "Gagal";
    toast.description = error.response?.data?.message || "Terjadi kesalahan";
    toast.type = "FAILED";
    toast.trigger();
  }
};

const checkToken = async () => {
  try {
    const baseURL = process.env.VUE_APP_API_BASE_URL;
    const endpoint = `${baseURL}/api/mail/forgot-password/check?token=${token.value}`;
    await axios.get(endpoint).then((response) => {
      if (response.data["error_type"]) {
        toast.message = "Gagal";
        toast.description = response.data.message;
        toast.type = "FAILED";
        toast.trigger();
        router.push("/login");
      }
    });
  } catch (error) {
    toast.message = "Gagal";
    toast.description = error.response?.data?.message || "Terjadi kesalahan";
    toast.type = "FAILED";
    toast.trigger();
    router.push("/login");
  }
};

onMounted(() => {
  token.value = route.query.token || "";
  console.log(token.value);

  checkToken();
});
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
