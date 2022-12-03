<!-- Form for creating posts (block style) -->

<script>
import BlockForm from '@/components/common/BlockForm.vue';

export default {
  name: 'CreateFriendForm',
  mixins: [BlockForm],
  data() {
    return {
      url: '/api/friend/',
      method: 'POST',
      hasBody: true,
      fields: [
        {id: 'username', label: 'Enter the Countability handle of the person to friend', value: ''},
      ],
      title: 'Create a friend',
      refreshFriend: true,
      // <!-- TODO Make friendrequests -->
      callback: () => {
        const message = 'Friend Request Sent!'; 
        this.$set(this.alerts, message, 'success');
        // Delete this success message after 3 seconds
        setTimeout(() => this.$delete(this.alerts, message), 3000);
      }
    };
  }
};
</script>
