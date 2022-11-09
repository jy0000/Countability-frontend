<!-- Form for creating freets (block style) -->

<script>
import InlineForm from '@/components/common/InlineForm.vue';

export default {
  name: 'CreateTrustForm',
  mixins: [InlineForm],
  data() {
    return {
      url: '/api/trust',
      method: 'POST',
      hasBody: true,
      fields: [
        {id: 'username', label: 'Enter the Fritter ID of the person to trust.', value: ''},
      ],
      title: 'Create a trust',
      refreshFreets: true,
      callback: () => {
        const message = 'Successfully created a trust!';
        this.$set(this.alerts, message, 'success');
        // Delete this success message after 3 seconds
        setTimeout(() => this.$delete(this.alerts, message), 3000);
      }
    };
  }
};
</script>
