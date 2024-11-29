<template>
  <PageContainer
    title="Supplier Detail"
    subtitle="Tambat/Edit supplier yang ada..."
  >
    <!-- Apply a max-height to the form and enable scrolling -->
    <form @submit.prevent="handleSubmit" class="max-h-[95vh] overflow-y-auto">
      <!-- Supplier Detail -->
      <DashboardCard class="form-section">
        <!-- If not editing, show input field for supplier name -->
        <div v-if="!isEdit">
          <TextInput
            v-model="supplierDetail.name"
            name="supplier_name"
            type="text"
            label="Supplier Name"
            placeholder="Masukkan nama supplier"
            required
            class="w-full"
            pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$"
          />
        </div>

        <!-- If editing, show supplier name as static text -->
        <div v-else>
          <h2><strong>Supplier:</strong> {{ supplierDetail.name }}</h2>
        </div>

        <TextInput
          v-model="supplierDetail.address"
          name="address"
          type="text"
          label="Alamat"
          required
          class="w-full"
          pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$"
        />
        <TextInput
          v-model="supplierDetail.phone_number"
          name="phone_number"
          label="Nomor Telepon"
          placeholder="Nomor Telepon"
          required
          class="w-full"
          pattern="[0-9._%+-]+@[0-9.-]+\.{2,3}$"
        />
      </DashboardCard>

      <div
        class="flex flex-col space-y-4 w-full items-center justify-center mt-8"
      >
        <CustomButton
          class="w-1/4 bg-primary-600"
          type="submit"
          :loading="page.buttonLoading"
        >
          Submit
        </CustomButton>
        <CustomButton class="w-1/4 bg-red-600" @click="cancelForm">
          Cancel
        </CustomButton>
      </div>
    </form>
  </PageContainer>
</template>

<script setup>
import {
  ref,
  onMounted,
  defineProps,
  defineAsyncComponent,
  defineEmits,
} from "vue";
import { axios } from "@/sdk/axios";
import CustomButton from "@/components/Button/CustomButton.vue";
import DashboardCard from "@/components/Card/DashboardCard.vue";
import useAuth from "@/stores/useAuth";
import PageContainer from "@/views/PageContainer.vue";
import useToast from "@/stores/useToast";
import usePage from "@/stores/usePage";

const toast = useToast();
const auth = useAuth();
const page = usePage();

const TextInput = defineAsyncComponent(() =>
  import("@/components/Input/TextInput.vue")
);

const props = defineProps({
  isEdit: Boolean,
  supplierData: Object,
});

const emit = defineEmits(["cancel", "save"]);

const supplierDetail = ref({
  name: "",
  address: "",
  phone_number: "",
});

const loadExistingData = () => {
  console.log(props.supplierData);
  if (props.isEdit && props.supplierData) {
    supplierDetail.value = {
      name: props.supplierData.name || "",
      address: props.supplierData.address || "",
      phone_number: props.supplierData.phone_number || "",
    };
  }
};

const handleSubmit = async () => {
  page.buttonLoading = true;

  try {
    const requestBody = {
      name: supplierDetail.value.name,
      address: supplierDetail.value.address,
      phone_number: supplierDetail.value.phone_number,
    };

    let response;
    if (props.isEdit) {
      // Update existing supply
      response = await axios.put(
        `${process.env.VUE_APP_API_BASE_URL}/api/supplier?shop_id=${auth.shopId}`,
        requestBody,
        {
          headers: {
            Authorization: `Bearer ${auth.authToken}`,
          },
        }
      );
    } else {
      // Add new supply
      response = await axios.post(
        `${process.env.VUE_APP_API_BASE_URL}/api/supplier?shop_id=${auth.shopId}`,
        requestBody,
        {
          headers: {
            Authorization: `Bearer ${auth.authToken}`,
          },
        }
      );
    }

    toast.message = "Sukses";
    toast.description = response?.message || "Login berhasil!";
    toast.type = "SUCCESS";
    toast.trigger();
    emit("save");
  } catch (error) {
    toast.message = "Gagal";
    toast.description = error.response?.data.message || error.message;
    toast.type = "FAILED";
    toast.trigger();
  }
};

const cancelForm = () => {
  emit("cancel");
};

onMounted(() => {
  if (props.isEdit) {
    loadExistingData();
  }
});
</script>
