<!-- Page for account settings and management -->
<!-- User should be authenticated in order to see this page -->

<template>
  <main>
    <section>
      <!-- Logged in already -->
      <header>
        <h2 class="box">Hi, @{{ $store.state.username }}!</h2>
      </header>
      <PointComponent />
    </section>
    <section>
      <header>
        <h2 class="box">Account management</h2>
      </header>
      <ChangeUsernameForm />
      <ChangePasswordForm />
      <LogoutForm />
      <DeleteAccountForm />
    </section>
  </main>
</template>

<script>
import PointComponent from '@/components/Point/PointComponent.vue';
import ChangeUsernameForm from '@/components/Account/ChangeUsernameForm.vue';
import ChangePasswordForm from '@/components/Account/ChangePasswordForm.vue';
import DeleteAccountForm from '@/components/Account/DeleteAccountForm.vue';
import LogoutForm from '@/components/Account/LogoutForm.vue';

export default {
  name: 'AccountPage',
  components: {
    ChangeUsernameForm,
    ChangePasswordForm,
    DeleteAccountForm,
    LogoutForm,
    PointComponent,
  }
};
</script>


<style scoped>
/* CSS */
.box {
  background-color: #c2fbd7;
  border-radius: 5px;
  box-shadow: rgba(44, 187, 99, .2) 0 -25px 18px -14px inset,rgba(44, 187, 99, .15) 0 1px 2px,rgba(44, 187, 99, .15) 0 2px 4px,rgba(44, 187, 99, .15) 0 4px 8px,rgba(44, 187, 99, .15) 0 8px 16px,rgba(44, 187, 99, .15) 0 16px 32px;
  color: green;
  display: inline-block;
  font-family: CerebriSans-Regular,-apple-system,system-ui,Roboto,sans-serif;
  padding: 7px 20px;
  text-align: center;
  text-decoration: none;
  border: 0;
  font-size: 30px;
  margin-top: 30px;
  margin-bottom: 10px;
}

</style>
