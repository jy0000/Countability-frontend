<!-- Form for creating posts (block style) -->
<!-- <template>
  <button @posted="this.$parent.endSession()"/>
</template> -->
<script>
import BlockForm from '@/components/common/BlockForm.vue';

export default {
  name: 'CreatePostForm',
  mixins: [BlockForm],
  data() {
    return {
      url: '/api/posts',
      method: 'POST',
      hasBody: true,
      fields: [
      {id: 'caption', label: 'Your work in one sentence', value:'', placeholder: ""},
      {id: 'progressReflection', label: 'Reflection', value: ''},
      {id: 'focusReflection', label: 'How focused where you on a scale from 1 to 10', value: ''},
      {id: 'photo', label: 'Photo', value: this.$parent.photos},
      ],
      title: 'Reflecting on my work',
      refreshPosts: true,
      callback: () => {
        const message = 'Successfully created a post!';
        this.$set(this.alerts, message, 'success');
        // Delete this success message after 3 seconds
        setTimeout(() => this.$delete(this.alerts, message), 1000);
      },
    };
  }
};
</script>
