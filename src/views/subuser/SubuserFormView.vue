<template>
  <PageContainer
    :title="isEdit ? 'Ubah Karyawan' : 'Tambah Karyawan'"
    :subtitle="
      isEdit ? 'Mengubah detail karyawan...' : 'Menambah daftar karyawan...'
    "
    enable-back
    @back="$emit('closeForm')"
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
              v-model="form.password"
              type="password"
              name="password"
              label="Password"
              placeholder="Masukkan password..."
              class="col-span-2 lg:col-span-1"
            />
            <TextInput
              v-model="form.name"
              name="name"
              label="Nama"
              placeholder="Masukkan nama..."
              class="col-span-2 lg:col-span-1"
            />
          </div>
          <div class="flex justify-center pt-4">
            <CustomButton
              size="xl"
              label="Add"
              :icon="Plus"
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
                  :label="permission.name"
                  :is-active="
                    form.permissions
                      ? form.permissions
                          .map((perm) => perm.code)
                          .includes(permission.code)
                      : false
                  "
                  @switch="
                    (newVal) =>
                      newVal
                        ? form.permissions.push(permission.code)
                        : form.permissions.splice(
                            form.permissions.indexOf(permission.code),
                            1
                          )
                  "
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
import { Users, Plus } from "lucide-vue-next";
import {
  defineProps,
  ref,
  onMounted,
  defineAsyncComponent,
  reactive,
} from "vue";
import PageContainer from "@/views/PageContainer.vue";
import axios from "axios";
import FormCard from "@/components/Card/FormCard.vue";
import CustomButton from "@/components/Button/CustomButton.vue";
import SwitchInput from "@/components/Input/SwitchInput.vue";
import useToast from "@/stores/useToast";

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

const emit = defineEmits(["closeForm"]);

const toast = useToast();

const permissionList = ref([]);

const form = reactive({
  id: props.subuserData ? props.subuserData.id : "",
  name: props.subuserData ? props.subuserData.name : "",
  email: props.subuserData ? props.subuserData.email : "",
  password: props.subuserData ? props.subuserData.password : "",
  permissions: props.subuserData ? props.subuserData.permissions : [],
});

onMounted(() => {
  fetchPermissions();

  console.log(form);
});

const submitSubuser = async () => {
  if (validateForm()) {
    if (props.isEdit) {
      const { data } = await axios.put(
        `${process.env.VUE_APP_API_BASE_URL}/api/subusers`,
        {
          id: form.id,
          email: form.email,
          password: form.password,
          name: form.name,
          permissions: form.permissions,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
          },
          withCredentials: true,
        }
      );
    } else {
      const { data } = await axios.post(
        `${process.env.VUE_APP_API_BASE_URL}/api/subusers`,
        {
          shop_id: "76L1",
          email: form.email,
          password: form.password,
          name: form.name,
          permissions: form.permissions,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
          },
          withCredentials: true,
        }
      );
    }

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

      emit("closeForm");
    }
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

const fetchPermissions = async () => {
  const { data } = await axios.get(
    `${process.env.VUE_APP_API_BASE_URL}/api/permissions?shop_id=76L1`,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
      },
      withCredentials: true,
    }
  );

  permissionList.value = data.data;
};
</script>
