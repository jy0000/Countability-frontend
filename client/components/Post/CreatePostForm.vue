<!-- Form for creating posts (block style) -->

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
        {id: 'caption', label: 'Reflect on your work', value:'', placeholder: 'Write anything you want'},
        {id: 'content', label: 'Reflection', value: ''},
        {id: 'photo', label: 'Photo', value: ''},
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
