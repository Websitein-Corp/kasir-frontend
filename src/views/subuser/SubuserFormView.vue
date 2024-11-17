<template>
  <PageContainer
    :title="isEdit ? 'Ubah Karyawan' : 'Tambah Karyawan'"
    :subtitle="
      isEdit ? 'Mengubah detail karyawan...' : 'Menambah karyawan baru...'
    "
    enable-back
    @back="$emit('formBack')"
  >
    <div class="grid grid-cols-3 gap-4">
      <FormCard
        title="Informasi Karyawan"
        :icon="Users"
        class="col-span-3 lg:col-span-2"
      >
        <div class="space-y-8">
          <div class="grid grid-cols-2 gap-4">
            <TextInput
              v-model="form.email"
              type="email"
              name="email"
              label="Email"
              placeholder="Masukkan email..."
              class="col-span-2 lg:col-span-1"
            />
            <TextInput
              v-model="form.name"
              name="name"
              label="Nama"
              placeholder="Masukkan nama..."
              class="col-span-2 lg:col-span-1"
            />
            <TextInput
              v-if="!isEdit"
              v-model="form.password"
              type="password"
              name="password"
              label="Password"
              placeholder="Masukkan password..."
              class="col-span-2 lg:col-span-1"
            />
            <TextInput
              v-if="!isEdit"
              v-model="form.passwordConfirmation"
              type="password"
              name="confirm_password"
              label="Konfirmasi Password"
              placeholder="Konfirmasi password..."
              class="col-span-2 lg:col-span-1"
            />
          </div>
          <div class="flex justify-center pt-4">
            <CustomButton
              size="xl"
              :label="isEdit ? 'Edit' : 'Add'"
              :icon="isEdit ? Pencil : Plus"
              class="bg-primary-700 hover:bg-primary-800"
              @click="submitSubuser"
            />
          </div>
        </div>
      </FormCard>
      <FormCard
        title="Akses Karyawan"
        :icon="Users"
        class="col-span-3 lg:col-span-1"
      >
        <div class="space-y-8">
          <div class="flex space-x-4 mt-6">
            <div class="flex-col space-y-4">
              <div
                v-for="(permission, index) in permissionList"
                v-bind:key="index"
                class="h-7 mt-1"
              >
                {{ permission.name }}
              </div>
            </div>
            <div class="flex-col space-y-4">
              <div
                v-for="(permission, index) in permissionList"
                v-bind:key="index"
                class="h-7"
              >
                <SwitchInput
                  :is-active="form.permission === permission.code"
                  @switch="(newVal) => changeRole(newVal, permission)"
                />
              </div>
            </div>
          </div>
        </div>
      </FormCard>
    </div>
  </PageContainer>
</template>

<script setup>
import { Users, Plus, Pencil } from "lucide-vue-next";
import { ref, onMounted, defineAsyncComponent, reactive } from "vue";
import PageContainer from "@/views/PageContainer.vue";
import { axios } from "@/sdk/axios";
import FormCard from "@/components/Card/FormCard.vue";
import CustomButton from "@/components/Button/CustomButton.vue";
import SwitchInput from "@/components/Input/SwitchInput.vue";
import useToast from "@/stores/useToast";
import useAuth from "@/stores/useAuth";

const TextInput = defineAsyncComponent(() =>
  import("@/components/Input/TextInput.vue")
);

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

const emit = defineEmits(["formBack", "submitSuccess"]);

const auth = useAuth();
const toast = useToast();

const permissionList = ref([]);

const form = reactive({
  id: props.subuserData ? props.subuserData.id : "",
  name: props.subuserData ? props.subuserData.name : "",
  email: props.subuserData ? props.subuserData.email : "",
  password: "",
  passwordConfirmation: "",
  permission: props.subuserData ? props.subuserData.permission : "",
});

onMounted(() => {
  fetchPermissions();
});

const submitSubuser = async () => {
  if (validateForm()) {
    if (props.isEdit) {
      axios
        .put(
          `${process.env.VUE_APP_API_BASE_URL}/api/subusers`,
          {
            id: form.id,
            email: form.email,
            name: form.name,
            permission: form.permission,
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
    } else {
      if (form.password !== form.passwordConfirmation) {
        toast.message = "Gagal";
        toast.description = "Konfirmasi password salah";
        toast.type = "FAILED";
        toast.trigger();
      } else {
        axios
          .post(
            `${process.env.VUE_APP_API_BASE_URL}/api/subusers`,
            {
              shop_id: auth.shopId,
              email: form.email,
              password: form.password,
              name: form.name,
              permission: form.permission,
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
    }
  }
};

const validateForm = () => {
  let isValid = true;

  Object.keys(form).forEach((field) => {
    if (!form[field] && field !== "id") {
      if (!props.isEdit || field !== "password") {
        toast.message = "Gagal";
        toast.description = `Kolom ${field} harus diisi!`;
        toast.type = "FAILED";
        toast.trigger();

        isValid = false;
      }
    }
  });

  return isValid;
};

const fetchPermissions = () => {
  axios
    .get(
      `${process.env.VUE_APP_API_BASE_URL}/api/permissions?shop_id=${auth.shopId}`,
      {
        headers: {
          Authorization: `Bearer ${auth.authToken}`,
        },
        withCredentials: true,
      }
    )
    .then(({ data }) => {
      permissionList.value = data.data;
    });
};

const changeRole = (newVal, permission) => {
  if (newVal) {
    form.permission = permission.code;
  } else {
    form.permission = "";
  }
};
</script>
