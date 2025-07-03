<script lang="ts">
  import { browser, dev } from "$app/environment";
  import Screen from "$lib/components/dashboard/screen.svelte";

  // Fully Refresh page after 2 hours
  if (browser)
    setInterval(
      () => {
        location.reload();
      },
      2 * 60 * 60 * 1000
    );
</script>

<div class="h-screen">
  <img src="/ide-expo.png" alt="IDE Expo" class="w-full h-full object-cover" />
</div>
