<!-- Form for creating freets (block style) -->

<script>
import BlockForm from '@/components/common/BlockForm.vue';

export default {
  name: 'CreateTrustForm',
  mixins: [BlockForm],
  data() {
    return {
      url: '/api/trust/',
      method: 'POST',
      hasBody: true,
      fields: [
        {id: 'username', label: 'Enter the Fritter handle of the person to trust', value: ''},
      ],
      title: 'Create a trust',
      refreshTrust: true,
      callback: () => {
        const message = 'Successfully created trust between you to!';
        this.$set(this.alerts, message, 'success');
        // Delete this success message after 3 seconds
        setTimeout(() => this.$delete(this.alerts, message), 3000);
      }
    };
  }
};
</script>
