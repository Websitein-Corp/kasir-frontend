<template>
  <PageContainer
    title="Pilihan Unggah"
    subtitle="
      Pilih yang ingin diunggah...
    "
  >
    <div class="grid grid-cols-2 gap-8 p-8">
      <FormCard
        v-for="upload in uploadList"
        v-bind:key="upload.id"
        :title="upload.name"
        :icon="upload.icon"
        class="col-span-2 lg:col-span-1 hover:shadow-2xl cursor-pointer transition-all"
        @click="pickUpload(upload.id)"
      >
        <div>{{ upload.desc }}</div>
      </FormCard>
    </div>
  </PageContainer>
</template>

<script setup>
import { CookingPot, Package, ShoppingBasket } from "lucide-vue-next";
import { ref, onMounted } from "vue";
import PageContainer from "@/views/PageContainer.vue";
import { axios } from "@/sdk/axios";
import FormCard from "@/components/Card/FormCard.vue";
import useToast from "@/stores/useToast";
import router from "@/router";
import useAuth from "@/stores/useAuth";
import { useRoute } from "vue-router";

const props = defineProps({
  subuserData: {
    type: Object,
    default: null,
  },
  isEdit: {
    type: Boolean,
    default: false,
  },
});

const auth = useAuth();
const toast = useToast();
const route = useRoute();

const uploadList = ref([
  {
    id: "product",
    name: "Produk",
    desc: "Unggah dan masukkan produk dalam jumlah banyak.",
    icon: Package,
  },
  {
    id: "ingredient",
    name: "Bahan Baku",
    desc: "Unggah dan masukkan bahan baku dalam jumlah banyak.",
    icon: ShoppingBasket,
  },
  {
    id: "recipe",
    name: "Resep",
    desc: "Unggah dan masukkan resep makanan dalam jumlah banyak.",
    icon: CookingPot,
  },
]);

onMounted(() => {
  //fetchUploadList();
});

const fetchUploadList = async () => {
  const { data } = await axios.get(
    `${process.env.VUE_APP_API_BASE_URL}/api/shops`,
    {
      headers: {
        Authorization: `Bearer ${auth.authToken}`,
      },
      withCredentials: true,
    }
  );

  uploadList.value = data.data;
};

const pickUpload = (id) => {
  router.push(`/upload/${id}`);
};
</script>
