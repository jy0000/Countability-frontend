<!-- Form for creating posts (block style) -->

<script>
import BlockForm from '@/components/common/BlockForm.vue';

export default {
  name: 'CreateFriendForm',
  mixins: [BlockForm],
  data() {
    return {
      url: '/api/friendRequest/',
      method: 'POST',
      refreshOutFriendRequest: true,
      refreshInFriendRequest: true,
      hasBody: true,
      fields: [
        {id: 'username', label: 'Username', value: ''},
      ],
      title: 'Send friend request',

      callback: () => {
        const message = 'Friend request sent!'; 
        this.$set(this.alerts, message, 'success');
        // Delete this success message after 3 seconds
        setTimeout(() => this.$delete(this.alerts, message), 1000);
      }
    };
  }
};
</script>
