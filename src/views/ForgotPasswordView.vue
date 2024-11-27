<template>
  <div class="relative w-screen h-screen overflow-hidden">
    <!-- Parent container wraps both the SVG and login view -->
    <svg
      xmlns="http://www.w3.org/2000/svg"
      version="1.1"
      xmlns:xlink="http://www.w3.org/1999/xlink"
      xmlns:svgjs="http://svgjs.dev/svgjs"
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

    <div
      class="loginview absolute inset-0 flex items-center justify-center overflow-y-auto"
    >
      <div
        class="flex flex-row min-w-fit w-10/12 md:w-5/12 h-[25rem] md:h-[30rem] min-h-fit border border-1 rounded-xl bg-white shadow-lg z-10 overflow-y-auto"
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
