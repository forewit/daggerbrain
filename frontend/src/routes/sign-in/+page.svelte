<script lang="ts">
  import { SignIn } from "svelte-clerk";

  let { data } = $props();
</script>

<div class="min-h-[60vh] flex items-center justify-center px-4 py-16">
  <div class="w-full max-w-md">
    <SignIn
      redirectUrl={data.redirectUrl}
      afterSignInUrl={data.redirectUrl}
      afterSignUpUrl={data.redirectUrl}
    />
  </div>
</div>

