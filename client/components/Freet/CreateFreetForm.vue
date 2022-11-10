<!-- Form for creating freets (block style) -->

<script>
import BlockForm from '@/components/common/BlockForm.vue';

export default {
  name: 'CreateFreetForm',
  mixins: [BlockForm],
  data() {
    return {
      url: '/api/freets',
      method: 'POST',
      hasBody: true,
      fields: [
        {id: 'content', label: 'Content', value: ''},
        {id: 'freetType', label: 'Which type of post are you making?', value:'', placeholder: "Enter 'News' or 'Fibe' for News or Fibe post"},
        {id: 'sourceLink', label: "Enter a news source", value: ''},
        {id: 'emoji', label: "Enter an emoji (any one-word descriptive term you want, for now)", value: ''}
      ],
      title: 'Create a freet',
      refreshFreets: true,
      callback: () => {
        const message = 'Successfully created a freet!';
        this.$set(this.alerts, message, 'success');
        // Delete this success message after 3 seconds
        setTimeout(() => this.$delete(this.alerts, message), 3000);
      },
    };
  }
};
</script>
