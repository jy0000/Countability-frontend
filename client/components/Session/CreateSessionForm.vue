<!-- Form for creating sessions (block style) -->

<script>
import BlockForm from '@/components/common/BlockForm.vue';

export default {
  name: 'CreatePostForm',
  mixins: [BlockForm],
  data() {
    return {
      url: '/api/sessions',
      method: 'POST',
      hasBody: true,
      fields: [
        {id: 'content', label: 'Content', value: ''},
        {id: 'sessionType', label: 'Which type of session are you making?', value:'', placeholder: "Enter 'News' or 'Fibe' for News or Fibe session"},
        {id: 'sourceLink', label: "Enter a news source", value: ''},
        {id: 'emoji', label: "Enter an emoji (any one-word descriptive term you want, for now)", value: ''}
        // {id: 'duration', label: "Enter duration (minutes)", value: ''}
        // {id: 'frequency', label: "Enter check frequency (minutes)", value: ''}
        // {id: 'goals', label: "Enter goals", value: ''}
      ],
      title: 'Create a session',
      refreshPosts: true,
      callback: () => {
        const message = 'Successfully created a session!';
        this.$set(this.alerts, message, 'success');
        // Delete this success message after 3 seconds
        setTimeout(() => this.$delete(this.alerts, message), 1000);
      },
    };
  }
};
</script>
