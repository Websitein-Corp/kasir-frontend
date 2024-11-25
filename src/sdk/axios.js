import axios from "axios";
import useAuth from "@/stores/useAuth";
import useToast from "@/stores/useToast";
import usePage from "@/stores/usePage";

const axiosInstance = axios.create();

axiosInstance.interceptors.response.use(
  function (response) {
    // if code 2xx
    const page = usePage();
    page.loading = false;

    return response;
  },
  function (error) {
    const auth = useAuth();
    const page = usePage();
    const toast = useToast();

    page.loading = false;

    // if code other than 2xx
    if (error.response.status === 401) {
      auth.handleUnauthenticated();
      return new Promise(() => {});
    } else if (error.response.status >= 500) {
      // if code is 5xx
      toast.message = "Gagal";
      toast.description = "Terjadi kesalahan, mohon coba lagi";
      toast.type = "FAILED";
      toast.trigger();

      auth.handleAxiosError();
      return new Promise(() => {});
    } else {
      toast.message = "Gagal";
      toast.description = error.response?.data.message || error.message;
      toast.type = "FAILED";
      toast.trigger();

      auth.handleAxiosError();
      return new Promise(() => {});
    }
  }
);

export { axiosInstance as axios };
