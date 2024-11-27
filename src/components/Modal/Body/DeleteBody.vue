<template>
  <div class="flex justify-center items-center mb-4">
    <MessageCircleQuestion :stroke-width="1" size="150" />
  </div>
  <div class="flex justify-center text-center mt-8">
    {{ modal.props.label }}
  </div>
  <div class="flex justify-center mt-8 space-x-4">
    <CustomButton
      size="md"
      label="Batal"
      @click="modal.close()"
      class="border-2 border-slate-700 hover:bg-slate-100 text-primary-800"
    />
    <CustomButton
      size="md"
      label="Hapus"
      @click="handleDelete"
      class="bg-red-700 hover:bg-red-800"
    />
  </div>
</template>

<script setup>
import { ref } from "vue";
import CustomButton from "@/components/Button/CustomButton.vue";
import useModal from "@/stores/useModal";
import { axios } from "@/sdk/axios";
import { MessageCircleQuestion } from "lucide-vue-next";
import useAuth from "@/stores/useAuth";
import useToast from "@/stores/useToast";

const loading = ref(false);

const modal = useModal();
const auth = useAuth();
const toast = useToast();

const handleDelete = () => {
  axios
    .delete(modal.props.endpoint, {
      headers: {
        Authorization: `Bearer ${auth.authToken}`,
      },
      withCredentials: true,
    })
    .then(({ data }) => {
      if (data["error_type"]) {
        toast.message = "Gagal";
        toast.description = data.message;
        toast.type = "FAILED";
        toast.trigger();
      } else {
        toast.message = "Sukses";
        toast.description = data.message;
        toast.type = "SUCCESS";
        toast.trigger();

        modal.success = true;
        modal.callback();
      }
    })
    .finally(() => {
      modal.close();
    });
};
</script>
