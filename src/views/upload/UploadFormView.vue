<template>
  <PageContainer
    :title="upload.title"
    :subtitle="upload.description"
    enable-back
    enable-router-back
    @back="$emit('formBack')"
  >
    <div class="grid grid-cols-3 gap-4">
      <FormCard title="Unggah Excel File" :icon="FileUp" class="col-span-3">
        <div class="space-y-8">
          <div class="grid grid-cols-2 gap-4">
            <div class="col-span-2 flex justify-center">
              <FileInput
                label="Unggah Excel File"
                :acceptedFiles="['csv', 'xlsx']"
                :clickable="true"
                @addedFile="
                  (file) => {
                    form.file = file.file;
                  }
                "
              />
            </div>
          </div>
          <div class="flex justify-center pt-4">
            <CustomButton
              size="xl"
              label="Unggah"
              :icon="Upload"
              class="bg-primary-700 hover:bg-primary-800"
              :loading="page.buttonLoading"
              @click="submitUpload"
            />
          </div>
        </div>
      </FormCard>
    </div>
  </PageContainer>
</template>

<script setup>
import { FileUp, Upload } from "lucide-vue-next";
import { computed, reactive } from "vue";
import PageContainer from "@/views/PageContainer.vue";
import { axios } from "@/sdk/axios";
import FormCard from "@/components/Card/FormCard.vue";
import CustomButton from "@/components/Button/CustomButton.vue";
import useToast from "@/stores/useToast";
import useAuth from "@/stores/useAuth";
import usePage from "@/stores/usePage";
import FileInput from "@/components/Input/File/FileInput.vue";
import { useRoute } from "vue-router";

const emit = defineEmits(["formBack", "submitSuccess"]);

const auth = useAuth();
const toast = useToast();
const page = usePage();
const route = useRoute();

const type = computed(() => {
  return route.params.type;
});

const upload = computed(() => {
  const types = {
    product: {
      title: "Unggah Produk",
      description: "Memasukkan produk dalam jumlah banyak...",
      endpoint: "/products/insert",
    },
    ingredient: {
      title: "Unggah Bahan Baku",
      description: "Memasukkan bahan baku dalam jumlah banyak...",
      endpoint: "/ingredients/insert",
    },
    recipe: {
      title: "Unggah Resep Makanan",
      description: "Memasukkan resep makanan dalam jumlah banyak...",
      endpoint: "/recipes/insert",
    },
  };

  return types[type.value];
});

const form = reactive({
  file: null,
});

const submitUpload = async () => {
  if (validateForm()) {
    page.buttonLoading = true;

    axios
      .post(
        `${process.env.VUE_APP_API_BASE_URL}/api/${upload.value.endpoint}`,
        {
          shop_id: auth.shopId,
          file: form.file,
        },
        {
          headers: {
            Authorization: `Bearer ${auth.authToken}`,
          },
          withCredentials: true,
        }
      )
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

          emit("submitSuccess");
        }
      });
  }
};

const validateForm = () => {
  let isValid = true;

  Object.keys(form).forEach((field) => {
    if (!form[field]) {
      toast.message = "Gagal";
      toast.description = `Kolom ${field} harus diisi!`;
      toast.type = "FAILED";
      toast.trigger();

      isValid = false;
    }
  });

  return isValid;
};
</script>
