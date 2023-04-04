<template>
  <button data-bs-toggle="modal" data-bs-target="#imageUploadModal" class="btn btn-primary me-2 mt-2">
    <i class="bi bi-file-earmark-image-fill"></i> 
    IMG
  </button>
  
  <!-- Modal -->
  <div class="modal fade" id="imageUploadModal" tabindex="-1" aria-labelledby="imageUploadModalLabel" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5" id="imageUploadModalLabel">Upload an image</h1>
          <button id="closeImageUploadModal" type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
  
        <div class="modal-body">
  
          <div>
            <label for="formFileLg" class="form-label">Upload an image (max 1 MB size)</label>
            <input 
              @change="handleFileInput"
              class="form-control form-control-lg" 
              id="formFileLg" 
              type="file"
            >
          </div>
  
        </div>

        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
          <button type="button" class="btn btn-primary" @click="uploadToWeb3Storage">Upload image</button>
        </div>
      </div>
    </div>
  </div>
  </template>
  
  <script>
  import { useToast } from "vue-toastification/dist/index.mjs";

  export default {
    name: "Web3StorageImageUpload",
    emits: ["insertImage"],
  
    data()  {
      return {
        file: null,
        maxSize: 1 * 1024 * 1024, // 1 MB
      }
    },
  
    methods: {
      handleFileInput(event) {
        const uploadedFile = event.target.files[0];
        this.file = uploadedFile;
      },

      async uploadToWeb3Storage() {
        const file = this.file;

        if (!file) {
          console.error('No file selected');
          this.toast('No file selected', {type: "error"});
          return;
        }

        if (file.size > this.maxSize) {
          console.error('File is too large (max size is 1 MB)');
          this.toast('File is too large (max size is 1 MB)', {type: "error"});
          return;
        }

        const formData = new FormData();
        formData.append('file', file);

        const options = {
          method: 'POST',
          headers: {
            'accept': 'application/json',
            "Authorization": 'Bearer ' + this.$config.web3storageKey,
            "X-NAME": encodeURIComponent(file.name) // make name URI safe
          },
          body: formData
        };

        try {
          const response = await fetch('https://api.web3.storage/upload', options);

          if (!response.ok) {
            console.error('Failed to upload image:', response);
            this.toast('Failed to upload image', {type: "error"});
          } else {
            const data = await response.json();

            document.getElementById('closeImageUploadModal').click();

            //console.log("https://" + data.cid + ".ipfs.w3s.link/" + encodeURIComponent(file.name));
            //console.log("https://dweb.link/ipfs/" + data.cid + "/" + encodeURIComponent(file.name));

            this.$emit("insertImage", "https://" + data.cid + ".ipfs.w3s.link?img");
          }

          
        } catch (error) {
          console.error('Error uploading image:', error);
          this.toast('Error uploading image', {type: "error"});
        }
      }
    },

    setup() {
      const toast = useToast();

      return { toast }
    },
  }
  </script>