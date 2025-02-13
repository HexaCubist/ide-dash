<script lang="ts">
  import { page } from "$app/state";
  import { error } from "@sveltejs/kit";
  import type { ScreenData } from "$lib/screens.svelte.js";
  import Screen from "$lib/components/dashboard/screen.svelte";
  import EditForm from "$lib/components/editForm.svelte";
  import { enhance } from "$app/forms";
  const { id } = page.params;

  let { data } = $props();
</script>

<div class="card">
  <div class="card-body">
    <h1 class="card-title flex">
      <p class="grow">Screen Editor</p>

      <a href="../" class="btn btn-text">
        <p class="icon-[tabler--arrow-left]"></p>
        Back
      </a>
    </h1>
    <div
      class="aspect-video max-w-xs mx-auto card overflow-clip pointer-events-none bg-white text-black mb-4"
    >
      {#if data.currentScreen}
        <Screen screen={data.currentScreen}></Screen>
      {/if}
    </div>
    <!-- Edit Form -->
    <div
      class="card flex flex-row w-full bg-base-200 mb-4 items-center transition"
    >
      <div class="grow"></div>
      <div class="flex gap-2 p-2">
        <form
          method="POST"
          action="?/delete"
          use:enhance={({ cancel }) => {
            // Confirm before deleting
            if (confirm("Are you sure you want to delete this screen?")) {
              return async ({ result, update }) => {
                await update();
              };
            } else {
              cancel();
            }
          }}
        >
          <input type="hidden" name="id" value={data.currentScreen.id} />
          <button class="btn btn-sm btn-error"> Delete this Screen </button>
        </form>
      </div>
    </div>
    <EditForm screen={data.currentScreen} canSetStatus={true} />
  </div>
</div>
