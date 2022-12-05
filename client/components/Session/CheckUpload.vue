<template>
   <div v-if="showUpload">
      <img :src="previewImage" class="uploading-image" />
      <input type="file" accept="image/jpeg" @change=uploadImage>
      <div>
        <button @click='submitImage'>Submit Image</button>
        <button @click='skipCheck'>Skip Check</button>
      </div>
   </div>
</template>

<script>
    export default {
        name:'CheckUpload',
        props: {
            showUpload: {
                type: Boolean,
                required: true
            }
        },
        data(){
            return{
               previewImage:null,
               showUpload:false
            }
        },
        methods:{
            uploadImage(e){
                const image = e.target.files[0];
                const reader = new FileReader();
                reader.readAsDataURL(image);
                console.log(image);
                reader.onload = e =>{
                    this.previewImage = e.target.result;
                    console.log(this.previewImage);
                };
            },
            submitImage
        }
     }  // missing closure added
</script>



<style>
   .uploading-image{
     display:flex;
     max-width: 100%;
     height: auto;
   }
 </style>